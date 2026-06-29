'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { ScheduleItem } from '@/types';
import { offsetDate, getDateLabel, DAYS_RANGE } from '@/lib/schedule';

const MAX_PERSONS = 5;

interface ScheduleItemFormProps {
  roles: string[];
  weddingDate: string;
  initialData?: ScheduleItem;
  onSubmit: (data: Omit<ScheduleItem, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export default function ScheduleItemForm({
  roles,
  weddingDate,
  initialData,
  onSubmit,
  onCancel,
}: ScheduleItemFormProps) {
  const [date, setDate] = useState(initialData?.date ?? weddingDate);
  const [time, setTime] = useState(initialData?.time ?? '');
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [location, setLocation] = useState(initialData?.location ?? '');
  const [selectedPersons, setSelectedPersons] = useState<string[]>(initialData?.responsiblePersons ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const minDate = offsetDate(weddingDate, -DAYS_RANGE);
  const maxDate = offsetDate(weddingDate, DAYS_RANGE);
  const dateLabel = getDateLabel(date, weddingDate);

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date ?? weddingDate);
      setTime(initialData.time);
      setTitle(initialData.title);
      setDescription(initialData.description);
      setLocation(initialData.location);
      setSelectedPersons(initialData.responsiblePersons);
    }
  }, [initialData, weddingDate]);

  function togglePerson(role: string) {
    setSelectedPersons(prev => {
      if (prev.includes(role)) return prev.filter(r => r !== role);
      if (prev.length >= MAX_PERSONS) return prev;
      return [...prev, role];
    });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!date) e.date = 'Date is required';
    if (!time) e.time = 'Time is required';
    if (!title.trim()) e.title = 'Title is required';
    if (!location.trim()) e.location = 'Location is required';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    await onSubmit({
      date,
      time,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      responsiblePersons: selectedPersons,
    });
    setSaving(false);
  }

  const isWeddingDay = date === weddingDate;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Date row */}
      <div>
        <label className="form-label">Date</label>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            min={minDate}
            max={maxDate}
            onChange={e => setDate(e.target.value)}
            className="form-input flex-1"
          />
          <span
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
            style={{
              backgroundColor: isWeddingDay ? 'var(--color-gold)' : 'rgba(27,42,74,0.08)',
              color: isWeddingDay ? 'var(--color-navy)' : 'rgba(27,42,74,0.7)',
            }}
          >
            {isWeddingDay ? '💍 ' : ''}{dateLabel}
          </span>
        </div>
        <p className="mt-1 text-xs" style={{ color: 'rgba(27,42,74,0.45)' }}>
          Date range: {DAYS_RANGE} days before to {DAYS_RANGE} days after the wedding ({weddingDate})
        </p>
        {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
      </div>

      {/* Time + Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Time</label>
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="form-input"
          />
          {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time}</p>}
        </div>
        <Input
          label="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Wedding Ceremony"
          error={errors.title}
        />
      </div>

      <Input
        label="Location"
        value={location}
        onChange={e => setLocation(e.target.value)}
        placeholder="e.g. Grand Ballroom"
        error={errors.location}
      />

      <div>
        <label className="form-label">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          placeholder="Brief description of what happens at this time…"
          className="form-input resize-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="form-label mb-0">Responsible Persons</label>
          <span className="text-xs opacity-60" style={{ color: 'var(--color-navy)' }}>
            {selectedPersons.length}/{MAX_PERSONS} selected
          </span>
        </div>
        {roles.length === 0 ? (
          <p className="text-sm opacity-60" style={{ color: 'var(--color-navy)' }}>
            Add roles first before assigning persons.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {roles.map(role => {
              const checked = selectedPersons.includes(role);
              const disabled = !checked && selectedPersons.length >= MAX_PERSONS;
              return (
                <label
                  key={role}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                  style={{
                    borderColor: checked ? 'var(--color-gold)' : 'rgba(248,187,217,0.4)',
                    backgroundColor: checked ? 'rgba(212,175,55,0.1)' : undefined,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => togglePerson(role)}
                    className="rounded"
                    style={{ accentColor: 'var(--color-gold)' }}
                  />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-navy)' }}>
                    {role}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={saving} className="flex-1">
          {initialData ? 'Update Task' : 'Add Task'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
