import { Link } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";
import gatherlyLogo from "@/assets/GatherlyLogo.jpg";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Logo and Description */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <Link to="/" className="flex items-center">
              <img 
                src={gatherlyLogo} 
                alt="Gatherly Logo" 
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600 text-center md:text-left max-w-xs">
              ღონისძიებების აღმოჩენისა და ახალი ადამიანების გაცნობის პლატფორმა 
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-md text-gray-500">
              © 2025 Gatherly. ყველა უფლება დაცულია.
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex justify-center md:justify-end items-center space-x-6">
            <a 
              href="https://www.facebook.com/profile.php?id=61581044843816" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#1877f2] transition-colors duration-200 group"
              aria-label="Facebook-ზე გაყევით"
            >
              <Facebook size={24} className="group-hover:scale-110 transition-transform duration-200" />
            </a>
            <a 
              href="https://www.instagram.com/_getherly_?igsh=YWo5dWRmbzQ1Mm1v" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#E4405F] transition-colors duration-200 group"
              aria-label="Instagram-ზე გაყევით"
            >
              <Instagram size={24} className="group-hover:scale-110 transition-transform duration-200" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;