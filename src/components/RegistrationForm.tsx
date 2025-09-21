import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import backgroundImage from "@/assets/geometric-background.jpg";
import gatherlyLogo from "@/assets/GatherlyArched.png";
import { Link, useNavigate } from "react-router-dom";
import { signUpWithEmail, clearAuthState } from "@/lib/databaseClient";
import { toast } from "sonner";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validation function to check form inputs
  const validateForm = (): string | null => {
    // Check if all fields are filled
    if (!formData.name.trim()) {
      return "სახელი აუცილებელია";
    }
    
    if (!formData.email.trim()) {
      return "ელ-ფოსტა აუცილებელია";
    }
    
    if (!formData.password) {
      return "პაროლი აუცილებელია";
    }
    
    // Check password length (minimum 6 characters)
    if (formData.password.length < 6) {
      return "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო";
    }
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      return "პაროლები არ ემთხვევა";
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form inputs
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }
    
    // Set loading state to show spinner
    setIsLoading(true);
    
    try {
      // Clear any corrupted auth state before attempting signup
      await clearAuthState();
      
      // Proceed with signup
      const { data, error } = await signUpWithEmail(formData.email, formData.password, formData.name);
      
      if (error) {
        // Handle specific Supabase auth errors
        let errorMessage = "რეგისტრაციისას მოხდა შეცდომა";
        
        if (error.message.includes("already registered") || 
            error.message.includes("User already registered") ||
            error.message.includes("already exists")) {
          errorMessage = "თქვენ უკვე გაქვთ ანგარიში, შედით სისტემაში";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "არასწორი ელ-ფოსტის ფორმატი";
        } else if (error.message.includes("Password")) {
          errorMessage = "პაროლი ძალიან სუსტია";
        } else if (error.message.includes("rate limit") || error.message.includes("429")) {
          errorMessage = "ძალიან ბევრი მცდელობა. სცადეთ რამდენიმე წუთში";
        }
        
        toast.error(errorMessage);
        return;
      }
      
      if (data.user) {
        if (data.user.email_confirmed_at) {
          // User is already confirmed (shouldn't happen with new registrations)
          toast.success("რეგისტრაცია წარმატებით დასრულდა!");
          navigate("/onboarding");
        } else {
          // User needs to confirm email
          setEmailSent(true);
          toast.success(
            `რეგისტრაცია წარმატებით დასრულდა! გთხოვთ შეამოწმოთ თქვენი ელ-ფოსტა (${formData.email}) და დააჭირეთ დადასტურების ლინკს.`,
            {
              duration: 8000, // Show for 8 seconds
            }
          );
          // Don't redirect yet - wait for email confirmation
        }
      }
      
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("რეგისტრაციისას მოხდა შეცდომა. გთხოვთ სცადოთ ხელახლა.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-5 bg-gradient-background relative overflow-hidden safe-area-padding"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-background opacity-60"></div>
      
      <Card className="relative z-10 w-full max-w-sm sm:max-w-md bg-card shadow-2xl border-0 rounded-responsive p-6 sm:p-8 lg:p-10">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <img 
            src={gatherlyLogo} 
            alt="Gatherly" 
            className="mx-auto mb-2 h-16 sm:h-20 object-contain"
          />
          <h2 className="font-georgian text-responsive-xl font-semibold text-foreground mb-2">
            რეგისტრაცია
          </h2>
          <p className="font-georgian text-responsive-xs text-muted-foreground leading-relaxed">
            დარეგისტრირდი, რათა იპოვო მეგობრები და ივენთები
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Name Input */}
          <div className="relative">
            <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder" size={18} />
            <Input
              type="text"
              placeholder="სახელი"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-input border-input-border rounded-responsive text-responsive-sm font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent touch-target"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder" size={18} />
            <Input
              type="email"
              placeholder="ელ-ფოსტა"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-input border-input-border rounded-responsive text-responsive-sm font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent touch-target"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder" size={18} />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="პაროლი"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-input border-input-border rounded-responsive text-responsive-sm font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent touch-target"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-text-placeholder hover:text-foreground transition-colors touch-target p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder" size={18} />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="გაიმეორეთ პაროლი"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 bg-input border-input-border rounded-responsive text-responsive-sm font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent touch-target"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-text-placeholder hover:text-foreground transition-colors touch-target p-1"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="gatherly"
            className="w-full py-3 sm:py-4 text-responsive-sm font-semibold mt-6 sm:mt-8 touch-target rounded-responsive"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                რეგისტრაცია...
              </>
            ) : (
              "რეგისტრაცია"
            )}
          </Button>

          {/* Divider */}
          <div className="relative my-6 sm:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-input-border"></div>
            </div>
            <div className="relative flex justify-center text-responsive-xs">
              <span className="px-4 bg-card text-muted-foreground font-georgian">ან</span>
            </div>
          </div>

          {/* Google Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full py-3 sm:py-4 text-responsive-sm font-georgian border-input-border hover:bg-accent touch-target rounded-responsive"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-3.15.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            გაიარეთ Google-ით
          </Button>
        </form>

        {/* Email Confirmation Notice */}
        {emailSent && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <h3 className="font-georgian text-sm font-semibold text-blue-800">
                  ელ-ფოსტის დადასტურება
                </h3>
                <p className="font-georgian text-xs text-blue-700 mt-1">
                  დადასტურების ლინკი გაიგზავნა {formData.email}-ზე. 
                  გთხოვთ შეამოწმოთ თქვენი ელ-ფოსტა და დააჭირეთ ლინკს.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 space-y-3">
          <Link to={"/login"}>
          <button className="text-primary text-sm font-georgian underline hover:text-primary-dark transition-colors">
            უკვე გაქვთ ანგარიში? შედით სისტემაში
          </button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegistrationForm;