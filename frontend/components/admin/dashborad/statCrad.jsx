import React from 'react';

const StatCard = ({ name, icon: Icon, value, color }) => {
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body bg-secondary-subtle text-light rounded">
        <div className="d-flex align-items-center mb-2">
          <div className={`me-2 fs-4 text-${color}`}><i className={Icon}></i></div>
          <span className="fw-bold text-dark">{name}</span>
        </div>
        <h3 className="fw-semibold text-dark">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
