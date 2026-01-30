import React from 'react';
import { Beaker, Cpu, Zap, ArrowUpRight, ShieldCheck } from 'lucide-react';

const ResearchHighlight = () => {
  const researchPillars = [
    {
      icon: <ShieldCheck className="text-orange-500" size={20} />,
      title: "Error Mitigation",
      desc: "Developing protocols for the real-time detection and removal of decoherence-induced errors."
    },
    {
      icon: <Zap className="text-orange-500" size={20} />,
      title: "Photonic Transport",
      desc: "Utilizing laser-light architecture to carry quantum information across modular networks."
    },
    {
      icon: <Cpu className="text-orange-500" size={20} />,
      title: "Calculation Fidelity",
      desc: "Systematically improving the accuracy of algorithmic calculations for complex systems."
    }
  ];

  return (
    <div className="bg-white border-y border-slate-200 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Abstract Content */}
        <div className="space-y-8">
          <div>
            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-[10px] font-bold uppercase tracking-widest rounded mb-4">
              Pioneering Quantum Faculty
            </span>
            <h2 className="text-4xl font-black text-[#1a2b4c] leading-tight mb-6">
              Advancing Computational Frontiers: <br/>
              <span className="text-slate-400">Next-Generation Quantum Systems</span>
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              University researchers are currently spearheading breakthroughs in quantum mechanics that 
              promise to redefine global computational limits. Our initiatives focus on 
              transitioning quantum theory into scalable, functional technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
             <div className="border-l-2 border-slate-100 pl-4">
                <p className="text-2xl font-bold text-[#1a2b4c]">99.9%</p>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Fidelity Rate</p>
             </div>
             <div className="border-l-2 border-slate-100 pl-4">
                <p className="text-2xl font-bold text-[#1a2b4c]">12+</p>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Global Patents</p>
             </div>
             <div className="border-l-2 border-slate-100 pl-4">
                <p className="text-2xl font-bold text-[#1a2b4c]">2026</p>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Scale Goal</p>
             </div>
          </div>

          <button className="flex items-center gap-3 text-[#1a2b4c] font-bold hover:text-orange-600 transition-colors group">
            Explore the Quantum Lab Repository 
            <ArrowUpRight size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Right Side: Technical Breakdown */}
        <div className="bg-slate-50 p-8 md:p-12 rounded-3xl border border-slate-100 relative">
          <div className="absolute -top-6 -right-6 bg-white shadow-xl p-4 rounded-2xl border border-slate-100 hidden md:block">
            <Beaker className="text-orange-500" size={32} />
          </div>
          
          <h3 className="text-xl font-bold text-[#1a2b4c] mb-8">Ongoing Research Focus</h3>
          
          <div className="space-y-8">
            {researchPillars.map((pillar, idx) => (
              <div key={idx} className="flex gap-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  {pillar.icon}
                </div>
                <div>
                  <h4 className="font-bold text-[#1a2b4c] text-sm uppercase tracking-wide mb-1">
                    {pillar.title}
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-[#1a2b4c] rounded-2xl text-white">
            <p className="text-xs font-semibold text-orange-400 uppercase mb-2 tracking-widest">Potential Impact</p>
            <p className="text-sm italic leading-relaxed opacity-90">
              "This technology could enable the rapid design of life-saving drugs, clean energy solutions, 
              and optimized global commerce architectures."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResearchHighlight;