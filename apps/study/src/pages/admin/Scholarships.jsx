import React, { useState } from 'react';
import { MdCardMembership, MdSave, MdAdd, MdDelete, MdEdit, MdClose, MdCheck, MdSearch, MdFilterList } from 'react-icons/md';

const Scholarships = () => {
  const [scholarships, setScholarships] = useState([
    {
      id: 1,
      name: 'Academic Excellence Award',
      description: 'For students with A- and above',
      discountType: 'percentage',
      discountValue: 50,
      eligibilityCriteria: 'GPA 3.7 and above',
      status: 'active',
      category: 'academic',
      maxRecipients: 50,
      currentRecipients: 32,
      sponsor: 'University Fund',
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    {
      id: 2,
      name: 'Sports Merit Scholarship',
      description: 'For exceptional athletes',
      discountType: 'percentage',
      discountValue: 30,
      eligibilityCriteria: 'National level sports participation',
      status: 'active',
      category: 'sports',
      maxRecipients: 25,
      currentRecipients: 18,
      sponsor: 'Alumni Association',
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    {
      id: 3,
      name: 'Financial Aid Program',
      description: 'Need-based financial assistance',
      discountType: 'fixed',
      discountValue: 5000,
      eligibilityCriteria: 'Family income below $30,000',
      status: 'active',
      category: 'financial',
      maxRecipients: 100,
      currentRecipients: 87,
      sponsor: 'Government Grant',
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    {
      id: 4,
      name: 'Tech Innovation Scholarship',
      description: 'For outstanding CS and Engineering students',
      discountType: 'percentage',
      discountValue: 40,
      eligibilityCriteria: 'Outstanding project portfolio',
      status: 'inactive',
      category: 'academic',
      maxRecipients: 15,
      currentRecipients: 0,
      sponsor: 'Tech Corp Partnership',
      startDate: '2024-09-01',
      endDate: '2025-08-31'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    eligibilityCriteria: '',
    status: 'active',
    category: 'academic',
    maxRecipients: '',
    sponsor: '',
    startDate: '',
    endDate: ''
  });

  const categories = [
    { value: 'academic', label: 'Academic' },
    { value: 'sports', label: 'Sports' },
    { value: 'financial', label: 'Financial Aid' },
    { value: 'arts', label: 'Arts & Culture' },
    { value: 'community', label: 'Community Service' },
    { value: 'corporate', label: 'Corporate Sponsored' }
  ];

  const handleOpenModal = (scholarship = null) => {
    if (scholarship) {
      setEditingScholarship(scholarship);
      setFormData({
        name: scholarship.name,
        description: scholarship.description,
        discountType: scholarship.discountType,
        discountValue: scholarship.discountValue,
        eligibilityCriteria: scholarship.eligibilityCriteria,
        status: scholarship.status,
        category: scholarship.category,
        maxRecipients: scholarship.maxRecipients,
        sponsor: scholarship.sponsor,
        startDate: scholarship.startDate,
        endDate: scholarship.endDate
      });
    } else {
      setEditingScholarship(null);
      setFormData({
        name: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        eligibilityCriteria: '',
        status: 'active',
        category: 'academic',
        maxRecipients: '',
        sponsor: '',
        startDate: '',
        endDate: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingScholarship(null);
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
    
    if (editingScholarship) {
      setScholarships(prev => prev.map(s => 
        s.id === editingScholarship.id 
          ? { ...s, ...formData }
          : s
      ));
    } else {
      const newScholarship = {
        id: Math.max(...scholarships.map(s => s.id)) + 1,
        ...formData,
        currentRecipients: 0,
        discountValue: Number(formData.discountValue),
        maxRecipients: Number(formData.maxRecipients)
      };
      setScholarships(prev => [...prev, newScholarship]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this scholarship?')) {
      setScholarships(prev => prev.filter(s => s.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setScholarships(prev => prev.map(s => 
      s.id === id 
        ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
        : s
    ));
  };

  const filteredScholarships = scholarships.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || s.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: scholarships.length,
    active: scholarships.filter(s => s.status === 'active').length,
    totalRecipients: scholarships.reduce((sum, s) => sum + s.currentRecipients, 0),
    totalCapacity: scholarships.reduce((sum, s) => sum + s.maxRecipients, 0)
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Scholarship Schemes</h1>
            <p className="text-slate-500 text-sm mt-1">Manage financial aid and corporate sponsorships</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#1a2b4c] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 text-sm hover:bg-[#243a5e] transition-colors"
          >
            <MdAdd size={20}/> New Scheme
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase">Total Schemes</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <MdCardMembership className="text-blue-600" size={24}/>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase">Active Schemes</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <MdCheck className="text-green-600" size={24}/>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase">Current Recipients</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stats.totalRecipients}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <MdCardMembership className="text-purple-600" size={24}/>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase">Capacity Usage</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {Math.round((stats.totalRecipients / stats.totalCapacity) * 100)}%
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <MdFilterList className="text-orange-600" size={24}/>
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
                placeholder="Search scholarships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

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

        {/* Scholarships Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Scholarship Name</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Category</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Discount</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Recipients</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Sponsor</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredScholarships.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">
                    No scholarships found
                  </td>
                </tr>
              ) : (
                filteredScholarships.map((scholarship) => (
                  <tr key={scholarship.id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{scholarship.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{scholarship.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{scholarship.eligibilityCriteria}</p>
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold capitalize">
                        {scholarship.category}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-semibold text-blue-600">
                      {scholarship.discountType === 'percentage' 
                        ? `${scholarship.discountValue}%` 
                        : `$${scholarship.discountValue.toLocaleString()}`
                      }
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-800">
                          {scholarship.currentRecipients} / {scholarship.maxRecipients}
                        </span>
                        <div className="w-24 bg-slate-200 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${(scholarship.currentRecipients / scholarship.maxRecipients) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{scholarship.sponsor}</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleStatus(scholarship.id)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          scholarship.status === 'active'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {scholarship.status}
                      </button>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button 
                        onClick={() => handleOpenModal(scholarship)}
                        className="text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <MdEdit size={20}/>
                      </button>
                      <button 
                        onClick={() => handleDelete(scholarship.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <MdDelete size={20}/>
                      </button>
                    </td>
                  </tr>
                ))
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
                {editingScholarship ? 'Edit Scholarship' : 'Create New Scholarship'}
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
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Scholarship Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., Academic Excellence Award"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Brief description of the scholarship"
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

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Discount Type *
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max={formData.discountType === 'percentage' ? '100' : undefined}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder={formData.discountType === 'percentage' ? '0-100' : 'Amount'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Max Recipients *
                  </label>
                  <input
                    type="number"
                    name="maxRecipients"
                    value={formData.maxRecipients}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., 50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Sponsor *
                  </label>
                  <input
                    type="text"
                    name="sponsor"
                    value={formData.sponsor}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., University Fund"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Eligibility Criteria *
                  </label>
                  <textarea
                    name="eligibilityCriteria"
                    value={formData.eligibilityCriteria}
                    onChange={handleInputChange}
                    required
                    rows="2"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., GPA 3.7 and above"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#1a2b4c] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#243a5e] transition-colors"
                >
                  {editingScholarship ? 'Update Scholarship' : 'Create Scholarship'}
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

export default Scholarships;