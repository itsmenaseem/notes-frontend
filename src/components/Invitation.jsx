import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function Invitation() {
  
  const [invitations, setInvitations] = useState([
  ]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  
  // Copy feedback state
  const [copiedId, setCopiedId] = useState(null);

  const [hasNext,setHasNext] = useState(false)
  
  // New invitation form state
  const [newInvitation, setNewInvitation] = useState({
    email: '',
    role: 'user',
    plan: 'free'
  });

  // Status color mapping
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    declined: "bg-red-100 text-red-800 border-red-200",
    expired: "bg-gray-100 text-gray-800 border-gray-200"
  };

  // Plan color mapping
  const planColors = {
    basic: "bg-blue-100 text-blue-800",
    pro: "bg-purple-100 text-purple-800",
    enterprise: "bg-indigo-100 text-indigo-800"
  };

  // Role color mapping
  const roleColors = {
    admin: "bg-rose-100 text-rose-800",
    user: "bg-cyan-100 text-cyan-800",
    viewer: "bg-amber-100 text-amber-800"
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvitation(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const token = useSelector(state => state.auth.token)
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/invite`,newInvitation,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      setInvitations(prev => [...prev,response.data.invitation])
      toast.success(response.data.message);
    } catch (error) {
        const message = error?.response?.data.message || error.message;
        toast.error(message);
        console.log(message);
    }
    
    // Reset form and close modal
    setNewInvitation({
      email: '',
      role: 'user',
      plan: 'free'
    });
    
    setShowModal(false);
  };

  // Delete invitation
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invitation?")) {
      try {
          await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/invite/${id}`,{
            headers:{
              Authorization: `Bearer ${token}`
            }
          });
          toast.success("Invitation deleted successfully!");
          setInvitations(prev => prev.filter(inv => inv._id !== id));
      } catch (error) {
         const message = error?.response?.data.message || error.message;
        toast.error(message);
        console.log(message);
      }
    }
  };

  // Copy invitation link to clipboard
  const copyToClipboard = (id, link) => {
    navigator.clipboard.writeText(link);
    toast.success("Invitation link copied to clipboard!");
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };



  // Change page

  async function fetchInvitations(curr) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/invite?page=${curr}&limit=10`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data.invites);
      
      setInvitations(response.data.invites);
      setHasNext(response.data.hasNext)
      toast.success(response.data.message);
    } catch (error) {
      const message = error?.response?.data.message || error.message;
      toast.error(message);
      console.log(message);
    }
  }
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchInvitations(pageNumber)
  };
  useEffect(()=>{
    fetchInvitations(currentPage)
  },[])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invitation Management</h1>
            <p className="text-gray-600 mt-2">Manage and track your team invitations</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Invitation
          </button>
        </header>

        {/* Invitations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.map(invitation => (
            <div key={invitation._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="p-5">
                {/* Header with avatar and status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {invitation.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <h2 className="font-semibold text-gray-800">{invitation.email}</h2>
                      <p className="text-xs text-gray-500">Invited on {invitation.createdAt.split('T')[0]}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[invitation.status]}`}>
                    {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                  </span>
                </div>
                
                {/* Details */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Role</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleColors[invitation.role]}`}>
                      {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Plan</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${planColors[invitation.plan]}`}>
                      {invitation.plan.charAt(0).toUpperCase() + invitation.plan.slice(1)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 uppercase">Invited By</p>
                    <p className="font-medium text-sm">{invitation.invitedBy.email}</p>
                  </div>
                </div>
                
                {/* Invitation Link Section */}
                <div className="mt-4">
                  <p className="text-xs text-gray-500 uppercase mb-1">Invitation Link</p>
                  <div className="flex items-center">
                    <input
                      type="text"
                      readOnly
                      value={invitation.url}
                      className="flex-1 text-xs p-2 border border-gray-300 rounded-l-md bg-gray-50 truncate"
                    />
                    <button
                      onClick={() => copyToClipboard(invitation._id, invitation.url)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-r-md text-xs flex items-center"
                    >
                      {copiedId === invitation._id ? (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-between mt-5">
                  <button 
                    onClick={() => handleDelete(invitation._id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {invitations.length > 0 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Previous
              </button>
              
                <button
                  className={`px-3 py-1 rounded-md bg-indigo-600 text-white}`}
                >
                  {currentPage}
                </button>
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={!hasNext}
                className={`px-3 py-1 rounded-md ${!hasNext? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Add Invitation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="text-xl font-semibold text-gray-900">Add New Invitation</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newInvitation.email}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="user@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={newInvitation.role}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                  <select
                    id="plan"
                    name="plan"
                    value={newInvitation.plan}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="pro">Pro</option>
                    <option value="free">free</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

