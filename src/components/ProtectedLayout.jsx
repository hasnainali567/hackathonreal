'use client';

import { useAuth } from '@/hooks/useAuth';

export const ProtectedLayout = ({ children }) => {
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-canvas-grad">
                <div className="text-center space-y-4">
                    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto"></div>
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
