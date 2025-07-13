import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useEffect, useState } from 'react';
import api from '../api/api';

const SidebarLayout = () => {
  const [labels, setLabels] = useState([]);

  const fetchLabels = async () => {
    const res = await api.get('/labels');
    setLabels(res.data);
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  return (
    <div className="flex">
      <Sidebar labels={labels} />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
