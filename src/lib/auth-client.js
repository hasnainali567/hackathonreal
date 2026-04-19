import { createAuthClient } from 'better-auth/react'

const getBaseURL = () => {
    if (typeof window !== 'undefined' && window.location?.origin) {
        return `${window.location.origin}/api/auth`;
    }

    const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;
    if (configuredBaseUrl) {
        return `${configuredBaseUrl.replace(/\/$/, '')}/api/auth`;
    }

    return 'http://localhost:3000/api/auth';
};

const authClient = createAuthClient({
    baseURL: getBaseURL(),
})

export { authClient };
export const { signIn, signUp, signOut, useSession } = authClient;
