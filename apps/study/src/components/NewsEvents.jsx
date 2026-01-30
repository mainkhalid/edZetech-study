import React from 'react';
import { Calendar, Clock, ArrowRight, TrendingUp, Newspaper, ChevronRight } from 'lucide-react';

const NewsEvents = () => {
  const news = [
    {
      id: 1,
      title: 'Zetech University Hosts International Tech Conference 2026',
      excerpt: 'Leading tech experts from across the globe gather to discuss AI and innovation in education.',
      date: { day: '15', month: 'FEB' },
      category: 'Events',
      trending: true
    },
    {
      id: 2,
      title: 'New State-of-the-Art Engineering Lab Inaugurated',
      excerpt: 'Students now have access to cutting-edge equipment for practical engineering projects.',
      date: { day: '20', month: 'JAN' },
      category: 'Campus News',
      trending: false
    },
    {
      id: 3,
      title: 'Zetech Students Win National Innovation Challenge',
      excerpt: 'Team develops groundbreaking mobile app for agricultural management.',
      date: { day: '18', month: 'JAN' },
      category: 'Achievements',
      trending: true
    },
    {
      id: 4,
      title: 'Partnership Announced with Leading Tech Companies',
      excerpt: 'New collaborations to provide internships and job placements for students.',
      date: { day: '10', month: 'JAN' },
      category: 'Partnerships',
      trending: false
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Open Day 2026',
      date: '2026-03-01',
      time: '9:00 AM - 4:00 PM',
      location: 'Main Campus'
    },
    {
      id: 2,
      title: 'Career Fair',
      date: '2026-03-15',
      time: '10:00 AM - 5:00 PM',
      location: 'University Hall'
    },
    {
      id: 3,
      title: 'Alumni Networking Event',
      date: '2026-04-05',
      time: '6:00 PM - 9:00 PM',
      location: 'City Campus'
    }
  ];

  return (
    <section className="py-8 bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 border-b border-slate-200 pb-8">
          <div>
            <h2 className="text-orange-600 font-bold text-sm uppercase tracking-[0.2em] mb-3">
              Press & Media
            </h2>
            <h1 className="text-4xl md:text-5xl font-black text-[#1a2b4c] tracking-tight">
              Latest Updates
            </h1>
          </div>
          <p className="text-slate-500 max-w-md text-sm leading-relaxed">
            The central hub for university announcements, academic breakthroughs, and institutional milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* News Feed (No Images) */}
          <div className="lg:col-span-8 space-y-4">
            {news.map((article) => (
              <div 
                key={article.id}
                className="group relative bg-white border border-slate-200 p-6 md:p-8 rounded-sm hover:border-orange-500/50 hover:shadow-sm transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col md:flex-row gap-6 md:items-center">
                  
                  {/* Styled Date Block */}
                  <div className="flex-shrink-0 flex md:flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-slate-50 border border-slate-100 rounded-lg">
                    <span className="text-2xl font-black text-[#1a2b4c]">{article.date.day}</span>
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">{article.date.month}</span>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-bold uppercase py-1 px-2 bg-slate-100 text-slate-600 tracking-wider">
                        {article.category}
                      </span>
                      {article.trending && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 uppercase">
                          <TrendingUp size={10} /> Trending
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-[#1a2b4c] mb-2 leading-snug group-hover:text-orange-600 transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="hidden md:block">
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            ))}

            <button className="w-full py-4 mt-4 border-2 border-dashed border-slate-200 text-slate-400 font-bold text-sm rounded-lg hover:bg-slate-50 hover:border-slate-300 hover:text-slate-600 transition-all">
              View All Press Releases
            </button>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Minimalist Events Card */}
            <div className="bg-[#1a2b4c] text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <Calendar size={120} className="-mr-8 -mt-8" />
              </div>
              
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3 relative z-10">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                   <Clock size={16} className="text-white" />
                </div>
                Event Briefs
              </h3>

              <div className="space-y-8 relative z-10">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="group cursor-pointer">
                    <p className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.2em] mb-1">
                      {event.date}
                    </p>
                    <h4 className="font-bold text-white group-hover:text-orange-300 transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                      {event.location} • {event.time}
                    </p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-10 group flex items-center justify-center gap-2 bg-white/10 hover:bg-orange-500 py-3 rounded-xl text-sm font-bold transition-all">
                Access Calendar <ArrowRight size={16} />
              </button>
            </div>

            {/* Clean Newsletter */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8">
              <Newspaper className="text-orange-500 mb-4" size={32} />
              <h3 className="text-lg font-bold text-[#1a2b4c] mb-2">Digest Subscription</h3>
              <p className="text-sm text-slate-500 mb-6">Weekly insights, research updates and academic news directly to your inbox.</p>
              
              <div className="space-y-3">
                <input 
                  type="email"
                  placeholder="Official Email Address"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-sm focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                />
                <button className="w-full bg-[#1a2b4c] hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-900/10">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NewsEvents;