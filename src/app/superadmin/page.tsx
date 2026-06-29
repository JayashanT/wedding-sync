'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon, PencilIcon, TrashIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import WeddingForm from '@/components/superadmin/WeddingForm';

interface WeddingMeta {
  id: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  accessCode: string;
  coupleUsername: string;
  // couplePassword is never returned from the API (stored as bcrypt hash)
}

export default function SuperAdminPage() {
  const router = useRouter();
  const [weddings, setWeddings] = useState<WeddingMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingWedding, setEditingWedding] = useState<WeddingMeta | undefined>();
  const [deleteConfirm, setDeleteConfirm] = useState<WeddingMeta | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('weddingday_superadmin');
    if (!session) { router.replace('/superadmin/login'); return; }
    try { JSON.parse(session); } catch { router.replace('/superadmin/login'); return; }
    loadWeddings();
  }, [router]);

  async function loadWeddings() {
    setLoading(true);
    try {
      const res = await fetch('/api/superadmin/weddings');
      const data = await res.json();
      setWeddings(data.weddings ?? []);
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function handleCreate(fields: Omit<WeddingMeta, 'id'>) {
    const res = await fetch('/api/superadmin/weddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    if (res.ok) { setFormOpen(false); await loadWeddings(); }
  }

  async function handleUpdate(fields: Omit<WeddingMeta, 'id'>) {
    if (!editingWedding) return;
    const res = await fetch(`/api/superadmin/weddings/${editingWedding.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    if (res.ok) { setFormOpen(false); setEditingWedding(undefined); await loadWeddings(); }
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    setDeleting(true);
    await fetch(`/api/superadmin/weddings/${deleteConfirm.id}`, { method: 'DELETE' });
    setDeleting(false);
    setDeleteConfirm(null);
    await loadWeddings();
  }

  function logout() {
    localStorage.removeItem('weddingday_superadmin');
    router.push('/superadmin/login');
  }

  function openEdit(w: WeddingMeta) { setEditingWedding(w); setFormOpen(true); }
  function openAdd() { setEditingWedding(undefined); setFormOpen(true); }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-ivory)' }}>
        <div
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-ivory)' }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-40"
        style={{
          backgroundColor: 'var(--color-navy)',
          boxShadow: '0 2px 12px rgba(27,42,74,0.15)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}
            >
              WS
            </div>
            <div>
              <span className="font-serif text-base font-bold" style={{ color: 'var(--color-ivory)' }}>Wedding Sync</span>
              <span
                className="ml-2 text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: 'rgba(212,175,55,0.2)', color: 'var(--color-gold)' }}
              >
                Super Admin
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: 'rgba(255,255,240,0.6)' }}
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--color-gold)', letterSpacing: '0.2em' }}>
              Super Admin
            </p>
            <h1 className="font-serif text-3xl" style={{ color: 'var(--color-navy)' }}>
              Weddings Management
            </h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(27,42,74,0.55)' }}>
              {weddings.length} wedding{weddings.length !== 1 ? 's' : ''} registered
            </p>
          </div>
          <Button onClick={openAdd}>
            <PlusIcon className="w-4 h-4" />
            Add Wedding
          </Button>
        </div>

        {weddings.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4">💍</div>
            <p className="font-serif text-xl mb-2" style={{ color: 'var(--color-navy)' }}>No weddings yet</p>
            <p className="text-sm opacity-60 mb-6" style={{ color: 'var(--color-navy)' }}>Add your first wedding to get started.</p>
            <Button onClick={openAdd}>
              <PlusIcon className="w-4 h-4" />
              Add Wedding
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {weddings.map(w => (
              <div
                key={w.id}
                className="card"
                style={{ border: '1px solid rgba(248,187,217,0.4)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Left: names + date */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2 className="font-serif text-xl" style={{ color: 'var(--color-navy)' }}>
                        {w.brideName} &amp; {w.groomName}
                      </h2>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: 'rgba(27,42,74,0.08)', color: 'var(--color-navy)' }}
                      >
                        {w.id}
                      </span>
                    </div>
                    <p className="text-sm mb-3" style={{ color: 'rgba(27,42,74,0.55)' }}>
                      📅 {new Date(w.weddingDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      {/* Access code */}
                      <div
                        className="rounded-lg px-3 py-2"
                        style={{ backgroundColor: 'rgba(248,187,217,0.15)', border: '1px solid rgba(248,187,217,0.3)' }}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(27,42,74,0.45)' }}>Team Access Code</p>
                        <p className="font-mono font-bold tracking-wider" style={{ color: 'var(--color-navy)' }}>{w.accessCode}</p>
                      </div>
                      {/* Couple username */}
                      <div
                        className="rounded-lg px-3 py-2"
                        style={{ backgroundColor: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)' }}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(27,42,74,0.45)' }}>Admin Username</p>
                        <p className="font-mono" style={{ color: 'var(--color-navy)' }}>{w.coupleUsername}</p>
                      </div>
                      {/* Password */}
                      <div
                        className="rounded-lg px-3 py-2"
                        style={{ backgroundColor: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)' }}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(27,42,74,0.45)' }}>Admin Password</p>
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm tracking-widest" style={{ color: 'rgba(27,42,74,0.4)' }}>••••••••</p>
                          <span
                            className="text-xs px-1.5 py-0.5 rounded font-medium"
                            style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#16a34a' }}
                          >
                            encrypted
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2 flex-wrap">
                      <Link
                        href={`/${w.id}/admin/login`}
                        className="text-xs font-semibold hover:underline"
                        style={{ color: 'var(--color-gold)' }}
                      >
                        → Open Admin Panel
                      </Link>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEdit(w)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}
                    >
                      <PencilIcon className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(w)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      style={{ backgroundColor: 'rgba(220,38,38,0.08)', color: '#dc2626' }}
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      <Modal
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingWedding(undefined); }}
        title={editingWedding ? `Edit — ${editingWedding.brideName} & ${editingWedding.groomName}` : 'Add New Wedding'}
        size="lg"
      >
        <WeddingForm
          initialData={editingWedding}
          onSubmit={editingWedding ? handleUpdate : handleCreate}
          onCancel={() => { setFormOpen(false); setEditingWedding(undefined); }}
        />
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Wedding"
        size="sm"
      >
        {deleteConfirm && (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: 'rgba(27,42,74,0.7)' }}>
              Are you sure you want to delete <strong>{deleteConfirm.brideName} &amp; {deleteConfirm.groomName}</strong>?
              This will permanently remove the wedding and all its schedule data.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleDelete}
                loading={deleting}
                className="flex-1"
                style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }}
              >
                Delete Wedding
              </Button>
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
