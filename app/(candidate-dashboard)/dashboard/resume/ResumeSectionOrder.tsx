'use client';

import {
  DndContext,
  closestCenter,
  DragEndEvent,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

type Props = {
  sectionOrder: string[];
  handleDragEnd: (event: DragEndEvent) => void;
};

function SortableItem({ id }: { id: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="
        flex cursor-grab flex-wrap items-center justify-between
        rounded-2xl border border-white/10
        bg-white/[0.03] p-4 text-white
      "
    >
      <span className="capitalize">
        {id.replaceAll('-', ' ')}
      </span>

      <GripVertical size={18} className="text-white/40" />
    </div>
  );
}

export default function ResumeSectionOrder({
  sectionOrder,
  handleDragEnd,
}: Props) {
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sectionOrder}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {sectionOrder.map((section) => (
            <SortableItem
              key={section}
              id={section}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}