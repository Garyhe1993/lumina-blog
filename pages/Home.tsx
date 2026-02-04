
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useBlogStore } from '../store/blogStore';
import { ArrowRight, Sparkles, Zap, MessageSquare, Image as ImageIcon, Video, Filter } from 'lucide-react';

export const Home: React.FC = () => {
  const { posts, updates } = useBlogStore();
  const [activeCategory, setActiveCategory] = useState('All');

  const featuredPosts = useMemo(() => posts.filter(p => p.status === 'published'), [posts]);
  
  const categories = useMemo(() => {
    const cats = new Set(featuredPosts.map(p => p.category));
    return ['All', ...Array.from(cats)].sort();
  }, [featuredPosts]);

  const filteredPosts = useMemo(() => {
    const base = featuredPosts;
    if (activeCategory === 'All') return base.slice(0, 6);
    return base.filter(p => p.category === activeCategory);
  }, [featuredPosts, activeCategory]);

  const latestUpdates = updates.slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-12 sm:pt-32 sm:pb-16 lg:pt-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center space-x-2 bg-black text-white px-3 py-1 rounded-full text-xs font-semibold mb-6 animate-fade-in">
                <Sparkles size={14} />
                <span>AI-POWERED INSIGHTS</span>
              </div>
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight serif mb-6 leading-tight">
                Where human creativity <br />
                <span className="text-gray-400 italic">meets</span> AI intelligence.
              </h1>
              <p className="text-xl text-gray-500 mb-10 leading-relaxed max-w-2xl">
                A modern space for exploring the future of technology, design, and culture through thoughtful long-form writing and AI-augmented research.
              </p>
              <div className="flex space-x-4">
                <Link to="/blog" className="bg-black text-white px-8 py-4 rounded-full font-medium hover:scale-105 transition-transform flex items-center space-x-2">
                  <span>Read Articles</span>
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>

            {/* Quick Updates Sidebar on Home */}
            <div className="lg:col-span-4 bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm h-full flex flex-col">
              <div className="flex items-center space-x-2 mb-6 text-black font-bold text-lg border-b border-gray-50 pb-4">
                <Zap size={20} fill="currentColor" />
                <span>Lumina Feed</span>
              </div>
              <div className="space-y-6 flex-grow">
                {latestUpdates.map(update => (
                  <div key={update.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:bg-black before:rounded-full group">
                    <p className="text-sm text-gray-700 leading-relaxed mb-1 line-clamp-2">{update.text}</p>
                    
                    {(update.imageUrl || update.videoUrl) && (
                      <div className="mb-2 flex items-center space-x-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded w-fit">
                        {update.imageUrl ? <ImageIcon size={10} /> : <Video size={10} />}
                        <span>Media Attached</span>
                      </div>
                    )}

                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {new Date(update.date).toLocaleDateString()} • {update.author}
                    </div>
                  </div>
                ))}
                {latestUpdates.length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-xs italic">No updates recently.</div>
                )}
              </div>
              <Link to="/feed" className="block text-center text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest pt-6 border-t border-gray-50 mt-4 transition-colors">
                View Full Feed
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts with Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-bold serif mb-2">Latest Stories</h2>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Filter size={14} />
              <span>Explore by category</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                  activeCategory === cat 
                    ? 'bg-black text-white border-black shadow-lg shadow-black/10' 
                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPosts.map((post) => (
            <Link key={post.id} to={`/post/${post.id}`} className="group block">
              <div className="overflow-hidden rounded-2xl mb-4 bg-gray-200 aspect-[16/10] relative">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold leading-snug group-hover:text-gray-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <div className="flex items-center space-x-3 text-xs text-gray-400 pt-2">
                  <div className="flex items-center space-x-1">
                    <Zap size={12} fill="currentColor" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare size={12} />
                    <span>{post.comments.length}</span>
                  </div>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
          {filteredPosts.length === 0 && (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
               <p className="text-gray-400 italic">No stories found in this category.</p>
            </div>
          )}
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/blog" className="inline-flex items-center space-x-2 text-sm font-bold uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-all">
            <span>View All Articles</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};
