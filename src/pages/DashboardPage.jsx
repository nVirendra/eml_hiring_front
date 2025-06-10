import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardStats from './DashboardStats';
import { API_BASE_URL } from '../utils/constants';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/dashboard/stats`).then((res) => {
      if (res.data.success) setStats(res.data.data);
    });
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
