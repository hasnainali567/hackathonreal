
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Field = ({ label, children }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {children}
    </div>
);

const inputCls =
    "w-full h-12 rounded-xl bg-background/60 border border-border px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition";

const Auth = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: 'demo123',
        role: 'Both'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check if user is already logged in
        const user = localStorage.getItem('user');
        if (user) {
            router.push('/dashboard');
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.username || !formData.email || !formData.password) {
            setError('Please fill all fields');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await fetch('/api/users/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.username,
                    email: formData.email,
                    location: 'Pakistan',
                    role: formData.role,
                    skills: ['JavaScript', 'React', 'Node.js', 'Design'],
                    interests: ['Web Development', 'Mentoring'],
                    trustScore: 75,
                    contributions: 12,
                    avgRating: 4.5,
                    badges: ['Fast Responder']
                })
            });

            // For demo purposes, create session directly in localStorage
            const userData = {
                _id: Math.random().toString(36).substring(7),
                name: formData.username,
                email: formData.email,
                role: formData.role,
                location: 'Pakistan',
                trustScore: 75,
                contributions: 12,
                avgRating: 4.5,
                skills: ['JavaScript', 'React', 'Node.js', 'Design'],
                interests: ['Web Development', 'Mentoring']
            };

            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('authToken', 'demo_token_' + userData._id);
            localStorage.setItem('userRole', formData.role);

            // Redirect to dashboard
            router.push('/dashboard');
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message || 'Failed to authenticate');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <main className="min-h-screen bg-linear-to-br from-tertiary from-5% to-neutral to-90%">
            <section className="grid lg:grid-cols-2 gap-8 px-6 lg:px-12 mt-10 lg:mt-16 max-w-7xl mx-auto pb-20">
                {/* Left dark card */}
                <div className="bg-secondary text-primary-foreground rounded-3xl shadow-card p-10 lg:p-14">
                    <p className="text-xs font-semibold tracking-[0.2em] text-primary-foreground/70 mb-6">
                        COMMUNITY ACCESS
                    </p>
                    <h1 className="text-4xl lg:text-[56px] leading-[1.05] font-extrabold tracking-tight">
                        Enter the support
                        <br />
                        network.
                    </h1>
                    <p className="mt-6 text-primary-foreground/70 text-[15px] leading-relaxed max-w-md">
                        Choose a demo identity, set your role, and jump into a multi-page
                        product flow designed for asking, offering, and tracking help with
                        a premium interface.
                    </p>

                    <ul className="mt-8 space-y-3 text-[15px] text-primary-foreground/80">
                        {[
                            "Role-based entry for Need Help, Can Help, or Both",
                            "Direct path into dashboard, requests, AI Center, and community feed",
                            "Persistent demo session powered by localStorage",
                        ].map((t) => (
                            <li key={t} className="flex gap-3">
                                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-foreground/60 shrink-0" />
                                <span>{t}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right light card */}
                <div className="bg-neutral rounded-3xl shadow-card p-10 lg:p-12">
                    <p className="text-xs font-semibold tracking-[0.2em] text-primary mb-5">
                        LOGIN / SIGNUP
                    </p>
                    <h2 className="text-4xl lg:text-[44px] leading-[1.1] font-extrabold text-foreground tracking-tight">
                        Authenticate your
                        <br />
                        community profile
                    </h2>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <Field label="Full name">
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="Your name"
                                className={inputCls}
                            />
                        </Field>

                        <Field label="Role selection">
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className={inputCls}
                            >
                                <option>Both</option>
                                <option>Need Help</option>
                                <option>Can Help</option>
                            </select>
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Email">
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your@email.com"
                                    className={inputCls}
                                />
                            </Field>
                            <Field label="Password">
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className={inputCls}
                                />
                            </Field>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !formData.username}
                            className="w-full h-13 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] hover:opacity-90 transition shadow-soft disabled:opacity-60"
                        >
                            {loading ? '⏳ Authenticating...' : '✨ Continue to dashboard'}
                        </button>

                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Already have an account?</span>
                            <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition">
                                Sign in here
                            </Link>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default Auth;