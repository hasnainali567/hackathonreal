'use client';

import Link from 'next/link';
import { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const Profile = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [, startTransition] = useTransition();
    const [user, setUser] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        skills: '',
        interests: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
            return;
        }

        try {
            const userData = JSON.parse(storedUser);
            startTransition(() => {
                setFormData({
                    name: userData.name || '',
                    location: userData.location || '',
                    skills: (userData.skills || []).join(', '),
                    interests: (userData.interests || []).join(', ')
                });
                setUser(userData);
                setMounted(true);
            });
        } catch (err) {
            console.error('Failed to parse user:', err);
            router.push('/login');
        }
    }, [router, startTransition]);

    const handleSaveProfile = () => {
        if (user && formData.name.trim()) {
            const updatedUser = {
                ...user,
                name: formData.name,
                location: formData.location,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
                interests: formData.interests.split(',').map(s => s.trim()).filter(s => s)
            };

            localStorage.setItem('user', JSON.stringify(updatedUser));
            fetch('/api/users/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser)
            }).catch((err) => {
                console.error('Failed to sync profile:', err);
            });
            setUser(updatedUser);
            alert('Profile updated successfully!');
        }
    };

    const isActive = (href) => {
        if (href === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(href);
    };

    if (!mounted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-tertiary from-5% to-neutral to-90%">
                <div className="text-center">
                    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-3">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <main className="min-h-screen bg-linear-to-br from-tertiary from-5% to-neutral to-90%">
            {/* Navigation */}
            

            {/* Profile Content */}
            <section className=" mx-auto px-6 lg:px-12 mt-8 pb-20">
                {/* Profile Header Card */}
                <div className="bg-secondary text-primary-foreground rounded-3xl shadow-card p-10 lg:p-14 mb-8">
                    <p className="text-xs font-semibold tracking-[0.2em] text-primary-foreground/70 mb-4">
                        PROFILE
                    </p>
                    <h1 className="text-5xl lg:text-[56px] leading-[1.05] font-extrabold tracking-tight">
                        {user.name}
                    </h1>
                    <p className="mt-4 text-primary-foreground/70 text-[15px]">
                        {user.role} • {user.location || 'Pakistan'}
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Public Profile Card */}
                    <div className="bg-neutral rounded-3xl shadow-card p-10 lg:p-12">
                        <p className="text-xs font-semibold tracking-[0.2em] text-primary mb-6">
                            PUBLIC PROFILE
                        </p>
                        <h2 className="text-3xl lg:text-[36px] leading-[1.1] font-extrabold text-foreground tracking-tight">
                            Skills and reputation
                        </h2>

                        <div className="mt-10 space-y-6">
                            <div>
                                <p className="text-sm font-semibold text-foreground mb-2">Trust score</p>
                                <p className="text-3xl font-bold text-primary">{user.trustScore || 75}%</p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-foreground mb-2">Contributions</p>
                                <p className="text-3xl font-bold text-primary">{user.contributions || 12}</p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-foreground mb-3">Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {(user.skills && user.skills.length > 0) ? (
                                        user.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1.5 rounded-full bg-tag-teal-bg text-tag-teal-fg text-xs font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-muted-foreground">No skills added yet</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-foreground mb-3">Badges</p>
                                <div className="flex flex-wrap gap-2">
                                    {['Design Ally', 'Fast Responder', 'Top Mentor'].map((badge) => (
                                        <span
                                            key={badge}
                                            className="px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium border border-yellow-200"
                                        >
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile Card */}
                    <div className="bg-neutral rounded-3xl shadow-card p-10 lg:p-12">
                        <p className="text-xs font-semibold tracking-[0.2em] text-primary mb-6">
                            EDIT PROFILE
                        </p>
                        <h2 className="text-3xl lg:text-[36px] leading-[1.1] font-extrabold text-foreground tracking-tight">
                            Update your
                            <br />
                            identity
                        </h2>

                        <div className="mt-10 space-y-5">
                            <div>
                                <label className="text-sm font-semibold text-foreground block mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full h-12 rounded-xl bg-background/60 border border-border px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-foreground block mb-2">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full h-12 rounded-xl bg-background/60 border border-border px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-foreground block mb-2">Skills (comma-separated)</label>
                                <textarea
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    rows="3"
                                    className="w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                                    placeholder="e.g., React, UI/UX, Design"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-foreground block mb-2">Interests (comma-separated)</label>
                                <textarea
                                    value={formData.interests}
                                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                                    rows="3"
                                    className="w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                                    placeholder="e.g., Hackathons, Community Building"
                                />
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] hover:opacity-90 transition shadow-soft"
                            >
                                Save profile
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Profile;
