import { NavLink } from 'react-router-dom';
import { AiOutlineCalendar, AiOutlineDollar, AiOutlineUser, AiOutlineMessage, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { useState, useEffect } from 'react';

const navItems = [
  { icon: AiOutlineCalendar, text: 'Meetings', path: '/dashboard/user/meetings' },
  { icon: AiOutlineDollar, text: 'Payments', path: '/dashboard/user/payments' },
  { icon: AiOutlineUser, text: 'Profile', path: '/dashboard/user/profile' },
  { icon: AiOutlineMessage, text: 'Chats', path: '/dashboard/user/chats' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40 transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isMobile ? 'w-64' : 'w-64'} md:translate-x-0`}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold mb-8">Dashboard</h1>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="text-xl" />
                <span>{item.text}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}