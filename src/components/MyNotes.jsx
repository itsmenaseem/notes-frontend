import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function MyNotes() {

  const [notes, setNotes] = useState([]);

  // State for modal and editing
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({
    title: '',
    description: ''
  });
  const token = useSelector(state => state.auth.token)
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext,setHasNext] = useState(false)
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNoteForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  async function getNotes(curr){
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/note/my?page=${curr}&limit=10`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      });
      setNotes(response.data.notes);
      setHasNext(response.data.pagination.hasNext)
    } catch (error) {
      const message = error?.response?.data.message || error.message;
      toast.error(message);
      console.log(message);
    }
  }
  // Handle create new note
  const handleCreateClick = () => {
    setEditingNote(null);
    setNoteForm({
      title: '',
      description: ''
    });
    setShowModal(true);
  };

  // Handle edit note
  const handleEditClick = (note) => {
    setEditingNote(note.id);
    setNoteForm({
      title: note.title,
      description: note.description
    });
    setShowModal(true);
  };
  
  // Handle save note (both create and update)
  const handleSaveNote = async(e) => {
    e.preventDefault();
    
    if (editingNote) {
      
    } else {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/note`,noteForm,{
          headers:{
              Authorization:`Bearer ${token}`
          }
        })
        setNotes(prev => [...prev, response.data.note]);
        toast.success('Note created successfully');
        setShowModal(false);
        setEditingNote(null);
        setNoteForm({
          title: '',
          description: ''
        });
      } catch (error) {
          const message = error?.response?.data.message || error.message;
          toast.error(message);
          console.log(message);
      }
    }
    
    setShowModal(false);
    setEditingNote(null);
  };

  // Handle delete note
  const handleDeleteNote = async(id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/note/${id}`,{
          headers:{
              Authorization:`Bearer ${token}`
          }
        });
        toast.success('Note deleted successfully');
         setNotes(prev => prev.filter(note => note._id !== id));
      } catch (error) {
        const message = error?.response?.data?.message || "Error in deleting note";
        toast.error(message);
        console.log(message);
      }
    }

  };

  // Handle cancel edit/create
  const handleCancel = () => {
    setShowModal(false);
    setEditingNote(null);
  };

  function paginate(curr){
    setCurrentPage(curr)
    getNotes(curr)
  }

  useEffect(()=>{
    getNotes(currentPage)
  },[])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
            <p className="text-gray-600 mt-2">Create and manage your personal notes</p>
          </div>
          <button 
            onClick={handleCreateClick}
            className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create New Note
          </button>
        </header>

        {/* Notes Grid */}
        {notes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map(note => (
                <div key={note.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
                  <div className="p-5 flex-grow">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{note.title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{note.description}</p>
                  </div>
                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                       <p className='text-sm font-medium text-gray-600'>{note.createdAt.split('T')[0]}</p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleDeleteNote(note._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete note"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {notes.length > 0 && (
              <div className="flex items-center justify-center mt-8 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
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
                      className={`px-3 py-1 rounded-md ${!hasNext? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </>
        ) :(<></>)}

        {/* Note Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto p-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingNote ? 'Edit Note' : 'Create New Note'}
                </h3>
                <button 
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSaveNote} className="space-y-4 mt-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={noteForm.title}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Note title"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={noteForm.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Note content"
                    required
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {editingNote ? 'Save Changes' : 'Create Note'}
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