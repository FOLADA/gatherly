import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getEventById, updateEvent, deleteEvent, type Event } from "@/lib/databaseClient";
import { toast } from "sonner";
import backgroundImage from "@/assets/geometric-background.jpg";

const EditEvent = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    image_url: "",
  });

  useEffect(() => {
    if (eventId && user) {
      fetchEvent();
    }
  }, [eventId, user]);

  const fetchEvent = async () => {
    if (!eventId || !user) return;
    
    try {
      setLoading(true);
      const result = await getEventById(eventId);
      
      if (result.success && result.data) {
        const eventData = result.data;
        
        // Check if user owns this event
        if (eventData.created_by !== user.id) {
          toast.error('თქვენ არ გაქვთ ამ ღონისძიების რედაქტირების უფლება');
          navigate('/dashboard');
          return;
        }
        
        setEvent(eventData);
        setFormData({
          title: eventData.title,
          description: eventData.description || "",
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          category: eventData.category,
          image_url: eventData.image_url || "",
        });
      } else {
        toast.error('ღონისძიება ვერ მოიძებნა');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('შეცდომა ღონისძიების ჩატვირთვისას');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'ღონისძიების სახელი აუცილებელია';
    }
    
    if (!formData.date) {
      newErrors.date = 'თარიღი აუცილებელია';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'თარიღი არ უნდა იყოს წარსულში';
      }
    }
    
    if (!formData.time) {
      newErrors.time = 'დროის მითითება აუცილებელია';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'ლოკაცია აუცილებელია';
    }
    
    if (!formData.category) {
      newErrors.category = 'კატეგორიის არჩევა აუცილებელია';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!eventId || !user || !validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const result = await updateEvent(eventId, {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        date: formData.date,
        time: formData.time,
        location: formData.location.trim(),
        category: formData.category,
        image_url: formData.image_url.trim() || undefined,
      });
      
      if (result.success) {
        toast.success('ღონისძიება წარმატებით განახლდა!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'შეცდომა ღონისძიების განახლებისას');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('მოულოდნელი შეცდომა მოხდა');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!eventId || !user || !event) return;
    
    const confirmed = window.confirm('დარწმუნებული ხართ, რომ გსურთ ამ ღონისძიების წაშლა? ეს მოქმედება შეუქცევადია.');
    
    if (!confirmed) return;
    
    setDeleting(true);
    try {
      const result = await deleteEvent(eventId);
      
      if (result.success) {
        toast.success('ღონისძიება წარმატებით წაიშალა');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'შეცდომა ღონისძიების წაშლისას');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('მოულოდნელი შეცდომა მოხდა');
    } finally {
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold font-georgian mb-2">
            შესვლა საჭიროა
          </h2>
          <p className="text-muted-foreground font-georgian mb-6">
            ღონისძიების რედაქტირებისთვის გთხოვთ შედით სისტემაში
          </p>
          <Button asChild variant="gatherly" className="font-georgian">
            <a href="/login">შესვლა</a>
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
        <div className="flex items-center justify-between mb-8 pt-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="font-georgian">უკან</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white font-georgian">
                ღონისძიების რედაქტირება
              </h1>
              <p className="text-white/80 font-georgian">
                შეცვალეთ ღონისძიების დეტალები
              </p>
            </div>
          </div>
        </div>

        <Card className="p-6 bg-white/95 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <Label className="font-georgian text-sm text-foreground mb-2 block">
                ღონისძიების სახელი *
              </Label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`font-georgian ${errors.title ? 'border-red-500' : ''}`}
                placeholder="მაგ: ღია ცის ქვეშ კინოს ღამე"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1 font-georgian">{errors.title}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <Label className="font-georgian text-sm text-foreground mb-2 block">
                თარიღი *
              </Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className={`font-georgian ${errors.date ? 'border-red-500' : ''}`}
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1 font-georgian">{errors.date}</p>
              )}
            </div>

            {/* Time */}
            <div>
              <Label className="font-georgian text-sm text-foreground mb-2 block">
                დრო *
              </Label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                className={`font-georgian ${errors.time ? 'border-red-500' : ''}`}
              />
              {errors.time && (
                <p className="text-red-500 text-xs mt-1 font-georgian">{errors.time}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <Label className="font-georgian text-sm text-foreground mb-2 block">
                ლოკაცია *
              </Label>
              <Input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={`font-georgian ${errors.location ? 'border-red-500' : ''}`}
                placeholder="მაგ: რუსთაველის გამზირი 12"
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1 font-georgian">{errors.location}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <Label className="font-georgian text-sm text-foreground mb-2 block">
                კატეგორია *
              </Label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={`w-full px-3 py-2 border border-input bg-background rounded-md font-georgian ${errors.category ? 'border-red-500' : ''}`}
              >
                <option value="">აირჩიეთ კატეგორია</option>
                <option value="გასართობი">გასართობი</option>
                <option value="საგანმანათლებლო">საგანმანათლებლო</option>
                <option value="სოციალური">სოციალური</option>
                <option value="სპორტი">სპორტი</option>
                <option value="მოხალისეობრივი">მოხალისეობრივი</option>
                <option value="სხვა">სხვა</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1 font-georgian">{errors.category}</p>
              )}
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <Label className="font-georgian text-sm text-foreground mb-2 block">
                სურათის ლინკი
              </Label>
              <Input
                type="url"
                value={formData.image_url}
                onChange={(e) => handleInputChange("image_url", e.target.value)}
                className="font-georgian"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label className="font-georgian text-sm text-foreground mb-2 block">
                აღწერა
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="font-georgian min-h-[100px]"
                placeholder="მოგვიყევით ღონისძიების შესახებ..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              onClick={handleSave}
              disabled={saving || deleting}
              variant="gatherly"
              className="flex-1 font-georgian"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  შენახვა...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  ცვლილებების შენახვა
                </>
              )}
            </Button>
            
            <Button
              onClick={handleDelete}
              disabled={saving || deleting}
              variant="destructive"
              className="font-georgian"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  წაშლა...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  ღონისძიების წაშლა
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EditEvent;
