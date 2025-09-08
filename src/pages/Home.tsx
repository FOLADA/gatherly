import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import backgroundImage from "@/assets/geometric-background.jpg";
import theMainImage from "@/assets/EventsPage.png";

const Home = () => {
  const [favorites, setFavorites] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const events = [
    {
      id: 1,
      title: "შეხვედრა",
      details: "20 აპრილი, 10:00 საათი",
      subtitle: "დეტალები",
      image: backgroundImage,
    },
    {
      id: 2,
      title: "კონცერტი",
      details: "4 მაისი, 20:00 საათი",
      subtitle: "დეტალები",
      image: backgroundImage,
    },
    {
      id: 3,
      title: "წიგნების საღამოების დღე",
      details: "24 აპრილი, 19:00 საათი",
      subtitle: "დეტალები",
      image: backgroundImage,
    },
    {
      id: 4,
      title: "ფერების ფესტივალი",
      details: "18 აპრილი, 14:00 საათი",
      subtitle: "დეტალები",
      image: backgroundImage,
    },
    {
      id: 5,
      title: "შეხვედრა",
      details: "30 მაისი, 11:00 საათი",
      subtitle: "დეტალები",
      image: backgroundImage,
    },
    {
      id: 6,
      title: "შეხვედრა",
      details: "29 აპრილი, 12:00 საათი",
      subtitle: "დეტალები",
      image: backgroundImage,
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
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 items-end">
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                როდის?
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                კატეგორია?
              </label>
              <select
                name="category"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base"
              >
                <option value="გასართობი">გასართობი</option>
                <option value="საგანმანათლებლო">საგანმანათლებლო</option>
                <option value="სოციალური">სოციალური</option>
                <option value="სპორტი">სპორტი</option>
                <option value="მოხალისეობრივი">მოხალისეობრივი</option>
              </select>
            </div>
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                ადგილი?
              </label>
              <input
                type="text"
                placeholder="ქალაქი"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm sm:text-base"
              />
            </div>
            <div>
              <Button variant="gatherly" className="w-full font-bold py-2 sm:py-3 px-4 rounded-lg flex items-center justify-center text-sm sm:text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                ძიება
              </Button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 md:gap-24">
            {events.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden rounded-3xl shadow-lg bg-white"
              >
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 sm:h-64 md:h-80 object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(event.id)}
                    className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 sm:p-3 rounded-full bg-white/90 backdrop-blur"
                  >
                    {favorites[event.id] ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 sm:h-7 sm:w-7 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 sm:h-7 sm:w-7 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-base sm:text-lg mb-2">{event.details}</p>
                  <p className="text-gray-500 cursor-pointer underline text-base sm:text-lg mt-3 sm:mt-4">
                    {event.subtitle}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;