import React, { useState } from 'react';
import { 
  MdUpload, MdDownload, MdDelete, MdEdit, MdAdd, MdClose,
  MdSearch, MdSchool, MdAttachMoney, MdSchedule, MdFolder,
  MdVisibility, MdCloudUpload, MdDescription
} from 'react-icons/md';

const AdmissionsAdmin = () => {
  const [programmes, setProgrammes] = useState([
    {
      id: 1,
      level: 'certificate',
      name: 'Certificate in Information Technology',
      feeStructure: {
        uploaded: true,
        fileName: 'IT_Certificate_Fees_2024.xlsx',
        uploadDate: '2024-01-15',
        fileUrl: '#'
      },
      timetable: {
        uploaded: true,
        fileName: 'IT_Certificate_Timetable_Sem1.xlsx',
        uploadDate: '2024-01-20',
        fileUrl: '#'
      },
      status: 'active'
    },
    {
      id: 2,
      level: 'certificate',
      name: 'Certificate in Business Management',
      feeStructure: {
        uploaded: true,
        fileName: 'Business_Certificate_Fees_2024.xlsx',
        uploadDate: '2024-01-15',
        fileUrl: '#'
      },
      timetable: {
        uploaded: false,
        fileName: null,
        uploadDate: null,
        fileUrl: null
      },
      status: 'active'
    },
    {
      id: 3,
      level: 'diploma',
      name: 'Diploma in Software Engineering',
      feeStructure: {
        uploaded: true,
        fileName: 'Software_Diploma_Fees_2024.xlsx',
        uploadDate: '2024-01-10',
        fileUrl: '#'
      },
      timetable: {
        uploaded: true,
        fileName: 'Software_Diploma_Timetable_2024.xlsx',
        uploadDate: '2024-01-18',
        fileUrl: '#'
      },
      status: 'active'
    },
    {
      id: 4,
      level: 'diploma',
      name: 'Diploma in Accounting',
      feeStructure: {
        uploaded: true,
        fileName: 'Accounting_Diploma_Fees_2024.xlsx',
        uploadDate: '2024-01-12',
        fileUrl: '#'
      },
      timetable: {
        uploaded: false,
        fileName: null,
        uploadDate: null,
        fileUrl: null
      },
      status: 'active'
    },
    {
      id: 5,
      level: 'degree',
      name: 'Bachelor of Science in Computer Science',
      feeStructure: {
        uploaded: true,
        fileName: 'CS_Degree_Fees_2024.xlsx',
        uploadDate: '2024-01-05',
        fileUrl: '#'
      },
      timetable: {
        uploaded: true,
        fileName: 'CS_Degree_Timetable_2024.xlsx',
        uploadDate: '2024-01-16',
        fileUrl: '#'
      },
      status: 'active'
    },
    {
      id: 6,
      level: 'degree',
      name: 'Bachelor of Business Administration',
      feeStructure: {
        uploaded: false,
        fileName: null,
        uploadDate: null,
        fileUrl: null
      },
      timetable: {
        uploaded: false,
        fileName: null,
        uploadDate: null,
        fileUrl: null
      },
      status: 'active'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingProgramme, setEditingProgramme] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [uploadType, setUploadType] = useState(null); // 'feeStructure' or 'timetable'
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  
  const [formData, setFormData] = useState({
    level: 'certificate',
    name: '',
    status: 'active'
  });

  const levels = [
    { value: 'certificate', label: 'Certificate', color: 'blue' },
    { value: 'diploma', label: 'Diploma', color: 'green' },
    { value: 'degree', label: 'Degree', color: 'purple' }
  ];

  const handleOpenModal = (programme = null) => {
    if (programme) {
      setEditingProgramme(programme);
      setFormData({
        level: programme.level,
        name: programme.name,
        status: programme.status
      });
    } else {
      setEditingProgramme(null);
      setFormData({
        level: 'certificate',
        name: '',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProgramme(null);
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
    
    if (editingProgramme) {
      setProgrammes(prev => prev.map(p => 
        p.id === editingProgramme.id 
          ? { ...p, ...formData }
          : p
      ));
    } else {
      const newProgramme = {
        id: Math.max(...programmes.map(p => p.id)) + 1,
        ...formData,
        feeStructure: {
          uploaded: false,
          fileName: null,
          uploadDate: null,
          fileUrl: null
        },
        timetable: {
          uploaded: false,
          fileName: null,
          uploadDate: null,
          fileUrl: null
        }
      };
      setProgrammes(prev => [...prev, newProgramme]);
    }
    
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this programme?')) {
      setProgrammes(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleFileUpload = (programmeId, type, event) => {
    const file = event.target.files[0];
    if (file) {
      // Simulate file upload
      setProgrammes(prev => prev.map(p => {
        if (p.id === programmeId) {
          return {
            ...p,
            [type]: {
              uploaded: true,
              fileName: file.name,
              uploadDate: new Date().toISOString().split('T')[0],
              fileUrl: '#' // In real app, this would be the actual URL
            }
          };
        }
        return p;
      }));
      alert(`${file.name} uploaded successfully!`);
    }
  };

  const handleDownload = (fileName) => {
    // In a real application, this would trigger actual file download
    alert(`Downloading: ${fileName}`);
    // window.open(fileUrl, '_blank');
  };

  const handleDeleteFile = (programmeId, type) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setProgrammes(prev => prev.map(p => {
        if (p.id === programmeId) {
          return {
            ...p,
            [type]: {
              uploaded: false,
              fileName: null,
              uploadDate: null,
              fileUrl: null
            }
          };
        }
        return p;
      }));
    }
  };

  const filteredProgrammes = programmes.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || p.level === filterLevel;
    
    return matchesSearch && matchesLevel;
  });

  // Group programmes by level
  const groupedProgrammes = {
    certificate: filteredProgrammes.filter(p => p.level === 'certificate'),
    diploma: filteredProgrammes.filter(p => p.level === 'diploma'),
    degree: filteredProgrammes.filter(p => p.level === 'degree')
  };

  const stats = {
    total: programmes.length,
    withFees: programmes.filter(p => p.feeStructure.uploaded).length,
    withTimetables: programmes.filter(p => p.timetable.uploaded).length,
    complete: programmes.filter(p => p.feeStructure.uploaded && p.timetable.uploaded).length
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Admissions Management</h1>
            <p className="text-slate-500 text-sm mt-1">Manage fee structures and timetables for all programmes</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#1a2b4c] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 text-sm hover:bg-[#243a5e] transition-colors"
          >
            <MdAdd size={20}/> Add Programme
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase">Total Programmes</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <MdSchool className="text-blue-600" size={24}/>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase">With Fee Structures</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.withFees}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <MdAttachMoney className="text-green-600" size={24}/>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase">With Timetables</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{stats.withTimetables}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <MdSchedule className="text-orange-600" size={24}/>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase">Complete</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.complete}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <MdFolder className="text-purple-600" size={24}/>
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
                placeholder="Search programmes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">All Levels</option>
              {levels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grouped Programmes */}
        {levels.map(level => {
          const levelProgrammes = groupedProgrammes[level.value];
          if (levelProgrammes.length === 0 && filterLevel !== 'all' && filterLevel !== level.value) return null;

          return (
            <div key={level.value} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-slate-800 capitalize">{level.label} Programmes</h2>
                <span className={`bg-${level.color}-100 text-${level.color}-700 px-3 py-1 rounded-full text-xs font-bold`}>
                  {levelProgrammes.length} {levelProgrammes.length === 1 ? 'Programme' : 'Programmes'}
                </span>
              </div>

              {levelProgrammes.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center text-slate-500 border border-slate-200">
                  No {level.label.toLowerCase()} programmes found
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase">Programme Name</th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase">Fee Structure</th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase">Timetable</th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                        <th className="p-4 text-xs font-bold text-slate-400 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {levelProgrammes.map((programme) => (
                        <tr key={programme.id} className="hover:bg-slate-50/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`bg-${level.color}-100 p-2 rounded-lg`}>
                                <MdSchool className={`text-${level.color}-600`} size={20}/>
                              </div>
                              <div>
                                <p className="font-bold text-slate-800">{programme.name}</p>
                                <p className="text-xs text-slate-500 capitalize">{programme.level}</p>
                              </div>
                            </div>
                          </td>

                          {/* Fee Structure Column */}
                          <td className="p-4">
                            {programme.feeStructure.uploaded ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <MdDescription className="text-green-600" size={16}/>
                                  <span className="text-xs font-medium text-slate-700 truncate max-w-[200px]">
                                    {programme.feeStructure.fileName}
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleDownload(programme.feeStructure.fileName)}
                                    className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 flex items-center gap-1"
                                  >
                                    <MdDownload size={14}/> Download
                                  </button>
                                  <button
                                    onClick={() => handleDeleteFile(programme.id, 'feeStructure')}
                                    className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded hover:bg-red-100"
                                  >
                                    <MdDelete size={14}/>
                                  </button>
                                </div>
                                <p className="text-[10px] text-slate-400">
                                  Uploaded: {programme.feeStructure.uploadDate}
                                </p>
                              </div>
                            ) : (
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  accept=".xlsx,.xls,.csv"
                                  onChange={(e) => handleFileUpload(programme.id, 'feeStructure', e)}
                                  className="hidden"
                                />
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                                  <MdCloudUpload size={16}/>
                                  <span className="text-xs font-semibold">Upload Fee Structure</span>
                                </div>
                              </label>
                            )}
                          </td>

                          {/* Timetable Column */}
                          <td className="p-4">
                            {programme.timetable.uploaded ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <MdDescription className="text-green-600" size={16}/>
                                  <span className="text-xs font-medium text-slate-700 truncate max-w-[200px]">
                                    {programme.timetable.fileName}
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleDownload(programme.timetable.fileName)}
                                    className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100 flex items-center gap-1"
                                  >
                                    <MdDownload size={14}/> Download
                                  </button>
                                  <button
                                    onClick={() => handleDeleteFile(programme.id, 'timetable')}
                                    className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded hover:bg-red-100"
                                  >
                                    <MdDelete size={14}/>
                                  </button>
                                </div>
                                <p className="text-[10px] text-slate-400">
                                  Uploaded: {programme.timetable.uploadDate}
                                </p>
                              </div>
                            ) : (
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  accept=".xlsx,.xls,.csv"
                                  onChange={(e) => handleFileUpload(programme.id, 'timetable', e)}
                                  className="hidden"
                                />
                                <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-2 rounded-lg hover:bg-orange-100 transition-colors">
                                  <MdCloudUpload size={16}/>
                                  <span className="text-xs font-semibold">Upload Timetable</span>
                                </div>
                              </label>
                            )}
                          </td>

                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                              programme.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {programme.status}
                            </span>
                          </td>

                          <td className="p-4 flex gap-2">
                            <button 
                              onClick={() => handleOpenModal(programme)}
                              className="text-slate-400 hover:text-blue-600 transition-colors"
                              title="Edit Programme"
                            >
                              <MdEdit size={20}/>
                            </button>
                            <button 
                              onClick={() => handleDelete(programme.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                              title="Delete Programme"
                            >
                              <MdDelete size={20}/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add/Edit Programme Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
            <div className="border-b border-slate-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingProgramme ? 'Edit Programme' : 'Add New Programme'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <MdClose size={24}/>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Programme Level *
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {levels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Programme Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="e.g., Certificate in Information Technology"
                  />
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

                {!editingProgramme && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> After creating the programme, you can upload fee structures and timetables from the main table.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#1a2b4c] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#243a5e] transition-colors"
                >
                  {editingProgramme ? 'Update Programme' : 'Add Programme'}
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

export default AdmissionsAdmin;