import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart, UserCheck, Users, Instagram, MapPin, Clock, Loader2, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUsersForMeetups, createUserInteraction, type PublicUserProfile } from "@/lib/databaseClient";
import { toast } from "sonner";
import backgroundImage from "@/assets/geometric-background.jpg";

const People = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [people, setPeople] = useState<PublicUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Fetch users for meetups on component mount
  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const result = await getUsersForMeetups(user.id);
      
      if (result.success && result.data) {
        setPeople(result.data);
      } else {
        toast.error(result.error || 'შეცდომა მონაცემების ჩატვირთვისას');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('მოულოდნელი შეცდომა მოხდა');
    } finally {
      setLoading(false);
    }
  };

  const handleInteraction = async (interactionType: 'like' | 'dislike') => {
    if (!user || !people[currentIndex] || actionLoading) return;
    
    try {
      setActionLoading(true);
      const targetUser = people[currentIndex];
      
      const result = await createUserInteraction(user.id, targetUser.id, interactionType);
      
      if (result.success) {
        if (interactionType === 'like') {
          toast.success(`${targetUser.name}-ს მოგწონთ! 💖`);
        }
        
        // Move to next person
        setSwipeDirection(interactionType === 'like' ? 'right' : 'left');
        
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setSwipeDirection(null);
        }, 300);
      } else {
        toast.error(result.error || 'შეცდომა მოხდა');
      }
    } catch (error) {
      console.error('Error creating interaction:', error);
      toast.error('მოულოდნელი შეცდომა მოხდა');
    } finally {
      setActionLoading(false);
    }
  };

  const getHobbyIcon = (hobby: string) => {
    const iconMap: Record<string, JSX.Element> = {
      'sports': <Zap className="h-3 w-3" />,
      'books': <Star className="h-3 w-3" />,
      'music': <Heart className="h-3 w-3" />,
      'travel': <MapPin className="h-3 w-3" />,
      'food': <Star className="h-3 w-3" />,
      'technology': <Zap className="h-3 w-3" />,
      'art': <Star className="h-3 w-3" />,
      'meetups': <Users className="h-3 w-3" />
    };
    return iconMap[hobby] || <Star className="h-3 w-3" />;
  };

  const getHobbyLabel = (hobby: string) => {
    const labelMap: Record<string, string> = {
      'sports': 'სპორტი',
      'books': 'წიგნები', 
      'music': 'მუსიკა',
      'travel': 'მოგზაურობა',
      'food': 'კულინარია',
      'technology': 'ტექნოლოგია',
      'art': 'ხელოვნება',
      'meetups': 'შეხვედრები'
    };
    return labelMap[hobby] || hobby;
  };

  const currentPerson = people[currentIndex];

  const handleSwipe = (direction: "left" | "right") => {
    handleInteraction(direction === 'right' ? 'like' : 'dislike');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const deltaX = currentX - startX;
    const threshold = 100;
    
    if (Math.abs(deltaX) > threshold) {
      handleSwipe(deltaX > 0 ? "right" : "left");
    } else {
      setCurrentX(startX);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const deltaX = currentX - startX;
    const threshold = 100;
    
    if (Math.abs(deltaX) > threshold) {
      handleSwipe(deltaX > 0 ? "right" : "left");
    } else {
      setCurrentX(startX);
    }
  };

  const getCardTransform = () => {
    if (swipeDirection) {
      return swipeDirection === "right" 
        ? "translateX(100%) rotate(20deg)" 
        : "translateX(-100%) rotate(-20deg)";
    }
    
    if (isDragging) {
      const deltaX = currentX - startX;
      const rotation = deltaX * 0.1;
      return `translateX(${deltaX}px) rotate(${rotation}deg)`;
    }
    
    return "translateX(0) rotate(0deg)";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold font-georgian mb-2">
            შესვლა საჭიროა
          </h2>
          <p className="text-muted-foreground font-georgian mb-6">
            ადამიანების ნახვისთვის გთხოვთ შედით სისტემაში
          </p>
          <Button asChild variant="gatherly" className="font-georgian">
            <Link to="/login">შესვლა</Link>
          </Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-georgian text-muted-foreground">
            იტვირთება...
          </p>
        </div>
      </div>
    );
  }

  if (currentIndex >= people.length) {
    return (
      <div 
        className="min-h-screen bg-gradient-background flex items-center justify-center p-4 relative"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-background opacity-70"></div>
        <Card className="p-8 text-center max-w-md relative z-10 bg-white/95 backdrop-blur-sm">
          <UserCheck className="h-16 w-16 mx-auto text-primary mb-4" />
          <h2 className="text-xl font-semibold font-georgian mb-2">
            ყველა ნანახია! 🎉
          </h2>
          <p className="text-muted-foreground font-georgian mb-6">
            ახალი ადამიანების ნახვისთვის მოგვიანებით დაბრუნდით
          </p>
          <div className="space-y-3">
            <Button asChild variant="gatherly" className="w-full font-georgian">
              <Link to="/favorites">ფავორიტების ნახვა</Link>
            </Button>
            <Button asChild variant="outline" className="w-full font-georgian">
              <Link to="/events">ღონისძიებების ნახვა</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-background p-3 sm:p-4 relative overflow-hidden safe-area-padding"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-background opacity-70"></div>
      
      <div className="relative z-10 max-w-sm sm:max-w-md mx-auto pt-4 sm:pt-6 lg:pt-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-responsive-2xl font-bold text-white font-georgian mb-2">
            ახალი ადამიანები
          </h1>
          <p className="text-white/80 font-georgian text-responsive-sm leading-relaxed">
            იპოვეთ საინტერესო ადამიანები თქვენს ირგვლივ
          </p>
        </div>

        {/* Card Stack */}
        <div className="relative h-[500px] sm:h-[550px] lg:h-[600px]">
          {/* Current Card */}
          <Card
            ref={cardRef}
            className="absolute inset-0 bg-white/95 backdrop-blur-sm overflow-hidden cursor-grab active:cursor-grabbing shadow-2xl"
            style={{
              transform: getCardTransform(),
              transition: isDragging ? 'none' : 'transform 0.3s ease-out',
              zIndex: 10
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Profile Image */}
            <div className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
              <img
                src={currentPerson?.image_url || backgroundImage}
                alt={currentPerson?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = backgroundImage;
                }}
              />
              
              {/* Match Percentage Badge */}
              <div className="absolute top-3 right-3 bg-gradient-primary text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                <span className="hidden xs:inline">{currentPerson?.match_percentage || 0}% რამდენად ემთხვევით</span>
                <span className="xs:hidden">{currentPerson?.match_percentage || 0}%</span>
              </div>
              
              {/* Age Badge */}
              <div className="absolute top-3 left-3 bg-white/90 text-gray-800 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                {currentPerson?.age} წლის
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-4 sm:p-6">
              <h2 className="text-responsive-xl font-bold text-gray-900 mb-2 font-georgian">
                {currentPerson?.name}
              </h2>

              {/* Bio */}
              {currentPerson?.bio && (
                <p className="text-gray-700 mb-3 sm:mb-4 font-georgian leading-relaxed text-responsive-sm line-clamp-3">
                  {currentPerson.bio}
                </p>
              )}

              {/* Hobbies */}
              {currentPerson?.hobbies && currentPerson.hobbies.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2 font-georgian">
                    ინტერესები:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentPerson.hobbies.slice(0, 6).map((hobby, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-gradient-primary text-white px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {getHobbyIcon(hobby)}
                        {getHobbyLabel(hobby)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Instagram */}
              {currentPerson?.instagram_profile && (
                <div className="flex items-center gap-2 text-pink-600 mb-4">
                  <Instagram className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {currentPerson.instagram_profile}
                  </span>
                </div>
              )}

              {/* Availability */}
              {currentPerson?.availability && currentPerson.availability.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-2 font-georgian">
                    ხელმისაწვდომობა:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentPerson.availability.slice(0, 3).map((slot, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs"
                      >
                        <Clock className="h-3 w-3" />
                        {slot === 'weekday_mornings' && 'სამუშაო დღეების დილა'}
                        {slot === 'weekday_evenings' && 'სამუშაო დღეების საღამო'}
                        {slot === 'weekends' && 'შაბათ-კვირა'}
                        {slot === 'anytime' && 'ნებისმიერ დროს'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Next Card Preview */}
          {people[currentIndex + 1] && (
            <Card className="absolute inset-0 bg-white/90 backdrop-blur-sm shadow-xl scale-95 -z-10">
              <div className="h-80 overflow-hidden">
                <img
                  src={people[currentIndex + 1]?.image_url || backgroundImage}
                  alt={people[currentIndex + 1]?.name}
                  className="w-full h-full object-cover opacity-50"
                />
              </div>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
          <Button
            onClick={() => handleInteraction('dislike')}
            disabled={actionLoading}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 hover:bg-white text-red-500 hover:text-red-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 touch-target"
          >
            {actionLoading ? (
              <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
            ) : (
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </Button>
          
          <Button
            onClick={() => handleInteraction('like')}
            disabled={actionLoading}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 touch-target"
          >
            {actionLoading ? (
              <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
            ) : (
              <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm font-georgian">
            {currentIndex + 1} / {people.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default People;
