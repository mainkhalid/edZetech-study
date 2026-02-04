import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  FileText,
  Users,
  Calendar,
  DollarSign,
  Eye,
  GraduationCap,
  CheckCircle,
  Clock,
  MapPin,
  Facebook,
  Twitter,
  Globe,
  Info,
} from "lucide-react";
import { toast } from "sonner";

const scholarshipInitialState = {
  id: "",
  name: "",
  provider: "",
  amount: "",
  deadline: "",
  eligibility: "Open to All",
  description: "",
  requirements: [""],
};

const clubInitialState = {
  name: "",
  category: "Sports",
  president: "",
  schedule: "",
  location: "",
  description: "",
  activities: [""],
};

const CombinedPortal = () => {
  const [activeTab, setActiveTab] = useState("scholarships"); // 'scholarships' or 'clubs'
  const [isPreview, setIsPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scholarshipData, setScholarshipData] = useState(
    scholarshipInitialState,
  );
  const [clubData, setClubData] = useState(clubInitialState);

  // Scholarship handlers
  const handleScholarshipChange = (e) => {
    const { name, value } = e.target;
    setScholarshipData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequirementChange = (index, value) => {
    const newReqs = [...scholarshipData.requirements];
    newReqs[index] = value;
    setScholarshipData((prev) => ({ ...prev, requirements: newReqs }));
  };

  const addRequirement = () => {
    setScholarshipData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index) => {
    const newReqs = scholarshipData.requirements.filter((_, i) => i !== index);
    setScholarshipData((prev) => ({ ...prev, requirements: newReqs }));
  };

  const handleScholarshipSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const simulate = new Promise((resolve) => setTimeout(resolve, 1500));
    toast.promise(simulate, {
      loading: "Creating scholarship...",
      success: () => {
        setScholarshipData(scholarshipInitialState);
        setLoading(false);
        return "Scholarship posted successfully!";
      },
      error: "Error creating scholarship.",
      finally: () => setLoading(false),
    });
  };

  // Club handlers
  const handleClubChange = (e) => {
    const { name, value } = e.target;
    setClubData((prev) => ({ ...prev, [name]: value }));
  };

  const handleActivityChange = (index, value) => {
    const newAct = [...clubData.activities];
    newAct[index] = value;
    setClubData((prev) => ({ ...prev, activities: newAct }));
  };

  const addActivity = () =>
    setClubData((prev) => ({ ...prev, activities: [...prev.activities, ""] }));

  const removeActivity = (index) =>
    setClubData((prev) => ({
      ...prev,
      activities: clubData.activities.filter((_, i) => i !== index),
    }));

  const handleClubSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Club updated successfully!");
      setLoading(false);
      setClubData(clubInitialState);
    }, 1000);
  };

  const renderScholarshipPreview = () => (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-100 animate-in zoom-in-95 duration-300">
      <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            Financial Aid
          </span>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            {scholarshipData.name || "SCHOLARSHIP NAME"}
          </h2>
          <p className="text-indigo-600 font-semibold">
            {scholarshipData.provider || "PROVIDER NAME"}
          </p>
          {scholarshipData.thumbnail?.preview && (
            <img
              src={scholarshipData.thumbnail.preview}
              alt="Scholarship thumbnail"
              className="w-full h-48 object-cover rounded-xl mb-6"
            />
          )}
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs font-bold uppercase">Deadline</p>
          <p className="text-red-500 font-bold">
            {scholarshipData.deadline || "TBA"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-slate-400 text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
            <DollarSign size={10} /> Funding Amount
          </p>
          <p className="text-lg font-bold text-slate-800">
            {scholarshipData.amount || "N/A"}
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-slate-400 text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
            <GraduationCap size={10} /> Eligibility
          </p>
          <p className="text-lg font-bold text-slate-800">
            {scholarshipData.eligibility}
          </p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-slate-400 text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
            <CheckCircle size={10} /> Type
          </p>
          <p className="text-lg font-bold text-slate-800">Merit-Based</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">
            About this Scholarship
          </h3>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
            {scholarshipData.description || "No description provided."}
          </p>
        </div>
        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">
            Application Requirements
          </h3>
          <ul className="grid grid-cols-1 gap-3">
            {scholarshipData.requirements.map(
              (req, i) =>
                req && (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-slate-700 bg-indigo-50/50 p-3 rounded-lg border border-indigo-50"
                  >
                    <div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </div>
                    {req}
                  </li>
                ),
            )}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderScholarshipForm = () => (
    <form onSubmit={handleScholarshipSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-2 underline decoration-indigo-500 decoration-2 underline-offset-4">
            <FileText size={18} className="text-indigo-500" /> Scholarship
            Identity
          </h2>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Scholarship Name *
          </label>
          <input
            name="name"
            value={scholarshipData.name}
            onChange={handleScholarshipChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. Presidential Excellence Award"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Provider / Organization *
          </label>
          <input
            name="provider"
            value={scholarshipData.provider}
            onChange={handleScholarshipChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. National Education Foundation"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Funding Amount *
          </label>
          <input
            name="amount"
            value={scholarshipData.amount}
            onChange={handleScholarshipChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. $10,000 / Full Tuition"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Application Deadline *
          </label>
          <input
            name="deadline"
            type="date"
            value={scholarshipData.deadline}
            onChange={handleScholarshipChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Eligibility Criteria
          </label>
          <input
            name="eligibility"
            value={scholarshipData.eligibility}
            onChange={handleScholarshipChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. Undergraduate students with GPA > 3.5"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <Plus size={18} className="text-emerald-500" /> Scholarship Details &
          Requirements
        </h2>
        <ImageUpload
        label="Scholarship Thumbnail"
        image={scholarshipData.thumbnail}
        setImage={(img) =>
          setScholarshipData((prev) => ({ ...prev, thumbnail: img }))
        }
      />
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Full Description
          </label>
          <textarea
            name="description"
            value={scholarshipData.description}
            onChange={handleScholarshipChange}
            rows={4}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Provide background and context for this funding opportunity..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase block">
            Specific Requirements
          </label>
          {scholarshipData.requirements.map((req, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={req}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                className="flex-1 border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder={`Requirement ${index + 1}`}
              />
              {scholarshipData.requirements.length > 1 && (
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
            <Plus size={16} /> Add Another Requirement
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4 pb-12">
        <button
          type="submit"
          disabled={loading}
          className={`px-10 py-4 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl hover:shadow-indigo-200 ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
        >
          <Save size={18} />
          {loading ? "Posting..." : "Publish Scholarship"}
        </button>
      </div>
    </form>
  );
  const ImageUpload = ({ label, image, setImage }) => {
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setImage({
        file,
        preview: URL.createObjectURL(file),
      });
    };

    return (
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase">
          {label}
        </label>

        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50">
            {image?.preview ? (
              <img
                src={image.preview}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-slate-400 text-center px-2">
                No image
              </span>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm"
          />
        </div>
      </div>
    );
  };

  const renderClubPreview = () => (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
      <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 relative">
        <div className="absolute -bottom-8 left-8 w-24 h-24 bg-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center overflow-hidden">
          {clubData.thumbnail?.preview ? (
            <img
              src={clubData.thumbnail.preview}
              alt="Club logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-slate-400">No logo</span>
          )}
        </div>
      </div>
      <div className="pt-12 px-8 pb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              {clubData.name || "CLUB NAME"}
            </h2>
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mt-2">
              {clubData.category}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-500 transition-colors">
              <Facebook size={20} />
            </button>
            <button className="p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-500 transition-colors">
              <Twitter size={20} />
            </button>
            <button className="p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-500 transition-colors">
              <Globe size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 text-slate-800 font-bold mb-3">
                <Info size={18} className="text-emerald-500" /> About Us
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
                {clubData.description ||
                  "Describe the club's mission and culture here."}
              </p>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-slate-800 font-bold mb-3">
                <Users size={18} className="text-emerald-500" /> Core Activities
              </h3>
              <ul className="space-y-2">
                {clubData.activities.map(
                  (act, i) =>
                    act && (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-slate-600 border-l-2 border-emerald-500 pl-3 py-1 bg-emerald-50/30"
                      >
                        {act}
                      </li>
                    ),
                )}
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
              <h3 className="text-slate-800 font-bold text-lg">Quick Facts</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Users size={18} className="text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Club President
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {clubData.president || "Pending"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Meeting Schedule
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {clubData.schedule || "TBD"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Primary Location
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {clubData.location || "On Campus"}
                    </p>
                  </div>
                </div>
              </div>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-95">
                Join Organization
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClubForm = () => (
    <form onSubmit={handleClubSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
            <Users size={18} className="text-emerald-500" /> Organization
            Profile
          </h2>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Club Name *
          </label>
          <input
            name="name"
            value={clubData.name}
            onChange={handleClubChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="e.g. Coding & Robotics Society"
            required
          />
          <ImageUpload
            label="Club Logo / Thumbnail"
            image={clubData.thumbnail}
            setImage={(img) =>
              setClubData((prev) => ({ ...prev, thumbnail: img }))
            }
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Category *
          </label>
          <select
            name="category"
            value={clubData.category}
            onChange={handleClubChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="Sports">Sports & Fitness</option>
            <option value="Tech">Technology & Innovation</option>
            <option value="Arts">Arts & Culture</option>
            <option value="Academic">Academic Support</option>
            <option value="Volunteer">Volunteer & Charity</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">
            President / Leader *
          </label>
          <input
            name="president"
            value={clubData.president}
            onChange={handleClubChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Meeting Schedule
          </label>
          <input
            name="schedule"
            value={clubData.schedule}
            onChange={handleClubChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="e.g. Wed 4:00 PM - 6:00 PM"
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-bold text-slate-500 uppercase">
            Primary Location
          </label>
          <input
            name="location"
            value={clubData.location}
            onChange={handleClubChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="e.g. Student Center Room 201"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <Info size={18} className="text-emerald-500" /> Description &
          Activities
        </h2>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">
            About the Club
          </label>
          <textarea
            name="description"
            value={clubData.description}
            onChange={handleClubChange}
            rows={4}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="History, mission and target audience..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase block">
            Regular Activities
          </label>
          {clubData.activities.map((act, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={act}
                onChange={(e) => handleActivityChange(index, e.target.value)}
                className="flex-1 border p-2 rounded focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder={`Activity ${index + 1}`}
              />
              {clubData.activities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeActivity(index)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addActivity}
            className="mt-2 flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700"
          >
            <Plus size={16} /> Add Activity
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4 pb-12">
        <button
          type="submit"
          disabled={loading}
          className={`px-10 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg ${loading ? "bg-slate-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 text-white"}`}
        >
          <Save size={18} />
          {loading ? "Saving..." : "Register Organization"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header with Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {activeTab === "scholarships"
                ? "Scholarship Portal"
                : "Student Life & Organizations"}
            </h1>
            <p className="text-slate-500 text-sm">
              {activeTab === "scholarships"
                ? "Manage student financial aid and grants"
                : "Register and manage campus clubs, groups and societies"}
            </p>
          </div>

          <div className="flex gap-3">
            {/* Tab Toggle */}
            <div className="inline-flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
              <button
                onClick={() => {
                  setActiveTab("scholarships");
                  setIsPreview(false);
                }}
                className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                  activeTab === "scholarships"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap size={16} className="inline mr-1" />
                Scholarships
              </button>
              <button
                onClick={() => {
                  setActiveTab("clubs");
                  setIsPreview(false);
                }}
                className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                  activeTab === "clubs"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Users size={16} className="inline mr-1" />
                Clubs
              </button>
            </div>

            {/* Preview Toggle */}
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all shadow-sm ${
                isPreview
                  ? (activeTab === "scholarships"
                      ? "bg-indigo-600"
                      : "bg-emerald-600") + " text-white"
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              <Eye size={18} /> {isPreview ? "Edit" : "Preview"}
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === "scholarships"
          ? isPreview
            ? renderScholarshipPreview()
            : renderScholarshipForm()
          : isPreview
            ? renderClubPreview()
            : renderClubForm()}
      </div>
    </div>
  );
};

export default CombinedPortal;
