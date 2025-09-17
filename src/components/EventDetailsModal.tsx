import React, { useEffect, useRef } from 'react';
import { X, Clock, Users, Calendar, MapPin } from 'lucide-react';

interface EventDetails {
  id: string | number;
  title: string;
  description: string;
  heroImage: {
    src: string;
    alt: string;
    highRes?: boolean;
  };
  duration: {
    hours: number;
    minutes: number;
    formatted: string;
  };
  ageGroup: {
    min: number;
    max: number;
    formatted: string;
  };
  datetime: {
    date: string;
    time: string;
    timezone?: string;
    timestamp?: number;
  };
  location: {
    venue?: string;
    address: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
}

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventDetails: EventDetails | null;
  isLoading?: boolean;
  error?: string | null;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onClose,
  eventDetails,
  isLoading = false,
  error = null
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
      
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
      
      // Return focus to trigger element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape') {
        onClose();
      }

      // Focus trap
      if (event.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleShare = () => {
    if (navigator.share && eventDetails) {
      navigator.share({
        title: eventDetails.title,
        text: eventDetails.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleRegister = () => {
    // Implement registration logic
    console.log('Registration clicked for event:', eventDetails?.id);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 200ms ease-out'
      }}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="event-modal bg-white rounded-2xl max-w-[700px] w-full max-h-[90vh] overflow-hidden relative"
        style={{
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'slideIn 250ms cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          className="modal-close-btn absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white border-0 cursor-pointer z-10 flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
          onClick={onClose}
          aria-label="დახურვა"
        >
          <X size={20} color="#666666" />
        </button>

        {/* Modal Content */}
        <div className="modal-content h-full overflow-auto" style={{ scrollbarWidth: 'thin' }}>
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-lg text-gray-600">იტვირთება...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-lg text-red-600">შეცდომა: {error}</div>
            </div>
          ) : eventDetails ? (
            <>
              {/* Hero Section */}
              <div className="modal-hero relative h-[300px] overflow-hidden">
                <img
                  src={eventDetails.heroImage.src}
                  alt={eventDetails.heroImage.alt}
                  className="modal-hero-image w-full h-full object-cover"
                />
                <div 
                  className="absolute bottom-0 left-0 right-0 h-[120px]"
                  style={{ background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))' }}
                />
                <h2 
                  id="modal-title"
                  className="modal-event-title absolute bottom-6 left-6 right-6 text-white text-[28px] font-bold m-0"
                  style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}
                >
                  {eventDetails.title}
                </h2>
              </div>

              {/* Details Section */}
              <div className="modal-details p-8 flex flex-col gap-6">
                {/* Description */}
                <div className="event-description-section">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    ღონისძიების აღწერა
                  </h3>
                  <p className="event-description text-base leading-relaxed text-gray-700 m-0">
                    {eventDetails.description}
                  </p>
                </div>

                {/* Meta Information Grid */}
                <div className="event-meta-grid grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                  {/* Duration */}
                  <div className="meta-item duration flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <Clock size={20} color="#4285f4" className="mt-1 flex-shrink-0" />
                    <div>
                      <span className="block text-sm font-medium text-gray-600 mb-1">
                        ხანგრძლივობა
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        {eventDetails.duration.formatted}
                      </span>
                    </div>
                  </div>

                  {/* Age Group */}
                  <div className="meta-item age-group flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <Users size={20} color="#4285f4" className="mt-1 flex-shrink-0" />
                    <div>
                      <span className="block text-sm font-medium text-gray-600 mb-1">
                        ასაკი
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        {eventDetails.ageGroup.formatted}
                      </span>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="meta-item datetime flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <Calendar size={20} color="#4285f4" className="mt-1 flex-shrink-0" />
                    <div>
                      <span className="block text-sm font-medium text-gray-600 mb-1">
                        თარიღი და დრო
                      </span>
                      <span className="text-base font-semibold text-gray-900">
                        {eventDetails.datetime.date}, {eventDetails.datetime.time}
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="meta-item location flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <MapPin size={20} color="#4285f4" className="mt-1 flex-shrink-0" />
                    <div>
                      <span className="block text-sm font-medium text-gray-600 mb-1">
                        ზუსტი მისამართი
                      </span>
                      <address className="text-base font-semibold text-gray-900 not-italic">
                        {eventDetails.location.address}
                      </address>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: scale(0.9) translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }

        @media (max-width: 768px) {
          .event-modal {
            max-width: 95vw !important;
            max-height: 95vh !important;
          }
          
          .modal-hero {
            height: 200px !important;
          }
          
          .modal-details {
            padding: 20px !important;
          }
          
          .event-meta-grid {
            grid-template-columns: 1fr !important;
          }
          
          .modal-event-title {
            font-size: 24px !important;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .event-modal {
            max-width: 600px !important;
          }
          
          .modal-hero {
            height: 250px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EventDetailsModal;
