import React, { useState, useEffect } from 'react';
import {
  Trash2, Edit2, Save, Search,
  HelpCircle, MessageSquare, Eye
} from 'lucide-react';
import api from '../../api/axios';

const FAQAdmin = () => {
  const categories = ['Admissions', 'Programs', 'Fees', 'Campus Life', 'Technical'];

  const [isPreview, setIsPreview] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    category: 'Admissions',
    question: '',
    answer: '',
    status: 'draft'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  /* ---------------- FETCH FAQS ---------------- */
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/faqs/admin/all');
      setFaqs(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  /* ---------------- FORM HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      category: 'Admissions',
      question: '',
      answer: '',
      status: 'draft'
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/faqs/${editingId}`, formData);
      } else {
        await api.post('/faqs', formData);
      }

      resetForm();
      fetchFaqs();
    } catch (err) {
      console.error(err);
      alert('Error saving FAQ');
    }
  };

  const handleEdit = (faq) => {
    setEditingId(faq._id);
    setFormData({
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
      status: faq.status
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this FAQ?')) return;

    try {
      await api.delete(`/faqs/${id}`);
      fetchFaqs();
    } catch (err) {
      console.error(err);
      alert('Failed to delete FAQ');
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || faq.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">FAQ Administrator</h1>
            <p className="text-slate-500 text-sm">Manage FAQs</p>
          </div>
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border"
          >
            <Eye size={16} /> {isPreview ? 'Edit Mode' : 'Preview'}
          </button>
        </div>

        {isPreview ? (
          <div className="space-y-4">
            {filteredFaqs.map(faq => (
              <div key={faq._id} className="bg-white p-6 rounded-lg border">
                <div className="flex items-center gap-2 text-blue-800 font-bold mb-2">
                  <HelpCircle size={16} />
                  {faq.category}
                </div>
                <h3 className="font-bold">{faq.question}</h3>
                <p className="text-sm text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* FORM */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border mb-6">
              <h2 className="font-bold flex items-center gap-2 mb-4">
                <MessageSquare size={18} />
                {editingId ? 'Edit FAQ' : 'Create FAQ'}
              </h2>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full mb-3 border p-2 rounded"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <input
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="Question"
                className="w-full mb-3 border p-2 rounded"
              />

              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                placeholder="Answer"
                className="w-full mb-3 border p-2 rounded"
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full mb-3 border p-2 rounded"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>

              <div className="flex gap-2 justify-end">
                {editingId && (
                  <button type="button" onClick={resetForm} className="px-4 py-2 border rounded">
                    Cancel
                  </button>
                )}
                <button className="bg-[#1a2b4c] text-white px-6 py-2 rounded flex items-center gap-2">
                  <Save size={16} /> Save
                </button>
              </div>
            </form>

            {/* LIST */}
            <div className="bg-white rounded-lg border">
              <div className="p-4 flex gap-2">
                <Search size={16} />
                <input
                  placeholder="Search..."
                  onChange={e => setSearchTerm(e.target.value)}
                  className="flex-1 border-b outline-none"
                />
                <select onChange={e => setFilterCategory(e.target.value)}>
                  <option value="All">All</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {filteredFaqs.map(faq => (
                <div key={faq._id} className="p-4 flex justify-between border-t">
                  <p className="font-semibold truncate">{faq.question}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(faq)}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(faq._id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FAQAdmin;
