
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlogStore } from '../store/blogStore';
import { Search } from 'lucide-react';

export const BlogList: React.FC = () => {
  const { posts } = useBlogStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Technology', 'Design', 'AI', 'Lifestyle', 'Business'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return post.status === 'published' && matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-16">
        <h1 className="text-5xl font-bold serif mb-8">All Articles</h1>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black transition-shadow"
            />
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Link key={post.id} to={`/post/${post.id}`} className="group block">
              <div className="overflow-hidden rounded-2xl mb-4 bg-gray-200 aspect-[16/10]">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{post.category}</span>
                <h3 className="text-2xl font-bold leading-snug group-hover:text-gray-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-base line-clamp-3">{post.excerpt}</p>
                <div className="pt-4 flex items-center text-sm text-gray-400">
                  <span className="font-medium text-gray-900">{post.author}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime} read</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-400">
            No articles found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};
