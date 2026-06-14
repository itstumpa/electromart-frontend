"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ShoppingBag,
  Tag,
  Package,
  Truck,
  CheckCheck,
  Trash2,
} from "lucide-react";
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/api/notification.api";
import { mapNotificationDtoToUi } from "@/lib/notification-mappers";
import type { Notification, NotificationType } from "@/data/types";

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ElementType; color: string; bg: string }
> = {
  order: {
    icon: ShoppingBag,
    color: "text-amber-700",
    bg: "bg-amber-100",
  },
  review: {
    icon: Package,
    color: "text-purple-700",
    bg: "bg-purple-100",
  },
  system: {
    icon: Bell,
    color: "text-blue-700",
    bg: "bg-blue-100",
  },
  promotion: {
    icon: Tag,
    color: "text-rose-600",
    bg: "bg-rose-100",
  },
  delivery: {
    icon: Truck,
    color: "text-green-700",
    bg: "bg-green-100",
  },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
}

export function VendorNotificationsClient() {
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    getMyNotifications()
      .then((res) =>
        setNotifs((res.data.data ?? []).map(mapNotificationDtoToUi))
      )
      .catch(() => setNotifs([]));
  }, []);

  const [filter, setFilter] = useState<NotificationType | "">("");

  const filtered = filter ? notifs.filter((n) => n.type === filter) : notifs;
  const unread = notifs.filter((n) => !n.isRead).length;

  const markRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    }
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead();
    } catch {
      /* keep optimistic UI */
    }
    setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const remove = (id: string) =>
    setNotifs((prev) => prev.filter((n) => n.id !== id));

  const clearAll = () => setNotifs([]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-slate-400 mt-0.5">
            {notifs.length} total &middot; {unread} unread
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-xl transition-colors"
            >
              <CheckCheck size={13} /> Mark all read
            </button>
          )}
          {notifs.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors"
            >
              <Trash2 size={13} /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { key: "", label: "All" },
          { key: "order", label: "Orders" },
          { key: "promotion", label: "Offers" },
          { key: "delivery", label: "Delivery" },
          { key: "system", label: "System" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as NotificationType | "")}
            className={`shrink-0 text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
              filter === key
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:border-amber-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <Bell size={36} className="mx-auto mb-3 text-slate-300" />
          <p className="text-slate-500 font-semibold">No notifications</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {filtered.map((n) => {
              const cfg = TYPE_CONFIG[n.type];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.28 }}
                  onClick={() => markRead(n.id)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all group ${
                    n.isRead
                      ? "bg-white border-slate-100 hover:border-slate-200"
                      : "bg-amber-50 border-amber-200 hover:border-amber-300"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <Icon size={17} className={cfg.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm font-bold leading-snug ${
                          n.isRead ? "text-slate-700" : "text-slate-900"
                        }`}
                      >
                        {n.title}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {!n.isRead && (
                          <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        )}
                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                      {n.message}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(n.id);
                    }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-100 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
