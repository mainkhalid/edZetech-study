import React from 'react';
import { 
  Microscope, 
  BookOpen, 
  Users, 
  TrendingUp,
  Award,
  Target,
  Lightbulb,
  FileText,
  Globe
} from 'lucide-react';

const Research = () => {
  const researchAreas = [
    {
      icon: <Microscope size={40} />,
      title: 'Technology & Innovation',
      description: 'AI, Machine Learning, IoT, Cybersecurity, and Software Engineering',
      projects: 15,
      color: 'blue'
    },
    {
      icon: <TrendingUp size={40} />,
      title: 'Business & Economics',
      description: 'Entrepreneurship, Financial Management, Marketing Analytics, and Trade',
      projects: 12,
      color: 'green'
    },
    {
      icon: <Users size={40} />,
      title: 'Social Sciences',
      description: 'Education, Psychology, Sociology, and Community Development',
      projects: 10,
      color: 'purple'
    },
    {
      icon: <Lightbulb size={40} />,
      title: 'Engineering & Design',
      description: 'Civil Engineering, Electrical Systems, and Sustainable Design',
      projects: 18,
      color: 'orange'
    }
  ];

  const researchCenters = [
    {
      name: 'Center for Innovation & Technology',
      focus: 'AI, Data Science, and Digital Transformation',
      director: 'Dr. James Odhiambo',
      established: '2018'
    },
    {
      name: 'Business Research Institute',
      focus: 'Entrepreneurship, SME Development, and Market Research',
      director: 'Prof. Mary Kamau',
      established: '2016'
    },
    {
      name: 'Sustainable Engineering Lab',
      focus: 'Green Technology, Renewable Energy, and Smart Cities',
      director: 'Dr. Peter Mwangi',
      established: '2020'
    }
  ];

  const publications = [
    {
      title: 'AI-Driven Agricultural Solutions for Smallholder Farmers in East Africa',
      authors: 'Wanjiru, S., Omondi, J., & Kimani, P.',
      journal: 'Journal of Agricultural Technology',
      year: '2025',
      type: 'Journal Article'
    },
    {
      title: 'Digital Financial Inclusion: Mobile Money Impact on Rural Communities',
      authors: 'Mutua, A. & Otieno, R.',
      journal: 'African Economic Review',
      year: '2025',
      type: 'Research Paper'
    },
    {
      title: 'Sustainable Urban Development in Nairobi: A Case Study',
      authors: 'Kamau, M., Njoroge, D., & Akinyi, F.',
      journal: 'Urban Planning & Design',
      year: '2024',
      type: 'Conference Paper'
    }
  ];

  const achievements = [
    { number: '200+', label: 'Research Projects', icon: <FileText size={32} /> },
    { number: '150+', label: 'Publications', icon: <BookOpen size={32} /> },
    { number: '50+', label: 'Research Partners', icon: <Globe size={32} /> },
    { number: '20+', label: 'Awards Won', icon: <Award size={32} /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1a2b4c] to-[#2d4263] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
            <Microscope size={40} />
          </div>
          <h1 className="text-5xl font-extrabold mb-6">Research & Innovation</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Advancing knowledge through cutting-edge research that addresses real-world challenges and creates impact
          </p>
        </div>
      </div>

      {/* Research Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="text-orange-500 flex justify-center mb-4">
                {achievement.icon}
              </div>
              <div className="text-4xl font-extrabold text-[#1a2b4c] mb-2">
                {achievement.number}
              </div>
              <p className="text-gray-600 font-semibold">{achievement.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Research Areas */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-2">
              Our Focus
            </h2>
            <h1 className="text-4xl font-extrabold text-[#1a2b4c] mb-4">
              Research Areas
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our key research domains and ongoing projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {researchAreas.map((area, index) => (
              <div 
                key={index}
                className="group bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${area.color}-100 mb-6 text-${area.color}-600 group-hover:scale-110 transition-transform`}>
                  {area.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#1a2b4c] mb-3">{area.title}</h3>
                <p className="text-gray-600 mb-4">{area.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Target size={16} className="text-orange-500" />
                  <span className="font-semibold text-gray-700">{area.projects} Active Projects</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Centers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-2">
              Facilities
            </h2>
            <h1 className="text-4xl font-extrabold text-[#1a2b4c] mb-4">
              Research Centers
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              State-of-the-art research facilities equipped with modern technology
            </p>
          </div>

          <div className="space-y-6">
            {researchCenters.map((center, index) => (
              <div 
                key={index}
                className="bg-gradient-to-r from-slate-50 to-white border-2 border-gray-200 rounded-xl p-8 hover:border-orange-400 transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#1a2b4c] mb-2">{center.name}</h3>
                    <p className="text-gray-600 mb-3">{center.focus}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Users size={16} className="text-orange-500" />
                        <span className="text-gray-700">Director: <strong>{center.director}</strong></span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Award size={16} className="text-orange-500" />
                        <span className="text-gray-700">Est. <strong>{center.established}</strong></span>
                      </span>
                    </div>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Publications */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-2">
              Knowledge Sharing
            </h2>
            <h1 className="text-4xl font-extrabold text-[#1a2b4c] mb-4">
              Recent Publications
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our latest research contributions to academic and industry communities
            </p>
          </div>

          <div className="space-y-6 max-w-5xl mx-auto">
            {publications.map((pub, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full mb-2">
                      {pub.type}
                    </span>
                    <h3 className="text-xl font-bold text-[#1a2b4c] mb-2">{pub.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{pub.authors}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="italic">{pub.journal}</span>
                      <span>•</span>
                      <span>{pub.year}</span>
                    </div>
                  </div>
                  <button className="text-orange-500 hover:text-orange-600 font-semibold text-sm">
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="bg-[#1a2b4c] hover:bg-[#2d4263] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              View All Publications
            </button>
          </div>
        </div>
      </section>

      {/* Collaboration CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1a2b4c] to-[#2d4263] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-6">Collaborate With Us</h2>
          <p className="text-xl text-gray-300 mb-8">
            Partner with Zetech University on groundbreaking research projects and innovation initiatives
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors">
              Research Partnerships
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors border-2 border-white/20">
              Contact Research Office
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Research;