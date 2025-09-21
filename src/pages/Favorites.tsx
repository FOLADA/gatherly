import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Instagram, MapPin, Clock, Users, Star, Zap, Loader2, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserFavorites, type PublicUserProfile } from "@/lib/databaseClient";
import { toast } from "sonner";
import backgroundImage from "@/assets/geometric-background.jpg";

const Favorites = () => {
  const [favorites, setFavorites] = useState<PublicUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const result = await getUserFavorites(user.id);
      
      if (result.success && result.data) {
        setFavorites(result.data);
      } else {
        toast.error(result.error || 'შეცდომა მონაცემების ჩატვირთვისას');
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('მოულოდნელი შეცდომა მოხდა');
    } finally {
      setLoading(false);
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

  const ProfileCard = ({ profile }: { profile: PublicUserProfile }) => (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/95 backdrop-blur-sm rounded-responsive">
      {/* Profile Image */}
      <div className="relative h-40 sm:h-44 lg:h-48 overflow-hidden">
        <img
          src={profile.image_url || backgroundImage}
          alt={profile.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = backgroundImage;
          }}
        />
        
        {/* Match Percentage Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gradient-primary text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
          {profile.match_percentage || 0}%
        </div>
        
        {/* Liked Badge */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white p-1 sm:p-1.5 rounded-full shadow-lg">
          <Heart className="h-3 w-3 fill-current" />
        </div>
        
        {/* Age Badge */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
          {profile.age} წლის
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-3 sm:p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 font-georgian truncate">
          {profile.name}
        </h3>

        {/* Bio */}
        {profile.bio && (
          <p className="text-gray-600 text-sm mb-3 font-georgian line-clamp-2 leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* Hobbies */}
        {profile.hobbies && profile.hobbies.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {profile.hobbies.slice(0, 3).map((hobby, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs"
                >
                  {getHobbyIcon(hobby)}
                  {getHobbyLabel(hobby)}
                </span>
              ))}
              {profile.hobbies.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{profile.hobbies.length - 3} სხვა
                </span>
              )}
            </div>
          </div>
        )}

        {/* Instagram */}
        {profile.instagram_profile && (
          <div className="flex items-center gap-2 text-pink-600 mb-3">
            <Instagram className="h-4 w-4" />
            <a
              href={`https://instagram.com/${profile.instagram_profile.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:underline truncate"
            >
              {profile.instagram_profile}
            </a>
          </div>
        )}

        {/* Availability */}
        {profile.availability && profile.availability.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 text-gray-600 text-xs">
              <Clock className="h-3 w-3" />
              <span className="font-georgian">
                {profile.availability.length === 1 
                  ? profile.availability[0] === 'anytime' 
                    ? 'ნებისმიერ დროს'
                    : profile.availability[0] === 'weekends'
                    ? 'შაბათ-კვირა'
                    : profile.availability[0] === 'weekday_evenings'
                    ? 'საღამოებით'
                    : 'დილით'
                  : `${profile.availability.length} დროის ინტერვალი`
                }
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 font-georgian text-xs"
            disabled
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            მესიჯი
          </Button>
          
          {profile.instagram_profile && (
            <Button
              size="sm"
              variant="gatherly"
              className="flex-1 font-georgian text-xs"
              asChild
            >
              <a
                href={`https://instagram.com/${profile.instagram_profile.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-3 w-3 mr-1" />
                Instagram
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold font-georgian mb-2">
            შესვლა საჭიროა
          </h2>
          <p className="text-muted-foreground font-georgian mb-6">
            ფავორიტების ნახვისთვის გთხოვთ შედით სისტემაში
          </p>
          <Button asChild variant="gatherly" className="font-georgian">
            <Link to="/login">შესვლა</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-background p-3 sm:p-4 relative safe-area-padding"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-background opacity-70"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 pt-4 sm:pt-6 lg:pt-8">
          <h1 className="text-responsive-2xl font-bold text-white font-georgian mb-2">
            ჩემი ფავორიტები
          </h1>
          <p className="text-white/80 font-georgian text-responsive-sm leading-relaxed">
            ადამიანები რომლებიც მოგწონთ
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
              <p className="text-lg font-georgian text-white">
                იტვირთება...
              </p>
            </div>
          </div>
        ) : favorites.length === 0 ? (
          /* Empty State */
          <div className="flex items-center justify-center py-20">
            <Card className="p-8 text-center max-w-md bg-white/95 backdrop-blur-sm">
              <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold font-georgian mb-2">
                ჯერ არ გაქვთ ფავორიტები
              </h2>
              <p className="text-muted-foreground font-georgian mb-6">
                დაიწყეთ ადამიანების ნახვა და მოიძიეთ საინტერესო პროფილები
              </p>
              <div className="space-y-3">
                <Button asChild variant="gatherly" className="w-full font-georgian">
                  <Link to="/people">ადამიანების ნახვა</Link>
                </Button>
                <Button asChild variant="outline" className="w-full font-georgian">
                  <Link to="/events">ღონისძიებების ნახვა</Link>
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          /* Favorites Grid */
          <>
            {/* Stats */}
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                <Heart className="h-4 w-4 text-red-400" />
                <span className="font-georgian">
                  {favorites.length} ფავორიტი
                </span>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-responsive-1-2-4 gap-responsive">
              {favorites.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 sm:mt-12 text-center">
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center max-w-md xs:max-w-none mx-auto">
                <Button asChild variant="gatherly" className="font-georgian touch-target">
                  <Link to="/people">მეტი ადამიანის ნახვა</Link>
                </Button>
                <Button asChild variant="outline" className="font-georgian bg-white/10 border-white/20 text-white hover:bg-white/20 touch-target">
                  <Link to="/dashboard">მართვის პანელი</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
