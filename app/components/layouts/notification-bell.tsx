'use client';

import { Bell } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { useUserStore } from '@/lib/store';
import ThemeToggle from '../theme-toggle';

const NotificationBell = () => {
  const {
    notifications,
    markAllAsRead,
  } = useUserStore();

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />

      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            className="
              relative rounded-full
              border border-white/10
              bg-white/5
              p-3
              backdrop-blur-xl
              transition hover:bg-white/10
            "
          >
            <Bell size={18} className="text-white" />

            {unreadCount > 0 && (
              <span
                className="
                  absolute -right-1 -top-1
                  flex h-5 min-w-[20px]
                  items-center justify-center
                  rounded-full
                  bg-cyan-400
                  px-1
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
            className="z-50 w-[320px] rounded-2xl border border-white/10 bg-[#0A0A0F] p-4 shadow-2xl
            data-[state=open]:animate-in
            data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0
            data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95
            data-[state=open]:zoom-in-95
            duration-200"
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
                      relative
                      rounded-xl
                      border border-white/5
                      bg-[#101522]
                      p-3
                    "
                  >
                    {!notification.read && (
                      <div
                        className="
                          absolute right-3 top-3
                          h-2 w-2 rounded-full
                          bg-cyan-400
                        "
                      />
                    )}
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
    </div>
  );
};

export default NotificationBell;