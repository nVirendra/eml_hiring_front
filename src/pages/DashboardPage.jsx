import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardStats from './DashboardStats';
import { API_BASE_URL } from '../utils/constants';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [selectedTech, setSelectedTech] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5); // default page size

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1); // reset to first page when limit changes
  };


  const fetchStats = async (tech='') => {
      try {
        const res = await axios.get(`${API_BASE_URL}/dashboard/stats`,{
                   params: { tech, page, limit },
        });
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

  useEffect(() => {
    fetchStats(selectedTech,page,limit);
  }, [selectedTech,page,limit]);

  const handleTechClick = (techId) => {
    setPage(1); // reset page on tech change
    setSelectedTech((prev) => (prev === techId ? '' : techId)); // Toggle filter
  };


  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8 bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-indigo-700">📊 Dashboard Overview</h1>
        {stats ? <DashboardStats stats={stats} onTechClick={handleTechClick} selectedTech={selectedTech} page={page}
    setPage={setPage}
    limit={limit} onLimitChange={handleLimitChange}/> : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default DashboardPage;
