'use client';

type RoleVariant = 'me' | 'admin' | 'sedzia' | 'tier';

interface RoleBadgeProps {
  variant: RoleVariant;
  label: string;
  size?: 'sm' | 'md';
  bgClass?: string;
  textClass?: string;
  borderColor?: string;
}

const VARIANT_STYLES: Record<RoleVariant, string> = {
  me: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  admin: 'bg-red-50 text-red-600 border-red-200',
  sedzia: 'bg-blue-50 text-blue-600 border-blue-200',
  tier: '',
};

export default function RoleBadge({ variant, label, size = 'sm', bgClass, textClass, borderColor }: RoleBadgeProps) {
  const sizeClass = size === 'sm' ? 'text-[8px] px-1.5 py-0.5' : 'text-[9px] px-2 py-0.5';
  const variantClass = variant === 'tier' ? `${bgClass ?? ''} ${textClass ?? ''} ${borderColor ?? ''}` : VARIANT_STYLES[variant];

  return (
    <span className={`font-black uppercase tracking-widest rounded-md border shrink-0 ${sizeClass} ${variantClass}`}>
      {label}
    </span>
  );
}
