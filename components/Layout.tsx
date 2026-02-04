
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PenTool, Home, BookOpen, User } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-xl font-bold tracking-tight">LUMINA</span>
            </Link>

            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-black transition-colors">Home</Link>
              <Link to="/blog" className="text-gray-600 hover:text-black transition-colors">Articles</Link>
              <Link to="/admin" className="flex items-center space-x-1 text-gray-600 hover:text-black transition-colors">
                <LayoutDashboard size={18} />
                <span>Admin</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 serif">Lumina</h3>
              <p className="text-gray-500 text-sm">
                Exploring the intersection of technology, human creativity, and the future.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/blog">All Posts</Link></li>
                <li><Link to="/admin">Admin Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-sm text-gray-600 mb-4">Get the latest insights delivered to your inbox.</p>
              <div className="flex space-x-2">
                <input type="email" placeholder="Email" className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-black" />
                <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">Join</button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-400 text-xs">
            © {new Date().getFullYear()} Lumina Blog Platform. Built with Gemini AI.
          </div>
        </div>
      </footer>
    </div>
  );
};
