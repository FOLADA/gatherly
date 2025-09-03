import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import backgroundImage from "@/assets/geometric-background.jpg";

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registration submitted:", formData);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-5 bg-gradient-background relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-background opacity-80"></div>
      
      <Card className="relative z-10 w-full max-w-md bg-card shadow-2xl border-0 rounded-2xl p-10">
        {/* Back Arrow */}
        <button className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-sans text-3xl font-semibold text-primary tracking-wider mb-2">
            Gatherly
          </h1>
          <h2 className="font-georgian text-2xl font-semibold text-foreground mb-2">
            რეგისტრაცია
          </h2>
          <p className="font-georgian text-sm text-muted-foreground leading-relaxed">
            დარეგისტრირდით, რათა იქონიოთ შესაძლებლობა და იყიდოთ
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder" size={20} />
            <Input
              type="text"
              placeholder="სახელი"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="pl-12 pr-4 py-4 bg-input border-input-border rounded-xl text-base font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder" size={20} />
            <Input
              type="email"
              placeholder="ელ-ფოსტა"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="pl-12 pr-4 py-4 bg-input border-input-border rounded-xl text-base font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder" size={20} />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="პაროლი"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="pl-12 pr-12 py-4 bg-input border-input-border rounded-xl text-base font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-placeholder hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder" size={20} />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="გაიმეორეთ პაროლი"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="pl-12 pr-12 py-4 bg-input border-input-border rounded-xl text-base font-georgian placeholder:text-text-placeholder focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-placeholder hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="gatherly"
            className="w-full py-4 text-base font-semibold mt-6"
          >
            შესვლა
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-input-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground font-georgian">ან</span>
            </div>
          </div>

          {/* Google Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full py-4 text-base font-georgian border-input-border hover:bg-accent"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            გაიარეთ Google-ით
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 space-y-3">
          <button className="text-primary text-sm font-georgian underline hover:text-primary-dark transition-colors">
            უკვე გაქვთ ანგარიში? შედით სისტემაში
          </button>
          <div>
            <span className="inline-block bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs font-semibold">
              ENG
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegistrationForm;