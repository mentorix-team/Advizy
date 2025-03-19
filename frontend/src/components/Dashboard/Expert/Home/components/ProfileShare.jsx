import React, { useState, useEffect } from 'react';
import { Copy, Share2, X } from 'lucide-react';

const Dialog = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-gradient-to-b from-[#D5FEE3] to-[#FAFAFA] p-6 text-left shadow-xl transition-all w-full max-w-lg">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 text-gray-600 hover:text-gray-800 bg-white rounded-full p-1 shadow-sm border border-gray-100"
          >
            <X size={16} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

const ProfileShare = ({expert}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const redirect_url = expert?.redirect_url
  console.log("thisi sexpert ",expert)
  const profileUrl = `https://advizy.in/expert/${redirect_url}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My Profile',
        text: 'Check out my profile!',
        url: profileUrl,
      });
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const confettiStyle = `
    @keyframes confettiDrop {
      0% {
        transform: translateY(-100%) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(1000%) rotate(720deg);
        opacity: 0;
      }
    }
    
    .confetti-piece {
      position: absolute;
      animation: confettiDrop 2.5s ease-out forwards;
      pointer-events: none;
    }
  `;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="border border-gray-300 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 mx-auto transition-colors"
      >
        <span className="text-black">Share Your Profile</span>
        <Share2 size={20} className="text-gray-800"/>
      </button>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="w-full rounded-lg relative overflow-hidden">
          <style>{confettiStyle}</style>

          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => {
                const colors = ['#FFD700', '#FF69B4', '#4169E1', '#32CD32', '#FF4500', '#9370DB'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                const left = `${Math.random() * 100}%`;
                const animationDelay = `${Math.random() * 1}s`;
                const size = 8 + Math.random() * 8;

                return (
                    <div
                    key={i}
                    className="confetti-piece"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: '-20px',
                      width: `${8 + Math.random() * 8}px`,
                      height: `${8 + Math.random() * 8}px`,
                      backgroundColor: color,
                      animationDelay: `${Math.random() * 1}s`,
                      borderRadius: Math.random() > 0.5 ? '50%' : '0',
                    }}
                  />
                  
                );
              })}
            </div>
          )}

          <div className="text-center mb-6">
            <span className="text-5xl">🎉</span>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Profile Complete!</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Your expertise is now ready to shine. It's time to connect, inspire, and earn.
            </p>

            <div className="flex items-center justify-center space-x-2 bg-white rounded-lg border border-gray-200 p-3 max-w-md mx-auto">
              <span className="text-gray-600 flex-grow text-left">{profileUrl}</span>
              <button
                onClick={handleCopy}
                className="text-green-600 hover:text-green-700 transition-colors"
              >
                {copied ? (
                  <div className="flex items-center gap-1">
                    <span className="text-sm">Copied!</span>
                  </div>
                ) : (
                  <Copy size={20} />
                )}
              </button>
            </div>

            <button
              onClick={handleShare}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 mx-auto transition-colors"
            >
              <span>Share Your Profile</span>
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ProfileShare;