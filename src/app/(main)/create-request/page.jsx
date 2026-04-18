'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const TagChip = ({ tag, onRemove }) => (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
        {tag}
        <button
            onClick={() => onRemove(tag)}
            className="text-primary/60 hover:text-primary transition"
        >
            ✕
        </button>
    </div>
);

const CreateRequest = () => {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [urgency, setUrgency] = useState('medium');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [suggestedTags, setSuggestedTags] = useState([]);
    const [detectedUrgency, setDetectedUrgency] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const normalizeUrgency = (value) => {
        const normalized = String(value || '').toLowerCase().trim();
        if (['low', 'medium', 'high'].includes(normalized)) return normalized;
        if (['urgent', 'critical', 'immediate'].includes(normalized)) return 'high';
        return 'medium';
    };

    const detectedUrgencyLevel = normalizeUrgency(detectedUrgency?.urgency || detectedUrgency?.level);
    const detectedUrgencyReason = detectedUrgency?.detection_reason || detectedUrgency?.reason || '';

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tag) => {
        setTags(tags.filter(t => t !== tag));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    // Call AI API for urgency detection
    const detectUrgency = async () => {
        if (!title) return;
        try {
            const res = await fetch('/api/ai/urgency', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            });
            const data = await res.json();
            setDetectedUrgency(data);
            setUrgency(normalizeUrgency(data.urgency || data.level));
        } catch (err) {
            console.error('Failed to detect urgency:', err);
        }
    };

    // Call AI API for tag suggestions
    const suggestTagsAPI = async () => {
        if (!title) return;
        try {
            const res = await fetch('/api/ai/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            });
            const data = await res.json();
            setSuggestedTags(data.suggested_tags || []);
            // Auto-add suggested tags to the tags list if they don't exist
            if (data.suggested_tags && data.suggested_tags.length > 0) {
                setTags(prevTags => {
                    const newTags = [...prevTags];
                    data.suggested_tags.forEach((tag) => {
                        if (!newTags.includes(tag)) {
                            newTags.push(tag);
                        }
                    });
                    return newTags;
                });
            }
        } catch (err) {
            console.error('Failed to suggest tags:', err);
        }
    };

    // Call AI API for category detection
    const detectCategoryAPI = async () => {
        if (!title) return;
        try {
            const res = await fetch('/api/ai/category', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            });
            const data = await res.json();
            if (data.category && data.confidence > 0) {
                setCategory(data.category);
            }
        } catch (err) {
            console.error('Failed to detect category:', err);
        }
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        // Auto-detect urgency, tags, and category when title changes
        setTimeout(() => {
            if (e.target.value.length > 5) {
                detectUrgency();
                suggestTagsAPI();
                detectCategoryAPI();
            }
        }, 500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title || !description || !category) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const storedUser = localStorage.getItem('user');
            const currentUser = storedUser ? JSON.parse(storedUser) : null;

            const res = await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    urgency: normalizeUrgency(urgency),
                    tags,
                    authorName: currentUser?.name || 'Anonymous',
                    authorEmail: currentUser?.email || '',
                    location: currentUser?.location || 'Karachi'
                })
            });

            const payload = await res.json().catch(() => null);

            if (!res.ok) {
                throw new Error(payload?.error || payload?.message || 'Failed to create request');
            }

            setSuccess(true);
            
            // Redirect to newly created request detail page
            const requestId = payload?.id || payload?._id;
            setTimeout(() => {
                if (requestId) {
                    router.push(`/request/${requestId}`);
                } else {
                    router.push('/explore');
                }
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to create request');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-canvas-grad">
            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
                {/* Hero dark card */}
                <section className="bg-secondary text-primary-foreground rounded-3xl shadow-card px-10 lg:px-14 py-12 lg:py-14">
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary-foreground/60 mb-5">
                        CREATE REQUEST
                    </p>
                    <h1 className="text-5xl lg:text-[64px] leading-[1.02] font-extrabold tracking-tight">
                        Ask for help clearly
                    </h1>
                    <p className="mt-5 text-primary-foreground/70 text-base">
                        AI will analyze and help categorize your request with smart suggestions.
                    </p>
                </section>

                {/* Success Message */}
                {success && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-green-700 font-semibold">
                        ✅ Request created successfully! Redirecting...
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
                        ❌ {error}
                    </div>
                )}

                {/* Form section */}
                <section className="grid lg:grid-cols-3 gap-8">
                    {/* Main form */}
                    <form onSubmit={handleSubmit} className="lg:col-span-2 bg-card rounded-3xl shadow-card p-10 lg:p-12">
                        <p className="text-xs font-semibold tracking-[0.25em] text-primary mb-5">
                            REQUEST DETAILS
                        </p>
                        <h2 className="text-3xl lg:text-[40px] font-extrabold text-foreground tracking-tight">
                            Post your request
                        </h2>

                        <div className="mt-8 space-y-6">
                            {/* Title */}
                            <label className="block">
                                <span className="block text-sm text-foreground/80 mb-2">Request Title *</span>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={handleTitleChange}
                                    placeholder="e.g., Need help with API authentication"
                                    className="w-full px-5 py-3.5 rounded-full bg-background/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    required
                                />
                            </label>

                            {/* Description */}
                            <label className="block">
                                <span className="block text-sm text-foreground/80 mb-2">Description *</span>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe your problem in detail..."
                                    className="w-full px-5 py-3.5 rounded-2xl bg-background/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                                    rows="5"
                                    required
                                />
                            </label>

                            {/* Category */}
                            <label className="block">
                                <span className="block text-sm text-foreground/80 mb-2">Category *</span>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-5 py-3.5 rounded-full bg-background/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    <option value="web">Web Development</option>
                                    <option value="mobile">Mobile Development</option>
                                    <option value="design">Design</option>
                                    <option value="backend">Backend Development</option>
                                    <option value="business">Business</option>
                                    <option value="career">Career</option>
                                </select>
                            </label>

                            {/* Urgency */}
                            <label className="block">
                                <span className="block text-sm text-foreground/80 mb-2">Urgency Level</span>
                                <div className="flex gap-3">
                                    {['low', 'medium', 'high'].map((level) => (
                                        <label key={level} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="urgency"
                                                value={level}
                                                checked={urgency === level}
                                                onChange={(e) => setUrgency(e.target.value)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm text-foreground/80 capitalize">{level}</span>
                                        </label>
                                    ))}
                                </div>
                                {detectedUrgency && detectedUrgencyLevel && (
                                    <p className="text-xs text-primary mt-2">
                                        🤖 AI detected: <strong>{detectedUrgencyLevel.toUpperCase()}</strong>{detectedUrgencyReason ? ` - ${detectedUrgencyReason}` : ''}
                                    </p>
                                )}
                            </label>

                            {/* Tags */}
                            <div>
                                <label className="block mb-2">
                                    <span className="block text-sm text-foreground/80 mb-2">Tags</span>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Add tags, press Enter"
                                            className="flex-1 px-5 py-3.5 rounded-full bg-background/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTag}
                                            className="px-5 py-3.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </label>
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <TagChip key={tag} tag={tag} onRemove={removeTag} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity shadow-soft disabled:opacity-60"
                            >
                                {loading ? '⏳ Posting...' : '📤 Post request'}
                            </button>
                        </div>
                    </form>

                    {/* AI Suggestions sidebar */}
                    <div className="space-y-5">
                        <div className="bg-card rounded-3xl shadow-card p-7">
                            <p className="text-xs font-semibold tracking-[0.25em] text-primary mb-4">
                                AI SUGGESTIONS
                            </p>
                            <h3 className="text-xl font-bold text-foreground mb-4">Smart help</h3>

                            {title ? (
                                <>
                                    {/* Auto Category Detection */}
                                    <div className="mb-5 pb-5 border-b border-border/60">
                                        <p className="text-xs font-semibold text-primary mb-3">DETECTED CATEGORY</p>
                                        {category ? (
                                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                                ✅ {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </span>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">Select a category</p>
                                        )}
                                    </div>

                                    {/* Suggested Tags */}
                                    <div className="mb-5 pb-5 border-b border-border/60">
                                        <p className="text-xs font-semibold text-primary mb-3">SUGGESTED TAGS</p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestedTags.map((suggestion) => (
                                                <button
                                                    key={suggestion}
                                                    type="button"
                                                    onClick={() => !tags.includes(suggestion) && setTags([...tags, suggestion])}
                                                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition cursor-pointer"
                                                >
                                                    + {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Urgency */}
                                    <div>
                                        <p className="text-xs font-semibold text-primary mb-3">URGENCY</p>
                                        {detectedUrgency && detectedUrgencyLevel && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                detectedUrgencyLevel === 'high' ? 'bg-red-100 text-red-700' :
                                                detectedUrgencyLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {detectedUrgencyLevel.toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <p className="text-xs text-muted-foreground">Start typing to see AI suggestions</p>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default CreateRequest;
               