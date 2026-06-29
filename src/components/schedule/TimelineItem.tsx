import { MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import Badge from '@/components/ui/Badge';
import CountdownBadge from './CountdownBadge';
import type { ScheduleItem } from '@/types';
import { formatTime12h } from '@/lib/schedule';

interface TimelineItemProps {
  item: ScheduleItem;
  isLast: boolean;
  userRole?: string;
  showAll?: boolean;
}

export default function TimelineItem({ item, isLast, userRole, showAll }: TimelineItemProps) {
  const isMyTask = userRole ? item.responsiblePersons.includes(userRole) : false;

  return (
    <div className="relative flex gap-6 pb-8">
      {/* Vertical line */}
      {!isLast && (
        <div
          className="absolute left-5 top-10 bottom-0 w-0.5"
          style={{ background: 'linear-gradient(to bottom, var(--color-blush), rgba(248,187,217,0.1))' }}
        />
      )}

      {/* Time dot */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-md border-2 z-10"
          style={{
            backgroundColor: isMyTask ? 'var(--color-gold)' : 'white',
            borderColor: isMyTask ? 'var(--color-gold)' : 'var(--color-blush)',
            color: isMyTask ? 'var(--color-navy)' : 'rgba(27,42,74,0.5)',
          }}
        >
          <ClockIcon className="w-4 h-4" />
        </div>
      </div>

      {/* Content */}
      <div
        className={`flex-1 rounded-2xl p-4 border transition-shadow hover:shadow-md ${isMyTask ? 'shadow-sm' : ''}`}
        style={{
          backgroundColor: isMyTask ? 'white' : 'rgba(255,255,255,0.6)',
          borderColor: isMyTask ? 'rgba(212,175,55,0.3)' : 'rgba(248,187,217,0.2)',
          borderLeftWidth: isMyTask ? '3px' : '1px',
          borderLeftColor: isMyTask ? 'var(--color-gold)' : undefined,
        }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-bold text-xs px-2 py-1 rounded-full"
              style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-navy)' }}
            >
              {formatTime12h(item.time)}
            </span>
            <CountdownBadge time={item.time} />
            {isMyTask && !showAll && (
              <span className="badge badge-blush text-xs">Your task</span>
            )}
          </div>
        </div>

        <h3 className="font-serif text-lg font-semibold mb-1" style={{ color: 'var(--color-navy)' }}>
          {item.title}
        </h3>

        <div className="flex items-center gap-1 mb-2 text-sm" style={{ color: 'rgba(27,42,74,0.6)' }}>
          <MapPinIcon className="w-4 h-4 flex-shrink-0" />
          <span>{item.location}</span>
        </div>

        <p className="text-sm mb-3 leading-relaxed" style={{ color: 'rgba(27,42,74,0.7)' }}>
          {item.description}
        </p>

        {item.responsiblePersons.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.responsiblePersons.map(person => (
              <Badge
                key={person}
                variant={person === userRole ? 'gold' : 'navy'}
                className="text-xs"
              >
                {person}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
