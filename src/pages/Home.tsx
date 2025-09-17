import React from "react";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import EventDetailsModal from "@/components/EventDetailsModal";
import { useEventModal } from "@/hooks/useEventModal";
import backgroundImage from "@/assets/geometric-background.jpg";
import theMainImage from "@/assets/EventsPage.png";

const Home = () => {
  const { isOpen, isLoading, error, eventDetails, openModal, closeModal } = useEventModal();

  const events = [
    {
      id: 1,
      title: "შეხვედრა",
      date: "20 აპრილი",
      time: "10:00 საათი",
      image: {
        src: backgroundImage,
        alt: "შეხვედრა"
      },
      type: "networking" as const,
      location: "თბილისი",
      ctaText: "იხილეთ დეტალები"
    },
    {
      id: 2,
      title: "კონცერტი",
      date: "4 მაისი",
      time: "20:00 საათი",
      image: {
        src: backgroundImage,
        alt: "კონცერტი"
      },
      type: "concert" as const,
      location: "თბილისი",
      ctaText: "იხილეთ დეტალები"
    },
    {
      id: 3,
      title: "წიგნების საღამოების დღე",
      date: "24 აპრილი",
      time: "19:00 საათი",
      image: {
        src: backgroundImage,
        alt: "წიგნების საღამოების დღე"
      },
      type: "workshop" as const,
      location: "თბილისი",
      ctaText: "იხილეთ დეტალები"
    },
    {
      id: 4,
      title: "ფერების ფესტივალი",
      date: "18 აპრილი",
      time: "14:00 საათი",
      image: {
        src: backgroundImage,
        alt: "ფერების ფესტივალი"
      },
      type: "festival" as const,
      location: "თბილისი",
      ctaText: "იხილეთ დეტალები"
    },
    {
      id: 5,
      title: "შეხვედრა",
      date: "30 მაისი",
      time: "11:00 საათი",
      image: {
        src: backgroundImage,
        alt: "შეხვედრა"
      },
      type: "networking" as const,
      location: "თბილისი",
      ctaText: "იხილეთ დეტალები"
    },
    {
      id: 6,
      title: "შეხვედრა",
      date: "29 აპრილი",
      time: "12:00 საათი",
      image: {
        src: backgroundImage,
        alt: "შეხვედრა"
      },
      type: "networking" as const,
      location: "თბილისი",
      ctaText: "იხილეთ დეტალები"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        className="mt-10 mx-4 sm:mx-6 md:mx-10 relative bg-cover rounded-xl bg-center h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center"
        style={{
          backgroundImage: `url(${theMainImage})`,
          borderRadius: "20px",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r rounded-[20px] from-black/80 via-black/60 to-black/40"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 drop-shadow-lg">აღმოაჩინე ახალი ღონისძიებები</h1>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 drop-shadow-md">შეხვდი ახალ ადამიანებს და იპოვე სასურველი ღონისძიება</p>
        </div>
      </div>

      {/* Search Bar - Moved below the hero image */}
      <div className="mx-4 sm:mx-6 md:mx-10 -mt-16 sm:-mt-20 relative z-20">
        <div className="bg-blue-600 rounded-2xl shadow-xl p-4 sm:p-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 items-end">
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                როდის?
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-white border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                კატეგორია?
              </label>
              <select
                name="category"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-white border-0 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base"
              >
                <option value="">აირჩიეთ კატეგორია</option>
                <option value="გასართობი">გასართობი</option>
                <option value="საგანმანათლებლო">საგანმანათლებლო</option>
                <option value="სოციალური">სოციალური</option>
                <option value="სპორტი">სპორტი</option>
                <option value="მოხალისეობრივი">მოხალისეობრივი</option>
              </select>
            </div>
            <div>
              <button 
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 text-sm sm:text-base"
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>ძიება</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Cards */}
      <div className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            მომავალი ღონისძიებები
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                image={event.image}
                type={event.type}
                location={event.location}
                ctaText={event.ctaText}
                onClick={() => openModal(event.id)}
              />
            ))}
          </div>
        </div>
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

export default Home;