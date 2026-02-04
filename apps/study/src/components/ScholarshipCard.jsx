import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Calendar, Building2, ArrowRight, DollarSign } from 'lucide-react';

const ScholarshipCard = ({ scholarship }) => {
  const navigate = useNavigate();
  
  const { 
    _id, 
    name, 
    provider, 
    thumbnail, 
    description, 
    deadline,
    amount,
    eligibility 
  } = scholarship;

  const formatDeadline = (date) => {
    if (!date) return 'TBA';
    const deadlineDate = new Date(date);
    return deadlineDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={thumbnail?.url || "/api/placeholder/400/200"} 
          alt={name}
          className="w-full h-full object-cover  transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-rose-600 shadow-sm flex items-center gap-1">
          <Calendar size={12} /> {formatDeadline(deadline)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
          <Building2 size={14} />
          <span className="font-medium">{provider}</span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-rose-600 transition-colors">
          {name}
        </h3>

        {eligibility && (
          <div className="mb-3">
            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
              {eligibility}
            </span>
          </div>
        )}
        
        <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1">
          {description || 'No description available.'}
        </p>

        <button 
          onClick={() => navigate(`/scholarships/${_id}`)}
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