import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const styles = {
  card: {
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    borderRadius: '0.5rem',
  },
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
  },
};

const DashboardCard = ({ title, icon, link }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    ...styles.card,
    ...(isHovered ? styles.cardHover : {}),
  };

  const content = (
    <div
      className="card shadow border-0"
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col">
            <span className="h6 font-semibold text-muted text-sm d-block mb-2">
              {title}
            </span>
          </div>
          <div className="col-auto">
            <div className="icon icon-shape text-white text-lg rounded-circle bg-success d-flex align-items-center justify-content-center" id="icon_shape">
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="col-xl-3 col-sm-6 col-12 py-3">
      {link ? <Link to={link}>{content}</Link> : content}
    </div>
  );
};

export default DashboardCard;
