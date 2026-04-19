import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, useSession } from '@/lib/auth-client';

const PROTECTED_ROUTES = [
    '/explore',
    '/create-request',
    '/request',
    '/leaderboard',
    '/messages',
    '/notifications',
    '/profile',
    '/ai-center',
    '/onboarding'
];

const parseStoredUser = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
        console.error('Failed to parse stored user:', err);
        return null;
    }
};

const clearStoredAuth = () => {
    if (typeof window === 'undefined') {
        return;
    }

    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
};

export const useAuth = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, isPending } = useSession();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (isPending) {
                    return;
                }

                const isProtectedRoute = PROTECTED_ROUTES.some(route => 
                    pathname.startsWith(route)
                );

                if (!session?.user) {
                    clearStoredAuth();
                    if (isProtectedRoute) {
                        router.replace('/signup');
                    }
                    setUser(null);
                    return;
                }

                const storedUser = parseStoredUser();
                const sessionEmail = String(session.user.email || '').toLowerCase();
                const storedEmail = String(storedUser?.email || '').toLowerCase();

                let nextUser = storedUser && (!storedEmail || storedEmail === sessionEmail)
                    ? { ...storedUser, ...session.user }
                    : null;

                if (!nextUser) {
                    const res = await fetch('/api/users/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: session.user.email,
                            name: session.user.name || session.user.email?.split('@')[0] || 'User'
                        })
                    });

                    const payload = await res.json().catch(() => ({}));
                    nextUser = payload?.data ? { ...payload.data, ...session.user } : { ...session.user };
                }

                localStorage.setItem('user', JSON.stringify(nextUser));
                if (nextUser?.role) {
                    localStorage.setItem('userRole', nextUser.role);
                }

                setUser(nextUser);
            } catch (err) {
                console.error('Auth check failed:', err);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [isPending, pathname, router, session]);

    const logout = async () => {
        clearStoredAuth();
        setUser(null);
        await signOut();
        router.replace('/signup');
    };

    return { user, isLoading, logout };
};
