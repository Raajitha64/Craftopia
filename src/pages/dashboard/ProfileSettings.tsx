import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Camera, Save, Eye, EyeOff, Shield, Bell, Globe } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';

const ProfileSettings: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    avatar: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'privacy'>('profile');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const validateProfile = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSave = async () => {
    if (!validateProfile()) return;

    try {
      await updateProfile(formData);
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handlePasswordChange = async () => {
    if (!validatePassword()) return;

    // Mock password change
    console.log('Password change requested');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Clear specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const changeSampleAvatar = () => {
    const sampleAvatars = [
      'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
    ];
    
    const currentIndex = sampleAvatars.indexOf(formData.avatar);
    const nextIndex = (currentIndex + 1) % sampleAvatars.length;
    handleInputChange('avatar', sampleAvatars[nextIndex]);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Globe className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-50 mb-1">Account Settings</h1>
        <p className="text-secondary-300">
          Manage your account preferences and security settings
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-primary-600 rounded-lg border border-primary-500">
        <div className="flex border-b border-primary-500 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-secondary-50 border-b-2 border-secondary-500'
                  : 'text-secondary-300 hover:text-secondary-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-secondary-500">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-500 flex items-center justify-center">
                        <User className="w-8 h-8 text-secondary-300" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={changeSampleAvatar}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center text-primary-800 hover:bg-secondary-400 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-secondary-50">Profile Picture</h3>
                  <p className="text-secondary-300 text-sm">
                    Click the camera icon to change your avatar
                  </p>
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-200 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`input ${errors.name ? 'border-danger-500' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-danger-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-200 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`input ${errors.username ? 'border-danger-500' : ''}`}
                    placeholder="Enter your username"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-danger-500">{errors.username}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-200 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`input ${errors.email ? 'border-danger-500' : ''}`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-danger-500">{errors.email}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-200 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className={`input ${errors.bio ? 'border-danger-500' : ''}`}
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                  <p className="mt-1 text-xs text-secondary-300">
                    {formData.bio.length}/500 characters
                  </p>
                  {errors.bio && (
                    <p className="mt-1 text-sm text-danger-500">{errors.bio}</p>
                  )}
                </div>
              </div>

              {hasChanges && (
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={handleProfileSave}
                    leftIcon={<Save className="w-4 h-4" />}
                    isLoading={isLoading}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium text-secondary-50 mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-200 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className={`input pr-10 ${errors.currentPassword ? 'border-danger-500' : ''}`}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-300 hover:text-secondary-100"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-danger-500">{errors.currentPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-200 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className={`input pr-10 ${errors.newPassword ? 'border-danger-500' : ''}`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-300 hover:text-secondary-100"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-danger-500">{errors.newPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-200 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`input pr-10 ${errors.confirmPassword ? 'border-danger-500' : ''}`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-300 hover:text-secondary-100"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-danger-500">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    onClick={handlePasswordChange}
                    leftIcon={<Shield className="w-4 h-4" />}
                  >
                    Update Password
                  </Button>
                </div>
              </div>

              <div className="border-t border-primary-500 pt-6">
                <h3 className="text-lg font-medium text-secondary-50 mb-4">Account Verification</h3>
                <div className="flex items-center justify-between p-4 bg-primary-700 rounded-lg">
                  <div>
                    <p className="text-secondary-50 font-medium">Email Verification</p>
                    <p className="text-secondary-300 text-sm">
                      {user?.isVerified ? 'Your email is verified' : 'Verify your email to increase trust'}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs ${
                    user?.isVerified 
                      ? 'bg-success-500/20 text-success-500' 
                      : 'bg-warning-500/20 text-warning-500'
                  }`}>
                    {user?.isVerified ? 'Verified' : 'Unverified'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium text-secondary-50 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    { id: 'orders', label: 'New Orders', description: 'Get notified when you receive new orders' },
                    { id: 'messages', label: 'Messages', description: 'Get notified when you receive new messages' },
                    { id: 'reviews', label: 'Reviews', description: 'Get notified when you receive new reviews' },
                    { id: 'marketing', label: 'Marketing', description: 'Receive updates about new features and promotions' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-primary-700 rounded-lg">
                      <div>
                        <p className="text-secondary-50 font-medium">{item.label}</p>
                        <p className="text-secondary-300 text-sm">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-primary-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-medium text-secondary-50 mb-4">Privacy Settings</h3>
                <div className="space-y-4">
                  {[
                    { id: 'profile', label: 'Public Profile', description: 'Allow others to view your profile and services' },
                    { id: 'online', label: 'Online Status', description: 'Show when you are online to other users' },
                    { id: 'analytics', label: 'Analytics', description: 'Help us improve by sharing anonymous usage data' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-primary-700 rounded-lg">
                      <div>
                        <p className="text-secondary-50 font-medium">{item.label}</p>
                        <p className="text-secondary-300 text-sm">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-primary-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-primary-500 pt-6">
                <h3 className="text-lg font-medium text-secondary-50 mb-4">Data Management</h3>
                <div className="space-y-3">
                  <Button variant="outline" fullWidth>
                    Download My Data
                  </Button>
                  <Button variant="danger" fullWidth>
                    Delete Account
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;