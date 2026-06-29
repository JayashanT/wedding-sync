'use client';

import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const MAX_ROLES = 5;

interface RolesManagerProps {
  roles: string[];
  onUpdate: (roles: string[]) => Promise<void>;
}

export default function RolesManager({ roles, onUpdate }: RolesManagerProps) {
  const [localRoles, setLocalRoles] = useState(roles);
  const [newRole, setNewRole] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleAdd() {
    const trimmed = newRole.trim();
    if (!trimmed) return;
    if (localRoles.length >= MAX_ROLES) {
      setError(`Maximum ${MAX_ROLES} roles allowed.`);
      return;
    }
    if (localRoles.includes(trimmed)) {
      setError('This role already exists.');
      return;
    }
    const updated = [...localRoles, trimmed];
    setLocalRoles(updated);
    setNewRole('');
    setError('');
    setSaving(true);
    await onUpdate(updated);
    setSaving(false);
  }

  async function handleRemove(role: string) {
    const updated = localRoles.filter(r => r !== role);
    setLocalRoles(updated);
    setSaving(true);
    await onUpdate(updated);
    setSaving(false);
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xl" style={{ color: 'var(--color-navy)' }}>
          Roles
        </h3>
        <span className="badge badge-navy text-xs">{localRoles.length}/{MAX_ROLES}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 min-h-[2.5rem]">
        {localRoles.map(role => (
          <div
            key={role}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
            style={{
              backgroundColor: 'rgba(212,175,55,0.15)',
              color: 'var(--color-navy)',
              border: '1px solid rgba(212,175,55,0.3)',
            }}
          >
            {role}
            <button
              onClick={() => handleRemove(role)}
              className="hover:opacity-60 transition-opacity"
              title="Remove role"
            >
              <TrashIcon className="w-3.5 h-3.5 text-red-400" />
            </button>
          </div>
        ))}
        {localRoles.length === 0 && (
          <p className="text-sm opacity-50" style={{ color: 'var(--color-navy)' }}>
            No roles added yet.
          </p>
        )}
      </div>

      {localRoles.length < MAX_ROLES && (
        <div className="flex gap-2">
          <Input
            value={newRole}
            onChange={e => { setNewRole(e.target.value); setError(''); }}
            placeholder="New role name…"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <Button
            onClick={handleAdd}
            loading={saving}
            size="sm"
            className="flex-shrink-0"
          >
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {saving && <p className="mt-2 text-sm opacity-60" style={{ color: 'var(--color-gold)' }}>Saving…</p>}
    </div>
  );
}
