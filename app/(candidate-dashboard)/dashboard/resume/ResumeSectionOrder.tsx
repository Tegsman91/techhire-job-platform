'use client';

import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
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
      className="
        flex flex-wrap items-center justify-between
        rounded-2xl
        border border-slate-200
        bg-white/80 p-4
        text-slate-900
        shadow-sm backdrop-blur-xl
        touch-pan-y
        dark:border-white/10
        dark:bg-white/[0.03]
        dark:text-white
        dark:shadow-none
      "
    >
      <span
        className="
          capitalize font-medium
          text-slate-800 dark:text-white
        "
      >
        {id.replaceAll('-', ' ')}
      </span>

      <GripVertical
        size={18}
        {...attributes}
        {...listeners}
        className="
          cursor-grab touch-none
          text-slate-400
          dark:text-white/40
        "
      />
    </div>
  );
}

export default function ResumeSectionOrder({ sectionOrder, handleDragEnd,
}: Props) {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    }),

    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
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