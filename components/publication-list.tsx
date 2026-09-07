'use client';
import { ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function PublicationList({
  children,
  count,
}: {
  children: React.ReactNode;
  count: number;
}) {
  return (
    <Collapsible className="publication-list-alternative">
      <CollapsibleTrigger className="publication-list-toggle">
        Publication list ({count} papers)
        <ChevronDown size={16} />
      </CollapsibleTrigger>
      <CollapsibleContent keepMounted>{children}</CollapsibleContent>
    </Collapsible>
  );
}
