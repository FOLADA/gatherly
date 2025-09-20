import React, { useEffect, useRef, useState } from 'react';
import { X, Clock, Users, Calendar, MapPin, UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { joinEvent, leaveEvent, isUserJoinedEvent, getEventParticipants, type Event } from "@/lib/databaseClient";
import { toast } from "sonner";
import backgroundImage from "@/assets/geometric-background.jpg";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventDetails: Event | null;
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
  const { user } = useAuth();
  const [isJoined, setIsJoined] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [joinLoading, setJoinLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
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

  // Check if user has joined the event and get participant count
  useEffect(() => {
    if (eventDetails && user) {
      const checkJoinStatus = async () => {
        const joinResult = await isUserJoinedEvent(eventDetails.id, user.id);
        if (joinResult.success) {
          setIsJoined(joinResult.isJoined || false);
        }

        const participantsResult = await getEventParticipants(eventDetails.id);
        if (participantsResult.success && participantsResult.data) {
          setParticipantCount(participantsResult.data.length);
        }
      };

      checkJoinStatus();
    }
  }, [eventDetails, user]);

  const handleJoinLeave = async () => {
    if (!eventDetails || !user) return;

    setJoinLoading(true);
    try {
      if (isJoined) {
        const result = await leaveEvent(eventDetails.id, user.id);
        if (result.success) {
          setIsJoined(false);
          setParticipantCount(prev => prev - 1);
          toast.success("წარმატებით გამოხვედით ღონისძიებიდან");
        } else {
          toast.error(result.error || "შეცდომა ღონისძიებიდან გამოსვლისას");
        }
      } else {
        const result = await joinEvent(eventDetails.id, user.id);
        if (result.success) {
          setIsJoined(true);
          setParticipantCount(prev => prev + 1);
          toast.success("წარმატებით შეუერთდით ღონისძიებას!");
        } else {
          toast.error(result.error || "შეცდომა ღონისძიებაში შეერთებისას");
        }
      }
    } catch (error) {
      console.error("Error joining/leaving event:", error);
      toast.error("მოულოდნელი შეცდომა მოხდა");
    } finally {
      setJoinLoading(false);
    }
  };

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative shadow-2xl"
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white border-0 cursor-pointer z-10 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
          onClick={onClose}
          aria-label="დახურვა"
        >
          <X size={20} className="text-gray-600" />
        </button>

        {/* Modal Content */}
        <div className="h-full overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg text-gray-600 font-georgian">იტვირთება...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-lg text-red-600 font-georgian">შეცდომა: {error}</div>
            </div>
          ) : eventDetails ? (
            <>
              {/* Hero Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={eventDetails.image_url || backgroundImage}
                  alt={eventDetails.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="bg-primary px-3 py-1 rounded-full text-sm font-georgian">
                    {eventDetails.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <h2 id="modal-title" className="text-2xl font-bold text-gray-900 mb-4 font-georgian">
                  {eventDetails.title}
                </h2>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Date & Time */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-georgian">თარიღი და დრო</div>
                      <div className="text-sm font-semibold text-gray-900 font-georgian">
                        {new Date(eventDetails.date).toLocaleDateString('ka-GE')} • {eventDetails.time}
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin size={16} className="text-orange-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-georgian">მდებარეობა</div>
                      <div className="text-sm font-semibold text-gray-900 font-georgian">
                        {eventDetails.location}
                      </div>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users size={16} className="text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-georgian">მონაწილეები</div>
                      <div className="text-sm font-semibold text-gray-900 font-georgian">
                        {participantCount} {eventDetails.max_participants ? `/ ${eventDetails.max_participants}` : ''}
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Clock size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-georgian">ხანგრძლივობა</div>
                      <div className="text-sm font-semibold text-gray-900 font-georgian">
                        2-3 საათი
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {eventDetails.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 font-georgian">აღწერა</h3>
                    <div className="text-gray-700 leading-relaxed font-georgian">
                      {eventDetails.description}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {user ? (
                  <div className="flex gap-3">
                    <Button
                      onClick={handleJoinLeave}
                      disabled={joinLoading}
                      className={`flex-1 py-3 font-georgian ${
                        isJoined 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-primary hover:bg-primary-dark'
                      }`}
                    >
                      {joinLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : isJoined ? (
                        <UserMinus className="h-4 w-4 mr-2" />
                      ) : (
                        <UserPlus className="h-4 w-4 mr-2" />
                      )}
                      {isJoined ? 'გამოსვლა' : 'შეერთება'}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 font-georgian mb-3">
                      ღონისძიებაში მონაწილეობისთვის გთხოვთ შედით სისტემაში
                    </p>
                    <Button asChild variant="gatherly" className="font-georgian">
                      <a href="/login">შესვლა</a>
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-lg text-gray-600 font-georgian">ღონისძიება ვერ მოიძებნა</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
