import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="bg-white/90 backdrop-blur-lg shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side - Text Logo with animation */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight animate-fade-in"
            >
              Gatherly
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Center - Navigation items */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/events" 
              className="text-gray-700 hover:text-primary font-bold px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 relative group text-sm sm:text-base"
            >
              ივენთები
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-primary group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
            </Link>
            
            <Link 
              to="/people" 
              className="text-gray-700 hover:text-primary font-bold px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 relative group text-sm sm:text-base"
            >
              შეხვდარი
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-primary group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
            </Link>
            
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-primary font-bold px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 relative group text-sm sm:text-base"
            >
              გაცნობა
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-primary group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
            </Link>
          </div>

          {/* Right side - Login button with navy blue style */}
          <div className="hidden md:flex items-center">
            <Button 
              asChild
              className="bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold py-1.5 px-4 sm:py-2 sm:px-6 rounded-full shadow-lg hover:from-blue-800 hover:to-blue-950 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              <Link to="/login">
                შესვლა
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div ref={menuRef} className="md:hidden py-4 px-2 space-y-2 absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
            <Link 
              to="/events" 
              className="block text-gray-700 hover:text-primary font-bold px-4 py-2 rounded-lg transition-all duration-300 text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              ივენთები
            </Link>
            
            <Link 
              to="/people" 
              className="block text-gray-700 hover:text-primary font-bold px-4 py-2 rounded-lg transition-all duration-300 text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              შეხვდარი
            </Link>
            
            <Link 
              to="/about" 
              className="block text-gray-700 hover:text-primary font-bold px-4 py-2 rounded-lg transition-all duration-300 text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              გაცნობა
            </Link>
            
            <div className="pt-2 px-4">
              <Button 
                asChild
                className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:from-blue-800 hover:to-blue-950 hover:shadow-xl transition-all duration-300 text-base"
              >
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  შესვლა
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;