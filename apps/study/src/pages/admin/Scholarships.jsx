import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  Eye,
  Loader2,
  Calendar,
  DollarSign,
  GraduationCap,
  FileText,
  Info,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../api/axios";

const scholarshipInitialState = {
  name: "",
  provider: "",
  amount: "",
  deadline: "",
  eligibility: "Open to All",
  description: "",
  requirements: [""],
  tags: [""],
  applicationUrl: "",
  contactEmail: "",
  thumbnail: null,
};

const ScholarshipAdmin = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(scholarshipInitialState);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const response = await api.get("/scholarships?sort=-createdAt");
      if (response.data.success) {
        setScholarships(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch scholarships");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const removeThumbnail = () => {
    setFormData((prev) => ({ ...prev, thumbnail: null }));
    setThumbnailPreview(null);
  };

  const handleRequirementChange = (index, value) => {
    const newReqs = [...formData.requirements];
    newReqs[index] = value;
    setFormData((prev) => ({ ...prev, requirements: newReqs }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index) => {
    const newReqs = formData.requirements.filter((_, i) => i !== index);
    setFormData((prev) => ({ 
      ...prev, 
      requirements: newReqs.length > 0 ? newReqs : [""] 
    }));
  };

  const handleTagChange = (index, value) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData((prev) => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, ""] }));
  };

  const removeTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData((prev) => ({ 
      ...prev, 
      tags: newTags.length > 0 ? newTags : [""] 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      const filteredRequirements = formData.requirements
        .map(req => req.trim())
        .filter(req => req.length > 0);
      
      const filteredTags = formData.tags
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      if (filteredRequirements.length === 0) {
        toast.error("Please add at least one requirement");
        setLoading(false);
        return;
      }

      // Add all text fields
      Object.keys(formData).forEach((key) => {
        if (key === "thumbnail") return;
        if (key === "requirements") {
          submitData.append(key, JSON.stringify(filteredRequirements));
        } else if (key === "tags") {
          submitData.append(key, JSON.stringify(filteredTags));
        } else {
          submitData.append(key, formData[key]);
        }
      });
      if (formData.thumbnail) {
        submitData.append("thumbnail", formData.thumbnail);
      }
      console.log("Submitting requirements:", filteredRequirements);
      console.log("Submitting tags:", filteredTags);

      let response;
      if (isEditing) {
        response = await api.put(`/scholarships/${editingId}`, submitData);
        toast.success("Scholarship updated successfully!");
      } else {
        response = await api.post("/scholarships", submitData);
        toast.success("Scholarship created successfully!");
      }

      if (response.data.success) {
        // Debug: Log what was saved
        console.log("Saved scholarship:", response.data.data);
        resetForm();
        fetchScholarships();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const editScholarship = (scholarship) => {
    // Ensure requirements and tags are arrays
    const requirementsArray = Array.isArray(scholarship.requirements) 
      ? scholarship.requirements 
      : [];
    const tagsArray = Array.isArray(scholarship.tags) 
      ? scholarship.tags 
      : [];

    setFormData({
      name: scholarship.name,
      provider: scholarship.provider,
      amount: scholarship.amount,
      deadline: scholarship.deadline
        ? new Date(scholarship.deadline).toISOString().split("T")[0]
        : "",
      eligibility: scholarship.eligibility,
      description: scholarship.description,
      requirements: requirementsArray.length > 0 ? requirementsArray : [""],
      tags: tagsArray.length > 0 ? tagsArray : [""],
      applicationUrl: scholarship.applicationUrl || "",
      contactEmail: scholarship.contactEmail || "",
      thumbnail: null,
    });
    
    setThumbnailPreview(scholarship.thumbnail?.url || null);
    setIsEditing(true);
    setEditingId(scholarship._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteScholarship = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scholarship?"))
      return;

    try {
      const response = await api.delete(`/scholarships/${id}`);
      if (response.data.success) {
        toast.success("Scholarship deleted successfully");
        fetchScholarships();
      }
    } catch (error) {
      toast.error("Failed to delete scholarship");
      console.error(error);
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      const response = await api.patch(`/scholarships/${id}/publish`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchScholarships();
      }
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData(scholarshipInitialState);
    setIsEditing(false);
    setEditingId(null);
    setIsPreview(false);
    setThumbnailPreview(null);
  };

  const renderPreview = () => (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-100">
      <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            Financial Aid
          </span>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            {formData.name || "SCHOLARSHIP NAME"}
          </h2>
          <p className="text-indigo-600 font-semibold">
            {formData.provider || "PROVIDER NAME"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs font-bold uppercase">Deadline</p>
          <p className="text-red-500 font-bold">{formData.deadline || "TBA"}</p>
        </div>
      </div>

      {thumbnailPreview && (
        <img
          src={thumbnailPreview}
          alt="Scholarship preview"
          className="w-full h-48 object-cover rounded-lg mb-6"
        />
      )}

      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="text-green-500" size={20} />
            <span className="font-bold text-slate-700">
              {formData.amount || "Amount TBA"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="text-blue-500" size={20} />
            <span className="text-slate-600">{formData.eligibility}</span>
          </div>
        </div>
      </div>

      {formData.description && (
        <div className="mb-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <Info size={18} className="text-indigo-500" /> Description
          </h3>
          <p className="text-slate-600 leading-relaxed">{formData.description}</p>
        </div>
      )}

      {formData.requirements.filter(req => req.trim()).length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-slate-800 mb-3">Requirements</h3>
          <ul className="space-y-2">
            {formData.requirements
              .filter(req => req.trim())
              .map((req, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-1">•</span>
                  <span className="text-slate-600">{req}</span>
                </li>
              ))}
          </ul>
        </div>
      )}

      {formData.tags.filter(tag => tag.trim()).length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold text-slate-800 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {formData.tags
              .filter(tag => tag.trim())
              .map((tag, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      )}

      {(formData.applicationUrl || formData.contactEmail) && (
        <div className="border-t border-slate-100 pt-6 mt-6">
          {formData.applicationUrl && (
            <a
              href={formData.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 mb-2"
            >
              Apply Now
            </a>
          )}
          {formData.contactEmail && (
            <p className="text-sm text-slate-600">
              Contact: {formData.contactEmail}
            </p>
          )}
        </div>
      )}
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-bold text-slate-800 mb-2">
            Scholarship Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-2">
            Provider *
          </label>
          <input
            type="text"
            name="provider"
            value={formData.provider}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-2">
            Amount *
          </label>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g., $5,000"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-2">
            Deadline *
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-2">
            Eligibility *
          </label>
          <select
            name="eligibility"
            value={formData.eligibility}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          >
            <option>Open to All</option>
            <option>Undergraduate</option>
            <option>Graduate</option>
            <option>PhD</option>
            <option>High School</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-2">
            Application URL
          </label>
          <input
            type="url"
            name="applicationUrl"
            value={formData.applicationUrl}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="https://..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-bold text-slate-800 mb-2">
            Contact Email
          </label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="contact@example.com"
          />
        </div>
      </div>

      {/* Thumbnail */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Upload size={18} className="text-indigo-500" /> Thumbnail Image
        </h2>
        <div>
          {thumbnailPreview ? (
            <div className="relative inline-block">
              <img
                src={thumbnailPreview}
                alt="Preview"
                className="w-full max-w-md h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeThumbnail}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
              <Upload className="text-slate-400 mb-2" />
              <span className="text-sm text-slate-500">
                Click to upload thumbnail
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Info size={18} className="text-indigo-500" /> Description
        </h2>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="Describe the scholarship, its purpose, and what makes it unique..."
          required
        />
      </div>

      {/* Requirements */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="font-bold text-slate-800 mb-4">
          Application Requirements *
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Add each requirement as a separate item. These will appear as bullet points.
        </p>
        <div className="space-y-2">
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={req}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                className="flex-1 border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder={`Requirement ${index + 1} (e.g., "GPA above 3.5")`}
              />
              {formData.requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addRequirement}
            className="mt-2 flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
          >
            <Plus size={16} /> Add Requirement
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="font-bold text-slate-800 mb-4">Tags</h2>
        <p className="text-sm text-slate-500 mb-4">
          Add tags to help categorize this scholarship (e.g., "STEM", "Women", "International")
        </p>
        <div className="space-y-2">
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                className="flex-1 border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder={`Tag ${index + 1}`}
              />
              {formData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTag}
            className="mt-2 flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
          >
            <Plus size={16} /> Add Tag
          </button>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 justify-end">
        {isEditing && (
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-3 border border-slate-300 rounded-lg font-bold hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`px-10 py-3 rounded-lg font-bold flex items-center gap-2 ${
            loading ? "bg-slate-400" : "bg-indigo-600 hover:bg-indigo-700"
          } text-white`}
        >
          <Save size={18} />
          {loading
            ? "Saving..."
            : isEditing
              ? "Update Scholarship"
              : "Create Scholarship"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Scholarship Management
            </h1>
            <p className="text-slate-500">
              Create and manage scholarship opportunities
            </p>
          </div>
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
              isPreview
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-700 border"
            }`}
          >
            <Eye size={18} /> {isPreview ? "Edit" : "Preview"}
          </button>
        </div>

        {/* Form or Preview */}
        {isPreview ? renderPreview() : renderForm()}

        {/* Scholarships List */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            All Scholarships
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-indigo-500" size={40} />
            </div>
          ) : scholarships.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No scholarships found. Create your first scholarship above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.map((scholarship) => (
                <div
                  key={scholarship._id}
                  className="bg-white rounded-xl p-6 shadow-sm border"
                >
                  {scholarship.thumbnail?.url && (
                    <img
                      src={scholarship.thumbnail.url}
                      alt={scholarship.name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">
                    {scholarship.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-1">
                    {scholarship.provider}
                  </p>
                  <p className="text-sm text-indigo-600 font-semibold mb-2">
                    {scholarship.amount}
                  </p>
                  <p className="text-xs text-slate-500 mb-4">
                    Deadline:{" "}
                    {new Date(scholarship.deadline).toLocaleDateString()}
                  </p>

                  {/* Display requirements count */}
                  {scholarship.requirements && scholarship.requirements.length > 0 && (
                    <p className="text-xs text-slate-600 mb-2">
                      {scholarship.requirements.length} requirement(s)
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => editScholarship(scholarship)}
                      className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded font-semibold text-sm hover:bg-blue-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        togglePublish(scholarship._id, scholarship.published)
                      }
                      className={`flex-1 px-3 py-2 rounded font-semibold text-sm ${
                        scholarship.published
                          ? "bg-green-50 text-green-600 hover:bg-green-100"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {scholarship.published ? "Published" : "Draft"}
                    </button>
                    <button
                      onClick={() => deleteScholarship(scholarship._id)}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipAdmin;