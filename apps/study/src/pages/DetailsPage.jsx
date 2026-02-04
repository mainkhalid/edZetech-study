import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Microscope, User, Target, 
  CheckCircle2, FileText, Briefcase, Calendar 
} from 'lucide-react';
import api from '../api/axios';

const DetailsPage = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = type === 'research' ? `/research/${id}` : `/scholarships/${id}`;
        const response = await api.get(endpoint);
        setData(response.data.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, type]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!data) return <div className="h-screen flex items-center justify-center">Item not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Dynamic Header / Hero */}
      <div className="bg-[#1a2b4c] text-white pt-12 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} /> Back
          </button>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img 
              src={data.thumbnail?.url || data.thumbnail || "/api/placeholder/400/250"} 
              className="w-full md:w-80 aspect-video rounded-2xl object-cover shadow-2xl border-4 border-white/10"
              alt="Thumbnail"
            />
            <div className="flex-1">
              <span className="bg-orange-500 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4 inline-block">
                {type === 'research' ? data.status : 'Funding Available'}
              </span>
              <h1 className="text-4xl font-extrabold mb-4 leading-tight">{data.title}</h1>
              <div className="flex flex-wrap gap-6 text-slate-300">
                <div className="flex items-center gap-2">
                  {type === 'research' ? <User size={18}/> : <Briefcase size={18}/>}
                  <span>{type === 'research' ? `Lead: ${data.lead}` : `Provider: ${data.provider}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18}/>
                  <span>{type === 'research' ? `Started: ${new Date(data.createdAt).toLocaleDateString()}` : `Deadline: ${data.deadline}`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="text-orange-500" /> 
                {type === 'research' ? 'Abstract' : 'Description'}
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {type === 'research' ? data.abstract : data.description}
              </p>
            </div>

            {/* Research Specific: Milestones */}
            {type === 'research' && data.milestones?.length > 0 && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Target className="text-orange-500" /> Project Milestones
                </h2>
                <div className="space-y-4">
                  {data.milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className={`p-2 rounded-full ${m.completed ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                        <CheckCircle2 size={20} />
                      </div>
                      <span className={`font-medium ${m.completed ? 'text-slate-800' : 'text-slate-400'}`}>
                        {m.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scholarship Specific: Requirements */}
            {type === 'scholarship' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Requirements & Eligibility</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><Microscope size={16}/> Requirements</h3>
                    <ul className="space-y-2">
                      {data.requirements?.map((r, i) => <li key={i} className="text-sm text-slate-600">• {r}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><Target size={16}/> Eligibility</h3>
                    <ul className="space-y-2">
                      {data.eligibility?.map((e, i) => <li key={i} className="text-sm text-slate-600">• {e}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4">Department</h4>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-2xl text-orange-700 font-bold">
                  <Microscope size={20} />
                  {data.department}
                </div>
             </div>
             
             <button className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 transition-all">
                {type === 'research' ? 'Contact Lead Researcher' : 'Apply for Scholarship'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;