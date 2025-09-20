import { useState, useCallback } from 'react';
import { getEventById, type Event } from '@/lib/databaseClient';

interface UseEventModalReturn {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  eventDetails: Event | null;
  openModal: (eventId: string | number) => void;
  closeModal: () => void;
}

export const useEventModal = (): UseEventModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<Event | null>(null);

  const openModal = useCallback(async (eventId: string | number) => {
    setIsOpen(true);
    setIsLoading(true);
    setError(null);

    try {
      const result = await getEventById(String(eventId));
      
      if (result.success && result.data) {
        setEventDetails(result.data);
      } else {
        // Fallback: Create a mock event for testing
        console.warn('Event not found in database, using fallback data');
        setEventDetails({
          id: String(eventId),
          title: 'ტესტ ღონისძიება',
          description: 'ეს არის ტესტ ღონისძიება. გთხოვთ შექმნათ მონაცემთა ბაზის ცხრილები database_schema.sql ფაილიდან.',
          date: new Date().toISOString().split('T')[0],
          time: '19:00',
          location: 'თბილისი',
          category: 'ტესტი',
          created_by: 'test-user',
          image_url: '',
          max_participants: 50
        });
      }
    } catch (err) {
      console.error('Error fetching event:', err);
      setError(err instanceof Error ? err.message : 'უცნობი შეცდომა');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEventDetails(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    isOpen,
    isLoading,
    error,
    eventDetails,
    openModal,
    closeModal
  };
};
