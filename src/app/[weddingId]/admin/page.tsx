'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import RolesManager from '@/components/admin/RolesManager';
import AdminScheduleTable from '@/components/admin/AdminScheduleTable';
import ScheduleItemForm from '@/components/admin/ScheduleItemForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { isCoupleSession } from '@/lib/auth';
import { fetchWeddingData, createScheduleItem, updateScheduleItem, deleteScheduleItem, updateRoles } from '@/lib/api';
import type { WeddingData, ScheduleItem } from '@/types';

export default function AdminPage({ params }: { params: Promise<{ weddingId: string }> }) {
  const { weddingId } = use(params);
  const router = useRouter();
  const { session, logout, isLoading } = useAuth();
  const [weddingData, setWeddingData] = useState<WeddingData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    if (isLoading) return;
    if (!isCoupleSession(session, weddingId)) {
      router.replace(`/${weddingId}/admin/login`);
    }
  }, [session, isLoading, weddingId, router]);

  // Load data
  useEffect(() => {
    fetchWeddingData(weddingId).then(data => {
      setWeddingData(data);
      setDataLoading(false);
    });
  }, [weddingId]);

  function handleLogout() {
    logout();
    router.push('/');
  }

  async function handleSaveItem(data: Omit<ScheduleItem, 'id'>) {
    if (!weddingData) return;
    if (editingItem) {
      const updated = await updateScheduleItem(weddingId, editingItem.id, data);
      if (updated) {
        setWeddingData(prev => prev ? {
          ...prev,
          schedule: prev.schedule.map(s => s.id === editingItem.id ? updated : s),
        } : prev);
      }
    } else {
      const created = await createScheduleItem(weddingId, data);
      if (created) {
        setWeddingData(prev => prev ? { ...prev, schedule: [...prev.schedule, created] } : prev);
      }
    }
    setFormOpen(false);
    setEditingItem(undefined);
  }

  async function handleDelete(itemId: string) {
    const ok = await deleteScheduleItem(weddingId, itemId);
    if (ok) {
      setWeddingData(prev => prev ? {
        ...prev,
        schedule: prev.schedule.filter(s => s.id !== itemId),
      } : prev);
    }
    setDeleteConfirm(null);
  }

  async function handleUpdateRoles(roles: string[]) {
    await updateRoles(weddingId, roles);
    setWeddingData(prev => prev ? { ...prev, roles } : prev);
  }

  function openAddForm() {
    setEditingItem(undefined);
    setFormOpen(true);
  }

  function openEditForm(item: ScheduleItem) {
    setEditingItem(item);
    setFormOpen(true);
  }

  if (isLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-ivory)' }}>
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }}
          />
          <p style={{ color: 'rgba(27,42,74,0.6)' }}>Loading admin panel…</p>
        </div>
      </div>
    );
  }

  if (!session || !isCoupleSession(session, weddingId)) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-ivory)' }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-30 border-b"
        style={{
          backgroundColor: 'rgba(27,42,74,0.97)',
          borderColor: 'rgba(212,175,55,0.3)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}
            >
              WS
            </div>
            <span className="font-serif text-base" style={{ color: 'var(--color-ivory)' }}>Wedding Sync</span>
          </Link>

          <div className="flex items-center gap-3">
            <Badge variant="gold">Admin Panel</Badge>
            <span className="text-xs hidden sm:block" style={{ color: 'rgba(255,255,240,0.6)' }}>
              {session.coupleUsername}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: 'rgba(255,255,240,0.7)' }}
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--color-gold)', letterSpacing: '0.2em' }}>
            Admin Panel
          </p>
          <h1 className="font-serif text-3xl mb-1" style={{ color: 'var(--color-navy)' }}>
            Wedding Schedule Manager
          </h1>
          <p className="text-sm" style={{ color: 'rgba(27,42,74,0.6)' }}>
            Manage your wedding day schedule and team roles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            {weddingData && (
              <RolesManager roles={weddingData.roles} onUpdate={handleUpdateRoles} />
            )}
          </div>
          <div
            className="lg:col-span-2 card flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, rgba(27,42,74,0.05), rgba(212,175,55,0.05))' }}
          >
            <div>
              <h3 className="font-serif text-xl mb-1" style={{ color: 'var(--color-navy)' }}>
                Schedule Items
              </h3>
              <p className="text-sm" style={{ color: 'rgba(27,42,74,0.6)' }}>
                {weddingData?.schedule.length ?? 0} task{(weddingData?.schedule.length ?? 0) !== 1 ? 's' : ''} in the schedule
              </p>
            </div>
            <Button onClick={openAddForm}>
              <PlusIcon className="w-4 h-4" />
              Add Task
            </Button>
          </div>
        </div>

        {weddingData && (
          <AdminScheduleTable
            schedule={weddingData.schedule}
            weddingDate={weddingData.weddingDate}
            onEdit={openEditForm}
            onDelete={id => setDeleteConfirm(id)}
          />
        )}
      </div>

      {/* Add/Edit modal */}
      <Modal
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingItem(undefined); }}
        title={editingItem ? 'Edit Task' : 'Add New Task'}
        size="lg"
      >
        {weddingData && (
          <ScheduleItemForm
            roles={weddingData.roles}
            weddingDate={weddingData.weddingDate}
            initialData={editingItem}
            onSubmit={handleSaveItem}
            onCancel={() => { setFormOpen(false); setEditingItem(undefined); }}
          />
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Task"
        size="sm"
      >
        <p className="mb-6 text-sm" style={{ color: 'rgba(27,42,74,0.7)' }}>
          Are you sure you want to delete this task? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" className="flex-1" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
            Delete
          </Button>
          <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
