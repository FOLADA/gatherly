import React from "react";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import EventDetailsModal from "@/components/EventDetailsModal";
import { useEventModal } from "@/hooks/useEventModal";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import backgroundImage from "@/assets/geometric-background.jpg";
import theMainImage from "@/assets/EventsPage.png";
import { getEvents, type Event } from "@/lib/databaseClient";
import { toast } from "sonner";

const Events = () => {
  const { isOpen, isLoading, error, eventDetails, openModal, closeModal } = useEventModal();
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Check if we came from add event page or onboarding
  useEffect(() => {
    if (location.state?.fromAddEvent) {
      setShowSuccess(true);
      // Hide the success message after 3 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
    
    if (location.state?.fromOnboarding) {
      setShowWelcome(true);
      // Hide the welcome message after 5 seconds
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  // Fetch events from database
  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true);
      try {
        const result = await getEvents();
        if (result.success && result.data) {
          setEvents(result.data);
        } else {
          toast.error(result.error || "შეცდომა ივენთების ჩატვირთვისას");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("მოულოდნელი შეცდომა მოხდა");
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search and filters
  useEffect(() => {
    let filtered = events;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Date filter
    if (selectedDate) {
      filtered = filtered.filter(event => event.date === selectedDate);
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, selectedCategory, selectedDate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            ივენთი წარმატებით დაემატა!
          </div>
        </div>
      )}

      {/* Welcome Message from Onboarding */}
      {showWelcome && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in max-w-md">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-xl">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold font-georgian">კეთილი იყოს თქვენი მობრძანება!</h3>
                <p className="text-xs mt-1 font-georgian opacity-90">
                  {location.state?.welcomeMessage || 'თქვენი პროფილი წარმატებით შეიქმნა!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div
        className="mt-6 sm:mt-8 lg:mt-10 mx-4 sm:mx-6 lg:mx-10 relative bg-cover rounded-responsive bg-center h-[300px] xs:h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center safe-area-padding"
        style={{
          backgroundImage: `url(${theMainImage})`,
          borderRadius: "16px",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r rounded-responsive from-black/80 via-black/60 to-black/40"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-responsive max-w-4xl mx-auto">
          <h1 className="font-georgian text-responsive-3xl font-bold mb-4 sm:mb-6 drop-shadow-lg leading-tight">აღმოაჩინე ახალი ღონისძიებები</h1>
          <p className="font-georgian text-responsive-lg mb-6 sm:mb-8 drop-shadow-md leading-relaxed max-w-2xl mx-auto">შეხვდი ახალ ადამიანებს და იპოვე სასურველი ღონისძიება</p>
        </div>
      </div>

      {/* Enhanced Search Bar */}
      <div className="mx-4 sm:mx-6 lg:mx-10 -mt-12 sm:-mt-16 lg:-mt-20 relative z-20 safe-area-padding">
        <div className="bg-blue-600 rounded-responsive shadow-xl p-responsive max-w-6xl mx-auto">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
            {/* Search Input */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2 font-georgian">
                ძიება
              </label>
              <input
                type="text"
                placeholder="ღონისძიების სახელი..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-3 sm:px-4 sm:py-3 rounded-lg bg-white border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 text-responsive-sm font-georgian touch-target"
              />
            </div>
            
            {/* Date Filter */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2 font-georgian">
                როდის?
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-3 sm:px-4 sm:py-3 rounded-lg bg-white border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 text-responsive-sm touch-target"
              />
            </div>
            
            {/* Category Filter */}
            <div>
              <label className="block text-white text-sm font-semibold mb-2 font-georgian">
                კატეგორია
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-3 sm:px-4 sm:py-3 rounded-lg bg-white border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 text-responsive-sm font-georgian touch-target"
              >
                <option value="">ყველა კატეგორია</option>
                <option value="გასართობი">გასართობი</option>
                <option value="საგანმანათლებლო">საგანმანათლებლო</option>
                <option value="სოციალური">სოციალური</option>
                <option value="სპორტი">სპორტი</option>
                <option value="მოხალისეობრივი">მოხალისეობრივი</option>
                <option value="სხვა">სხვა</option>
              </select>
            </div>
            
            {/* Clear Filters Button */}
            <div className="xs:col-span-2 lg:col-span-1">
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedDate('');
                }}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 sm:py-3 px-4 sm:px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 text-responsive-sm font-georgian touch-target"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>გაწმენდა</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Cards */}
      <div className="py-responsive px-responsive bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-6 sm:mb-8 gap-2">
            <h2 className="text-responsive-xl font-bold text-gray-900 font-georgian">
              მომავალი ღონისძიებები
            </h2>
            <div className="text-responsive-xs text-gray-600 font-georgian">
              {eventsLoading ? (
                'იტვირთება...'
              ) : (
                `${filteredEvents.length} ღონისძიება${events.length !== filteredEvents.length ? ` (${events.length}-დან)` : ''}`
              )}
            </div>
          </div>
          <div className="grid grid-responsive-1-2-3 gap-responsive">
            {eventsLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={new Date(event.date).toLocaleDateString('ka-GE')}
                  time={event.time}
                  image={{
                    src: event.image_url || backgroundImage,
                    alt: event.title
                  }}
                  type={event.category as any}
                  location={event.location}
                  ctaText="იხილეთ დეტალები"
                  onClick={() => openModal(event.id)}
                />
              ))
            ) : (
              // Empty state
              <div className="col-span-full text-center py-12">
                {events.length === 0 ? (
                  // No events at all
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h6" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg font-georgian mb-4">
                      ჯერ არ არის ღონისძიებები
                    </p>
                    <p className="text-gray-400 font-georgian mb-6">
                      იყავით პირველი ვინც შექმნის ღონისძიებას!
                    </p>
                    <Button asChild variant="gatherly" className="font-georgian">
                      <Link to="/add-event">ღონისძიების შექმნა</Link>
                    </Button>
                  </>
                ) : (
                  // No filtered results
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg font-georgian mb-4">
                      ღონისძიებები ვერ მოიძებნა
                    </p>
                    <p className="text-gray-400 font-georgian mb-6">
                      სცადეთ სხვა საძიებო კრიტერიუმები
                    </p>
                    <Button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('');
                        setSelectedDate('');
                      }}
                      variant="outline" 
                      className="font-georgian"
                    >
                      ფილტრების გაწმენდა
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Event Button */}
      <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 safe-area-padding">
        <Button 
          asChild 
          variant="gatherly" 
          className="rounded-full w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 p-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 touch-target"
        >
          <Link to="/add-event">
            <Plus className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
            <span className="sr-only">დაამატე ივენთი</span>
          </Link>
        </Button>
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={isOpen}
        onClose={closeModal}
        eventDetails={eventDetails}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
};

export default Events;