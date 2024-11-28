import React from 'react';

const LoadingPopup = ({ isLoading }) => {
  const contDown = async() => {
    await new Promise((resolve) => setTimeout(resolve, 3000)); 
  }
  return (
    isLoading && (
      <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center p-4">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="mt-3">Loading...</h5>
          </div>
        </div>
      </div>
    )
  );
};

export default LoadingPopup;
