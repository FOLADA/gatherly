import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { User, Lock } from "lucide-react";
import backgroundImage from "@/assets/geometric-background.jpg";
import gatherlyLogo from "@/assets/GatherlyArched.png";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted:", formData);
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
      <div className="absolute inset-0 bg-gradient-background opacity-60"></div>
      
      <Card className="relative z-10 w-full max-w-md bg-card shadow-2xl border-0 rounded-2xl p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src={gatherlyLogo} 
            alt="Gatherly" 
            className="mx-auto mb-1 h-20 object-contain"
          />
          <h2 className="font-georgian text-2xl font-semibold text-foreground mb-3">
            ავტორიზაცია
          </h2>
          <p className="font-georgian text-sm text-muted-foreground leading-relaxed">
            შედი სისტემაში, რათა იპოვო მეგობრები და ივენთები
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-placeholder" size={20} />
            <Input
              type="email"
              placeholder="ემაილი"
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
            className="w-full py-4 text-base font-semibold mt-8"
          >
            შესვლა
          </Button>

          {/* Footer Links */}
          <div className="text-center mt-8 space-y-3">
            <Link to={"/register"}>
            <button className="text-primary text-sm font-georgian underline hover:text-primary-dark transition-colors">
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