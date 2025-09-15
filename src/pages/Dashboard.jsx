import Invitation from '@/components/Invitation';
import MyNotes from '@/components/MyNotes';
import Notes from '@/components/Notes';
import Profile from '@/components/Profile';
import Users from '@/components/Users';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isAdmin, setIsAdmin] = useState(true); // Change to false to see non-admin view
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector(state => state.auth.user);
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile  />;
      case 'notes':
        return <Notes  />;
      case 'mynotes':
        return <MyNotes />;
      case 'users':
        return <Users  />;
      case 'invitations':
        return <Invitation />;
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome to Dashboard</h2>
            <p className="text-gray-600">Select an option from the sidebar to get started.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 w-screen">
      {/* Sidebar */}
      <div className={`fixed md:relative z-30 w-64 bg-gray-800 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out h-full`}>
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'profile' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('notes')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'notes' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Notes
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('mynotes')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'mynotes' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path>
                </svg>
                My Notes
              </button>
            </li>
            {user && user.role === 'admin' && (
              <>
                <li className="pt-4 mt-4 border-t border-gray-700">
                  <p className="px-4 text-xs uppercase text-gray-400">Admin</p>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    Users
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('invitations')}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'invitations' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Invitations
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <button 
              className="md:hidden text-gray-500 focus:outline-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;