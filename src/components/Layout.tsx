import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, FolderOpen, Users, Settings, LogOut, Menu, X, ShoppingBag, ShoppingCart, Globe, User, Image, Image as Images, Navigation, FileInput, MessageSquare, Tag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../hooks/useSettings';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { user, signOut } = useAuth();
  const { settings, loading: settingsLoading } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if ecommerce is disabled
  const isEcommerceDisabled = settings && settings.enable_ecommerce === false;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'categories', label: 'Categories', icon: FolderOpen },
    { id: 'content', label: 'Content Pages', icon: Globe },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'galleries', label: 'Galleries', icon: Images },
    { id: 'menus', label: 'Menus', icon: Navigation, adminEditorOnly: true },
    { id: 'forms', label: 'Forms', icon: FileInput, adminEditorOnly: true },
    { id: 'products', label: 'Products', icon: ShoppingBag, adminEditorOnly: true, ecommerceOnly: true },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, adminEditorOnly: true, ecommerceOnly: true },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, adminEditorOnly: true, ecommerceOnly: true },
    { id: 'coupons', label: 'Coupons', icon: Tag, adminOnly: true, ecommerceOnly: true },
    { id: 'users', label: 'Users', icon: Users, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings, adminOnly: true },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') return false;
    if (item.adminEditorOnly && !['admin', 'editor'].includes(user?.role || '')) return false;
    if (item.ecommerceOnly && isEcommerceDisabled) return false;
    return true;
  });

  // Listen for tab change events
  useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      onTabChange(event.detail);
    };
    
    window.addEventListener('change-tab', handleTabChange as EventListener);
    
    return () => {
      window.removeEventListener('change-tab', handleTabChange as EventListener);
    };
  }, [onTabChange]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } overflow-y-auto`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <Logo className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">DC CMS</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Content & Commerce</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role}
                </p>
              </div>
              <ThemeToggle />
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  onTabChange('profile');
                  setSidebarOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">Profile</span>
              </button>
              
              <button
                onClick={signOut}
                className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Welcome back, <span className="font-medium text-gray-900 dark:text-white">{user?.username}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;