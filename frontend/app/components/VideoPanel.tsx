"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Play } from 'lucide-react';

interface VideoSource {
    id: string;
    url: string;
    type: string;
}

interface VideoPanelProps {
    videos?: VideoSource[];
}

const VideoPanel: React.FC<VideoPanelProps> = ({ videos = [] }) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Slide in automatically 500ms after load
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    // Default mock videos if none provided in course data
    const displayVideos = videos && videos.length > 0 ? videos.slice(0, 3) : [
        { id: 'mock-1', url: 'https://assets.mixkit.co/videos/preview/mixkit-mechanical-parts-working-together-42790-large.mp4', type: 'intro' },
        { id: 'mock-2', url: 'https://assets.mixkit.co/videos/preview/mixkit-welding-macro-video-4171-large.mp4', type: 'lab' },
        { id: 'mock-3', url: 'https://assets.mixkit.co/videos/preview/mixkit-construction-site-surveying-42792-large.mp4', type: 'about' }
    ].slice(0, 3);

    return (
        <>
            {/* Desktop Side Panel */}
            <aside
                className={`hidden lg:flex fixed top-1/2 right-0 -translate-y-1/2 z-[100] transition-transform duration-500 ease-[cubic-bezier(0.19, 1, 0.22, 1)] ${!isVisible ? 'translate-x-full' : isMinimized ? 'translate-x-[calc(100%-12px)]' : 'translate-x-0'
                    }`}
            >
                {/* Minimize/Expand Toggle */}
                <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 p-2 bg-[#0b1f3a] text-white rounded-l-2xl shadow-[-10px_0_20px_rgba(0,0,0,0.2)] hover:bg-blue-900 transition-all hover:pr-4 group"
                    title={isMinimized ? "Show Videos" : "Hide Videos"}
                >
                    <div className="flex items-center gap-1">
                        {isMinimized ? <ChevronLeft size={20} className="animate-pulse" /> : <ChevronRight size={20} />}
                        {isMinimized && <span className="text-[10px] font-bold uppercase tracking-widest hidden group-hover:block whitespace-nowrap">Watch Preview</span>}
                    </div>
                </button>

                {/* Vertical Video Stack */}
                <div className="bg-white/80 backdrop-blur-2xl p-5 shadow-[-20px_0_50px_rgba(11,31,58,0.1)] border-l border-white/20 flex flex-col gap-5 w-[360px] max-h-[90vh] overflow-y-auto rounded-l-[2.5rem]">
                    {displayVideos.map((video) => (
                        <div key={video.id} className="relative group overflow-hidden rounded-2xl bg-black aspect-video w-[320px] ring-1 ring-[#0b1f3a]/5 hover:ring-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]">
                            <video
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                playsInline
                                muted
                                loop
                                autoPlay
                            >
                                <source src={video.url} type="video/mp4" />
                            </video>

                            {/* Overlay Title / Label */}
                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <span className="text-[8px] text-blue-400 font-bold uppercase tracking-widest">{video.type} session</span>
                            </div>

                            {/* Center Play Indicator */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="p-3 bg-white/20 backdrop-blur-xl rounded-full text-white border border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                    <Play size={24} fill="white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Mobile Bottom Drawer */}
            <div
                className={`lg:hidden fixed bottom-0 left-0 right-0 z-[100] transition-transform duration-500 ease-[cubic-bezier(0.19, 1, 0.22, 1)] bg-white rounded-t-[3rem] shadow-[0_-20px_50px_rgba(11,31,58,0.15)] ${!isVisible ? 'translate-y-full' : isMinimized ? 'translate-y-[calc(100%-80px)]' : 'translate-y-0'
                    }`}
            >
                {/* Mobile Drag Handle / Toggle */}
                <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="w-full h-20 flex flex-col items-center justify-center border-b border-gray-50/50"
                >
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-3 shadow-inner" />
                    <span className="text-[10px] font-bold text-[#0b1f3a]/40 uppercase tracking-[0.3em]">
                        {isMinimized ? "Tap to Preview" : "Training Highlights"}
                    </span>
                </button>

                {/* Mobile Scrollable Video List */}
                <div className="p-8 pb-12 flex flex-col gap-8 max-h-[75vh] overflow-y-auto">
                    {displayVideos.map((video) => (
                        <div key={video.id} className="w-full rounded-2xl overflow-hidden bg-black aspect-video shadow-xl ring-1 ring-gray-100">
                            <video
                                className="w-full h-full object-cover"
                                playsInline
                                muted
                                controls
                            >
                                <source src={video.url} type="video/mp4" />
                            </video>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default VideoPanel;
