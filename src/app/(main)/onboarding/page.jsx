'use client';
import { useState } from 'react';

const TagInput = ({ label, value, onChange, placeholder }) => (
    <label className="block">
        <span className="block text-sm text-foreground/80 mb-2">{label}</span>
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-5 py-3.5 rounded-full bg-background/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
    </label>
);

const SkillChip = ({ skill, onRemove }) => (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
        {skill}
        <button
            onClick={() => onRemove(skill)}
            className="text-primary/60 hover:text-primary transition"
        >
            ✕
        </button>
    </div>
);

const Onboarding = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [skills, setSkills] = useState([]);
    const [interestInput, setInterestInput] = useState('');
    const [interests, setInterests] = useState([]);

    const addSkill = () => {
        if (skillInput.trim() && !skills.includes(skillInput.trim())) {
            setSkills([...skills, skillInput.trim()]);
            setSkillInput('');
        }
    };

    const removeSkill = (skill) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const addInterest = () => {
        if (interestInput.trim() && !interests.includes(interestInput.trim())) {
            setInterests([...interests, interestInput.trim()]);
            setInterestInput('');
        }
    };

    const removeInterest = (interest) => {
        setInterests(interests.filter(i => i !== interest));
    };

    const handleKeyPress = (e, callback) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            callback();
        }
    };

    return (
        <div className="min-h-screen bg-canvas-grad">
            <main className="max-w-[1280px] mx-auto px-6 lg:px-12 py-8 space-y-8">
                {/* Hero dark card */}
                <section className="bg-secondary text-primary-foreground rounded-3xl shadow-card px-10 lg:px-14 py-12 lg:py-14">
                    <p className="text-xs font-semibold tracking-[0.25em] text-primary-foreground/60 mb-5">
                        GETTING STARTED
                    </p>
                    <h1 className="text-5xl lg:text-[64px] leading-[1.02] font-extrabold tracking-tight">
                        Welcome to HelpHub AI
                    </h1>
                    <p className="mt-5 text-primary-foreground/70 text-base">
                        Tell us about yourself so we can match you with the right people and opportunities.
                    </p>
                </section>

                {/* Form section */}
                <section className="grid lg:grid-cols-2 gap-8">
                    {/* AI Suggestions */}
                    <div className="bg-card rounded-3xl shadow-card p-10 lg:p-12">
                        <p className="text-xs font-semibold tracking-[0.25em] text-primary mb-5">
                            AI SUGGESTIONS
                        </p>
                        <h2 className="text-3xl lg:text-[40px] font-extrabold text-foreground tracking-tight">
                            Smart recommendations
                        </h2>

                        <div className="mt-8 space-y-5">
                            <div className="bg-background/40 border border-border/60 rounded-2xl p-5">
                                <p className="text-xs font-semibold text-primary mb-2">SUGGESTED SKILLS FOR YOU</p>
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                    Based on your background, you could help with:
                                </p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Web Development</span>
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">React</span>
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">JavaScript</span>
                                </div>
                            </div>

                            <div className="bg-background/40 border border-border/60 rounded-2xl p-5">
                                <p className="text-xs font-semibold text-primary mb-2">AREAS WHERE YOU MIGHT NEED HELP</p>
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                    You may benefit from learning:
                                </p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">UI Design</span>
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">DevOps</span>
                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">System Design</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form className="bg-card rounded-3xl shadow-card p-10 lg:p-12">
                        <p className="text-xs font-semibold tracking-[0.25em] text-primary mb-5">
                            YOUR PROFILE
                        </p>
                        <h2 className="text-3xl lg:text-[40px] font-extrabold text-foreground tracking-tight">
                            Complete your profile
                        </h2>

                        <div className="mt-8 space-y-5">
                            <TagInput
                                label="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                            />

                            <TagInput
                                label="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="City, Country"
                            />

                            <div>
                                <label className="block">
                                    <span className="block text-sm text-foreground/80 mb-2">Skills (you can help with)</span>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, addSkill)}
                                            placeholder="Add a skill, press Enter"
                                            className="flex-1 px-5 py-3.5 rounded-full bg-background/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                        <button
                                            type="button"
                                            onClick={addSkill}
                                            className="px-5 py-3.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </label>
                                {skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {skills.map((skill) => (
                                            <SkillChip key={skill} skill={skill} onRemove={removeSkill} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block">
                                    <span className="block text-sm text-foreground/80 mb-2">Interests (areas you want to learn)</span>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={interestInput}
                                            onChange={(e) => setInterestInput(e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, addInterest)}
                                            placeholder="Add an interest, press Enter"
                                            className="flex-1 px-5 py-3.5 rounded-full bg-background/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        />
                                        <button
                                            type="button"
                                            onClick={addInterest}
                                            className="px-5 py-3.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </label>
                                {interests.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {interests.map((interest) => (
                                            <SkillChip key={interest} skill={interest} onRemove={removeInterest} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-8 w-full py-4 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity shadow-soft"
                        >
                            Complete onboarding
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
};

export default Onboarding;
