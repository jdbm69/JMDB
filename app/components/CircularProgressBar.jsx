import { raleway } from '@/public/fonts';
import { useEffect, useState } from 'react';

const CircularProgressBar = ({ progress }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const strokeWidth = isMobile ? 2 : 4;
  const radius = isMobile ? 18 : 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference + (progress / 100) * circumference;

  return (
    <div className="circular-progress-bar" width={isMobile ? 40 : 60} height={isMobile ? 40 : 60}>
      <svg className="progress-ring" width={isMobile ? 40 : 60} height={isMobile ? 40 : 60}>
        <circle
          className="progress-ring-circle"
          stroke="rgba(99, 99, 99, 0.46)"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={isMobile ? 20 : 30}
          cy={isMobile ? 20 : 30}
        />
        <circle
          className="progress-ring-bar"
          stroke="rgb(220, 0, 0)"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={isMobile ? 20 : 30}
          cy={isMobile ? 20 : 30}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transform: 'rotate(-90deg)',
            transformOrigin: 'center', 
          }}
        />
        <text
          className="progress-text"
          x={isMobile ? "50%" : "53%"}
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill='white'
        >
          <tspan className={raleway.className}>{progress === 0 ? 'NR' : Number.isInteger(progress) ? progress : Math.ceil(progress)}</tspan>
          <tspan className={raleway.className} dy="-6" fontSize={isMobile ? "8" : "10"}>{progress === 0 ? '' : `%`}</tspan>
        </text>
      </svg>
    </div>
  );
};

export default CircularProgressBar;
