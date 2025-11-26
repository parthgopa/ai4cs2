import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 80, 
  message = "Loading...", 
  subMessage = "Please wait while we fetch your data",
  showDots = true 
}) => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner-wrapper">
        {/* Main animated SVG spinner */}
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          className="loading-spinner-svg"
        >
          {/* Outer ring */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--primary-color)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="283"
            strokeDashoffset="283"
            className="spinner-ring outer-ring"
          />
          
          {/* Middle ring */}
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="var(--secondary-color)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="220"
            strokeDashoffset="220"
            className="spinner-ring middle-ring"
          />
          
          {/* Inner ring */}
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke="var(--accent-color)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="157"
            strokeDashoffset="157"
            className="spinner-ring inner-ring"
          />
          
          {/* Center pulsing dot */}
          <circle
            cx="50"
            cy="50"
            r="8"
            fill="var(--primary-color)"
            className="spinner-center-dot"
          />
          
          {/* Rotating dots around center */}
          <g className="rotating-dots">
            <circle cx="50" cy="20" r="3" fill="var(--secondary-color)" opacity="0.8" />
            <circle cx="80" cy="50" r="3" fill="var(--secondary-color)" opacity="0.6" />
            <circle cx="50" cy="80" r="3" fill="var(--secondary-color)" opacity="0.4" />
            <circle cx="20" cy="50" r="3" fill="var(--secondary-color)" opacity="0.2" />
          </g>
        </svg>
        
        {/* Loading text */}
        <div className="loading-text-container">
          <h5 className="loading-message">{message}</h5>
          <p className="loading-sub-message">{subMessage}</p>
          
          {/* Animated dots */}
          {showDots && (
            <div className="loading-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
