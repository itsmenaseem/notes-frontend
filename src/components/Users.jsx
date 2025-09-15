import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function Users() {
  
  const currentUser = useSelector(state => state.auth.user)
  const [users, setUsers] = useState([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext,setHasNext] = useState(false)
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    role: '',
    plan: ''
  });

  // Status color mapping
  const statusColors = {
    active: "bg-green-100 text-green-800 border-green-200",
    inactive: "bg-gray-100 text-gray-800 border-gray-200",
    suspended: "bg-red-100 text-red-800 border-red-200"
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
    moderator: "bg-amber-100 text-amber-800"
  };

  // Handle edit button click
  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setEditForm({
      role: user.role,
      plan: user.plan
    });
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save changes
  const handleSaveClick = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/users/${id}`,{
        role: editForm.role,
        plan: editForm.plan
      },{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      toast.success('User updated successfully');
      setUsers(prev => prev.map(user => 
      user._id === id ? { ...user, role: editForm.role, plan: editForm.plan } : user
    ));
    setEditingUser(null);
    } catch (error) {
      const message = error?.response?.data?.message || error.message;
      toast.error(message);
      console.log(message);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  // Handle delete user
  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
        try {
          await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/users/${id}`,{
            headers:{
              Authorization:`Bearer ${token}`
            }
          })
          toast.success('User deleted successfully');
          setUsers(prev => prev.filter(user => user._id !== id));
        } catch (error) {
          const message = error?.response?.data?.message || error.message;
          toast.error(message);
          console.log(message);
        }
    }
  };
  const token = useSelector(state => state.auth.token)
  console.log(users);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  async function getUsers(curr){
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/users?page=${curr}&limit=10`,{
        headers:{Authorization:`Bearer ${token}`}
      });
      setUsers(response.data.users);
      setHasNext(response.data.pagination.hasNext)
    } catch (error) {
      const message = error?.response?.data.message || error.message;
      toast.error(message);
      console.log(message);
    }
  }
  useEffect(()=>{
    getUsers(currentPage)
  },[])
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage user roles and subscription plans</p>
          </div>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
              <div className="text-xs text-gray-500 capitalize">{currentUser.role}</div>
            </div>
          </div>
        </header>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 && users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user._id ? (
                        <select
                          name="role"
                          value={editForm.role}
                          onChange={handleEditChange}
                          className="rounded-md border border-gray-300 bg-white py-1 px-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleColors[user.role]}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === user._id ? (
                        <select
                          name="plan"
                          value={editForm.plan}
                          onChange={handleEditChange}
                          className="rounded-md border border-gray-300 bg-white py-1 px-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${planColors[user.plan]}`}>
                          {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt.split('T')[0]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        {editingUser === user._id ? (
                          <>
                            <button
                              onClick={() => handleSaveClick(user._id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(user)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            {/* Show delete button only if current user is admin */}
                            {currentUser.role === 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(user._id, user.name)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {users.length > 0 && (
          <div className="flex items-center justify-between mt-4 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
            <div>
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
                  className={`px-3 py-1 rounded-md ${!hasNext ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Empty state */}
        {users.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-gray-500">There are no users in the system yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}