import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  Plus, 
  Settings,
  User,
  Heart,
  TrendingUp,
  Award,
  Edit3,
  Trash2,
  Eye
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getEvents, getEventParticipants, getUserProfile, type Event } from "@/lib/databaseClient";
import { toast } from "sonner";
import backgroundImage from "@/assets/geometric-background.jpg";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch user profile
      const profileResult = await getUserProfile(user.id);
      if (profileResult) {
        setUserProfile(profileResult);
      }

      // Fetch all events
      const eventsResult = await getEvents();
      if (eventsResult.success && eventsResult.data) {
        const allEvents = eventsResult.data;
        
        // Filter events created by user
        const userCreatedEvents = allEvents.filter(event => event.created_by === user.id);
        setCreatedEvents(userCreatedEvents);

        // Find events user has joined
        const joinedEventsData: Event[] = [];
        for (const event of allEvents) {
          const participantsResult = await getEventParticipants(event.id);
          if (participantsResult.success && participantsResult.data) {
            const isJoined = participantsResult.data.some(p => p.user_id === user.id);
            if (isJoined) {
              joinedEventsData.push(event);
            }
          }
        }
        setJoinedEvents(joinedEventsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('შეცდომა მონაცემების ჩატვირთვისას');
    } finally {
      setLoading(false);
    }
  };

  const EventCard = ({ event, showActions = false }: { event: Event; showActions?: boolean }) => (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Calendar className="h-8 w-8 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-georgian font-semibold text-lg mb-2 truncate">
            {event.title}
          </h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="font-georgian">
                {new Date(event.date).toLocaleDateString('ka-GE')} • {event.time}
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="font-georgian truncate">{event.location}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span className="font-georgian">{event.category}</span>
            </div>
          </div>
          {showActions && (
            <div className="mt-3 flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="font-georgian"
                onClick={() => navigate(`/events`)}
              >
                <Eye className="h-4 w-4 mr-1" />
                ნახვა
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="font-georgian"
                onClick={() => navigate(`/edit-event/${event.id}`)}
              >
                <Edit3 className="h-4 w-4 mr-1" />
                რედაქტირება
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-georgian mb-2">
              გამარჯობა, {user.user_metadata?.name || user.email?.split('@')[0]}
            </h1>
            <p className="text-muted-foreground font-georgian">
              თქვენი ღონისძიებების მართვის პანელი
            </p>
          </div>
          <Button asChild variant="gatherly" className="font-georgian">
            <Link to="/add-event">
              <Plus className="h-4 w-4 mr-2" />
              ახალი ღონისძიება
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{createdEvents.length}</p>
                <p className="text-sm text-muted-foreground font-georgian">შექმნილი ღონისძიება</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{joinedEvents.length}</p>
                <p className="text-sm text-muted-foreground font-georgian">მონაწილეობა</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="joined" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="joined" className="font-georgian">
              ჩემი მონაწილეობა ({joinedEvents.length})
            </TabsTrigger>
            <TabsTrigger value="created" className="font-georgian">
              ჩემი ღონისძიებები ({createdEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="joined" className="space-y-4">
            {joinedEvents.length > 0 ? (
              <div className="grid gap-4">
                {joinedEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold font-georgian mb-2">
                  ჯერ არ მონაწილეობთ ღონისძიებებში
                </h3>
                <p className="text-muted-foreground font-georgian mb-6">
                  იპოვეთ საინტერესო ღონისძიებები და შეუერთდით მათ!
                </p>
                <Button asChild variant="gatherly" className="font-georgian">
                  <Link to="/events">ღონისძიებების ნახვა</Link>
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="created" className="space-y-4">
            {createdEvents.length > 0 ? (
              <div className="grid gap-6">
                {createdEvents.map(event => (
                  <EventCard key={event.id} event={event} showActions />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold font-georgian mb-2">
                  ჯერ არ გაქვთ შექმნილი ღონისძიებები
                </h3>
                <p className="text-muted-foreground font-georgian mb-6">
                  შექმენით თქვენი პირველი ღონისძიება და მოიზიდეთ მონაწილეები!
                </p>
                <Button asChild variant="gatherly" className="font-georgian">
                  <Link to="/add-event">ღონისძიების შექმნა</Link>
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
