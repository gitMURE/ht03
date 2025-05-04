import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../../styles/Dashboard.css';

const Dashboard = ({ user }) => {
  return (
    <div className="dashboard-container">
      <Sidebar userRole={user?.rol} />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Bienvenido, {user?.nombre_usuario}</h2>
        </div>
        <div className="dashboard-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;