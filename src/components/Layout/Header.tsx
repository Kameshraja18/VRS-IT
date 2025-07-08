import React, { useState } from 'react';
import { Menu, Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
  onNotificationClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, onNotificationClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={onNotificationClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user?.avatar || 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={user?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Navigate to profile based on role
                      if (user?.role === 'student' || user?.role === 'staff') {
                        // This would be handled by the sidebar navigation
                      }
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">View Profile</span>
                  </button>
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Settings</span>
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;