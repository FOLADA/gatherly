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
          <h1 className="font-georgian text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 drop-shadow-lg">
            აღმოაჩინე ახალი ღონისძიებები
          </h1>
          <p className="font-georgian text-lg sm:text-xl mb-6 sm:mb-8 drop-shadow-md">
            შეხვდი ახალ ადამიანებს და იპოვე სასურველი ღონისძიება
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild
              variant="gatherly"
              className="py-3 px-8 text-lg font-semibold"
            >
              <Link to="/register">
                დარეგისტრირდი ახლავე
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              className="py-3 px-8 text-lg font-semibold bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
            >
              <Link to="/login">
                შესვლა
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-georgian text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              რატომ Gatherly?
            </h2>
            <p className="font-georgian text-gray-600 text-lg">
              იპოვე ღონისძიებები და ახალი მეგობრები ერთ ადგილას
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-georgian text-xl font-semibold mb-2">ღონისძიებები</h3>
              <p className="font-georgian text-gray-600">
                იპოვე საინტერესო ღონისძიებები თქვენს ქალაქში
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-georgian text-xl font-semibold mb-2">ახალი მეგობრები</h3>
              <p className="font-georgian text-gray-600">
                შეხვდი ახალ ადამიანებს და შექმენი ახალი მეგობრობები
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-georgian text-xl font-semibold mb-2">უსაფრთხო</h3>
              <p className="font-georgian text-gray-600">
                ვერიფიცირებული მომხმარებლები და უსაფრთხო გარემო
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-georgian text-2xl sm:text-3xl font-bold text-white mb-4">
            მზად ხარ დასაწყებად?
          </h2>
          <p className="font-georgian text-white/90 text-lg mb-8">
            შეუერთდი ათასობით ადამიანს რომლებიც უკვე იყენებენ Gatherly-ს
          </p>
          <Button 
            asChild
            variant="secondary"
            className="py-3 px-8 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100"
          >
            <Link to="/register">
              დაიწყე ახლავე
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;