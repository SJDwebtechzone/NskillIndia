"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
    Layout,
    Monitor,
    PlusCircle,
    Trash2,
    CheckCircle2,
    XCircle,
    UploadCloud,
    FileImage,
    Globe
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/settings";

interface Banner {
    id: number;
    image_url: string;
    title: string;
    is_active: boolean;
}

interface Popup {
    id: number;
    image_url: string;
    title: string;
    description: string;
    course_id: string;
    is_active: boolean;
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("banner");
    const [banners, setBanners] = useState<Banner[]>([]);
    const [popups, setPopups] = useState<Popup[]>([]);
    const [loading, setLoading] = useState(false);

    const [bannerForm, setBannerForm] = useState({
        title: "",
        image: null as File | null,
    });

    const [popupForm, setPopupForm] = useState({
        image_url: "",
        title: "",
        description: "",
        course_id: "",
    });

    useEffect(() => {
        fetchBanners();
        fetchPopups();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/banners`);
            setBanners(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPopups = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/popups`);
            setPopups(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addBanner = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("title", bannerForm.title);
        if (bannerForm.image) {
            formData.append("image", bannerForm.image);
        }

        try {
            await axios.post(`${API_BASE_URL}/banners`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setBannerForm({ title: "", image: null });
            fetchBanners();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addPopup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/popups`, popupForm);
            setPopupForm({ image_url: "", title: "", description: "", course_id: "" });
            fetchPopups();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleBannerStatus = async (id: number, currentStatus: boolean) => {
        await axios.put(`${API_BASE_URL}/banners/${id}/status`, { is_active: !currentStatus });
        fetchBanners();
    };

    const togglePopupStatus = async (id: number, currentStatus: boolean) => {
        await axios.put(`${API_BASE_URL}/popups/${id}/status`, { is_active: !currentStatus });
        fetchPopups();
    };

    const deleteBanner = async (id: number) => {
        if (!confirm("Are you sure you want to delete this banner?")) return;
        await axios.delete(`${API_BASE_URL}/banners/${id}`);
        fetchBanners();
    };

    const deletePopup = async (id: number) => {
        if (!confirm("Are you sure you want to delete this popup?")) return;
        await axios.delete(`${API_BASE_URL}/popups/${id}`);
        fetchPopups();
    };

    return (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden min-h-[700px] flex flex-col md:flex-row">

            {/* Sidebar Tabs */}
            <div className="w-full md:w-80 bg-slate-50/50 border-r border-slate-100 p-8">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                        <Globe className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Website Settings</h2>
                </div>

                <div className="space-y-2">
                    <button
                        onClick={() => setActiveTab("banner")}
                        className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === "banner"
                            ? "bg-white text-blue-600 shadow-md shadow-blue-600/5 translate-x-1"
                            : "text-slate-400 hover:bg-white hover:text-slate-600"
                            }`}
                    >
                        <Monitor className="w-5 h-5" />
                        <span>Homepage Banner</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("popup")}
                        className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === "popup"
                            ? "bg-white text-blue-600 shadow-md shadow-blue-600/5 translate-x-1"
                            : "text-slate-400 hover:bg-white hover:text-slate-600"
                            }`}
                    >
                        <Layout className="w-5 h-5" />
                        <span>Featured Popup</span>
                    </button>
                </div>

            </div>

            {/* Content Area */}
            <div className="flex-1 p-10 overflow-y-auto">
                {activeTab === "banner" && (
                    <div className="animate-in fade-in slide-in-from-right duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Banner Management</h1>
                            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">{banners.length} Active Slots</span>
                        </div>

                        {/* Add Banner Form */}
                        <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-[24px] mb-12">
                            <form onSubmit={addBanner} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Banner Title</label>
                                    <input
                                        type="text"
                                        placeholder="Enter display title"
                                        value={bannerForm.title}
                                        onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium text-slate-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Hero Image</label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.files ? e.target.files[0] : null })}
                                            className="hidden"
                                            id="banner-file"
                                            required
                                        />
                                        <label htmlFor="banner-file" className="flex items-center gap-3 w-full p-4 bg-white border border-slate-200 border-dashed rounded-2xl cursor-pointer hover:bg-white hover:border-blue-400 transition-all font-medium text-slate-500">
                                            <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                                                <UploadCloud className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <span className="truncate">{bannerForm.image ? bannerForm.image.name : "Select JPG / PNG"}</span>
                                        </label>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-2"
                                >
                                    {loading ? "Uploading..." : <><PlusCircle className="w-5 h-5" /> Push to Production</>}
                                </button>
                            </form>
                        </div>

                        {/* Banner List */}
                        <div className="grid grid-cols-1 gap-4">
                            {banners.map((banner) => (
                                <div key={banner.id} className="group flex items-center gap-6 bg-white border border-slate-100 p-5 rounded-[24px] hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                                    <div className="relative h-20 w-32 rounded-xl overflow-hidden shadow-md shrink-0">
                                        <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        {!banner.is_active && <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center"><XCircle className="text-white w-6 h-6" /></div>}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Headline</p>
                                        <h3 className="font-black text-slate-800 text-lg tracking-tight truncate">{banner.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => toggleBannerStatus(banner.id, banner.is_active)}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${banner.is_active
                                                ? "bg-emerald-50 text-emerald-600 shadow-sm"
                                                : "bg-slate-100 text-slate-400"
                                                }`}
                                        >
                                            {banner.is_active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                            {banner.is_active ? "Live" : "Draft"}
                                        </button>
                                        <button
                                            onClick={() => deleteBanner(banner.id)}
                                            className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "popup" && (
                    <div className="animate-in fade-in slide-in-from-right duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Popup Management</h1>
                            <span className="px-4 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full">Manual Override</span>
                        </div>

                        <form onSubmit={addPopup} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 bg-slate-50/50 p-8 rounded-[24px] border border-slate-100">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Asset URL</label>
                                <input
                                    type="text"
                                    placeholder="Paste URL"
                                    value={popupForm.image_url}
                                    onChange={(e) => setPopupForm({ ...popupForm, image_url: e.target.value })}
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium text-slate-700"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Campaign Title</label>
                                <input
                                    type="text"
                                    placeholder="Enter Title"
                                    value={popupForm.title}
                                    onChange={(e) => setPopupForm({ ...popupForm, title: e.target.value })}
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium text-slate-700"
                                    required
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Short Description</label>
                                <input
                                    type="text"
                                    placeholder="Enter message for users"
                                    value={popupForm.description}
                                    onChange={(e) => setPopupForm({ ...popupForm, description: e.target.value })}
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium text-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Landing Course ID</label>
                                <input
                                    type="text"
                                    placeholder="ID or Slug"
                                    value={popupForm.course_id}
                                    onChange={(e) => setPopupForm({ ...popupForm, course_id: e.target.value })}
                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium text-slate-700"
                                />
                            </div>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-lg shadow-blue-600/20 md:mt-6">
                                Create Popup
                            </button>
                        </form>

                        <div className="grid grid-cols-1 gap-6">
                            {popups.map((popup) => (
                                <div key={popup.id} className="group relative flex flex-col md:flex-row gap-8 bg-white border border-slate-100 p-8 rounded-[32px] hover:shadow-2xl transition-all duration-300">
                                    <div className="relative w-full md:w-56 h-40 rounded-2xl overflow-hidden shadow-inner shrink-0 bg-slate-50">
                                        <img src={popup.image_url} alt={popup.title} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{popup.title}</h3>
                                            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg">ID: {popup.course_id || 'Global'}</span>
                                        </div>
                                        <p className="text-slate-500 font-medium leading-relaxed">{popup.description}</p>
                                        <div className="flex items-center gap-4 pt-2">
                                            <button
                                                onClick={() => togglePopupStatus(popup.id, popup.is_active)}
                                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${popup.is_active
                                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                                    : "bg-slate-100 text-slate-400"
                                                    }`}
                                            >
                                                {popup.is_active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                {popup.is_active ? "Active Now" : "Inactive"}
                                            </button>
                                            <button
                                                onClick={() => deletePopup(popup.id)}
                                                className="px-6 py-3 text-red-500 hover:bg-red-50 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all"
                                            >
                                                Delete Campaign
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
