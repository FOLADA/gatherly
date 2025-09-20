import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  User, 
  Camera, 
  Instagram, 
  FileText, 
  Save, 
  Edit3, 
  X,
  Check,
  Users,
  Heart,
  Clock,
  Globe,
  Shield,
  Star,
  Zap,
  Award,
  TrendingUp,
  MessageCircle,
  Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile, upsertUserProfile, type UserProfile } from "@/lib/databaseClient";
import { toast } from "sonner";
import backgroundImage from "@/assets/geometric-background.jpg";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    instagram_profile: "",
    bio: "",
    hobbies: [] as string[],
    availability: [] as string[],
    personality: {} as Record<string, string>,
    image_url: "",
    social_level: 3,
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const profile = await getUserProfile(user.id);
      
      if (profile) {
        setFormData({
          name: profile.name || "",
          age: profile.age?.toString() || "",
          instagram_profile: profile.instagram_profile || "",
          bio: profile.bio || "",
          hobbies: profile.hobbies || [],
          availability: profile.availability || [],
          personality: profile.personality || {},
          image_url: profile.image_url || "",
          social_level: profile.social_level || 3,
        });
      } else {
        // Pre-fill with user data if no profile exists
        setFormData(prev => ({
          ...prev,
          name: user.user_metadata?.name || user.email?.split('@')[0] || "",
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('შეცდომა პროფილის ჩატვირთვისას');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'სახელი აუცილებელია';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'სახელი უნდა იყოს მინიმუმ 2 სიმბოლო';
    }
    
    if (!formData.age) {
      newErrors.age = 'ასაკი აუცილებელია';
    } else {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 16 || ageNum > 100) {
        newErrors.age = 'ასაკი უნდა იყოს 16-დან 100-მდე';
      }
    }
    
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'ბიოგრაფია არ უნდა აღემატებოდეს 500 სიმბოლოს';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!user || !validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const profileData: Omit<UserProfile, 'created_at' | 'updated_at'> = {
        id: user.id,
        name: formData.name.trim(),
        age: parseInt(formData.age),
        instagram_profile: formData.instagram_profile.trim() || undefined,
        bio: formData.bio.trim() || undefined,
        hobbies: formData.hobbies,
        availability: formData.availability,
        personality: formData.personality,
        image_url: formData.image_url?.trim() || undefined,
        social_level: formData.social_level,
      };

      const result = await upsertUserProfile(profileData);
      
      if (result.success) {
        toast.success('პროფილი წარმატებით განახლდა!');
        setIsEditing(false);
      } else {
        toast.error(result.error || 'შეცდომა პროფილის განახლებისას');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('მოულოდნელი შეცდომა მოხდა');
    } finally {
      setSaving(false);
    }
  };

  const toggleHobby = (hobbyId: string) => {
    setFormData(prev => {
      const hobbies = [...prev.hobbies];
      if (hobbies.includes(hobbyId)) {
        return { ...prev, hobbies: hobbies.filter(h => h !== hobbyId) };
      } else {
        return { ...prev, hobbies: [...hobbies, hobbyId] };
      }
    });
  };

  const toggleAvailability = (slotId: string) => {
    setFormData(prev => {
      const availability = [...prev.availability];
      if (availability.includes(slotId)) {
        return { ...prev, availability: availability.filter(id => id !== slotId) };
      } else {
        return { ...prev, availability: [...availability, slotId] };
      }
    });
  };

  const predefinedHobbies = [
    { id: "sports", label: "სპორტი", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "books", label: "წიგნები", icon: <Award className="h-4 w-4" /> },
    { id: "music", label: "მუსიკა", icon: <Heart className="h-4 w-4" /> },
    { id: "travel", label: "მოგზაურობა", icon: <Globe className="h-4 w-4" /> },
    { id: "food", label: "კულინარია", icon: <Star className="h-4 w-4" /> },
    { id: "technology", label: "ტექნოლოგია", icon: <Zap className="h-4 w-4" /> },
    { id: "art", label: "ხელოვნება", icon: <Award className="h-4 w-4" /> },
    { id: "meetups", label: "შეხვედრები", icon: <Users className="h-4 w-4" /> }
  ];

  const timeSlots = [
    { id: "weekday_mornings", label: "სამუშაო დღეების დილა", icon: <Clock className="h-4 w-4" /> },
    { id: "weekday_evenings", label: "სამუშაო დღეების საღამო", icon: <Clock className="h-4 w-4" /> },
    { id: "weekends", label: "შაბათ-კვირა", icon: <Users className="h-4 w-4" /> },
    { id: "anytime", label: "ნებისმიერ დროს", icon: <Globe className="h-4 w-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid gap-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-background p-4 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-background opacity-70"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white font-georgian mb-2">
              ჩემი პროფილი
            </h1>
            <p className="text-white/80 font-georgian">
              მართეთ თქვენი პროფილის ინფორმაცია
            </p>
          </div>
          
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              variant="gatherly" 
              className="font-georgian"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              რედაქტირება
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                onClick={handleSave}
                disabled={saving}
                variant="gatherly" 
                className="font-georgian"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    შენახვა...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    შენახვა
                  </>
                )}
              </Button>
              <Button 
                onClick={() => {
                  setIsEditing(false);
                  setErrors({});
                  fetchUserProfile(); // Reset form
                }}
                variant="outline" 
                className="font-georgian bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4 mr-2" />
                გაუქმება
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-6">
          {/* Basic Information */}
          <Card className="p-6 bg-white/95 backdrop-blur-sm">
            <h2 className="text-xl font-semibold font-georgian mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              ძირითადი ინფორმაცია
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <Label className="font-georgian text-sm text-foreground mb-2 block">
                  სახელი *
                </Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={!isEditing}
                  className={`font-georgian ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="თქვენი სახელი"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 font-georgian">{errors.name}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <Label className="font-georgian text-sm text-foreground mb-2 block">
                  ასაკი *
                </Label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  disabled={!isEditing}
                  className={`font-georgian ${errors.age ? 'border-red-500' : ''}`}
                  placeholder="თქვენი ასაკი"
                />
                {errors.age && (
                  <p className="text-red-500 text-xs mt-1 font-georgian">{errors.age}</p>
                )}
              </div>

              {/* Instagram */}
              <div>
                <Label className="font-georgian text-sm text-foreground mb-2 block flex items-center">
                  <Instagram className="h-4 w-4 mr-1 text-primary" />
                  Instagram პროფილი
                </Label>
                <Input
                  type="text"
                  value={formData.instagram_profile}
                  onChange={(e) => handleInputChange("instagram_profile", e.target.value)}
                  disabled={!isEditing}
                  className="font-georgian"
                  placeholder="@username"
                />
              </div>

              {/* Profile Image URL */}
              <div>
                <Label className="font-georgian text-sm text-foreground mb-2 block flex items-center">
                  <Camera className="h-4 w-4 mr-1 text-primary" />
                  პროფილის ფოტო
                </Label>
                <Input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange("image_url", e.target.value)}
                  disabled={!isEditing}
                  className="font-georgian"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Profile Image Preview */}
            {formData.image_url && (
              <div className="mt-4 flex justify-center">
                <div className="relative">
                  <img
                    src={formData.image_url}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-primary shadow-sm"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Bio */}
            <div className="mt-4">
              <Label className="font-georgian text-sm text-foreground mb-2 block flex items-center">
                <FileText className="h-4 w-4 mr-1 text-primary" />
                ბიოგრაფია
              </Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                disabled={!isEditing}
                className={`font-georgian min-h-[100px] ${errors.bio ? 'border-red-500' : ''}`}
                placeholder="მოგვიყევით თქვენს შესახებ..."
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.bio && (
                  <p className="text-red-500 text-xs font-georgian">{errors.bio}</p>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {formData.bio.length}/500
                </span>
              </div>
            </div>
          </Card>

          {/* Hobbies & Interests */}
          <Card className="p-6 bg-white/95 backdrop-blur-sm">
            <h2 className="text-xl font-semibold font-georgian mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-primary" />
              ინტერესები და ჰობი
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {predefinedHobbies.map((hobby) => (
                <button
                  key={hobby.id}
                  type="button"
                  disabled={!isEditing}
                  onClick={() => toggleHobby(hobby.id)}
                  className={`p-3 rounded-lg text-sm font-georgian transition-all duration-200 flex flex-col items-center justify-center border-2 ${
                    formData.hobbies.includes(hobby.id)
                      ? "bg-gradient-primary text-white border-transparent shadow-md"
                      : "bg-input border-input-border text-foreground hover:bg-accent hover:border-primary"
                  } ${!isEditing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="mb-1">{hobby.icon}</div>
                  {hobby.label}
                  {formData.hobbies.includes(hobby.id) && (
                    <Check className="h-3 w-3 mt-1" />
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Availability */}
          <Card className="p-6 bg-white/95 backdrop-blur-sm">
            <h2 className="text-xl font-semibold font-georgian mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              ხელმისაწვდომობა
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  disabled={!isEditing}
                  onClick={() => toggleAvailability(slot.id)}
                  className={`p-4 rounded-lg text-sm font-georgian transition-all duration-200 flex items-center border-2 ${
                    formData.availability.includes(slot.id)
                      ? "bg-gradient-primary text-white border-transparent shadow-md"
                      : "bg-input border-input-border text-foreground hover:bg-accent hover:border-primary"
                  } ${!isEditing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="mr-3 p-1 rounded-md bg-white/20">
                    {slot.icon}
                  </div>
                  <span className="flex-1">{slot.label}</span>
                  {formData.availability.includes(slot.id) && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Social Level */}
          <Card className="p-6 bg-white/95 backdrop-blur-sm">
            <h2 className="text-xl font-semibold font-georgian mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              სოციალური დონე
            </h2>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground font-georgian">
                რამდენად სოციალური ხართ? (1 - ინტროვერტი, 5 - ექსტროვერტი)
              </p>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm font-georgian">ინტროვერტი</span>
                <div className="flex-1 flex justify-between items-center">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      disabled={!isEditing}
                      onClick={() => handleInputChange("social_level", level)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        formData.social_level >= level
                          ? "bg-gradient-primary border-transparent text-white"
                          : "border-input-border hover:border-primary"
                      } ${!isEditing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <span className="text-sm font-georgian">ექსტროვერტი</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
