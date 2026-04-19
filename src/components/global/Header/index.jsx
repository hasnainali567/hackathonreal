'use client';
import Link from "next/link";
import { useState, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from '@/hooks/useAuth';

const Nav = () => {
    const pathname = usePathname();
    const { user, logout, isLoading } = useAuth();
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);

    useLayoutEffect(() => {
        if (!user?.email) {
            return;
        }

        let isCancelled = false;

        const fetchUnreadMessages = async () => {
            try {
                const viewerEmail = String(user.email || '').toLowerCase();
                const res = await fetch(`/api/messages?viewerEmail=${encodeURIComponent(viewerEmail)}`);
                if (!res.ok) return;

                const data = await res.json();
                const unread = (data.threads || []).filter((thread) => {
                    const recipientEmail = String(thread?.recipient?.email || '').toLowerCase();
                    return recipientEmail === viewerEmail && !thread?.isRead;
                }).length;

                if (!isCancelled) {
                    setUnreadMessageCount(unread);
                }
            } catch (err) {
                if (!isCancelled) {
                    setUnreadMessageCount(0);
                }
            }
        };

        fetchUnreadMessages();

        return () => {
            isCancelled = true;
        };
    }, [user?.email, pathname]);

    const navItems = [
        {label : "Dashboard", href : '/dashboard'}, 
        {label: "Explore", href: '/explore'}, 
        {label: "Leaderboard", href: '/leaderboard'}, 
        {label: "AI Center", href: '/ai-center'},
        {label: "Messages", href: '/messages'},
    ];

    const isActive = (href) => {
        if (href === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(href);
    };

    const showCreateRequest = pathname !== '/explore';

    return (
        <nav className="flex items-center justify-between px-6 lg:px-12 py-2 bg-neutral">
            <div className="flex items-center gap-3">
                <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition">
                    <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold text-lg shadow-soft">
                        H
                    </div>
                    <span className="font-semibold text-foreground text-[15px]">HelpHub AI</span>
                </Link>
            </div>

            {user && !isLoading && (
                <div className="hidden md:flex items-center gap-1 rounded-full px-2 py-1.5 ">
                    {navItems.map((item) => (
                        <Link 
                            key={item.href}
                            href={item.href}
                            className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                                isActive(item.href)
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <span className="inline-flex items-center gap-2">
                                {item.label}
                                {item.href === '/messages' && unreadMessageCount > 0 && (
                                    <span className="min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold grid place-items-center">
                                        {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                                    </span>
                                )}
                            </span>
                        </Link>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-3">
                {user && !isLoading ? (
                    <>
                        {/* <Link href="/notifications" className="hidden sm:inline-flex px-4 py-2 text-sm rounded-full border border-border bg-card/60 text-foreground hover:bg-card transition-colors">
                            📢 Notifications
                        </Link> */}
                        {showCreateRequest && (
                            <Link href="/create-request" className="px-5 py-2.5 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                                + Create request
                            </Link>
                        )}
                        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border cursor-pointer hover:opacity-80 transition"
                            onClick={() => window.location.href = '/profile'}
                        >
                            <div className="h-9 w-9 rounded-full bg-primary/20 text-primary grid place-items-center font-medium text-sm">
                                {user.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-xs font-medium text-foreground line-clamp-1">{user.name || 'User'}</p>
                                <p className="text-xs text-muted-foreground">{user.role}</p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setUnreadMessageCount(0);
                                    logout();
                                }}
                                className="ml-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : !isLoading ? (
                    <div className="flex items-center gap-2">
                        <Link 
                            href="/signup" 
                            className="px-5 py-2.5 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                        >
                            Sign up
                        </Link>
                    </div>
                ) : null}
            </div>
        </nav>
    );
};

export default Nav;