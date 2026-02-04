import React, { useState, useRef, useEffect } from 'react'
import { 
  Plus, Trash2, Save, Microscope, 
  FileText, User, CreditCard, Eye, Activity, FlaskConical, Target, Upload, X, Image as ImageIcon
} from 'lucide-react'
import { toast } from 'sonner'
import api from '../../api/axios'

const initialState = {
  title: '',
  lead: '',
  department: 'Sciences',
  funding: '',
  status: 'Planning',
  abstract: '',
  milestones: [''],
  thumbnail: null,
  thumbnailPreview: null,
  tags: [],
  collaborators: []
}

const ResearchAdmin = () => {
  const [isPreview, setIsPreview] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(initialState)
  const fileInputRef = useRef(null)

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  // Milestones handling
  const handleMilestoneChange = (index, value) => {
    const newM = [...data.milestones]
    newM[index] = value
    setData(prev => ({ ...prev, milestones: newM }))
  }
  const addMilestone = () => setData(prev => ({ ...prev, milestones: [...prev.milestones, ''] }))
  const removeMilestone = (index) => setData(prev => ({ ...prev, milestones: data.milestones.filter((_, i) => i !== index) }))

  // Image handling
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setData(prev => ({ ...prev, thumbnail: file, thumbnailPreview: previewUrl }))
  }

  const removeImage = () => {
    if (data.thumbnailPreview) URL.revokeObjectURL(data.thumbnailPreview)
    setData(prev => ({ ...prev, thumbnail: null, thumbnailPreview: null }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('lead', data.lead)
      formData.append('department', data.department)
      formData.append('funding', data.funding)
      formData.append('status', data.status)
      formData.append('abstract', data.abstract)
      
      const milestonesArray = data.milestones
        .filter(m => m.trim() !== '')
        .map(m => ({ description: m, completed: false }))
      formData.append('milestones', JSON.stringify(milestonesArray))

      if (data.tags?.length) formData.append('tags', JSON.stringify(data.tags))
      if (data.collaborators?.length) formData.append('collaborators', JSON.stringify(data.collaborators))
      if (data.thumbnail) formData.append('thumbnail', data.thumbnail)

      const response = await api.post('/research', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.data.success) {
        toast.success('Research project registered successfully!')
        if (data.thumbnailPreview) URL.revokeObjectURL(data.thumbnailPreview)
        setData(initialState)
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        toast.error(response.data.message || 'Failed to register project')
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to register project'
      toast.error(msg)
      console.error('Submission error:', error.response?.data || error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => () => {
    if (data.thumbnailPreview) URL.revokeObjectURL(data.thumbnailPreview)
  }, [data.thumbnailPreview])

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Research & Innovation</h1>
            <p className="text-slate-500 text-sm">Publish and track ongoing academic research projects</p>
          </div>
          <button 
            onClick={() => setIsPreview(!isPreview)} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all shadow-sm ${isPreview ? 'bg-[#1a2b4c] text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
          >
            <Eye size={18} /> {isPreview ? "Back to Edit" : "Project Preview"}
          </button>
        </div>

        {/* preview */}
        {isPreview ? (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 animate-in slide-in-from-right-4 duration-300">
            {data.thumbnailPreview && (
              <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                <img src={data.thumbnailPreview} alt="Project thumbnail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            )}
            <div className="p-8 border-b border-slate-100 flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#2d4263] font-bold text-xs uppercase tracking-widest">
                  <Microscope size={14} /> Academic Research
                </div>
                <h2 className="text-3xl font-bold text-slate-900 leading-tight">{data.title || "RESEARCH PROJECT TITLE"}</h2>
                <div className="flex items-center gap-6 text-sm text-slate-500 font-medium pt-2">
                  <span className="flex items-center gap-1"><User size={14}/> {data.lead || "Lead Investigator"}</span>
                  <span className="flex items-center gap-1"><FlaskConical size={14}/> {data.department}</span>
                </div>
              </div>
              <div className="px-4 py-1.5 bg-rose-50 border border-rose-100 rounded-full text-[#2d4263] font-bold text-xs">
                {data.status}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2 p-8 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><FileText size={18} className="text-[#1a2b4c]" /> Abstract</h3>
                  <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">{data.abstract || "The project abstract provides a high-level overview of the research objectives and methodology."}</p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Target size={18} className="text-[#1a2b4c]" /> Key Milestones</h3>
                  <div className="space-y-2">
                    {data.milestones.filter(m => m.trim() !== '').map((m, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="w-2 h-2 rounded-full bg-[#1a2b4c] mt-1.5 flex-shrink-0"></div>
                        <p className="text-sm text-slate-600">{m}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-8 border-l border-slate-100 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Financial Summary</h4>
                  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Approved Funding</p>
                    <p className="text-2xl font-black text-slate-800">{data.funding || "$0.00"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          
<form onSubmit={handleSubmit} className="space-y-6 pb-20">
            {/* Image Upload Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon size={18} className="text-[#1a2b4c]"/> Project Thumbnail
              </h2>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Upload Image (Optional)</label>
                <p className="text-xs text-slate-400">Recommended: 1200x800px, Max 5MB</p>
                
                {data.thumbnailPreview ? (
                  <div className="relative rounded-lg overflow-hidden border-2 border-slate-200 group">
                    <img 
                      src={data.thumbnailPreview} 
                      alt="Preview" 
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="opacity-0 group-hover:opacity-100 transition-all bg-[#1a2b4c] text-white p-3 rounded-full hover:bg-[#1a2b4c] transform hover:scale-110"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-rose-[#1a2b4c] hover:bg-rose-50/50 transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-slate-100 rounded-full group-hover:bg-rose-100 transition-colors">
                        <Upload size={32} className="text-slate-400 group-hover:text-[#1a2b4c] transition-colors" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700 group-hover:text-[#1a2b4c] transition-colors">
                          Click to upload thumbnail
                        </p>
                        <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                  <Microscope size={18} className="text-[#1a2b4c]"/> Core Project Details
                </h2>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Project Title *</label>
                <input name="title" value={data.title} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-[#1a2b4c]outline-none" placeholder="e.g. AI Integration in Modern Healthcare Systems" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Lead Investigator *</label>
                <input name="lead" value={data.lead} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-[#1a2b4c] outline-none" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Department *</label>
                <select name="department" value={data.department} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-[#1a2b4c] outline-none">
                  <option value="Sciences">School of Sciences</option>
                  <option value="Tech">Information Technology</option>
                  <option value="Health">Health Sciences</option>
                  <option value="Arts">Humanities & Arts</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Funding Body / Amount</label>
                <input name="funding" value={data.funding} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-[#1a2b4c]outline-none" placeholder="e.g. $50,000 - Grant Foundation" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Current Status</label>
                <select name="status" value={data.status} onChange={handleChange} className="w-full border p-2 rounded focus:ring-2 focus:ring-[#1a2b4c] outline-none">
                  <option value="Planning">Planning Phase</option>
                  <option value="Active">Active Research</option>
                  <option value="Peer Review">Under Peer Review</option>
                  <option value="Completed">Completed / Published</option>
                </select>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <FileText size={18} className="text-rose-500"/> Abstract & Roadmap
              </h2>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Research Abstract</label>
                <textarea name="abstract" value={data.abstract} onChange={handleChange} rows={5} className="w-full border p-2 rounded focus:ring-2 focus:ring-[#1a2b4c]outline-none" placeholder="Problem statement, methodology and hypothesis..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase block">Project Milestones</label>
                {data.milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-2">
                    <input value={milestone} onChange={(e) => handleMilestoneChange(index, e.target.value)} className="flex-1 border p-2 rounded focus:ring-2 focus:ring-[#1a2b4c] outline-none" placeholder={`Phase ${index + 1} goal...`} />
                    {data.milestones.length > 1 && (
                      <button type="button" onClick={() => removeMilestone(index)} className="p-2 text-[#1a2b4c] hover:bg-red-50 rounded">
                        <Trash2 size={16}/>
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addMilestone} className="mt-2 flex items-center gap-2 text-sm font-bold text-[#1a2b4c] hover:text-rose-700">
                  <Activity size={16} /> Add Milestone
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" disabled={loading} className={`px-12 py-4 rounded-xl font-bold flex items-center gap-3 shadow-xl  ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#1a2b4c] hover:bg-[#2a4272] text-white shadow-lg'}`}>
                <Save size={20} /> 
                {loading ? 'Submitting...' : 'Register Project'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResearchAdmin
