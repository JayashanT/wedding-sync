import TimelineItem from './TimelineItem';
import ScheduleDateGroup from './ScheduleDateGroup';
import type { ScheduleItem } from '@/types';
import { groupScheduleByDate } from '@/lib/schedule';

interface ScheduleTimelineProps {
  schedule: ScheduleItem[];
  weddingDate: string;
  userRole?: string;
  showAll?: boolean;
}

export default function ScheduleTimeline({ schedule, weddingDate, userRole, showAll }: ScheduleTimelineProps) {
  if (schedule.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📅</div>
        <p className="font-serif text-xl mb-2" style={{ color: 'var(--color-navy)' }}>
          No schedule items
        </p>
        <p className="text-sm" style={{ color: 'rgba(27,42,74,0.5)' }}>
          {userRole ? `No tasks assigned to "${userRole}" yet.` : 'The schedule is empty.'}
        </p>
      </div>
    );
  }

  const groups = groupScheduleByDate(schedule, weddingDate);

  return (
    <div>
      {groups.map(group => (
        <div key={group.date}>
          <ScheduleDateGroup
            date={group.date}
            label={group.label}
            isWeddingDay={group.isWeddingDay}
            isToday={group.isToday}
          />
          <div className="relative">
            {group.items.map((item, i) => (
              <TimelineItem
                key={item.id}
                item={item}
                isLast={i === group.items.length - 1}
                userRole={userRole}
                showAll={showAll}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
