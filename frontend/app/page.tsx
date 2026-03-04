import BannerSection from "./components/BannerSection";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-[70vh] bg-white px-6 w-full py-12">
      <div className="max-w-7xl w-full text-center space-y-16">
        <BannerSection />

        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-black text-[#0b1f3a] tracking-tight">
            Welcome to <br />
            <span className="text-blue-600 uppercase tracking-widest">Nskill India</span>
          </h1>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full shadow-sm"></div>
          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Technical Skill Training & Corporate Consulting Excellence
          </p>
        </div>
      </div>
    </div>
  );
}