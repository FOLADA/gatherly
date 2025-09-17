import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Calendar, 
  Heart, 
  Clock, 
  Smile, 
  Users, 
  Camera,
  Plus,
  X,
  Check,
  ArrowLeft,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Globe,
  MessageCircle,
  TrendingUp,
  Award,
  Loader2,
  Instagram,
  FileText
} from "lucide-react";
import backgroundImage from "@/assets/geometric-background.jpg";
import gatherlyLogo from "@/assets/GatherlyArched.png";
import { useNavigate } from "react-router-dom";
import { supabase, uploadProfileImage, upsertUserProfile, type UserProfile } from "@/lib/supabaseClient";
import { toast } from "sonner";

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 6; // Updated to include bio step
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    profilePhoto: null as File | null,
    image_url: "",
    instagram_profile: "",
    bio: "",
    hobbies: [] as string[],
    customHobby: "",
    availability: [] as string[],
    personality: {} as Record<string, string>,
    socialLevel: 3,
  });

  // Get current user and pre-fill name if available
  useEffect(() => {
    // Handle email confirmation redirect
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        // Pre-fill name from user metadata or email
        const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '';
        if (displayName) {
          setFormData(prev => ({ ...prev, name: displayName }));
        }
      }
    };
    getCurrentUser();
  }, []);

  const handleInputChange = (field: string, value: string | File | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('მომხმარებელი არ არის ავტორიზებული');
      return;
    }

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('გთხოვთ შეიყვანოთ სახელი');
      return;
    }
    if (!formData.age || parseInt(formData.age) < 1) {
      toast.error('გთხოვთ შეიყვანოთ სწორი ასაკი');
      return;
    }

    setIsLoading(true);
    
    try {

      // Prepare user profile data
      const profileData: Omit<UserProfile, 'created_at' | 'updated_at'> = {
        id: currentUser.id,
        name: formData.name.trim(),
        age: parseInt(formData.age),
        instagram_profile: formData.instagram_profile.trim() || undefined,
        bio: formData.bio.trim() || undefined,
        hobbies: formData.hobbies,
        availability: formData.availability,
        personality: formData.personality,
        image_url: formData.image_url?.trim() || undefined,
        social_level: formData.socialLevel,
      };

      // Save to Supabase
      const result = await upsertUserProfile(profileData);
      
      if (result.success) {
        toast.success('პროფილი წარმატებით შეიქმნა!');
        // Redirect to home page
        navigate('/');
      } else {
        toast.error(result.error || 'შეცდომა მონაცემების შენახვისას');
      }
    } catch (error) {
      console.error('Error during onboarding:', error);
      toast.error('მოულოდნელი შეცდომა მოხდა');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Basic Details
  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
          <User className="h-6 w-6 text-white" />
        </div>
        <h2 className="font-georgian text-lg font-semibold text-foreground mb-1">
          თქვენი ინფორმაცია
        </h2>
        <p className="font-georgian text-xs text-muted-foreground">
          მოგვიყევით თქვენს შესახებ
        </p>
      </div>

      {/* Name Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-placeholder">
          <User className="h-4 w-4" />
        </div>
        <Input
          type="text"
          placeholder="სახელი"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="pl-9 pr-3 py-3 bg-input border-input-border rounded-lg text-sm font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Age Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-placeholder">
          <Calendar className="h-4 w-4" />
        </div>
        <Input
          type="number"
          placeholder="ასაკი"
          value={formData.age}
          onChange={(e) => handleInputChange("age", e.target.value)}
          className="pl-9 pr-3 py-3 bg-input border-input-border rounded-lg text-sm font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Gender Selection */}
      <div>
        <Label className="font-georgian text-sm text-foreground mb-2 block flex items-center">
          <Shield className="mr-1.5 h-4 w-4 text-primary" />
          სქესი
        </Label>
        <RadioGroup 
          value={formData.gender} 
          onValueChange={(value) => handleInputChange("gender", value)}
          className="flex flex-col space-y-1.5"
        >
          <div className="flex items-center space-x-2.5 bg-input border border-input-border rounded-lg p-2.5 hover:bg-accent transition-all duration-200">
            <RadioGroupItem value="male" id="male" className="h-4 w-4" />
            <Label htmlFor="male" className="font-georgian cursor-pointer text-sm">მამრობითი</Label>
          </div>
          <div className="flex items-center space-x-2.5 bg-input border border-input-border rounded-lg p-2.5 hover:bg-accent transition-all duration-200">
            <RadioGroupItem value="female" id="female" className="h-4 w-4" />
            <Label htmlFor="female" className="font-georgian cursor-pointer text-sm">მდედრობითი</Label>
          </div>
          <div className="flex items-center space-x-2.5 bg-input border border-input-border rounded-lg p-2.5 hover:bg-accent transition-all duration-200">
            <RadioGroupItem value="other" id="other" className="h-4 w-4" />
            <Label htmlFor="other" className="font-georgian cursor-pointer text-sm">სხვა</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Profile Photo URL */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-placeholder">
          <Camera className="h-4 w-4" />
        </div>
        <Input
          type="url"
          placeholder="პროფილის ფოტოს ლინკი (https://...)"
          value={formData.image_url || ''}
          onChange={(e) => handleInputChange("image_url", e.target.value)}
          className="pl-9 pr-3 py-3 bg-input border-input-border rounded-lg text-sm font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        />
      </div>
    </div>
  );

  // Step 2: Social Media & Bio
  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
          <Instagram className="h-6 w-6 text-white" />
        </div>
        <h2 className="font-georgian text-lg font-semibold text-foreground mb-1">
          სოციალური მედია და ბიო
        </h2>
        <p className="font-georgian text-xs text-muted-foreground">
          მოგვიყევით თქვენს შესახებ მეტი
        </p>
      </div>

      {/* Instagram Profile Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-placeholder">
          <Instagram className="h-4 w-4" />
        </div>
        <Input
          type="text"
          placeholder="Instagram პროფილი (@username)"
          value={formData.instagram_profile}
          onChange={(e) => handleInputChange("instagram_profile", e.target.value)}
          className="pl-9 pr-3 py-3 bg-input border-input-border rounded-lg text-sm font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Bio Input */}
      <div>
        <Label className="font-georgian text-sm text-foreground mb-2 block flex items-center">
          <FileText className="mr-1.5 h-4 w-4 text-primary" />
          ბიო (მოკლე აღწერა)
        </Label>
        <Textarea
          placeholder="მოგვიყევით თქვენს შესახებ რამდენიმე სიტყვით..."
          value={formData.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          className="min-h-[80px] bg-input border-input-border rounded-lg text-sm font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
          maxLength={200}
        />
        <div className="text-right mt-1">
          <span className="text-xs text-muted-foreground">
            {formData.bio.length}/200
          </span>
        </div>
      </div>
    </div>
  );

  // Step 3: Hobbies & Interests
  const renderStep3 = () => {
    const predefinedHobbies = [
      { id: "sports", label: "სპორტი", icon: <TrendingUp className="h-4 w-4" /> },
      { id: "books", label: "წიგნები", icon: <Award className="h-4 w-4" /> },
      { id: "hiking", label: "ტრეკინგი", icon: <Globe className="h-4 w-4" /> },
      { id: "music", label: "მუსიკა", icon: <MessageCircle className="h-4 w-4" /> },
      { id: "coding", label: "პროგარმირება", icon: <Zap className="h-4 w-4" /> },
      { id: "gaming", label: "თამაშები", icon: <Star className="h-4 w-4" /> },
      { id: "art", label: "ხელოვნება", icon: <Smile className="h-4 w-4" /> },
      { id: "meetups", label: "სტუმრები", icon: <Users className="h-4 w-4" /> }
    ];
    
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

    const addCustomHobby = () => {
      if (formData.customHobby.trim() && !formData.hobbies.includes(formData.customHobby.trim())) {
        setFormData(prev => ({
          ...prev,
          hobbies: [...prev.hobbies, prev.customHobby.trim()],
          customHobby: ""
        }));
      }
    };

    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h2 className="font-georgian text-lg font-semibold text-foreground mb-1">
            ინტერესები
          </h2>
          <p className="font-georgian text-xs text-muted-foreground">
            აირჩიეთ თქვენი ინტერესები და ჰობიები
          </p>
        </div>

        {/* Hobby Chips */}
        <div className="grid grid-cols-2 gap-1.5">
          {predefinedHobbies.map((hobby) => (
            <button
              key={hobby.id}
              type="button"
              onClick={() => toggleHobby(hobby.id)}
              className={`py-2.5 px-1.5 rounded-md text-xs font-georgian transition-all duration-200 flex flex-col items-center justify-center border ${
                formData.hobbies.includes(hobby.id)
                  ? "bg-gradient-primary text-white border-transparent shadow-sm"
                  : "bg-input border-input-border text-foreground hover:bg-accent hover:border-primary"
              }`}
            >
              <div className="mb-0.5">{hobby.icon}</div>
              <span className="text-[10px]">{hobby.label}</span>
            </button>
          ))}
        </div>

        {/* Custom Hobby Input */}
        <div className="mt-4">
          <Label className="font-georgian text-sm text-foreground mb-1.5 block flex items-center">
            <Plus className="mr-1.5 h-4 w-4 text-primary" />
            დაამატეთ სხვა ინტერესი
          </Label>
          <div className="flex space-x-1.5">
            <Input
              type="text"
              placeholder="შეიყვანეთ ინტერესი..."
              value={formData.customHobby}
              onChange={(e) => handleInputChange("customHobby", e.target.value)}
              className="flex-1 py-3 bg-input border-input-border rounded-lg text-sm font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomHobby();
                }
              }}
            />
            <Button 
              type="button" 
              onClick={addCustomHobby}
              className="px-3 py-3"
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Selected Hobbies */}
        {formData.hobbies.length > 0 && (
          <div className="mt-4">
            <Label className="font-georgian text-sm text-foreground mb-1.5 block">
              არჩეული ინტერესები:
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {formData.hobbies.map((hobbyId) => {
                const hobby = predefinedHobbies.find(h => h.id === hobbyId);
                return (
                  <span 
                    key={hobbyId} 
                    className="inline-flex items-center py-1 px-2 rounded-full bg-gradient-primary text-white text-[10px] font-georgian shadow-xs"
                  >
                    {hobby ? (
                      <>
                        <span className="mr-1">{hobby.icon}</span>
                        {hobby.label}
                      </>
                    ) : (
                      hobbyId
                    )}
                    <button
                      type="button"
                      onClick={() => toggleHobby(hobbyId)}
                      className="ml-1 text-white hover:text-gray-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Step 4: Time Availability
  const renderStep4 = () => {
    const timeSlots = [
      { id: "weekday_mornings", label: "სამუშაო დღეების დილა", icon: <Clock className="h-4 w-4" /> },
      { id: "weekday_evenings", label: "სამუშაო დღეების საღამო", icon: <Clock className="h-4 w-4" /> },
      { id: "weekends", label: "შაბათ-კვირა", icon: <Users className="h-4 w-4" /> },
      { id: "anytime", label: "ნებისმიერ დროს", icon: <Globe className="h-4 w-4" /> },
    ];

    const toggleTimeSlot = (slotId: string) => {
      setFormData(prev => {
        const availability = [...prev.availability];
        if (availability.includes(slotId)) {
          return { ...prev, availability: availability.filter(id => id !== slotId) };
        } else {
          return { ...prev, availability: [...availability, slotId] };
        }
      });
    };

    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <h2 className="font-georgian text-lg font-semibold text-foreground mb-1">
            თქვენი დრო
          </h2>
          <p className="font-georgian text-xs text-muted-foreground">
            როდის ხართ ხელმისაწვდომი შეხვდებისთვის?
          </p>
        </div>

        {/* Time Slot Chips */}
        <div className="grid grid-cols-1 gap-1.5">
          {timeSlots.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => toggleTimeSlot(slot.id)}
              className={`py-3 px-2.5 rounded-lg text-sm font-georgian text-left transition-all duration-200 flex items-center ${
                formData.availability.includes(slot.id)
                  ? "bg-gradient-primary text-white shadow-sm border-transparent"
                  : "bg-input border border-input-border text-foreground hover:bg-accent hover:border-primary"
              }`}
            >
              <div className="mr-2 p-1 rounded-md bg-white/20">
                {slot.icon}
              </div>
              <span>{slot.label}</span>
              {formData.availability.includes(slot.id) && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Step 5: Personality Snapshot
  const renderStep5 = () => {
    const questions = [
      {
        id: "extroversion",
        question: "ექსტრავერტული ხართ თუ ინტროვერტული?",
        options: [
          { value: "extrovert", label: "ექსტრავერტი", icon: <Users className="h-4 w-4" /> },
          { value: "introvert", label: "ინტროვერტი", icon: <User className="h-4 w-4" /> },
          { value: "ambivert", label: "ამბივერტი", icon: <MessageCircle className="h-4 w-4" /> },
        ]
      },
      {
        id: "planning",
        question: "როგორ ხვდებით გეგმებს?",
        options: [
          { value: "planner", label: "დამგეგმავი", icon: <Calendar className="h-4 w-4" /> },
          { value: "spontaneous", label: "სპონტანური", icon: <Star className="h-4 w-4" /> },
        ]
      }
    ];

    const handlePersonalityChange = (questionId: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        personality: {
          ...prev.personality,
          [questionId]: value
        }
      }));
    };

    return (
      <div className="space-y-5">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
            <Smile className="h-6 w-6 text-white" />
          </div>
          <h2 className="font-georgian text-lg font-semibold text-foreground mb-1">
            პიროვნება
          </h2>
          <p className="font-georgian text-xs text-muted-foreground">
            გვითხარით რამდენიმე სიტყვა თქვენი პიროვნების შესახებ
          </p>
        </div>

        {questions.map((q) => (
          <div key={q.id} className="space-y-2.5">
            <Label className="font-georgian text-sm text-foreground block flex items-center">
              <Star className="mr-1.5 h-4 w-4 text-primary" />
              {q.question}
            </Label>
            <div className="grid grid-cols-3 gap-1.5">
              {q.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handlePersonalityChange(q.id, option.value)}
                  className={`py-3 px-1.5 rounded-md text-[10px] font-georgian transition-all duration-200 flex flex-col items-center justify-center border ${
                    formData.personality[q.id] === option.value
                      ? "bg-gradient-primary text-white border-transparent shadow-sm"
                      : "bg-input border-input-border text-foreground hover:bg-accent hover:border-primary"
                  }`}
                >
                  <div className="mb-0.5">{option.icon}</div>
                  <span className="text-center">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Step 6: Social Integration Level
  const renderStep6 = () => {
    const levels = [
      { value: 1, label: "მხოლოდ მეგობრებთან" },
      { value: 2, label: "ახლო ნაცნობებთან" },
      { value: 3, label: "ნებისმიერთან" },
      { value: 4, label: "უცხოელებთან" },
      { value: 5, label: "ყველასთან" },
    ];

    return (
      <div className="space-y-5">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h2 className="font-georgian text-lg font-semibold text-foreground mb-1">
            სოციალური ინტეგრაცია
          </h2>
          <p className="font-georgian text-xs text-muted-foreground">
            როგორი დონის ადამიანებთან გსურთ შეხვდება?
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-0.5">
            <span className="font-georgian text-[10px] text-muted-foreground text-center">მხოლოდ მეგობრებთან</span>
            <span className="font-georgian text-[10px] text-muted-foreground text-center">ყველასთან</span>
          </div>
          
          <div className="flex space-x-1.5">
            {levels.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => handleInputChange("socialLevel", level.value)}
                className={`flex-1 py-2.5 rounded-md text-[10px] font-georgian transition-all duration-200 flex flex-col items-center justify-center border ${
                  formData.socialLevel === level.value
                    ? "bg-gradient-primary text-white border-transparent shadow-sm"
                    : "bg-input border-input-border text-foreground hover:bg-accent hover:border-primary"
                }`}
              >
                <span className="text-center px-0.5">{level.label}</span>
              </button>
            ))}
          </div>
          
          <div className="text-center mt-0.5">
            <p className="font-georgian text-sm font-semibold px-2.5 py-2 bg-input border border-input-border rounded-lg">
              {levels.find(l => l.value === formData.socialLevel)?.label}
            </p>
          </div>
        </div>

        {/* Review Summary */}
        <div className="bg-input border border-input-border rounded-lg p-3 mt-5 shadow-xs">
          <h3 className="font-georgian text-sm font-semibold mb-2.5 flex items-center">
            <Check className="mr-1.5 h-3.5 w-3.5 text-primary" />
            გადახედეთ ინფორმაციას
          </h3>
          <div className="space-y-1.5">
            <div className="flex">
              <span className="font-semibold w-16 flex-shrink-0 text-xs">სახელი:</span>
              <span className="text-muted-foreground text-xs">{formData.name || "არ არის მითითებული"}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-16 flex-shrink-0 text-xs">ასაკი:</span>
              <span className="text-muted-foreground text-xs">{formData.age || "არ არის მითითებული"}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-16 flex-shrink-0 text-xs">ინტერესები:</span>
              <span className="text-muted-foreground text-xs">
                {formData.hobbies.length > 0 
                  ? formData.hobbies.map(hobbyId => {
                      const hobby = [
                        { id: "sports", label: "სპორტი" },
                        { id: "books", label: "წიგნები" },
                        { id: "hiking", label: "ტრეკინგი" },
                        { id: "music", label: "მუსიკა" },
                        { id: "coding", label: "პროგარმირება" },
                        { id: "gaming", label: "თამაშები" },
                        { id: "art", label: "ხელოვნება" },
                        { id: "meetups", label: "სტუმრები" }
                      ].find(h => h.id === hobbyId);
                      return hobby ? hobby.label : hobbyId;
                    }).join(", ") 
                  : "არ არის მითითებული"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-3 bg-gradient-background relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-background opacity-70"></div>
      
      <Card className="relative z-10 w-full max-w-md bg-card/95 backdrop-blur-sm shadow-xl border-0 rounded-xl p-4">
        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-georgian text-xs text-muted-foreground">
              ნაბიჯი {step} / {totalSteps}
            </span>
            <span className="font-georgian text-xs text-muted-foreground">
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-input-border rounded-full h-1.5">
            <div 
              className="bg-gradient-primary h-1.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <img 
            src={gatherlyLogo} 
            alt="Gatherly" 
            className="mx-auto mb-1.5 h-10 object-contain"
          />
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {step === 6 && renderStep6()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="py-3 px-4 text-sm font-semibold rounded-lg border-input-border hover:bg-accent transition-all duration-200 flex items-center"
            >
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              უკან
            </Button>
            
            {step < totalSteps ? (
              <Button
                type="button"
                variant="gatherly"
                onClick={handleNext}
                className="py-3 px-4 text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center"
              >
                შემდეგი
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="gatherly"
                disabled={isLoading}
                className="py-3 px-4 text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    შენახვა...
                  </>
                ) : (
                  <>
                    დასრულება
                    <Check className="ml-1.5 h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Onboarding;