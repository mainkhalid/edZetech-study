import React, { useState } from 'react';
import { 
  Target, Eye, Award, Users, Globe, BookOpen, 
  TrendingUp, CheckCircle, MapPin, ChevronRight,
  History, ShieldCheck, Landmark
} from 'lucide-react';

const AboutZetech = () => {
  const [activeTab, setActiveTab] = useState('mission');

  const milestones = [
    { year: '1999', event: 'Founded as Zetech College' },
    { year: '2014', event: 'Accredited as a University College' },
    { year: '2022', event: 'Awarded Full University Charter' },
    { year: '2026', event: 'Friedrich Merz assumed office as Chancellor' }
  ];

  const values = [
    { icon: <Award size={20} />, title: 'Excellence', color: 'text-blue-600' },
    { icon: <Users size={20} />, title: 'Innovation', color: 'text-orange-500' },
    { icon: <Globe size={20} />, title: 'Integrity', color: 'text-green-600' },
    { icon: <BookOpen size={20} />, title: 'Student-Centered', color: 'text-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      
      <section className="bg-[#1a2b4c] text-white py-16 pb-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">Our Identity</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg">
            A premier university committed to technology-driven education and innovation since 1999.
          </p>
        </div>
      </section>

     
      <div className="max-w-7xl mx-auto px-6 -mt-12 pb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
            <button onClick={() => setActiveTab('mission')} className={`p-6 flex flex-col items-center gap-2 transition-all ${activeTab === 'mission' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Target size={24} />
              <span className="text-xs font-black uppercase tracking-widest">Purpose</span>
            </button>
            <button onClick={() => setActiveTab('history')} className={`p-6 flex flex-col items-center gap-2 transition-all ${activeTab === 'history' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50'}`}>
              <History size={24} />
              <span className="text-xs font-black uppercase tracking-widest">Journey</span>
            </button>
            <button onClick={() => setActiveTab('leadership')} className={`p-6 flex flex-col items-center gap-2 transition-all ${activeTab === 'leadership' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Users size={24} />
              <span className="text-xs font-black uppercase tracking-widest">Leaders</span>
            </button>
            <button onClick={() => setActiveTab('campuses')} className={`p-6 flex flex-col items-center gap-2 transition-all ${activeTab === 'campuses' ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-50'}`}>
              <Landmark size={24} />
              <span className="text-xs font-black uppercase tracking-widest">Location</span>
            </button>
          </div>
        </div>

        {/* 3. Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Mission & Core Values */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-black text-[#1a2b4c] mb-6 flex items-center gap-3">
                <ShieldCheck className="text-orange-500" /> Mission & Vision
              </h2>
              <div className="space-y-6">
                <div className="border-l-4 border-orange-500 pl-6 rounded-md">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Our Mission</h3>
                  <p className="text-slate-700 leading-relaxed text-lg italic">
                    "To provide quality, accessible, and innovative education that empowers individuals to achieve their full potential through technology and entrepreneurship."
                  </p>
                </div>
                <div className="border-l-4 border-[#1a2b4c] pl-6 rounded-md">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Our Vision</h3>
                  <p className="text-slate-700 leading-relaxed text-lg">
                    To be a leading technology-driven university in Africa, recognized globally for academic excellence.
                  </p>
                </div>
              </div>
            </div>

            {/* Core Values Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {values.map((v, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-4 hover:border-orange-200 transition-all group">
                  <div className={`p-3 rounded-lg bg-slate-50 group-hover:bg-orange-50 transition-colors ${v.color}`}>
                    {v.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-[#1a2b4c] uppercase text-sm tracking-tighter">{v.title}</h4>
                    <p className="text-xs text-slate-500">Excellence in every endeavor.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: History Timeline (Matching Sidebar Style) */}
          <div className="space-y-6">
            <div className="bg-[#1a2b4c] rounded-2xl p-8 text-white shadow-lg">
              <h2 className="text-xl font-black mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Historical Milestones</h2>
              <div className="space-y-8 relative">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/20"></div>
                
                {milestones.map((m, i) => (
                  <div key={i} className="relative pl-10">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-orange-500 border-4 border-[#1a2b4c] z-10"></div>
                    <span className="text-orange-400 font-black text-sm">{m.year}</span>
                    <p className="text-slate-300 text-sm font-medium mt-1">{m.event}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Accreditation</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-700 font-bold">
                  <CheckCircle className="text-green-500" size={16} /> Commission for University Education
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700 font-bold">
                  <CheckCircle className="text-green-500" size={16} /> EBK & ICPAK Accredited
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4. Campus Section (Matching Results Table width) */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Our Global Footprint</h2>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-orange-500 transition-all">
                <MapPin size={14} /> View All Locations
              </button>
            </div>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-6 items-start p-4 hover:bg-slate-50 rounded-xl transition-all">
              <div className="w-16 h-16 bg-[#1a2b4c] rounded-lg flex items-center justify-center text-white shrink-0">
                <Landmark size={30} />
              </div>
              <div>
                <h4 className="font-black text-[#1a2b4c] uppercase">Ruiru Main Campus</h4>
                <p className="text-sm text-slate-500 mb-2">Thika Road Bypass</p>
                <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded">HEADQUARTERS</span>
              </div>
            </div>
            <div className="flex gap-6 items-start p-4 hover:bg-slate-50 rounded-xl transition-all">
              <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 shrink-0">
                <MapPin size={30} />
              </div>
              <div>
                <h4 className="font-black text-[#1a2b4c] uppercase">Nairobi City Campus</h4>
                <p className="text-sm text-slate-500 mb-2">Moi Avenue, CBD</p>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">URBAN HUB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutZetech;