import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, Settings, BarChart3, Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("წარმატებით გახვედით სისტემიდან");
      navigate("/");
    } catch (error) {
      toast.error("შეცდომა გასვლისას");
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isMenuOpen || isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isUserMenuOpen]);

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
              გაცნობა
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-primary group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
            </Link>

            {user && (
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-primary font-bold px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 relative group text-sm sm:text-base"
              >
                პანელი
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-primary group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
              </Link>
            )}
          </div>

          {/* Right side - Auth buttons / User menu */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary transition-colors p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {(user.user_metadata?.name || user.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="font-georgian">
                    {user.user_metadata?.name || user.email?.split('@')[0]}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-georgian"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      პროფილის რედაქტირება
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-georgian"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      მართვის პანელი
                    </Link>
                    <Link
                      to="/favorites"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-georgian"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      ფავორიტები
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-georgian"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      გასვლა
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                asChild
                className="bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold py-1.5 px-4 sm:py-2 sm:px-6 rounded-full shadow-lg hover:from-blue-800 hover:to-blue-950 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <Link to="/login">
                  შესვლა
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div ref={menuRef} className="md:hidden py-4 px-2 space-y-2 absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
            <Link 
              to="/events" 
              className="block text-gray-700 hover:text-primary font-bold px-4 py-2 rounded-lg transition-all duration-300 text-base font-georgian"
              onClick={() => setIsMenuOpen(false)}
            >
              ივენთები
            </Link>
            
            <Link 
              to="/people" 
              className="block text-gray-700 hover:text-primary font-bold px-4 py-2 rounded-lg transition-all duration-300 text-base font-georgian"
              onClick={() => setIsMenuOpen(false)}
            >
              გაცნობა
            </Link>

            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className="block text-gray-700 hover:text-primary font-bold px-4 py-2 rounded-lg transition-all duration-300 text-base font-georgian"
                  onClick={() => setIsMenuOpen(false)}
                >
                  პანელი
                </Link>
                
                <Link 
                  to="/profile" 
                  className="block text-gray-700 hover:text-primary font-bold px-4 py-2 rounded-lg transition-all duration-300 text-base font-georgian"
                  onClick={() => setIsMenuOpen(false)}
                >
                  პროფილი
                </Link>
                
                <Link 
                  to="/favorites" 
                  className="block text-gray-700 hover:text-primary font-bold px-4 py-2 rounded-lg transition-all duration-300 text-base font-georgian"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ფავორიტები
                </Link>
              </>
            )}
            
            <div className="pt-2 px-4 border-t border-gray-200 mt-2">
              {user ? (
                <>
                  <div className="text-sm text-gray-600 font-georgian mb-2 px-2">
                    გამარჯობა, {user.user_metadata?.name || user.email?.split('@')[0]}
                  </div>
                  <Button 
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>გასვლა</span>
                  </Button>
                </>
              ) : (
                <Button 
                  asChild
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:from-blue-800 hover:to-blue-950 hover:shadow-xl transition-all duration-300 text-base"
                >
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    შესვლა
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;