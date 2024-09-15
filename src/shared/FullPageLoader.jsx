import React from 'react';

const FullPageLoader = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 vw-100 position-fixed top-0 start-0"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 9999 }}
    >
      <div className="spinner-border text-light" role="status" style={{ width: '3rem', height: '3rem', borderWidth: '0.4rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default FullPageLoader;