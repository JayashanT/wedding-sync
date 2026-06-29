'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';

interface WeddingMeta {
  id: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  accessCode: string;
  coupleUsername: string;
  couplePassword: string;
}

interface WeddingFormProps {
  initialData?: WeddingMeta;
  onSubmit: (data: Omit<WeddingMeta, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const EMPTY = { brideName: '', groomName: '', weddingDate: '', accessCode: '', coupleUsername: '', couplePassword: '' };

export default function WeddingForm({ initialData, onSubmit, onCancel }: WeddingFormProps) {
  const [fields, setFields] = useState(initialData ? { ...initialData } : EMPTY);
  const [errors, setErrors] = useState<Partial<typeof EMPTY>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFields(initialData ? { ...initialData } : EMPTY);
    setErrors({});
  }, [initialData]);

  function set(key: keyof typeof EMPTY, value: string) {
    setFields(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  }

  function validate() {
    const e: Partial<typeof EMPTY> = {};
    if (!fields.brideName.trim()) e.brideName = 'Required';
    if (!fields.groomName.trim()) e.groomName = 'Required';
    if (!fields.weddingDate) e.weddingDate = 'Required';
    if (!fields.accessCode.trim()) e.accessCode = 'Required';
    if (!fields.coupleUsername.trim()) e.coupleUsername = 'Required';
    if (!fields.couplePassword.trim()) e.couplePassword = 'Required';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    await onSubmit({
      brideName: fields.brideName.trim(),
      groomName: fields.groomName.trim(),
      weddingDate: fields.weddingDate,
      accessCode: fields.accessCode.trim(),
      coupleUsername: fields.coupleUsername.trim(),
      couplePassword: fields.couplePassword,
    });
    setSaving(false);
  }

  function Field({ label, fieldKey, type = 'text', placeholder }: { label: string; fieldKey: keyof typeof EMPTY; type?: string; placeholder?: string }) {
    return (
      <div>
        <label className="form-label">{label}</label>
        <input
          type={type}
          value={fields[fieldKey]}
          onChange={e => set(fieldKey, e.target.value)}
          placeholder={placeholder}
          className="form-input"
        />
        {errors[fieldKey] && <p className="mt-1 text-xs text-red-500">{errors[fieldKey]}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Bride's Name" fieldKey="brideName" placeholder="e.g. Ayesha" />
        <Field label="Groom's Name" fieldKey="groomName" placeholder="e.g. Kasun" />
      </div>

      <div>
        <label className="form-label">Wedding Date</label>
        <input
          type="date"
          value={fields.weddingDate}
          onChange={e => set('weddingDate', e.target.value)}
          className="form-input"
        />
        {errors.weddingDate && <p className="mt-1 text-xs text-red-500">{errors.weddingDate}</p>}
      </div>

      <div
        className="rounded-xl p-4 space-y-3"
        style={{ backgroundColor: 'rgba(27,42,74,0.04)', border: '1px solid rgba(248,187,217,0.3)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(27,42,74,0.5)' }}>
          Team Access
        </p>
        <Field label="Access Code (for team members)" fieldKey="accessCode" placeholder="e.g. AK2026" />
      </div>

      <div
        className="rounded-xl p-4 space-y-3"
        style={{ backgroundColor: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.2)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(27,42,74,0.5)' }}>
          Couple Admin Credentials
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Username" fieldKey="coupleUsername" placeholder="e.g. ayesha.kasun" />
          <Field label="Password" fieldKey="couplePassword" type="password" placeholder="Strong password" />
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <Button type="submit" loading={saving} className="flex-1">
          {initialData ? 'Save Changes' : 'Create Wedding'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
