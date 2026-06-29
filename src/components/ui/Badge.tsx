interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'navy' | 'blush' | 'green';
  className?: string;
}

export default function Badge({ children, variant = 'gold', className = '' }: BadgeProps) {
  const variants = {
    gold: 'badge-gold',
    navy: 'badge-navy',
    blush: 'badge-blush',
    green: 'bg-green-100 text-green-800 border border-green-200',
  };
  return (
    <span className={`badge ${variants[variant]} ${className}`}>{children}</span>
  );
}
