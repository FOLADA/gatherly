import React from 'react';

interface EventCardProps {
  id: string | number;
  title: string;
  date: string;
  time: string;
  image: {
    src: string;
    alt: string;
  };
  type?: 'conference' | 'festival' | 'concert' | 'workshop' | 'networking' | 'presentation';
  location?: string;
  ctaText?: string;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  time,
  image,
  type = 'conference',
  location,
  ctaText = 'იხილეთ დეტალები',
  onClick
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className="event-card group cursor-pointer"
      onClick={handleCardClick}
      style={{
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Image Section */}
      <div 
        className="card-image-container"
        style={{
          position: 'relative',
          width: '100%',
          height: '200px',
          overflow: 'hidden'
        }}
      >
        <img
          src={image.src}
          alt={image.alt}
          className="event-image group-hover:scale-105"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
        />
      </div>

      {/* Content Section */}
      <div 
        className="card-content"
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {/* Title */}
        <h3 
          className="event-title"
          style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1a1a1a',
            margin: '0',
            lineHeight: '1.4',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          {title}
        </h3>

        {/* Metadata */}
        <div 
          className="event-meta"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#666666'
          }}
        >
          <span 
            className="date-info"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {/* Calendar Icon */}
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: '#666666' }}
            >
              <path 
                d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeMiterlimit="10" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            {date}, {time}
          </span>
          {location && (
            <>
              <span>•</span>
              <span>{location}</span>
            </>
          )}
        </div>

        {/* Action Button */}
        <button
          className="event-cta-button"
          onClick={handleButtonClick}
          style={{
            backgroundColor: '#4285f4',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease, transform 0.1s ease',
            width: '100%',
            marginTop: 'auto'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3367d6';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4285f4';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
        >
          {ctaText}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
