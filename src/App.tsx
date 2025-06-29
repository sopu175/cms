import React, {useState, useEffect} from 'react';
import {AuthProvider, useAuth} from './contexts/AuthContext';
import {ThemeProvider} from './contexts/ThemeContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Posts from './components/Posts';
import Categories from './components/Categories';
import ContentPages from './components/ContentPages';
import Products from './components/Products';
import Orders from './components/Orders';
import Reviews from './components/Reviews';
import Coupons from './components/Coupons';
import Users from './components/Users';
import Settings from './components/Settings';
import Profile from './components/Profile';
import MediaLibrary from './components/MediaLibrary';
import Gallery from './components/Gallery';
import {Menu} from "lucide-react";
import Menus from "./pages/Menus.tsx";
import Forms from "./pages/Forms.tsx";

const AppContent: React.FC = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settings, setSettings] = useState<any>(null);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        if (data.success) {
          setSettings(data.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setSettingsLoaded(true);
      }
    };

    if (isAuthenticated) {
      fetchSettings();
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  // Check if ecommerce is disabled
  const isEcommerceDisabled = settings && settings.enable_ecommerce === false;

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'posts':
        return <Posts />;
      case 'categories':
        return <Categories />;
      case 'content':
        return <ContentPages />;
      case 'products':
        return isEcommerceDisabled ? <EcommerceDisabled /> : <Products />;
      case 'orders':
        return isEcommerceDisabled ? <EcommerceDisabled /> : <Orders />;
      case 'reviews':
        return isEcommerceDisabled ? <EcommerceDisabled /> : <Reviews />;
      case 'coupons':
        return isEcommerceDisabled ? <EcommerceDisabled /> : <Coupons />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      case 'media':
        return <MediaLibrary />;
      case 'galleries':
        return <Gallery />;
      case 'menus':
        return <Menus />;
      case 'forms':
        return <Forms />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActiveTab()}
    </Layout>
  );
};

// Component to show when ecommerce is disabled
const EcommerceDisabled: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600 dark:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Ecommerce Features Disabled</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        Ecommerce functionality is currently disabled. To enable it, go to Settings → Ecommerce and turn on the "Enable Ecommerce" option.
      </p>
      <button 
        onClick={() => {
          // Dispatch event to change tab to settings
          const event = new CustomEvent('change-tab', { detail: 'settings' });
          window.dispatchEvent(event);
        }}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Go to Settings
      </button>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;