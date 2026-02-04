
import React, { useState, useRef, useMemo } from 'react';
import { useBlogStore } from '../store/blogStore';
import { BlogPost, Category, PostLayout, QuickUpdate } from '../types';
import { 
  Plus, Edit, Trash2, Wand2, Loader2, FileText, 
  Sparkles, Image as ImageIcon, Video, Layout as LayoutIcon,
  ChevronRight, ArrowLeft, Zap, X, Tag
} from 'lucide-react';
import { generateBlogDraft } from '../services/geminiService';

export const Admin: React.FC = () => {
  const { posts, updates, addPost, updatePost, deletePost, addUpdate, deleteUpdate } = useBlogStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
  const [aiLoading, setAiLoading] = useState(false);
  const [topic, setTopic] = useState('');
  
  // Feed Composer State
  const [newUpdateText, setNewUpdateText] = useState('');
  const [feedImage, setFeedImage] = useState<string | undefined>();
  const [feedVideo, setFeedVideo] = useState<string | undefined>();

  // Category search state
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const feedImageRef = useRef<HTMLInputElement>(null);
  const feedVideoRef = useRef<HTMLInputElement>(null);

  const existingCategories = useMemo(() => {
    return Array.from(new Set(posts.map(p => p.category))).sort();
  }, [posts]);

  const filteredCategories = useMemo(() => {
    return existingCategories.filter(c => 
      c.toLowerCase().includes(categoryInput.toLowerCase())
    );
  }, [existingCategories, categoryInput]);

  const handleNewUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateText.trim() && !feedImage && !feedVideo) return;
    
    addUpdate({
      id: Math.random().toString(36).substr(2, 9),
      text: newUpdateText,
      date: new Date().toISOString(),
      author: 'Admin',
      imageUrl: feedImage,
      videoUrl: feedVideo
    });
    
    setNewUpdateText('');
    setFeedImage(undefined);
    setFeedVideo(undefined);
  };

  const handleFeedMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (type === 'image') setFeedImage(base64);
      else setFeedVideo(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setCategoryInput(post.category);
    setIsEditing(true);
  };

  const handleNew = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setCurrentPost({
      id: newId,
      title: '', excerpt: '', content: '',
      category: 'Uncategorized', author: 'Admin',
      date: new Date().toISOString().split('T')[0],
      readTime: '5 min', status: 'draft', layout: 'standard',
      likes: 0, comments: [], coverImage: 'https://picsum.photos/seed/' + newId + '/800/400',
    });
    setCategoryInput('');
    setIsEditing(true);
  };

  const handleSave = () => {
    const finalPost = {
      ...currentPost,
      category: categoryInput.trim() || 'Uncategorized'
    } as BlogPost;

    if (posts.find(p => p.id === finalPost.id)) {
      updatePost(finalPost);
    } else {
      addPost(finalPost);
    }
    setIsEditing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (type === 'image') setCurrentPost(prev => ({ ...prev, coverImage: base64 }));
      else setCurrentPost(prev => ({ ...prev, videoUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={20} /></button>
            <h2 className="font-bold text-lg">Editing: {currentPost.title || 'Untitled'}</h2>
          </div>
          <button onClick={handleSave} className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-all shadow-sm">Save Changes</button>
        </header>

        <div className="flex-grow flex flex-col lg:flex-row">
          <main className="flex-grow p-6 lg:p-10 space-y-8 max-w-4xl mx-auto w-full">
            <input type="text" placeholder="Title" value={currentPost.title || ''} onChange={e => setCurrentPost({...currentPost, title: e.target.value})} className="w-full text-4xl lg:text-5xl font-bold serif bg-transparent border-none outline-none focus:ring-0" />
            <textarea placeholder="Excerpt" value={currentPost.excerpt || ''} onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})} className="w-full text-xl text-gray-500 bg-transparent border-none outline-none focus:ring-0 resize-none h-20 italic" />
            <div className="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm">
              <textarea placeholder="Content..." rows={20} value={currentPost.content || ''} onChange={e => setCurrentPost({...currentPost, content: e.target.value})} className="w-full p-6 bg-transparent border-none outline-none focus:ring-0 font-mono text-gray-700" />
            </div>
          </main>

          <aside className="lg:w-[350px] border-l border-gray-200 bg-white p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-80px)]">
             <div className="space-y-4">
                <div className="flex items-center space-x-2 font-bold"><LayoutIcon size={18} /><span>Layout</span></div>
                <div className="grid grid-cols-3 gap-2">
                  {['standard', 'magazine', 'minimal'].map(l => (
                    <button key={l} onClick={() => setCurrentPost({...currentPost, layout: l as any})} className={`py-2 text-[10px] font-bold border rounded-lg ${currentPost.layout === l ? 'bg-black text-white' : 'bg-white text-gray-400'}`}>{l.toUpperCase()}</button>
                  ))}
                </div>
             </div>

             {/* Dynamic Category Section */}
             <div className="space-y-4 pt-4 border-t border-gray-100 relative">
               <div className="flex items-center space-x-2 font-bold"><Tag size={18} /><span>Category</span></div>
               <div className="relative">
                 <input 
                   type="text" 
                   value={categoryInput}
                   onChange={e => {
                     setCategoryInput(e.target.value);
                     setShowCategorySuggestions(true);
                   }}
                   onFocus={() => setShowCategorySuggestions(true)}
                   placeholder="Type to create or select..."
                   className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-black outline-none"
                 />
                 {showCategorySuggestions && filteredCategories.length > 0 && (
                   <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                     {filteredCategories.map(cat => (
                       <button 
                         key={cat}
                         onClick={() => {
                           setCategoryInput(cat);
                           setShowCategorySuggestions(false);
                         }}
                         className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                       >
                         {cat}
                       </button>
                     ))}
                   </div>
                 )}
                 {showCategorySuggestions && categoryInput && !existingCategories.includes(categoryInput) && (
                   <div className="mt-2 flex items-center space-x-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                     <Plus size={12} />
                     <span>New Category Detected</span>
                   </div>
                 )}
               </div>
               <div className="flex flex-wrap gap-1">
                 {existingCategories.slice(0, 5).map(cat => (
                   <button 
                     key={cat}
                     onClick={() => setCategoryInput(cat)}
                     className="px-2 py-1 bg-gray-50 border border-gray-100 rounded text-[10px] text-gray-400 hover:text-black hover:border-black transition-all"
                   >
                     {cat}
                   </button>
                 ))}
               </div>
             </div>
             
             <div className="space-y-4 pt-4 border-t border-gray-100">
               <div className="flex items-center space-x-2 font-bold"><ImageIcon size={18} /><span>Media</span></div>
               <div className="aspect-video bg-gray-50 rounded-xl overflow-hidden cursor-pointer relative shadow-inner" onClick={() => fileInputRef.current?.click()}>
                 {currentPost.coverImage ? <img src={currentPost.coverImage} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-gray-300 text-xs">Upload Cover</div>}
               </div>
               <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'image')} />
               <button onClick={() => videoInputRef.current?.click()} className="w-full py-2 border border-gray-200 rounded-lg text-sm text-gray-500 hover:border-black flex items-center justify-center space-x-2">
                  <Video size={16} />
                  <span>{currentPost.videoUrl ? 'Video Attached' : 'Attach Video'}</span>
               </button>
               <input ref={videoInputRef} type="file" className="hidden" accept="video/*" onChange={e => handleFileUpload(e, 'video')} />
             </div>

             <div className="space-y-4 pt-4 border-t border-gray-100">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Status</span>
                <select 
                  value={currentPost.status}
                  onChange={e => setCurrentPost({...currentPost, status: e.target.value as any})}
                  className="mt-2 block w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
             </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12" onClick={() => setShowCategorySuggestions(false)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold serif">Articles</h1>
            <button onClick={handleNew} className="bg-black text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform flex items-center space-x-2"><Plus size={20} /><span>New Post</span></button>
          </div>
          
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between group hover:shadow-md transition-all">
                <div className="flex items-center space-x-4">
                  <img src={post.coverImage} className="w-16 h-12 object-cover rounded-lg" />
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight">{post.title}</h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span className="text-indigo-500 font-bold uppercase tracking-tighter">{post.category}</span>
                      <span>•</span>
                      <span>{post.likes} Likes</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(post); }} className="p-2 text-gray-400 hover:text-black"><Edit size={18} /></button>
                  <button onClick={(e) => { e.stopPropagation(); if(confirm('Delete?')) deletePost(post.id); }} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-black text-white rounded-[2rem] p-8 shadow-2xl shadow-black/20">
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center space-x-2 font-bold"><Zap size={20} fill="currentColor" /><span>Post Feed Update</span></div>
             </div>
             <form onSubmit={handleNewUpdate} className="space-y-4">
               <textarea 
                 value={newUpdateText}
                 onChange={e => setNewUpdateText(e.target.value)}
                 placeholder="What's happening?"
                 className="w-full bg-white/10 border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-white/30 min-h-[100px] resize-none"
               />
               
               {(feedImage || feedVideo) && (
                 <div className="relative aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/10">
                    {feedImage && <img src={feedImage} className="w-full h-full object-cover" />}
                    {feedVideo && <video src={feedVideo} className="w-full h-full object-cover" />}
                    <button 
                      type="button"
                      onClick={() => { setFeedImage(undefined); setFeedVideo(undefined); }}
                      className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black rounded-full text-white"
                    >
                      <X size={14} />
                    </button>
                 </div>
               )}

               <div className="flex items-center space-x-2">
                 <button 
                   type="button" 
                   onClick={() => feedImageRef.current?.click()}
                   className="p-2 bg-white/5 hover:bg-white/20 rounded-lg text-white/60 hover:text-white transition-all flex-grow flex items-center justify-center space-x-2 border border-white/10"
                 >
                   <ImageIcon size={18} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Image</span>
                 </button>
                 <button 
                   type="button" 
                   onClick={() => feedVideoRef.current?.click()}
                   className="p-2 bg-white/5 hover:bg-white/20 rounded-lg text-white/60 hover:text-white transition-all flex-grow flex items-center justify-center space-x-2 border border-white/10"
                 >
                   <Video size={18} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Video</span>
                 </button>
               </div>

               <input ref={feedImageRef} type="file" className="hidden" accept="image/*" onChange={e => handleFeedMediaUpload(e, 'image')} />
               <input ref={feedVideoRef} type="file" className="hidden" accept="video/*" onChange={e => handleFeedMediaUpload(e, 'video')} />

               <button className="w-full bg-white text-black py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">Post to Feed</button>
             </form>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
            <h3 className="font-bold text-lg mb-6">Recent Feed Items</h3>
            <div className="space-y-6">
              {updates.map(u => (
                <div key={u.id} className="group relative pl-4 border-l-2 border-gray-50 hover:border-black transition-colors">
                  <p className="text-sm text-gray-600 mb-2 leading-relaxed">{u.text}</p>
                  {(u.imageUrl || u.videoUrl) && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 aspect-video">
                      {u.imageUrl && <img src={u.imageUrl} className="w-full h-full object-cover" />}
                      {u.videoUrl && <video src={u.videoUrl} className="w-full h-full object-cover" />}
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{new Date(u.date).toLocaleDateString()}</span>
                    <button onClick={() => deleteUpdate(u.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
