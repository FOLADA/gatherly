import { Link } from "react-router-dom";
import { Facebook, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t-3 border-t-[#4285f4] py-3 sm:py-4" style={{ height: 'auto', minHeight: '80px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          {/* Logo on the left */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl sm:text-3xl font-bold text-[#264ECA]"
              style={{ fontFamily: 'serif' }}
            >
              Gatherly
            </Link>
          </div>
          
          {/* Center text - hidden on mobile */}
          <div className="hidden sm:block text-center">
            <p className="text-sm sm:text-base font-normal text-[#264ECA]" style={{ fontFamily: 'sans-serif' }}>
              2025 ყველა უფლება დაცულია
            </p>
          </div>
          
          {/* Social icons on the right */}
          <div className="flex items-center space-x-3">
            <a href="#" className="text-[#1877f2] hover:text-blue-700 transition-colors">
              <Facebook size={20} className="sm:w-6 sm:h-6" />
            </a>
            <a href="#" className="text-[#1da1f2] hover:text-blue-400 transition-colors">
              <Twitter size={20} className="sm:w-6 sm:h-6" />
            </a>
            <a href="#" className="text-[#ff0000] hover:text-red-700 transition-colors">
              <Youtube size={20} className="sm:w-6 sm:h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;