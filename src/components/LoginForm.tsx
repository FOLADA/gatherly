import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { User, Lock, Loader2 } from "lucide-react";
import backgroundImage from "@/assets/geometric-background.jpg";
import gatherlyLogo from "@/assets/GatherlyArched.png";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmail, clearAuthState } from "@/lib/databaseClient";
import { toast } from "sonner";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validation function to check form inputs
  const validateForm = (): string | null => {
    if (!formData.email.trim()) {
      return "ელ-ფოსტა აუცილებელია";
    }
    
    if (!formData.password) {
      return "პაროლი აუცილებელია";
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
      // Clear any corrupted auth state before attempting login
      await clearAuthState();
      
      // Call Supabase Auth signIn with email and password
      const { data, error } = await signInWithEmail(formData.email, formData.password);
      
      if (error) {
        // Handle specific authentication errors
        let errorMessage = "შესვლისას მოხდა შეცდომა";
        
        if (error.message.includes("Invalid login credentials") || 
            error.message.includes("Invalid email or password")) {
          errorMessage = "არასწორი ელ-ფოსტა ან პაროლი";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "გთხოვთ დაადასტუროთ თქვენი ელ-ფოსტა";
        } else if (error.message.includes("Too many requests") || error.message.includes("429")) {
          errorMessage = "ძალიან ბევრი მცდელობა. სცადეთ რამდენიმე წუთში";
        }
        
        toast.error(errorMessage);
        return;
      }
      
      if (data.user) {
        // Successful login
        toast.success("წარმატებით შეხვედით სისტემაში!");
        // Redirect to home page
        navigate("/");
      }
      
    } catch (error) {
      console.error("Login error:", error);
      toast.error("შესვლისას მოხდა შეცდომა. გთხოვთ სცადოთ ხელახლა.");
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
          <h2 className="font-georgian text-responsive-xl font-semibold text-foreground mb-2 sm:mb-3">
            ავტორიზაცია
          </h2>
          <p className="font-georgian text-responsive-xs text-muted-foreground leading-relaxed">
            შედი სისტემაში, რათა იპოვო მეგობრები და ივენთები
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Email Input */}
          <div className="relative">
            <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder" size={18} />
            <Input
              type="email"
              placeholder="ემაილი"
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
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" x2="23" y1="1" y2="23"/>
                  <path d="M13.6 13.7a3 3 0 1 1-4.24-4.24"/>
                  <path d="M16.63 16.7a8 8 0 0 1-10.63-10.63"/>
                </svg>
              )}
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
                შესვლა...
              </>
            ) : (
              "შესვლა"
            )}
          </Button>

          {/* Footer Links */}
          <div className="text-center mt-6 sm:mt-8 space-y-3">
            <Link to={"/register"}>
            <button className="text-primary text-responsive-xs font-georgian underline hover:text-primary-dark transition-colors touch-target p-2">
              არ არ ხარ წევრი? გაიარე რეგისტრაცია!
            </button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginForm;