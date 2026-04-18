import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

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

export const useAuth = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const storedUser = localStorage.getItem('user');
                const authToken = localStorage.getItem('authToken');

                const isProtectedRoute = PROTECTED_ROUTES.some(route => 
                    pathname.startsWith(route)
                );

                if (!storedUser || !authToken) {
                    if (isProtectedRoute) {
                        router.push('/signup');
                    }
                    setUser(null);
                } else {
                    setUser(JSON.parse(storedUser));
                }
            } catch (err) {
                console.error('Auth check failed:', err);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        setUser(null);
        router.push('/signup');
    };

    return { user, isLoading, logout };
};
