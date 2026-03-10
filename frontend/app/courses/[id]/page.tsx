import { courses } from "@/data/courses";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Clock, Award, CheckCircle2, List, ClipboardCheck, GraduationCap, PenTool, Lightbulb } from "lucide-react";

import SidebarVideo from "../../components/SidebarVideo";

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const course = courses.find((c: any) => c.id === id);

    if (!course) {
        notFound();
    }

    // Fetch dynamic popup settings to get the featured video URL
    const dynamicVideos = {
        intro: null as any,
        middle: null as any,
        footer: null as any
    };

    try {
        const res = await fetch(`http://localhost:5000/api/settings/popups`, { next: { revalidate: 0 } });
        if (res.ok) {
            const popups = await res.json();
            // Filter active popups for this course
            const activePopups = popups.filter((p: any) => p.is_active && p.course_id === id && p.video_url && p.video_url.trim() !== "");

            // Map them to their positions
            activePopups.forEach((p: any) => {
                if (p.video_placement === 'intro') dynamicVideos.intro = p;
                if (p.video_placement === 'middle') dynamicVideos.middle = p;
                if (p.video_placement === 'footer') dynamicVideos.footer = p;
            });
        }
    } catch (err) {
        console.error("Failed to fetch featured videos from settings", err);
    }

    const renderTextWithBullets = (text: string) => {
        if (!text) return null;
        const lines = text.split('\n');
        return lines.map((line, index) => {
            if (line.trim().startsWith('-')) {
                return (
                    <li key={index} className="flex items-start ml-4 mb-2 text-gray-600">
                        <CheckCircle2 size={16} className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
                        <span>{line.trim().substring(1).trim()}</span>
                    </li>
                );
            }
            return (
                <p key={index} className="text-gray-600 whitespace-pre-line leading-relaxed pb-4">
                    {line}
                </p>
            );
        });
    };

    return (
        <div className="min-h-screen bg-[#eef2f6] pt-12 pb-24 px-4 font-serif" style={{ fontFamily: 'Cambria, Georgia, serif' }}>
            <div className="max-w-7xl mx-auto">
                {/* Navigation Breadcrumb */}
                <div className="mb-10">
                    <Link
                        href="/"
                        className="inline-flex items-center text-[#0b1f3a]/60 hover:text-blue-600 font-medium transition-all group"
                    >
                        <ArrowLeft size={18} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                        Return to Home
                    </Link>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-5 space-y-16">
                        {/* Header Section */}
                        <header className="border-b border-gray-100 pb-12">
                            <div className="mb-6 flex items-center space-x-3">
                                <span className="px-4 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-[0.2em]">
                                    {course.category} Program
                                </span>
                                <div className="h-px flex-grow bg-blue-100/50"></div>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-[#0b1f3a] mb-8 leading-[1.15]">
                                {course.title}
                            </h1>
                            <div className="flex flex-wrap gap-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Duration</span>
                                    <div className="flex items-center text-[#0b1f3a] font-bold">
                                        <Clock size={16} className="mr-2 text-blue-600" />
                                        {course.duration || "Self-Paced"}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Status</span>
                                    <div className="flex items-center text-[#0b1f3a] font-bold">
                                        <Award size={16} className="mr-2 text-blue-600" />
                                        Certified
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Delivery</span>
                                    <div className="flex items-center text-[#0b1f3a] font-bold">
                                        <GraduationCap size={16} className="mr-2 text-blue-600" />
                                        Practical Training
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Overview Section */}
                        {(course.goal || course.overview) && (
                            <section className="relative">
                                <div className="absolute -left-6 top-0 bottom-0 w-1 bg-blue-600 rounded-full"></div>
                                <h2 className="text-2xl font-bold text-[#0b1f3a] mb-6 flex items-center">
                                    Course Overview
                                </h2>
                                <div className="space-y-6 text-lg leading-relaxed text-gray-700 italic">
                                    {course.goal && <p className="font-medium text-[#0b1f3a]">{course.goal}</p>}
                                    {course.overview && <p className="text-gray-600 not-italic">{course.overview}</p>}
                                </div>
                            </section>
                        )}

                        {/* Key Features Section */}
                        {course.features && (
                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.3em] mb-8">Strategic Advantages</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                    {course.features.map((feature: string, index: number) => {
                                        const [title, desc] = feature.split(':-');
                                        return (
                                            <div key={index} className="group">
                                                <h4 className="font-bold text-[#0b1f3a] text-sm mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{title}</h4>
                                                {desc && <p className="text-gray-500 text-xs leading-relaxed border-l border-gray-100 pl-4">{desc.trim()}</p>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Syllabus/Curriculum */}
                        <section className="bg-gray-50 rounded-[32px] p-4 md:p-8 border border-gray-100">
                            <h2 className="text-3xl font-bold text-[#0b1f3a] mb-12 flex items-baseline">
                                <span className="text-6xl text-blue-600/10 mr-4 font-black">01.</span>
                                Detailed Syllabus
                            </h2>
                            <div className="space-y-2">
                                {course.content ? (
                                    <div className="grid gap-2">
                                        {course.content.map((text: string, i: number) => (
                                            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                                {renderTextWithBullets(text)}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">Curriculum details are currently being finalized.</p>
                                )}
                            </div>
                        </section>

                        {/* Practical Components */}
                        {(course.projectWork || course.dissertation) && (
                            <div className="grid md:grid-cols-2 gap-8">
                                {course.projectWork && (
                                    <div className="border border-amber-100 bg-amber-50/30 rounded-3xl p-8">
                                        <h3 className="text-amber-900 font-bold mb-4 flex items-center">
                                            <PenTool size={18} className="mr-3" /> Project Initiatives
                                        </h3>
                                        <ul className="space-y-3">
                                            {course.projectWork.map((pw: string, i: number) => (
                                                <li key={i} className="text-sm text-amber-800/80 flex items-start">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 mr-3 flex-shrink-0"></div>
                                                    {pw}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}{course.dissertation && (
                                    <div className="border border-emerald-100 bg-emerald-50/30 rounded-3xl p-8">
                                        <h3 className="text-emerald-900 font-bold mb-4 flex items-center">
                                            <BookOpen size={18} className="mr-3" /> Specialized Research
                                        </h3>
                                        <ul className="space-y-3">
                                            {course.dissertation.map((d: string, i: number) => (
                                                <li key={i} className="text-sm text-emerald-800/80 flex items-start">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-3 flex-shrink-0"></div>
                                                    {d}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Quick Contact Form */}
                        <section className="bg-white rounded-xl p-5 border border-gray-100 shadow-lg max-w-xl">
                            <h2 className="text-xl font-bold text-[#0b1f3a] mb-6">
                                Quick Contact
                            </h2>
                            <form className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700">Enter Name *</label>
                                        <input
                                            type="text"
                                            placeholder="Full name"
                                            className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700">Enter Email *</label>
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700">Enter Mobile *</label>
                                    <input
                                        type="tel"
                                        placeholder="Mobile number"
                                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-700">Enter Message *</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Your message..."
                                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-blue-500 outline-none transition resize-none"
                                        required
                                    ></textarea>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 w-fit scale-90 origin-left">
                                        <input
                                            type="checkbox"
                                            id="notarobot"
                                            className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                                            required
                                        />
                                        <label htmlFor="notarobot" className="text-[10px] font-medium text-gray-600 cursor-pointer uppercase tracking-wider">
                                            I'm not a robot
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="px-10 py-3 bg-[#0b1f3a] hover:bg-blue-900 text-white text-xs font-bold rounded-lg transition active:scale-[0.98] shadow-lg shadow-blue-900/10"
                                    >
                                        Submit Request
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* Center Column: Information Sidebar */}
                    <aside className="lg:col-span-4">
                        <div className="space-y-10">
                            {/* Admission Details */}
                            <div className="border-t-4 border-[#0b1f3a] bg-white p-8 pt-10 rounded-b-3xl shadow-sm">
                                <section className="mb-10">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-5">Admissions</h4>
                                    <div className="space-y-6">
                                        <div>
                                            <span className="block text-xs text-gray-500 mb-1">Eligibility Criteria</span>
                                            <p className="text-[#0b1f3a] font-bold text-lg">{course.eligibility || "Standard Qualifications"}</p>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-500 mb-1">Certification Body</span>
                                            <p className="text-[#0b1f3a] font-bold transition-colors hover:text-blue-600">
                                                {course.certification || "Professional Industry Certification"}
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Related Programs Navigation */}
                            <nav className="p-8">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Related Path</h4>
                                <div className="space-y-1">
                                    {courses
                                        .filter((c: any) => c.category === course.category && c.id !== course.id)
                                        .map((related: any) => (
                                            <Link
                                                key={related.id}
                                                href={`/courses/${related.id}`}
                                                className="block p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                                            >
                                                <span className="text-xs font-bold text-[#0b1f3a] group-hover:text-blue-600 transition-colors uppercase tracking-tight block truncate">
                                                    {related.title}
                                                </span>
                                            </Link>
                                        ))}
                                </div>

                                <div className="mt-8">
                                    <button className="w-full bg-[#0b1f3a] text-white font-bold py-4 rounded-xl hover:bg-blue-900 transition-all duration-300 shadow-lg shadow-blue-900/10 flex items-center justify-center gap-3">
                                        <ClipboardCheck size={18} />
                                        Download Brochure
                                    </button>
                                </div>
                            </nav>

                            {/* Evaluation Criteria */}
                            {course.assessments && (
                                <div className="px-8 border-l border-gray-100">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center">
                                        Evaluation
                                    </h4>
                                    <ul className="space-y-4">
                                        {course.assessments.map((a: string, i: number) => (
                                            <li key={i} className="text-xs text-gray-500 leading-relaxed pl-4 border-l border-blue-200">
                                                {a}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Right Column: Videos */}
                    <aside className="lg:col-span-3">
                        <div className="flex flex-col justify-between h-full py-16">
                            {/* Intro Video (Top) */}
                            <SidebarVideo
                                url={dynamicVideos.intro?.video_url || 'https://assets.mixkit.co/videos/preview/mixkit-mechanical-parts-working-together-42790-large.mp4'}
                            />

                            {/* Middle Video (Center) */}
                            <SidebarVideo
                                url={dynamicVideos.middle?.video_url || 'https://assets.mixkit.co/videos/preview/mixkit-welding-macro-video-4171-large.mp4'}
                            />

                            {/* Footer Video (Bottom) */}
                            <SidebarVideo
                                url={dynamicVideos.footer?.video_url || 'https://assets.mixkit.co/videos/preview/mixkit-construction-site-surveying-42792-large.mp4'}
                            />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
