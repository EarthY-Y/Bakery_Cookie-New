import React, { useState, useEffect } from "react";

export const AlertWithProgressBar = ({ message, duration, onClose, status }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - (100 / (duration / 100)), 0));
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (onClose) onClose();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration, onClose]);

  return (
    <div className={`alert ${status} d-flex align-items-center fade show position-fixed bottom-0 end-0 m-3`} role="alert" style={{ width: "300px", transition: 'opacity 0.5s ease' }}>
      <i className={`bi bi-${progress === 100 ? 'check-circle-fill' : 'info-circle-fill'} me-2`} style={{ fontSize: '20px', color:'#FFF'}}></i>
      <div className="text-white">{message}</div>
      {progress === 100 && (
        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
      )}
    </div>
  );
};
