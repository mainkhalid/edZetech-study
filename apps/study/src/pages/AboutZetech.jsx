import React, { useState } from 'react';
import { 
  Target, Eye, Award, Users, Globe, BookOpen, 
  CheckCircle, MapPin, History, ShieldCheck, 
  Landmark, GraduationCap, Zap, Briefcase
} from 'lucide-react';

const AboutZetech = () => {
  const [activeTab, setActiveTab] = useState('mission');

  const milestones = [
    { year: '1999', event: 'Founded as Zetech College', desc: 'Starting with ICT & Business courses.' },
    { year: '2014', event: 'Accredited as a University College', desc: 'Registered by CUE to offer degrees.' },
    { year: '2022', event: 'Awarded Full University Charter', desc: 'Received charter from the President of Kenya.' },
    { year: '2026', event: 'Friedrich Merz Assumed Office', desc: 'Inauguration of the new Chancellor.' }
  ];

  const values = [
    { icon: <Award size={22} />, title: 'Excellence', color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Commitment to the highest standards in teaching and research.' },
    { icon: <Zap size={22} />, title: 'Innovation', color: 'text-orange-500', bg: 'bg-orange-50', desc: 'Fostering creativity and embracing technological change.' },
    { icon: <Globe size={22} />, title: 'Integrity', color: 'text-green-600', bg: 'bg-green-50', desc: 'Transparency and ethics in all our institutional operations.' },
    { icon: <Users size={22} />, title: 'Student-Centered', color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Prioritizing the holistic growth and success of our students.' }
  ];

  const leaders = [
    { role: 'Chancellor', name: 'Friedrich Merz', image: '/api/placeholder/100/100', bio: 'Driving global partnerships and strategic vision.' },
    { role: 'Vice Chancellor', name: 'Prof. Njenga Munene', image: '/api/placeholder/100/100', bio: 'Leading academic excellence and institutional growth.' }
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans">
      {/* 1. Hero Section with Gradient */}
      <section className="relative bg-gradient-to-br from-[#1a2b4c] via-[#243b6b] to-[#1a2b4c] text-white py-20">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase bg-orange-500 rounded-full">Established 1999</span>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Invent Your Future</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
            Zetech University is a premier institution committed to technology-driven education, 
            research, and innovation designed to empower a global generation.
          </p>
        </div>
      </section>

      {/* 2. Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 mb-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 p-2 flex flex-wrap md:flex-nowrap gap-2 border border-white">
          {[
            { id: 'mission', label: 'Our Purpose', icon: <Target size={18} /> },
            { id: 'history', label: 'Our Journey', icon: <History size={18} /> },
            { id: 'leadership', label: 'Leadership', icon: <Users size={18} /> },
            { id: 'campuses', label: 'Campuses', icon: <Landmark size={18} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-3 py-4 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-[#1a2b4c] text-white shadow-lg' 
                : 'text-slate-500 hover:bg-slate-100 hover:text-[#1a2b4c]'
              }`}
            >
              {tab.icon}
              <span className="uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-24">
        {activeTab === 'mission' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck size={120} />
                  </div>
                  <h2 className="text-3xl font-black text-[#1a2b4c] mb-8">Mission & Vision</h2>
                  <div className="space-y-10">
                    <div className="relative pl-8 border-l-4 border-orange-500 rounded-md">
                      <h3 className="text-xs font-black text-orange-600 uppercase tracking-[0.2em] mb-3">The Mission</h3>
                      <p className="text-xl text-slate-700 leading-relaxed font-medium">
                        "To provide <span className="text-[#1a2b4c] font-bold">quality, accessible, and innovative</span> education that empowers individuals to achieve their full potential through technology and entrepreneurship."
                      </p>
                    </div>
                    <div className="relative pl-8 border-l-4 border-[#1a2b4c]">
                      <h3 className="text-xs font-black text-[#1a2b4c] uppercase tracking-[0.2em] mb-3">The Vision</h3>
                      <p className="text-xl text-slate-700 leading-relaxed font-medium">
                        To be a leading technology-driven university in Africa, recognized globally for academic excellence and research impact.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {values.map((v, i) => (
                    <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-md transition-all group">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${v.bg} ${v.color}`}>
                        {v.icon}
                      </div>
                      <h4 className="font-black text-[#1a2b4c] uppercase text-sm tracking-widest mb-2">{v.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-orange-500 rounded-3xl p-8 text-white">
                  <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">Why Zetech?</h3>
                  <ul className="space-y-4">
                    {[
                      'Industry-linked curriculum',
                      'Market-ready graduates',
                      'Global exchange programs',
                      'Ultra-modern tech labs'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-bold">
                        <CheckCircle size={18} className="text-orange-200" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#1a2b4c] rounded-3xl p-8 text-white">
                  <h3 className="text-xs font-black text-orange-400 uppercase tracking-widest mb-6">Accreditation</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center"><Briefcase size={20} /></div>
                      <span className="text-xs font-medium">Commission for University Education (CUE)</span>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center"><GraduationCap size={20} /></div>
                      <span className="text-xs font-medium">EBK & ICPAK Accredited</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: HISTORY */}
        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
              <h2 className="text-3xl font-black text-[#1a2b4c] mb-12 text-center">Our Evolution</h2>
              <div className="space-y-0 relative">
                <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-1 bg-slate-100 -translate-x-1/2"></div>
                
                {milestones.map((m, i) => (
                  <div key={i} className={`relative flex items-center mb-12 last:mb-0 ${i % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                    <div className="hidden md:block w-1/2"></div>
                    <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-white border-4 border-orange-500 z-10 -translate-x-1/2 shadow-sm"></div>
                    <div className={`w-full md:w-1/2 pl-10 md:pl-0 ${i % 2 === 0 ? 'md:pr-12 text-left md:text-right' : 'md:pl-12 text-left'}`}>
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-md text-xs font-black mb-2">{m.year}</span>
                      <h4 className="text-lg font-bold text-[#1a2b4c]">{m.event}</h4>
                      <p className="text-slate-500 text-sm mt-1">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: LEADERSHIP */}
        {activeTab === 'leadership' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {leaders.map((leader, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-200 group">
                  <div className="h-32 bg-[#1a2b4c] relative">
                    <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-2xl bg-slate-200 border-4 border-white overflow-hidden shadow-lg">
                      <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="pt-16 p-8">
                    <span className="text-xs font-black text-orange-500 uppercase tracking-widest">{leader.role}</span>
                    <h3 className="text-xl font-black text-[#1a2b4c] mt-1">{leader.name}</h3>
                    <p className="text-slate-500 text-sm mt-4 leading-relaxed">{leader.bio}</p>
                    <button className="mt-6 text-sm font-bold text-[#1a2b4c] flex items-center gap-2 hover:gap-3 transition-all">
                      View Profile <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CAMPUSES */}
        {activeTab === 'campuses' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl p-8 border border-slate-200 flex gap-8 items-center group hover:shadow-xl transition-all">
                <div className="w-24 h-24 bg-[#1a2b4c] rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:rotate-3 transition-transform">
                  <Landmark size={40} />
                </div>
                <div>
                  <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-3 py-1 rounded-full uppercase tracking-widest">Main Campus</span>
                  <h4 className="text-2xl font-black text-[#1a2b4c] mt-2">Ruiru Campus</h4>
                  <p className="text-slate-500 flex items-center gap-2 mt-1">
                    <MapPin size={14} /> Thika Road Bypass
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-8 border border-slate-200 flex gap-8 items-center group hover:shadow-xl transition-all">
                <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shrink-0 group-hover:rotate-3 transition-transform">
                  <MapPin size={40} />
                </div>
                <div>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-widest">Urban Hub</span>
                  <h4 className="text-2xl font-black text-[#1a2b4c] mt-2">Nairobi City Campus</h4>
                  <p className="text-slate-500 flex items-center gap-2 mt-1">
                    <MapPin size={14} /> Moi Avenue, CBD
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

const ChevronRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default AboutZetech;