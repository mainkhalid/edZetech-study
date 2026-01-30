import React, { useState } from 'react';
import { 
  MdHistoryEdu, MdFlag, MdEmojiEvents, MdLocationCity, 
  MdSave, MdDelete, MdEdit, MdAdd, MdClose, MdSearch,
  MdCalendarToday, MdTrendingUp
} from 'react-icons/md';

const HistoryAdmin = () => {
  const [milestones, setMilestones] = useState([
    { 
      id: 1, 
      year: '1999', 
      title: 'Foundation', 
      desc: 'Established as a technical training center focusing on ICT.', 
      icon: 'MdLocationCity',
      category: 'establishment',
      significance: 'high'
    },
    { 
      id: 2, 
      year: '2010', 
      title: 'Expansion', 
      desc: 'Relocated to the ultra-modern main campus and diversified faculties.', 
      icon: 'MdFlag',
      category: 'infrastructure',
      significance: 'high'
    },
    { 
      id: 3, 
      year: '2016', 
      title: 'Charter Award', 
      desc: 'Received the official University Charter from the Government.', 
      icon: 'MdHistoryEdu',
      category: 'accreditation',
      significance: 'high'
    },
    { 
      id: 4, 
      year: '2018', 
      title: 'Research Excellence', 
      desc: 'Launched the first Ph.D. programs and established research centers.', 
      icon: 'MdEmojiEvents',
      category: 'academic',
      significance: 'medium'
    },
    { 
      id: 5, 
      year: '2022', 
      title: 'International Recognition', 
      desc: 'Achieved top-tier ranking in East African universities.', 
      icon: 'MdEmojiEvents',
      category: 'achievement',
      significance: 'high'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [formData, setFormData] = useState({
    year: '',
    title: '',
    desc: '',
    icon: 'MdFlag',
    category: 'establishment',
    significance: 'medium'
  });

  // Map string names to actual components
  const iconMap = {
    MdLocationCity: MdLocationCity,
    MdFlag: MdFlag,
    MdHistoryEdu: MdHistoryEdu,
    MdEmojiEvents: MdEmojiEvents
  };

  const iconOptions = [
    { value: 'MdLocationCity', label: 'Campus/Location', component: MdLocationCity },
    { value: 'MdFlag', label: 'Foundation/Goal', component: MdFlag },
    { value: 'MdHistoryEdu', label: 'Charter/Academic', component: MdHistoryEdu },
    { value: 'MdEmojiEvents', label: 'Award/Achievement', component: MdEmojiEvents }
  ];

  const categories = [
    { value: 'establishment', label: 'Establishment' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'accreditation', label: 'Accreditation' },
    { value: 'academic', label: 'Academic' },
    { value: 'achievement', label: 'Achievement' },
    { value: 'partnership', label: 'Partnership' }
  ];

  const handleOpenModal = (milestone = null) => {
    if (milestone) {
      setEditingMilestone(milestone);
      setFormData({
        year: milestone.year,
        title: milestone.title,
        desc: milestone.desc,
        icon: milestone.icon,
        category: milestone.category,
        significance: milestone.significance
      });
    } else {
      setEditingMilestone(null);
      setFormData({
        year: '',
        title: '',
        desc: '',
        icon: 'MdFlag',
        category: 'establishment',
        significance: 'medium'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMilestone(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingMilestone) {
      setMilestones(prev => prev.map(m => 
        m.id === editingMilestone.id 
          ? { ...m, ...formData }
          : m
      ));
    } else {
      const newMilestone = {
        id: Math.max(...milestones.map(m => m.id)) + 1,
        ...formData
      };
      setMilestones(prev => [...prev, newMilestone]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      setMilestones(prev => prev.filter(m => m.id !== id));
    }
  };

  const filteredMilestones = milestones.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.year.includes(searchTerm);
    const matchesCategory = filterCategory === 'all' || m.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => b.year.localeCompare(a.year)); // Sort by year descending

  const stats = {
    total: milestones.length,
    highSignificance: milestones.filter(m => m.significance === 'high').length,
    recentYears: milestones.filter(m => parseInt(m.year) >= 2020).length,
    oldestYear: Math.min(...milestones.map(m => parseInt(m.year) || 9999))
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">University History Manager</h1>
            <p className="text-slate-500 text-sm mt-1">Manage institutional milestones and legacy</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#1a2b4c] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 text-sm hover:bg-[#243a5e] transition-colors"
          >
            <MdAdd size={20}/> Add Milestone
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase">Total Milestones</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <MdHistoryEdu className="text-blue-600" size={24}/>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase">High Significance</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{stats.highSignificance}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <MdEmojiEvents className="text-orange-600" size={24}/>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase">Since 2020</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.recentYears}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <MdTrendingUp className="text-green-600" size={24}/>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase">Founded In</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stats.oldestYear}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <MdCalendarToday className="text-purple-600" size={24}/>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-4 mb-6 border border-slate-200">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
              <input
                type="text"
                placeholder="Search milestones by title, year, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Milestones Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Year</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Milestone</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Category</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Significance</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Icon</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMilestones.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No milestones found
                  </td>
                </tr>
              ) : (
                filteredMilestones.map((milestone) => {
                  const IconComponent = iconMap[milestone.icon];
                  return (
                    <tr key={milestone.id} className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <MdCalendarToday className="text-slate-400" size={16}/>
                          <span className="font-black text-blue-600 text-lg">{milestone.year}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{milestone.title}</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">{milestone.desc}</p>
                      </td>
                      <td className="p-4">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold capitalize">
                          {milestone.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold capitalize ${
                          milestone.significance === 'high' 
                            ? 'bg-orange-100 text-orange-700' 
                            : milestone.significance === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {milestone.significance}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="bg-[#1a2b4c] text-white p-2 rounded-lg inline-flex">
                          <IconComponent size={20}/>
                        </div>
                      </td>
                      <td className="p-4 flex gap-2">
                        <button 
                          onClick={() => handleOpenModal(milestone)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <MdEdit size={20}/>
                        </button>
                        <button 
                          onClick={() => handleDelete(milestone.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <MdDelete size={20}/>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <MdClose size={24}/>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Year *
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., 1999 or 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Milestone Title"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="desc"
                    value={formData.desc}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Describe the significance of this milestone..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Icon Type *
                  </label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {iconOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Significance *
                  </label>
                  <select
                    name="significance"
                    value={formData.significance}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Icon Preview */}
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Icon Preview
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    {iconOptions.map(opt => (
                      <div 
                        key={opt.value}
                        className={`p-3 rounded-lg transition-all ${
                          formData.icon === opt.value 
                            ? 'bg-[#1a2b4c] text-white' 
                            : 'bg-white text-slate-400 border border-slate-200'
                        }`}
                      >
                        <opt.component size={24}/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#1a2b4c] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#243a5e] transition-colors flex items-center justify-center gap-2"
                >
                  <MdSave size={18}/>
                  {editingMilestone ? 'Update Milestone' : 'Add Milestone'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryAdmin;