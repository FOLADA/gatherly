import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Users, MapPin, Star, ArrowRight, Zap, Shield } from "lucide-react";
import backgroundImage from "@/assets/geometric-background.jpg";
import theMainImage from "@/assets/EventsPage.png";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to events page
  useEffect(() => {
    if (user) {
      navigate('/events');
    }
  }, [user, navigate]);

  // Landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        className="mt-6 sm:mt-8 lg:mt-10 mx-4 sm:mx-6 lg:mx-10 relative bg-cover rounded-responsive bg-center h-[350px] xs:h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] flex items-center justify-center safe-area-padding"
        style={{
          backgroundImage: `url(${theMainImage})`,
          borderRadius: "16px",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r rounded-responsive from-black/80 via-black/60 to-black/40"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-responsive max-w-4xl mx-auto">
          <h1 className="font-georgian text-responsive-3xl font-bold mb-4 sm:mb-6 drop-shadow-lg leading-tight">
            აღმოაჩინე ახალი ღონისძიებები
          </h1>
          <p className="font-georgian text-responsive-lg mb-6 sm:mb-8 drop-shadow-md leading-relaxed max-w-2xl mx-auto">
            შეხვდი ახალ ადამიანებს და იპოვე სასურველი ღონისძიება
          </p>
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center max-w-md xs:max-w-none mx-auto">
            <Button 
              asChild
              variant="gatherly"
              className="py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg font-semibold touch-target rounded-responsive"
            >
              <Link to="/register">
                დარეგისტრირდი ახლავე
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              className="py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 touch-target rounded-responsive"
            >
              <Link to="/login">
                შესვლა
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-responsive px-responsive bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-georgian text-responsive-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              რატომ Gatherly?
            </h2>
            <p className="font-georgian text-gray-600 text-responsive-base leading-relaxed max-w-2xl mx-auto">
              იპოვე ღონისძიებები და ახალი მეგობრები ერთ ადგილას
            </p>
          </div>

          <div className="grid grid-responsive-1-2-3 gap-responsive">
            {/* Feature 1 */}
            <div className="text-center p-responsive bg-white rounded-responsive shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h3 className="font-georgian text-responsive-lg font-semibold mb-2">ღონისძიებები</h3>
              <p className="font-georgian text-gray-600 text-responsive-sm leading-relaxed">
                იპოვე საინტერესო ღონისძიებები თქვენს ქალაქში
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-responsive bg-white rounded-responsive shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <h3 className="font-georgian text-responsive-lg font-semibold mb-2">ახალი მეგობრები</h3>
              <p className="font-georgian text-gray-600 text-responsive-sm leading-relaxed">
                შეხვდი ახალ ადამიანებს და შექმენი ახალი მეგობრობები
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-responsive bg-white rounded-responsive shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="font-georgian text-responsive-lg font-semibold mb-2">უსაფრთხო</h3>
              <p className="font-georgian text-gray-600 text-responsive-sm leading-relaxed">
                ვერიფიცირებული მომხმარებლები და უსაფრთხო გარემო
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-responsive px-responsive bg-gradient-to-r from-blue-600 to-purple-600 safe-area-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-georgian text-responsive-2xl font-bold text-white mb-4 sm:mb-6">
            მზად ხარ დასაწყებად?
          </h2>
          <p className="font-georgian text-white/90 text-responsive-base mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
            შეუერთდი ათასობით ადამიანს რომლებიც უკვე იყენებენ Gatherly-ს
          </p>
          <Button 
            asChild
            variant="secondary"
            className="py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100 touch-target rounded-responsive"
          >
            <Link to="/register">
              დაიწყე ახლავე
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;