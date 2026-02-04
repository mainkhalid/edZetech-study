import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Calendar, Building2, ArrowRight } from 'lucide-react';

const ScholarshipCard = ({ scholarship }) => {
  const navigate = useNavigate();
  const { id, title, provider, thumbnail, description, deadline } = scholarship;

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={thumbnail || "/api/placeholder/400/200"} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-rose-600 shadow-sm flex items-center gap-1">
          <Calendar size={12} /> {deadline}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
          <Building2 size={14} />
          <span className="font-medium">{provider}</span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-1 group-hover:text-rose-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1">
          {description}
        </p>

        {/* Link to the dynamic scholarship route */}
        <button 
          onClick={() => navigate(`/scholarships/${id}`)}
          className="w-full py-3 bg-slate-50 hover:bg-rose-600 text-slate-700 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
        >
          View Full Details
          <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ScholarshipCard;