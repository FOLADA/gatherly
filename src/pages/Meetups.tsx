import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart, UserCheck } from "lucide-react";

const People = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Sample person data for People
  const people = [
    {
      id: 1,
      name: "გიორგი გიორგაძე",
      age: 28,
      interests: ["ტექნოლოგიები", "მოგზაურობა", "კინო"],
      bio: "ვებ დეველოპერი და ტექნოლოგიური ინოვაციების მოყვარული. მომწყენი ხართ თუ არა კოდის დაწერა და ახალი ტექნოლოგიების შესწავლა?",
      matchPercentage: 85,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      name: "ნინო ბერიძე",
      age: 25,
      interests: ["ხელოვნება", "წიგნები", "მუსიკა"],
      bio: "გრაფიკული დიზაინერი და ხელოვნების მოყვარული. მომწყენი ხართ თუ არა ქალაქში არსებული გალერეების ეკიდებით?",
      matchPercentage: 72,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "ლევან კობაიძე",
      age: 32,
      interests: ["სპორტი", "მოგზაურობა", "ფოტოგრაფია"],
      bio: "პროფესიული ფოტოგრაფი და სპორტის მოყვარული. მომწყენი ხართ თუ არა ქალაქში არსებული სპორტული ღონისძიებების ეკიდებით?",
      matchPercentage: 90,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      name: "მარიამ ლომიძე",
      age: 26,
      interests: ["მეცნიერება", "ტექნოლოგიები", "მოგზაურობა"],
      bio: "მეცნიერების დარბაზის კვლევითი თანამშრომელი. მომწყენი ხართ თუ არა კონფერენციების და სემინარების ეკიდებით?",
      matchPercentage: 78,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      name: "დავით ხაჩიძე",
      age: 30,
      interests: ["მუსიკა", "კინო", "ხელოვნება"],
      bio: "მუსიკოსი და კომპოზიტორი. მომწყენი ხართ თუ არა კონცერტების და მუსიკალური ღონისძიებების ეკიდებით?",
      matchPercentage: 82,
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
  ];

  const currentPerson = people[currentIndex];

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeDirection(direction);
    setTimeout(() => {
      if (currentIndex < people.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSwipeDirection(null);
      } else {
        // Reset to first card when reaching the end
        setCurrentIndex(0);
        setSwipeDirection(null);
      }
    }, 300);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setCurrentX(clientX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const deltaX = currentX - startX;
    const threshold = 100; // Minimum distance to trigger a swipe
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        handleSwipe("right");
      } else {
        handleSwipe("left");
      }
    }
  };

  // Reset position when not dragging
  useEffect(() => {
    if (!isDragging) {
      setCurrentX(startX);
    }
  }, [isDragging, startX]);

  const getCardTransform = () => {
    if (isDragging) {
      const deltaX = currentX - startX;
      const rotate = deltaX * 0.1; // Rotate based on drag distance
      return {
        transform: `translateX(${deltaX}px) rotate(${rotate}deg)`,
        transition: "none",
      };
    }
    
    if (swipeDirection) {
      const translateX = swipeDirection === "right" ? 1000 : -1000;
      return {
        transform: `translateX(${translateX}px) rotate(${swipeDirection === "right" ? 30 : -30}deg)`,
        transition: "transform 0.3s ease-out",
      };
    }
    
    return {
      transform: "translateX(0) rotate(0)",
      transition: "transform 0.3s ease-out",
    };
  };

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-900">იპოვე ახალი მეგობრები</h1>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 text-sm sm:text-base">Swipe მარცხნივ ან მარჯვნივ და იპოვე თქვენთვის საინტერესო ადამიანები</p>
        
        <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] flex items-center justify-center">
          {currentIndex < people.length ? (
            <div 
              ref={cardRef}
              className="absolute w-full max-w-xs sm:max-w-sm md:max-w-md cursor-grab active:cursor-grabbing"
              style={getCardTransform()}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              <Card className="overflow-hidden rounded-3xl shadow-xl h-[400px] sm:h-[500px] md:h-[600px] border border-gray-200">
                <div className="relative h-2/3">
                  <img 
                    src={currentPerson.image} 
                    alt={currentPerson.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white">
                    <h2 className="text-xl sm:text-2xl font-bold">{currentPerson.name}, {currentPerson.age}</h2>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                      {currentPerson.interests.map((interest, index) => (
                        <span key={index} className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-xs font-medium text-white">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1 text-white font-bold text-xs sm:text-sm">
                    {currentPerson.matchPercentage}% ემთხვევით
                  </div>
                </div>
                <div className="p-4 sm:p-6 h-1/3">
                  <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-3">{currentPerson.bio}</p>
                </div>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">ყველა პროფილი ნანახია!</h2>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">შეამოწმეთ ახალი პროფილები მოგვიანებით</p>
              <Button 
                onClick={() => setCurrentIndex(0)} 
                className="bg-gradient-primary text-white hover:opacity-90 text-sm sm:text-base"
              >
                თავიდან დაწყება
              </Button>
            </div>
          )}
        </div>

        {/* Action Buttons - Responsive for mobile */}
        <div className="flex justify-center items-center space-x-4 sm:space-x-8 mt-6 sm:mt-8">
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-red-500 hover:bg-red-50 hover:border-red-600 transition-all duration-200 shadow-lg"
            onClick={() => handleSwipe("left")}
          >
            <X className="h-5 w-5 sm:h-8 sm:w-8 text-red-500" />
          </Button>
          
          <Button
            variant="outline"
            className="rounded-full px-4 py-2 sm:px-6 sm:py-3 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-lg hidden sm:flex"
          >
            <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-gray-700" />
            <span className="font-bold text-gray-700 text-sm sm:text-base">{currentPerson?.matchPercentage || 0}% ემთხვევით</span>
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-green-500 hover:bg-green-50 hover:border-green-600 transition-all duration-200 shadow-lg"
            onClick={() => handleSwipe("right")}
          >
            <Heart className="h-5 w-5 sm:h-8 sm:w-8 text-green-500" />
          </Button>
        </div>
        
        {/* Mobile view for match percentage */}
        <div className="sm:hidden mt-4 text-center">
          <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-2">
            <UserCheck className="h-4 w-4 mr-2 text-gray-700" />
            <span className="font-bold text-gray-700 text-sm">{currentPerson?.matchPercentage || 0}% ემთხვევით</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default People