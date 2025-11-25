"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { toast } from "sonner";

type Notification = {
    id: string;
    mensagem: string;
    lida: boolean;
    tipo: string;
    link: string | null;
    created_at: string;
};

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const fetchNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from("notificacoes")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10);

        if (data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.lida).length);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Real-time subscription
        const channel = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notificacoes',
                },
                (payload) => {
                    const newNotification = payload.new as Notification;
                    fetchNotifications();
                    toast.info("Nova notificação", { description: newNotification.mensagem });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAsRead = async (id: string) => {
        await supabase
            .from("notificacoes")
            .update({ lida: true })
            .eq("id", id);

        setNotifications(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from("notificacoes")
            .update({ lida: true })
            .eq("user_id", user.id)
            .eq("lida", false);

        if (!error) {
            setNotifications(prev => prev.map(n => ({ ...n, lida: true })));
            setUnreadCount(0);
            toast.success("Todas as notificações marcadas como lidas");
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.lida) {
            markAsRead(notification.id);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">Notificações</h3>
                            {unreadCount > 0 && (
                                <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-bold">
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors"
                            >
                                Marcar todas como lidas
                            </button>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 transition-colors ${!notification.lida ? 'bg-rose-50/30' : ''}`}
                                    >
                                        <Link
                                            href={notification.link || "#"}
                                            onClick={() => handleNotificationClick(notification)}
                                            className="block"
                                        >
                                            <p className={`text-sm ${!notification.lida ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                                {notification.mensagem}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(notification.created_at).toLocaleDateString()}
                                            </p>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                Nenhuma notificação.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
