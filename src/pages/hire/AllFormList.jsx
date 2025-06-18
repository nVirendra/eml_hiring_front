import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit3, Eye, Copy, Trash2, Loader2, AlertCircle, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const FormsListPage = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();


  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch forms data
  const fetchForms = async (page = 1, filters = {}) => {
    try {
      setLoading(page === 1);
      setError(null);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...filters
      });

      if (searchTerm) queryParams.append('search', searchTerm);
      if (statusFilter !== 'all') queryParams.append('isActive', statusFilter === 'active');
      if (difficultyFilter !== 'all') queryParams.append('difficulty', difficultyFilter);

      const response = await fetch(`${API_BASE_URL}/forms?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setForms(result.data || []);
        setPagination(result.pagination || {});
      } else {
        throw new Error(result.message || 'Failed to fetch forms');
      }
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError(err.message);
      
      // Fallback to mock data for demonstration
      if (err.message.includes('fetch')) {
        loadMockData();
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  

  // Handle status toggle
  const toggleFormStatus = async (formId, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/forms/${formId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update form status');
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setForms(prev => prev.map(form => 
          form._id === formId 
            ? { ...form, isActive: !currentStatus }
            : form
        ));
      }
    } catch (err) {
      console.error('Error updating form status:', err);
      // For demo, update locally
      setForms(prev => prev.map(form => 
        form._id === formId 
          ? { ...form, isActive: !currentStatus }
          : form
      ));
    }
  };

  // Handle search and filters
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setCurrentPage(1);
      fetchForms(1);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, statusFilter, difficultyFilter]);

  // Initial load
  useEffect(() => {
    fetchForms();
  }, []);

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchForms(page);
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchForms(currentPage);
  };

  // Filter forms for display
  const filteredForms = forms.filter(form => {
    const matchesSearch = form.technology.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && form.isActive) ||
      (statusFilter === 'inactive' && !form.isActive);
    const matchesDifficulty = difficultyFilter === 'all' || form.difficulty === difficultyFilter;
    
    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading evaluation forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">All Evaluation Forms</h1>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
             
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-yellow-800 font-medium">Notice</h3>
              <p className="text-yellow-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

       

        {/* Forms Grid */}
        {filteredForms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or create a new form.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <div key={form._id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{form.technology}</h3>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleFormStatus(form._id, form.isActive)}
                          className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            form.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } transition-colors cursor-pointer`}
                        >
                          {form.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </button>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          form.difficulty === 'beginner' ? 'bg-blue-100 text-blue-800' :
                          form.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {form.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Questions:</span>
                      <span className="ml-1">{form.questions?.length || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium">Max Score:</span>
                      <span className="ml-1">{form.maxScore || 0}</span>
                    </div>
                    <div>
                      <span className="font-medium">Created by:</span>
                      <span className="ml-1 capitalize">{form.createdBy}</span>
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span>
                      <span className="ml-1">{new Date(form.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-4 border-t border-gray-100">
                    <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                    onClick={() => navigate(`/hire/forms/edit/${form._id}`)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
                    >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                    </button>

                    <button className="flex items-center justify-center px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        
      </div>
    </div>
  );
};

export default FormsListPage;