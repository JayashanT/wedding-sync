import { formatDateLong } from '@/lib/schedule';

interface ScheduleDateGroupProps {
  date: string;
  label: string;
  isWeddingDay: boolean;
  isToday: boolean;
}

export default function ScheduleDateGroup({ date, label, isWeddingDay, isToday }: ScheduleDateGroupProps) {
  return (
    <div className="flex items-center gap-4 mb-5 mt-8 first:mt-0">
      <div
        className="flex-shrink-0 flex flex-col items-center justify-center rounded-2xl px-4 py-2 min-w-[7rem] text-center"
        style={{
          backgroundColor: isWeddingDay
            ? 'var(--color-gold)'
            : isToday
            ? 'var(--color-navy)'
            : 'rgba(27,42,74,0.07)',
          color: isWeddingDay || isToday ? 'white' : 'var(--color-navy)',
        }}
      >
        {isWeddingDay && (
          <span className="text-base mb-0.5" role="img" aria-label="rings">💍</span>
        )}
        <span
          className="font-serif text-sm font-bold leading-tight"
          style={{ color: isWeddingDay ? 'var(--color-navy)' : undefined }}
        >
          {label}
        </span>
        {isToday && !isWeddingDay && (
          <span
            className="text-xs font-semibold mt-0.5 px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(212,175,55,0.3)', color: 'var(--color-gold)' }}
          >
            Today
          </span>
        )}
        {isWeddingDay && isToday && (
          <span
            className="text-xs font-bold mt-0.5"
            style={{ color: 'var(--color-navy)' }}
          >
            Today!
          </span>
        )}
      </div>

      <div className="flex-1">
        <p className="text-xs font-medium" style={{ color: 'rgba(27,42,74,0.5)' }}>
          {formatDateLong(date)}
        </p>
        <div
          className="h-px w-full mt-1"
          style={{
            background: isWeddingDay
              ? 'linear-gradient(to right, var(--color-gold), rgba(212,175,55,0.1))'
              : isToday
              ? 'linear-gradient(to right, var(--color-navy), rgba(27,42,74,0.05))'
              : 'linear-gradient(to right, rgba(248,187,217,0.6), rgba(248,187,217,0.05))',
          }}
        />
      </div>
    </div>
  );
}
