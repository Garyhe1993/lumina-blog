
import { useState, useEffect } from 'react';
import { BlogPost, QuickUpdate, PostComment } from '../types';

const INITIAL_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Web Development with AI',
    excerpt: 'How large language models are fundamentally changing how we approach coding and user interfaces.',
    content: '# The AI Revolution\n\nAI is no longer just a buzzword. It is transforming the very fabric of the web...\n\n## Impact on Productivity\nDevelopers are seeing 2x productivity gains using tools like Gemini and Copilot.',
    author: 'Alex Chen',
    date: '2023-11-20',
    category: 'AI',
    readTime: '5 min',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
    status: 'published',
    layout: 'standard',
    likes: 42,
    comments: [
      { id: 'c1', author: 'Jamie', text: 'Great insights! AI is definitely changing my workflow.', date: '2023-11-21', avatar: 'https://ui-avatars.com/api/?name=Jamie' }
    ]
  },
  {
    id: '2',
    title: 'Minimalism in UI Design',
    excerpt: 'Why less is often more when it comes to modern digital experiences.',
    content: 'Minimalism is not about a lack of something. It is about the perfect amount of everything.',
    author: 'Sarah Jenkins',
    date: '2023-11-18',
    category: 'Design',
    readTime: '4 min',
    coverImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1000',
    status: 'published',
    layout: 'magazine',
    likes: 128,
    comments: []
  }
];

const INITIAL_UPDATES: QuickUpdate[] = [
  { id: 'u1', text: 'Working on a new series about Quantum Computing! 🚀', date: '2023-11-22T10:00:00Z', author: 'Alex Chen' },
  { id: 'u2', text: 'Just updated the site layout. Let us know what you think of the new Magazine view! ✨', date: '2023-11-21T15:30:00Z', author: 'Lumina Team' }
];

export const useBlogStore = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [updates, setUpdates] = useState<QuickUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedPosts = localStorage.getItem('lumina_posts');
    const savedUpdates = localStorage.getItem('lumina_updates');
    
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    else {
      setPosts(INITIAL_POSTS);
      localStorage.setItem('lumina_posts', JSON.stringify(INITIAL_POSTS));
    }

    if (savedUpdates) setUpdates(JSON.parse(savedUpdates));
    else {
      setUpdates(INITIAL_UPDATES);
      localStorage.setItem('lumina_updates', JSON.stringify(INITIAL_UPDATES));
    }

    setLoading(false);
  }, []);

  const savePosts = (newPosts: BlogPost[]) => {
    setPosts(newPosts);
    localStorage.setItem('lumina_posts', JSON.stringify(newPosts));
  };

  const saveUpdates = (newUpdates: QuickUpdate[]) => {
    setUpdates(newUpdates);
    localStorage.setItem('lumina_updates', JSON.stringify(newUpdates));
  };

  const addPost = (post: BlogPost) => savePosts([post, ...posts]);
  const updatePost = (updatedPost: BlogPost) => savePosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  const deletePost = (id: string) => savePosts(posts.filter(p => p.id !== id));

  const addUpdate = (update: QuickUpdate) => saveUpdates([update, ...updates]);
  const deleteUpdate = (id: string) => saveUpdates(updates.filter(u => u.id !== id));

  const likePost = (postId: string) => {
    const newPosts = posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
    savePosts(newPosts);
  };

  const addComment = (postId: string, comment: PostComment) => {
    const newPosts = posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p);
    savePosts(newPosts);
  };

  return { posts, updates, loading, addPost, updatePost, deletePost, addUpdate, deleteUpdate, likePost, addComment };
};
