
export type PostLayout = 'standard' | 'magazine' | 'minimal';

export interface PostComment {
  id: string;
  author: string;
  text: string;
  date: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  coverImage: string;
  videoUrl?: string;
  status: 'published' | 'draft';
  layout: PostLayout;
  likes: number;
  comments: PostComment[];
}

export interface QuickUpdate {
  id: string;
  text: string;
  date: string;
  author: string;
  imageUrl?: string;
  videoUrl?: string;
}

// Changed to string for dynamic support
export type Category = string;

export interface User {
  name: string;
  role: 'admin' | 'visitor';
  avatar: string;
}
