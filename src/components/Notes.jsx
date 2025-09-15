import axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function Notes() {
  // Sample notes data
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext,setHasNext] = useState(false)
  // const notes = [
  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    getNotes(pageNumber)
  };
  const token = useSelector(state => state.auth.token);
  
  async function getNotes(curr){
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/note?page=${curr}&limit=10`,{
        headers:{
            Authorization:`Bearer ${token}`
        }
      });
      setNotes(response.data.notes);
      setHasNext(response.data.pagination.hasNext)
      toast.success('Notes fetched successfully');
    } catch (error) {
      const message = error?.response?.data.message || error.message;
      toast.error(message);
      console.log(message);
    }
  }
  useState(()=>{
    getNotes(currentPage)
  },[])
  

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
            <p className="text-gray-600 mt-2">Manage and view all your notes</p>
          </div>
        </header>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length > 0 && notes.map(note => (
            <div key={note._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
              <div className="p-5 flex-grow">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{note.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{note.description}</p>
              </div>
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="ml-2">
                      <p className="text-sm font-medium text-gray-700">{note.createdBy.name}</p>
                      <p className='text-sm font-medium text-gray-600'>{note.createdBy.email}</p>
                      <p className="text-xs text-gray-500">{note.createdAt.split('T')[0]}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Pagination */}
        {notes.length > 0 && (
          <div className="flex items-center justify-between mt-8 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
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
      </div>
    </div>
  );
}