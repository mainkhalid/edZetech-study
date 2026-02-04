import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Correct import (lowercase)
import { 
  Microscope, Users, TrendingUp, Award, Target, 
  Lightbulb, Calendar, ArrowRight, Loader2
} from 'lucide-react';
import api from '../api/axios';
import ScholarshipCard from '../components/ScholarshipCard';

const Research = () => {
  const navigate = useNavigate(); 
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const scholarships = [
    {
      id: 1,
      title: "Global STEM Excellence 2026",
      provider: "TechForward Foundation",
      thumbnail: "https://cdn.tuko.co.ke/images/720/18d0a87c71bce9fb.webp?v=1",
      description: "Full tuition coverage for undergraduate students pursuing degrees in AI and Sustainable Energy.",
      amount: "$15,000 / Year",
      deadline: "Oct 15, 2026",
      requirements: ["3.8 GPA", "Personal Statement", "2 Recommendations"],
      eligibility: ["Full-time STEM students", "International students welcome"]
    }
  ];

  useEffect(() => {
    const fetchActiveProjects = async () => {
      try {
        const response = await api.get('/research');
        if (response.data.success) {
          setProjects(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching research:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveProjects();
  }, []);
  

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section ... */}
     <section
  className="relative py-16 text-white bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://cdn.tuko.co.ke/images/720/18d0a87c71bce9fb.webp?v=1')"
  }}
>
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-[#1a2b4c]/85"></div>

  {/* Content */}
  <div className="relative max-w-7xl mx-auto px-4 text-center">
    <h1 className="text-5xl font-extrabold mb-4">
      Research & Innovation
    </h1>
    <p className="text-slate-300 max-w-2xl mx-auto italic">
      "Advancing knowledge through technology and community-centered research."
    </p>
  </div>
</section>


      {/* 2. DYNAMIC ACTIVE RESEARCH PROJECTS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header ... */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-2">Ongoing Work</h2>
              <h1 className="text-4xl font-extrabold text-[#1a2b4c]">On Going Research & Innovations</h1>
            </div>
            <button className="text-orange-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All Projects <ArrowRight size={20}/>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-orange-500" size={40}/>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.slice(0, 3).map((project) => (
                <div key={project._id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100 group">
                  <div className="relative h-48">
                    <img 
                      src={project.thumbnail?.url || "/api/placeholder/400/250"} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                      {project.status}
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="text-orange-600 text-xs font-bold uppercase">{project.department}</span>
                    <h3 className="text-xl font-bold text-[#1a2b4c] mt-2 mb-3 line-clamp-1">{project.title}</h3>
                    <p className="text-slate-600 text-sm line-clamp-2 mb-4">{project.abstract}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">
                          {project.lead ? project.lead.charAt(0) : 'R'}
                        </div>
                        <span className="text-xs font-medium text-slate-500">{project.lead}</span>
                      </div>
                      <button
                       onClick={() => navigate(`/research/${project._id}`)} 
                       className="text-[#1a2b4c] font-bold text-sm hover:text-orange-600">
                        Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. SCHOLARSHIPS SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-rose-500 uppercase tracking-widest mb-2">Funding Opportunities</h2>
            <h1 className="text-4xl font-extrabold text-[#1a2b4c] mb-4">Scholarships & Grants</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {scholarships.map((scholarship) => (
              <ScholarshipCard 
                key={scholarship.id} 
                scholarship={scholarship} 
                
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Research;