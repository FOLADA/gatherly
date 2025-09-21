import { Link } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";
import gatherlyLogo from "@/assets/GatherlyLogo.jpg";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 sm:py-8 safe-area-padding">
      <div className="max-w-7xl mx-auto px-responsive">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-center">
          
          {/* Logo and Description */}
          <div className="flex flex-col items-center sm:items-start space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center">
              <img 
                src={gatherlyLogo} 
                alt="Gatherly Logo" 
                className="h-10 sm:h-12 w-auto"
              />
            </Link>
            <p className="text-responsive-xs text-gray-600 text-center sm:text-left max-w-xs leading-relaxed font-georgian">
              ღონისძიებების აღმოჩენისა და ახალი ადამიანების გაცნობის პლატფორმა 
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center sm:col-span-2 lg:col-span-1 order-3 sm:order-2 lg:order-2">
            <p className="text-responsive-xs text-gray-500 font-georgian">
              2025 Gatherly. ყველა უფლება დაცულია.
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex justify-center sm:justify-end lg:justify-end items-center space-x-4 sm:space-x-6 order-2 sm:order-3 lg:order-3 sm:col-span-2 lg:col-span-1">
            <a 
              href="https://www.facebook.com/profile.php?id=61581044843816" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#1877f2] transition-colors duration-200 group touch-target p-2"
              aria-label="Facebook-ზე გაყევით"
            >
              <Facebook size={20} className="sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-200" />
            </a>
            <a 
              href="https://www.instagram.com/_getherly_?igsh=YWo5dWRmbzQ1Mm1v" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#E4405F] transition-colors duration-200 group touch-target p-2"
              aria-label="Instagram-ზე გაყევით"
            >
              <Instagram size={20} className="sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-200" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;