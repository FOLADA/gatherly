import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import Home from "./Home";

const Events = () => {
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if we came from the add event page
  useEffect(() => {
    if (location.state?.fromAddEvent) {
      setShowSuccess(true);
      // Hide the success message after 3 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="relative">
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

      {/* Add Event Button */}
      <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8">
        <Button 
          asChild 
          variant="gatherly" 
          className="rounded-full w-14 h-14 sm:w-16 sm:h-16 p-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          <Link to="/add-event">
            <Plus className="h-6 w-6 sm:h-7 sm:w-7" />
            <span className="sr-only">დაამატე ივენთი</span>
          </Link>
        </Button>
      </div>
      
      <Home />
    </div>
  );
};

export default Events;