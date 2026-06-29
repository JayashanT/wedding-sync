'use client';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Badge from '@/components/ui/Badge';
import type { ScheduleItem } from '@/types';
import { sortByDateTime, formatTime12h, getDateLabel, formatDateLong } from '@/lib/schedule';

interface AdminScheduleTableProps {
  schedule: ScheduleItem[];
  weddingDate: string;
  onEdit: (item: ScheduleItem) => void;
  onDelete: (itemId: string) => void;
}

export default function AdminScheduleTable({ schedule, weddingDate, onEdit, onDelete }: AdminScheduleTableProps) {
  const sorted = sortByDateTime(schedule);

  if (sorted.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-4xl mb-3">📋</div>
        <p className="font-serif text-xl mb-1" style={{ color: 'var(--color-navy)' }}>No tasks yet</p>
        <p className="text-sm opacity-60" style={{ color: 'var(--color-navy)' }}>
          Click &quot;Add Task&quot; to create your first schedule item.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'rgba(27,42,74,0.04)', borderBottom: '2px solid rgba(248,187,217,0.4)' }}>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-navy)' }}>Date & Time</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-navy)' }}>Task</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--color-navy)' }}>Location</th>
              <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: 'var(--color-navy)' }}>Responsible</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-right" style={{ color: 'var(--color-navy)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item, i) => {
              const isWeddingDay = item.date === weddingDate;
              const dayLabel = getDateLabel(item.date, weddingDate);
              return (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-blush/5"
                  style={{
                    borderBottom: i < sorted.length - 1 ? '1px solid rgba(248,187,217,0.2)' : 'none',
                    backgroundColor: isWeddingDay ? 'rgba(212,175,55,0.03)' : undefined,
                  }}
                >
                  <td className="px-4 py-3">
                    <span
                      className="font-bold text-sm px-2 py-1 rounded-full whitespace-nowrap block mb-1"
                      style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)', display: 'inline-block' }}
                    >
                      {formatTime12h(item.time)}
                    </span>
                    <span
                      className="text-xs font-medium whitespace-nowrap"
                      style={{
                        color: isWeddingDay ? 'var(--color-gold)' : 'rgba(27,42,74,0.5)',
                        display: 'block',
                      }}
                    >
                      {isWeddingDay ? '💍 ' : ''}{dayLabel}
                    </span>
                    <span className="text-xs hidden sm:block" style={{ color: 'rgba(27,42,74,0.35)' }}>
                      {formatDateLong(item.date)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-navy)' }}>{item.title}</p>
                    <p className="text-xs opacity-60 mt-0.5 hidden sm:block" style={{ color: 'var(--color-navy)' }}>
                      {item.description.length > 60 ? item.description.slice(0, 60) + '…' : item.description}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-sm opacity-70" style={{ color: 'var(--color-navy)' }}>{item.location}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {item.responsiblePersons.slice(0, 3).map(p => (
                        <Badge key={p} variant="navy" className="text-xs">{p}</Badge>
                      ))}
                      {item.responsiblePersons.length > 3 && (
                        <Badge variant="gold" className="text-xs">+{item.responsiblePersons.length - 3}</Badge>
                      )}
                      {item.responsiblePersons.length === 0 && (
                        <span className="text-xs opacity-40" style={{ color: 'var(--color-navy)' }}>Unassigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-blue-50"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4 text-blue-500" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
