import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Database, Mail, Globe, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AnimatedCard from '../Common/AnimatedCard';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      collegeName: 'VRS College of Engineering & Technology',
      collegeCode: 'VRS-IT',
      academicYear: '2024-25',
      timezone: 'Asia/Kolkata',
      language: 'English'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      weeklyReports: true,
      systemAlerts: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5
    },
    appearance: {
      theme: 'light',
      primaryColor: '#3B82F6',
      fontSize: 'medium',
      compactMode: false
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'email', label: 'Email', icon: Mail },
  ];

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">College Name</label>
        <input
          type="text"
          value={settings.general.collegeName}
          onChange={(e) => handleSettingChange('general', 'collegeName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">College Code</label>
        <input
          type="text"
          value={settings.general.collegeCode}
          onChange={(e) => handleSettingChange('general', 'collegeCode', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
        <select
          value={settings.general.academicYear}
          onChange={(e) => handleSettingChange('general', 'academicYear', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="2024-25">2024-25</option>
          <option value="2025-26">2025-26</option>
          <option value="2026-27">2026-27</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
        <select
          value={settings.general.timezone}
          onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
          <option value="UTC">UTC</option>
          <option value="America/New_York">America/New_York (EST)</option>
        </select>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {Object.entries(settings.notifications).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <p className="text-sm text-gray-500">
              {key === 'emailNotifications' && 'Receive notifications via email'}
              {key === 'smsNotifications' && 'Receive notifications via SMS'}
              {key === 'pushNotifications' && 'Receive push notifications'}
              {key === 'weeklyReports' && 'Get weekly summary reports'}
              {key === 'systemAlerts' && 'Receive system alerts and updates'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value as boolean}
              onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.security.twoFactorAuth}
            onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
        <input
          type="number"
          min="5"
          max="120"
          value={settings.security.sessionTimeout}
          onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
        <input
          type="number"
          min="30"
          max="365"
          value={settings.security.passwordExpiry}
          onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
        <input
          type="number"
          min="3"
          max="10"
          value={settings.security.loginAttempts}
          onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
        <select
          value={settings.appearance.theme}
          onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
        <input
          type="color"
          value={settings.appearance.primaryColor}
          onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
        <select
          value={settings.appearance.fontSize}
          onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Compact Mode</h4>
          <p className="text-sm text-gray-500">Reduce spacing for more content</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.appearance.compactMode}
            onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">Database Information</h4>
        <p className="text-sm text-yellow-700">
          Database settings are managed automatically. Contact system administrator for advanced configurations.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Database Status</label>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-900">Connected</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Backup</label>
          <span className="text-sm text-gray-900">2024-12-05 10:30 AM</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Records</label>
          <span className="text-sm text-gray-900">15,847</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Storage Used</label>
          <span className="text-sm text-gray-900">2.3 GB</span>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Server</label>
        <input
          type="text"
          placeholder="smtp.gmail.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
        <input
          type="number"
          placeholder="587"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
        <input
          type="email"
          placeholder="noreply@vrsit.edu.in"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
        <input
          type="text"
          placeholder="VRS-IT College"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'notifications': return renderNotificationSettings();
      case 'security': return renderSecuritySettings();
      case 'appearance': return renderAppearanceSettings();
      case 'database': return renderDatabaseSettings();
      case 'email': return renderEmailSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <AnimatedCard>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </AnimatedCard>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <AnimatedCard>
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 capitalize">
                {activeTab} Settings
              </h2>
              {renderTabContent()}
            </motion.div>
          </AnimatedCard>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;