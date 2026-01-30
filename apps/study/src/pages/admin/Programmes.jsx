import React, { useState } from 'react';
import { 
  Plus, Trash2, Save, ListPlus, 
  MapPin, GraduationCap, BookOpen, Eye
} from 'lucide-react';
// 1. Import Toaster and toast from sonner
import { Toaster, toast } from 'sonner';

// Define initial state outside to reuse for resetting
const initialState = {
  id: '',
  name: '',
  level: 'Degree',
  school: 'ict',
  meanGrade: '',
  campuses: '',
  modes: 'Full time, Part time, E-Learning',
  description: '',
  careers: [''],
  goal: ''
};

const Programmes = () => {
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState(initialState);

  const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:5000/api';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleCareerChange = (index, value) => {
    const newCareers = [...courseData.careers];
    newCareers[index] = value;
    setCourseData(prev => ({ ...prev, careers: newCareers }));
  };

  const addCareerField = () => {
    setCourseData(prev => ({ ...prev, careers: [...prev.careers, ''] }));
  };

  const removeCareerField = (index) => {
    const newCareers = courseData.careers.filter((_, i) => i !== index);
    setCourseData(prev => ({ ...prev, careers: newCareers }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 2. Use toast.promise or manual toasts for better UX
    const promise = fetch(`${API_BASE_URL}/programmes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(courseData)
    });

    toast.promise(promise, {
      loading: 'Saving programme...',
      success: async (response) => {
        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'Failed to save');
        
        // 3. Reset the form on success
        setCourseData(initialState);
        return 'Programme created successfully!';
      },
      error: (err) => {
        return err.message || 'Network error. Please try again.';
      },
      finally: () => setLoading(false)
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      {/* 4. Place the Toaster component at the top level */}
      <Toaster position="top-right" richColors closeButton />
      
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Program Administrator</h1>
            <p className="text-slate-500 text-sm">Add or update course details and expansion content</p>
          </div>
          <button 
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              isPreview ? 'bg-orange-100 text-orange-700' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            <Eye size={18} /> {isPreview ? "Back to Edit" : "Live Preview"}
          </button>
        </div>

        {isPreview ? (
          /* Preview Mode */
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 text-blue-800 font-bold mb-6">
              <Plus size={14} /> 
              <span className="uppercase underline tracking-tight">{courseData.name || "COURSE NAME PREVIEW"}</span>
            </div>
            <div className="ml-7 space-y-4 text-[13px] text-slate-700 leading-relaxed">
               <p><span className="font-bold">MEAN GRADE:</span> {courseData.meanGrade || 'Not specified'}</p>
               <p><span className="font-bold">CAMPUSES OFFERED:</span> {courseData.campuses || 'Not specified'}</p>
               <p><span className="font-bold">MODES OF STUDY:</span> {courseData.modes}</p>
               <div>
                  <p className="font-bold uppercase mb-1">PROGRAM DESCRIPTION:</p>
                  <p className="font-semibold italic">Introduction</p>
                  <p className="whitespace-pre-wrap">{courseData.description || 'No description provided'}</p>
               </div>
               {courseData.careers.some(c => c.trim() !== '') && (
                 <div>
                    <p className="font-semibold italic">Career Opportunities</p>
                    <ol className="list-decimal ml-10 mt-1">
                      {courseData.careers.map((c, i) => c && <li key={i}>{c}</li>)}
                    </ol>
                 </div>
               )}
               {courseData.goal && (
                 <div>
                   <p className="font-bold uppercase mb-1">PROGRAM GOAL:</p>
                   <p className="whitespace-pre-wrap">{courseData.goal}</p>
                 </div>
               )}
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen size={18} className="text-blue-500"/> General Information
                </h2>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Course Name *</label>
                <input 
                  name="name" 
                  value={courseData.name} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="e.g. DIPLOMA IN SOFTWARE ENGINEERING" 
                  required 
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Course Code *</label>
                <input 
                  name="id" 
                  value={courseData.id} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="e.g. DSE204" 
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Study Level *</label>
                <select 
                  name="level" 
                  value={courseData.level} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="Certificate">Certificate</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Degree">Degree</option>
                  <option value="Masters">Masters</option>
                  <option value="Doctorate">Doctorate</option>
                  <option value="Professional Certification">Professional Certification</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">School *</label>
                <select 
                  name="school" 
                  value={courseData.school} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="ict">School of ICT,Media and Engineering</option>
                  <option value="business">School of Business economics</option>
                  <option value="engineering">School of Law</option>
                  <option value="health">School of Health Sciences</option>
                  <option value="education">School of Education,Arts & Social Science</option>
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Mean Grade Requirements</label>
                <input 
                  name="meanGrade" 
                  value={courseData.meanGrade} 
                  onChange={handleChange} 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="e.g. C- (Minus) | Mathematics D+" 
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <MapPin size={18} className="text-red-500"/> Delivery & Campuses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Campuses Offered</label>
                  <input 
                    name="campuses" 
                    value={courseData.campuses} 
                    onChange={handleChange} 
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="e.g. Ruiru, Town Campus, Nairobi" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Modes of Study</label>
                  <input 
                    name="modes" 
                    value={courseData.modes} 
                    onChange={handleChange} 
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap size={18} className="text-orange-500"/> Program Curriculum & Career
              </h2>
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Program Description</label>
                <textarea 
                  name="description" 
                  value={courseData.description} 
                  onChange={handleChange} 
                  rows="4" 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Enter a detailed introduction about the programme..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase block">Career Opportunities</label>
                {courseData.careers.map((career, index) => (
                  <div key={index} className="flex gap-2">
                    <input 
                      value={career} 
                      onChange={(e) => handleCareerChange(index, e.target.value)} 
                      className="flex-1 border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder={`Career opportunity ${index + 1}`}
                    />
                    {courseData.careers.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeCareerField(index)} 
                        className="p-2 text-red-400 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16}/>
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={addCareerField}
                  className="mt-2 flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  <ListPlus size={16} /> Add Another Career
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Program Goal</label>
                <textarea 
                  name="goal" 
                  value={courseData.goal} 
                  onChange={handleChange} 
                  rows="3" 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="What is the overall goal of this programme?"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className={`px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg ${
                  loading 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-[#1a2b4c] hover:bg-slate-800 text-white'
                }`}
              >
                <Save size={18} /> 
                {loading ? 'Saving...' : 'Save Program Data'}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default Programmes;