
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogStore } from '../store/blogStore';
import { ChevronLeft, Share2, Bookmark, Heart, MessageSquare, Send, Smile } from 'lucide-react';

const EMOJIS = ['❤️', '🔥', '👏', '🙌', '✨', '🚀', '💯', '😲', '🙏', '💡'];

export const PostDetail: React.FC = () => {
  const { id } = useParams();
  const { posts, likePost, addComment } = useBlogStore();
  const post = posts.find(p => p.id === id);

  const [commentText, setCommentText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  if (!post) return null;

  const handleLike = () => {
    if (!hasLiked) {
      likePost(post.id);
      setHasLiked(true);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(post.id, {
      id: Math.random().toString(36).substr(2, 9),
      author: 'Guest Reader',
      text: commentText,
      date: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=Guest&background=random`
    });
    setCommentText('');
    setShowEmojiPicker(false);
  };

  const addEmoji = (emoji: string) => {
    setCommentText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const renderContent = () => (
    <div className="prose prose-lg prose-black max-w-none mb-16">
      {post.content.split('\n').map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-8 mb-4">{line.replace('# ', '')}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>;
        return <p key={i} className="text-gray-700 leading-relaxed mb-6 text-lg">{line}</p>;
      })}
    </div>
  );

  return (
    <article className="pb-20">
      <header className="pt-12 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-8 transition-colors">
            <ChevronLeft size={16} className="mr-1" />
            Back to Articles
          </Link>
          <h1 className={`font-bold serif leading-tight mb-8 ${post.layout === 'magazine' ? 'text-5xl lg:text-7xl' : 'text-4xl md:text-6xl'}`}>
            {post.title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${post.author}`} alt={post.author} />
              </div>
              <div className="text-sm">
                <div className="font-bold">{post.author}</div>
                <div className="text-gray-400">{post.date}</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLike}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-full transition-all border ${hasLiked ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-gray-100 text-gray-400 hover:border-red-200 hover:text-red-400'}`}
              >
                <Heart size={18} fill={hasLiked ? 'currentColor' : 'none'} />
                <span className="text-xs font-bold">{post.likes}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {post.layout !== 'minimal' && (
        <div className="max-w-5xl mx-auto px-4 mb-16">
          <div className="aspect-video lg:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-xl bg-black">
             {post.videoUrl ? <video src={post.videoUrl} controls className="w-full h-full object-cover" /> : <img src={post.coverImage} className="w-full h-full object-cover" />}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4">
        {renderContent()}

        {/* Interaction Section */}
        <section className="border-t border-gray-100 pt-16 mt-20">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-bold serif">Discussion</h3>
            <span className="text-sm font-bold text-gray-400">{post.comments.length} Comments</span>
          </div>

          {/* New Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-12">
            <div className="relative bg-gray-50 rounded-2xl p-4 focus-within:ring-2 focus-within:ring-black transition-all">
              <textarea 
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full bg-transparent border-none outline-none resize-none text-sm placeholder-gray-400 min-h-[100px]"
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/50">
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-gray-400 hover:text-black transition-colors"
                  >
                    <Smile size={20} />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-100 p-2 rounded-xl shadow-xl flex flex-wrap gap-1 z-10 w-48">
                      {EMOJIS.map(e => (
                        <button key={e} type="button" onClick={() => addEmoji(e)} className="hover:scale-125 transition-transform p-1 text-lg">
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button 
                  type="submit"
                  disabled={!commentText.trim()}
                  className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 disabled:opacity-30 disabled:scale-100 transition-all flex items-center space-x-2"
                >
                  <span>Post Comment</span>
                  <Send size={14} />
                </button>
              </div>
            </div>
          </form>

          {/* Comment List */}
          <div className="space-y-8">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex space-x-4">
                <img src={comment.avatar} className="w-10 h-10 rounded-full border border-gray-100" alt={comment.author} />
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold">{comment.author}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">{new Date(comment.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{comment.text}</p>
                </div>
              </div>
            ))}
            {post.comments.length === 0 && (
              <div className="text-center py-10 text-gray-400 italic text-sm">
                No comments yet. Be the first to start the conversation!
              </div>
            )}
          </div>
        </section>
      </div>
    </article>
  );
};
