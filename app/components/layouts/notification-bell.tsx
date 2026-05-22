'use client';

import { Bell } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { useUserStore } from '@/lib/store';

const NotificationBell = () => {
  const {
    notifications,
    markAllAsRead,
  } = useUserStore();

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="
            relative rounded-full
            border border-white/10
            bg-[#101522]
            p-2.5
            text-white
          "
        >
          <Bell size={18} />

          {unreadCount > 0 && (
            <span
              className="
                absolute -right-1 -top-1
                flex h-5 w-5 items-center justify-center
                rounded-full
                bg-cyan-500
                text-[10px]
                font-bold
                text-black
              "
            >
              {unreadCount}
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={12}
          align="end"
          className="
            z-50 w-[320px]
            rounded-2xl
            border border-white/10
            bg-[#0A0A0F]
            p-4
            shadow-2xl
          "
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-white">
              Notifications
            </h3>

            <button
              onClick={markAllAsRead}
              className="
                text-xs text-cyan-400
              "
            >
              Mark all read
            </button>
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">
                No notifications yet
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="
                    rounded-xl
                    border border-white/5
                    bg-[#101522]
                    p-3
                  "
                >
                  <p className="text-sm font-medium text-white">
                    {notification.company}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {notification.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default NotificationBell;