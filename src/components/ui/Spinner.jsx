import React from 'react';

const Spinner = ({ size = 48, overlay = false }) => (
  <div
    className={
      overlay
        ? 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30'
        : 'flex items-center justify-center'
    }
    style={overlay ? { minHeight: '100vh' } : {}}
  >
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-20"
        cx="25"
        cy="25"
        r="20"
        stroke="#6366f1"
        strokeWidth="6"
      />
      <path
        className="opacity-80"
        d="M45 25c0-11.046-8.954-20-20-20"
        stroke="#6366f1"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export default Spinner;
