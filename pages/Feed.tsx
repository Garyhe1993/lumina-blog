
import React from 'react';
import { useBlogStore } from '../store/blogStore';
import { Zap, ArrowLeft, Image as ImageIcon, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Feed: React.FC = () => {
  const { updates } = useBlogStore();

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <Link to="/" className="inline-flex items-center text-sm text-gray-400 hover:text-black mb-12 transition-colors">
        <ArrowLeft size={16} className="mr-2" />
        Back to Home
      </Link>
      
      <div className="flex items-center space-x-4 mb-16">
        <div className="w-16 h-16 bg-black rounded-[2rem] flex items-center justify-center text-white shadow-xl">
          <Zap size={32} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-4xl font-bold serif">Lumina Feed</h1>
          <p className="text-gray-500">Visual updates and quick thoughts from our team.</p>
        </div>
      </div>

      <div className="space-y-12">
        {updates.map((update, idx) => (
          <div key={update.id} className="relative group">
            <div className="flex items-start space-x-6">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center font-bold text-xs shadow-sm">
                  {update.author.charAt(0)}
                </div>
                {idx !== updates.length - 1 && <div className="w-px flex-grow bg-gray-100 my-4" />}
              </div>
              <div className="flex-grow pb-12">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="font-bold text-sm tracking-tight">{update.author}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-400">{new Date(update.date).toLocaleString()}</span>
                </div>
                
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm group-hover:shadow-md transition-all space-y-4">
                  {update.text && <p className="text-gray-800 leading-relaxed text-lg">{update.text}</p>}
                  
                  {/* Image Attachment */}
                  {update.imageUrl && (
                    <div className="rounded-2xl overflow-hidden border border-gray-50 shadow-inner">
                      <img src={update.imageUrl} alt="Update" className="w-full h-auto object-cover max-h-[500px]" />
                    </div>
                  )}

                  {/* Video Attachment */}
                  {update.videoUrl && (
                    <div className="rounded-2xl overflow-hidden border border-gray-50 bg-black shadow-inner aspect-video">
                      <video src={update.videoUrl} controls className="w-full h-full object-cover" />
                    </div>
                  )}

                  {(update.imageUrl || update.videoUrl) && !update.text && (
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-2">
                      {update.imageUrl ? <ImageIcon size={12} /> : <Video size={12} />}
                      <span>Shared {update.imageUrl ? 'an image' : 'a video'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {updates.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[3rem] text-gray-400">
             <Zap size={48} className="mx-auto mb-4 opacity-10" />
             <p className="font-medium">No updates in the feed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
