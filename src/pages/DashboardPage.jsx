import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardStats from './DashboardStats';
import { API_BASE_URL } from '../utils/constants';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/dashboard/stats`);
        if (res.data.success) {
          setStats(res.data.data);
          console.log('res.data:',res.data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8 bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-indigo-700">📊 Dashboard Overview</h1>
        {stats ? <DashboardStats stats={stats} /> : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default DashboardPage;
