import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Users, Image, Plus, ArrowLeft, Check } from "lucide-react";
import backgroundImage from "@/assets/geometric-background.jpg";
import gatherlyLogo from "@/assets/GatherlyArched.png";
import { Link, useNavigate } from "react-router-dom";
import { createEvent } from "@/lib/databaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const AddEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    category: "",
    description: "",
    maxParticipants: "",
    image: null as File | null,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "ივენთის დასახელება აუცილებელია";
    }
    
    if (!formData.date) {
      newErrors.date = "თარიღი აუცილებელია";
    }
    
    if (!formData.time) {
      newErrors.time = "დრო აუცილებელია";
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "ადგილი აუცილებელია";
    }
    
    if (!formData.category) {
      newErrors.category = "კატეგორიის არჩევა აუცილებელია";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user) {
      toast.error("გთხოვთ შედით სისტემაში");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim() || "",
        date: formData.date,
        time: formData.time,
        location: formData.location.trim(),
        category: formData.category,
        max_participants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
        image_url: "", // TODO: Handle image upload later
        created_by: user.id
      };

      const result = await createEvent(eventData);
      
      if (result.success) {
        toast.success("ივენთი წარმატებით შეიქმნა!");
        navigate("/events", { state: { fromAddEvent: true } });
      } else {
        toast.error(result.error || "შეცდომა ივენთის შექმნისას");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("მოულოდნელი შეცდომა მოხდა");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: "გასართობი", label: "გასართობი" },
    { value: "საგანმანათლებლო", label: "საგანმანათლებლო" },
    { value: "სოციალური", label: "სოციალური" },
    { value: "სპორტი", label: "სპორტი" },
    { value: "მოხალისეობრივი", label: "მოხალისეობრივი" },
    { value: "სხვა", label: "სხვა" }
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-background relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-background opacity-70"></div>
      
      <Card className="relative z-10 w-full max-w-md bg-card/95 backdrop-blur-sm shadow-xl border-0 rounded-2xl p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
            <Plus className="h-8 w-8 text-white" />
          </div>
          <h2 className="font-georgian text-2xl font-semibold text-foreground mb-2">
            დაამატე ივენთი
          </h2>
          <p className="font-georgian text-base text-muted-foreground">
            შექმენი ახალი ღონისძიება
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Input */}
          <div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder">
                <Plus className="h-5 w-5" />
              </div>
              <Input
                type="text"
                placeholder="ივენთის დასახელება"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`pl-12 pr-4 py-5 bg-input border-input-border rounded-xl text-base font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                  errors.title ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.title && (
              <p className="font-georgian text-red-500 text-sm mt-1 ml-2">{errors.title}</p>
            )}
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder">
                  <Calendar className="h-5 w-5" />
                </div>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className={`pl-12 pr-4 py-5 bg-input border-input-border rounded-xl text-base font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                    errors.date ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.date && (
                <p className="font-georgian text-red-500 text-sm mt-1 ml-2">{errors.date}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder">
                  <Clock className="h-5 w-5" />
                </div>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  className={`pl-12 pr-4 py-5 bg-input border-input-border rounded-xl text-base font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                    errors.time ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.time && (
                <p className="font-georgian text-red-500 text-sm mt-1 ml-2">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Location Input */}
          <div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder">
                <MapPin className="h-5 w-5" />
              </div>
              <Input
                type="text"
                placeholder="ადგილი"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={`pl-12 pr-4 py-5 bg-input border-input-border rounded-xl text-base font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                  errors.location ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.location && (
              <p className="font-georgian text-red-500 text-sm mt-1 ml-2">{errors.location}</p>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <Label className="font-georgian text-base text-foreground mb-3 block flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              კატეგორია
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleInputChange("category", category.value)}
                  className={`py-4 px-3 rounded-xl text-base font-georgian transition-all duration-200 flex flex-col items-center justify-center border-2 ${
                    formData.category === category.value
                      ? "bg-gradient-primary text-white border-transparent shadow-md"
                      : "bg-input border-input-border text-foreground hover:bg-accent hover:border-primary"
                  }`}
                >
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="font-georgian text-red-500 text-sm mt-1 ml-2">{errors.category}</p>
            )}
          </div>

          {/* Max Participants Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder">
              <Users className="h-5 w-5" />
            </div>
            <Input
              type="number"
              placeholder="მაქსიმალური მონაწილეების რაოდენობა"
              value={formData.maxParticipants}
              onChange={(e) => handleInputChange("maxParticipants", e.target.value)}
              className="pl-12 pr-4 py-5 bg-input border-input-border rounded-xl text-base font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Description Input */}
          <div>
            <Label className="font-georgian text-base text-foreground mb-3 block flex items-center">
              <Plus className="mr-2 h-5 w-5 text-primary" />
              აღწერა
            </Label>
            <Textarea
              placeholder="ივენთის აღწერა..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="px-4 py-4 bg-input border-input-border rounded-xl text-base font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 min-h-[120px]"
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label className="font-georgian text-base text-foreground mb-3 block flex items-center">
              <Image className="mr-2 h-5 w-5 text-primary" />
              სურათი
            </Label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-input-border border-dashed rounded-2xl cursor-pointer bg-input hover:bg-accent transition-all duration-200 group">
                <div className="flex flex-col items-center justify-center pt-3 pb-4">
                  <Image className="w-8 h-8 mb-2 text-text-placeholder group-hover:text-foreground transition-colors duration-200" />
                  <p className="text-sm text-text-placeholder group-hover:text-foreground transition-colors duration-200">
                    <span className="font-semibold">ატვირთეთ ფაილი</span> ან გადაათრიეთ აქ
                  </p>
                  <p className="text-xs text-text-placeholder mt-1">(PNG ან JPG, მაქს. 5MB)</p>
                </div>
                <Input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleInputChange("image", e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              type="submit"
              variant="gatherly"
              disabled={isSubmitting}
              className="flex-1 py-5 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  იგზავნება...
                </>
              ) : (
                <>
                  დამატება
                  <Check className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1 py-5 text-base font-semibold rounded-xl border-input-border hover:bg-accent transition-all duration-200"
              asChild
            >
              <Link to="/events">
                <ArrowLeft className="mr-2 h-5 w-5" />
                უკან დაბრუნება
              </Link>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddEvent;