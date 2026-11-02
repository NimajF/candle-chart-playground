import type { ElementType, ReactNode } from 'react';
import type { Icon } from '@phosphor-icons/react';

interface SectionTitleProps {
  icon: Icon;
  children: ReactNode;
  as?: ElementType;
}

export function SectionTitle({ icon: IconComponent, children, as: Tag = 'h2' }: SectionTitleProps) {
  return (
    <Tag className="flex items-center gap-2 text-sm font-semibold text-fg">
      <span
        aria-hidden="true"
        className="grid size-6 place-items-center rounded-control bg-accent-soft text-accent-ink"
      >
        <IconComponent size={14} weight="bold" />
      </span>
      {children}
    </Tag>
  );
}
