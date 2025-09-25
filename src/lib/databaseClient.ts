import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Re-export Supabase types for convenience
export type { User, Session, AuthError } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  name: string
  age: number
  instagram_profile?: string
  bio?: string
  hobbies: string[]
  availability: string[]
  personality: Record<string, string>
  image_url?: string
  social_level: number
  created_at?: string
  updated_at?: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  max_participants?: number
  image_url?: string
  created_by: string
  created_at?: string
  updated_at?: string
}

export interface EventParticipant {
  id: string
  event_id: string
  user_id: string
  joined_at: string
}

export interface UserInteraction {
  id: string
  user_id: string
  target_user_id: string
  interaction_type: 'like' | 'dislike'
  created_at: string
}

export interface UserMatch {
  id: string
  user1_id: string
  user2_id: string
  matched_at: string
}

export interface PublicUserProfile extends UserProfile {
  email?: string
  match_percentage?: number
  interaction_status?: 'like' | 'dislike' | null
}

export const uploadProfileImage = async (file: File, userId: string): Promise<string | null> => {
  try {
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
      return null;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      return null;
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `profile-images/${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error('Error uploading image:', error)
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Error in uploadProfileImage:', error)
    return null
  }
}

export const upsertUserProfile = async (profileData: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        ...profileData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })

    if (error) {
      console.error('Error upserting user profile:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in upsertUserProfile:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - user profile doesn't exist yet
        return null
      }
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getUserProfile:', error)
    return null
  }
}

// Authentication helper functions
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { data, error }
  } catch (error) {
    console.error('Error in signInWithEmail:', error)
    return { data: null, error }
  }
}

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
        emailRedirectTo: `${window.location.origin}/onboarding`
      }
    })

    return { data, error }
  } catch (error) {
    console.error('Error in signUpWithEmail:', error)
    return { data: null, error }
  }
}

// Clear any corrupted auth state
export const clearAuthState = async () => {
  try {
    await supabase.auth.signOut()
    // Clear localStorage items that might be corrupted
    localStorage.removeItem('supabase.auth.token')
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    if (supabaseUrl) {
      localStorage.removeItem('sb-' + supabaseUrl.split('//')[1].split('.')[0] + '-auth-token')
    }
  } catch (error) {
    console.error('Error clearing auth state:', error)
  }
}

// Check if user exists by email - simplified approach
export const checkUserExistsBySignup = async (email: string): Promise<{ exists: boolean; error?: string }> => {
  // Let Supabase handle duplicate detection during actual signup
  // This is more reliable and doesn't trigger rate limits
  return { exists: false }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    console.error('Error in signOut:', error)
    return { error }
  }
}

// Event CRUD Operations
export const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: Event; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert({
        ...eventData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating event:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in createEvent:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const getEvents = async (): Promise<{ success: boolean; data?: Event[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching events:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error in getEvents:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const getEventById = async (eventId: string): Promise<{ success: boolean; data?: Event; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (error) {
      console.error('Error fetching event:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in getEventById:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const updateEvent = async (eventId: string, eventData: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>): Promise<{ success: boolean; data?: Event; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update({
        ...eventData,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventId)
      .select()
      .single()

    if (error) {
      console.error('Error updating event:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in updateEvent:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const deleteEvent = async (eventId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    if (error) {
      console.error('Error deleting event:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in deleteEvent:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Event Participation Functions
export const joinEvent = async (eventId: string, userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('event_participants')
      .insert({
        event_id: eventId,
        user_id: userId,
        joined_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error joining event:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in joinEvent:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const leaveEvent = async (eventId: string, userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error leaving event:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in leaveEvent:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const getEventParticipants = async (eventId: string): Promise<{ success: boolean; data?: EventParticipant[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('event_participants')
      .select('*')
      .eq('event_id', eventId)

    if (error) {
      console.error('Error fetching event participants:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error in getEventParticipants:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export const isUserJoinedEvent = async (eventId: string, userId: string): Promise<{ success: boolean; isJoined?: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('event_participants')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking event participation:', error)
      return { success: false, error: error.message }
    }

    return { success: true, isJoined: !!data }
  } catch (error) {
    console.error('Error in isUserJoinedEvent:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// ============================================
// PEOPLE SELECTION MODULE FUNCTIONS
// ============================================

// Calculate match percentage based on shared interests and preferences
export const calculateMatchPercentage = (currentUser: UserProfile, targetUser: UserProfile): number => {
  let score = 0;
  let totalFactors = 0;

  // Age compatibility (20% weight)
  if (currentUser.age && targetUser.age) {
    const ageDiff = Math.abs(currentUser.age - targetUser.age);
    if (ageDiff <= 2) score += 20;
    else if (ageDiff <= 5) score += 15;
    else if (ageDiff <= 10) score += 10;
    else if (ageDiff <= 15) score += 5;
    totalFactors += 20;
  } else if (currentUser.age || targetUser.age) {
    // Give partial score if only one has age
    score += 10;
    totalFactors += 20;
  }

  // Shared hobbies (30% weight)
  if (currentUser.hobbies && targetUser.hobbies && currentUser.hobbies.length > 0 && targetUser.hobbies.length > 0) {
    const sharedHobbies = currentUser.hobbies.filter(hobby => targetUser.hobbies?.includes(hobby));
    const hobbyScore = (sharedHobbies.length / Math.max(currentUser.hobbies.length, targetUser.hobbies.length)) * 30;
    score += hobbyScore;
    totalFactors += 30;
  } else if ((currentUser.hobbies && currentUser.hobbies.length > 0) || (targetUser.hobbies && targetUser.hobbies.length > 0)) {
    // Give partial score if only one has hobbies
    score += 15;
    totalFactors += 30;
  }

  // Availability compatibility (25% weight)
  if (currentUser.availability && targetUser.availability && currentUser.availability.length > 0 && targetUser.availability.length > 0) {
    const sharedAvailability = currentUser.availability.filter(slot => targetUser.availability?.includes(slot));
    const availabilityScore = (sharedAvailability.length / Math.max(currentUser.availability.length, targetUser.availability.length)) * 25;
    score += availabilityScore;
    totalFactors += 25;
  } else if ((currentUser.availability && currentUser.availability.length > 0) || (targetUser.availability && targetUser.availability.length > 0)) {
    // Give partial score if only one has availability
    score += 12;
    totalFactors += 25;
  }

  // Social level compatibility (25% weight)
  if (currentUser.social_level && targetUser.social_level) {
    const socialDiff = Math.abs(currentUser.social_level - targetUser.social_level);
    if (socialDiff === 0) score += 25;
    else if (socialDiff === 1) score += 20;
    else if (socialDiff === 2) score += 15;
    else if (socialDiff === 3) score += 10;
    else score += 5;
    totalFactors += 25;
  } else if (currentUser.social_level || targetUser.social_level) {
    // Give partial score if only one has social level
    score += 12;
    totalFactors += 25;
  }

  // Return percentage (minimum 15% for any profile, maximum 95%)
  const percentage = totalFactors > 0 ? Math.round(score) : 15;
  return Math.max(15, Math.min(95, percentage));
}

// Get all users for meetups page (excluding current user and already interacted users)
export const getUsersForMeetups = async (currentUserId: string): Promise<{ success: boolean; data?: PublicUserProfile[]; error?: string }> => {
  try {
    // Validate input
    if (!currentUserId || typeof currentUserId !== 'string') {
      return { success: false, error: 'Invalid user ID provided' };
    }

    // Get current user's profile for match calculation
    const currentUserProfile = await getUserProfile(currentUserId);
    if (!currentUserProfile) {
      return { success: false, error: 'Current user profile not found. Please complete your profile first.' };
    }

    // Get users that current user hasn't interacted with yet
    const { data: interactedUserIds, error: interactionError } = await supabase
      .from('user_interactions')
      .select('target_user_id')
      .eq('user_id', currentUserId);

    if (interactionError) {
      console.error('Error fetching interactions:', interactionError);
      return { success: false, error: 'Failed to load interaction history' };
    }

    console.log('Interacted user IDs:', interactedUserIds);

    // Get all user profiles first
    const { data: allProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .neq('id', currentUserId) // Exclude current user
      .limit(100); // Get more initially, then filter

    if (profilesError) {
      console.error('Error fetching user profiles:', profilesError);
      return { success: false, error: 'Failed to load user profiles' };
    }

    // Filter out interacted users in JavaScript (more reliable)
    const interactedIds = interactedUserIds?.map(i => i.target_user_id) || [];
    const profiles = allProfiles?.filter(profile => !interactedIds.includes(profile.id)) || [];
    console.log('Raw profiles fetched:', allProfiles?.length || 0);
    console.log('Profiles after filtering interactions:', profiles?.length || 0);

    if (!profiles || profiles.length === 0) {
      console.log('No profiles available after filtering interactions');
      return { success: true, data: [] };
    }

    // Filter out profiles with insufficient data (more lenient filtering)
    const validProfiles = profiles.filter(profile => {
      // Basic validation - only require name and reasonable age
      const hasName = profile.name && profile.name.trim().length > 0;
      const hasValidAge = profile.age && profile.age >= 16 && profile.age <= 100;
      
      // More lenient - only require name OR age, not both
      const isValid = hasName || hasValidAge;
      
      if (!isValid) {
        console.log('Filtering out invalid profile:', {
          id: profile.id,
          name: profile.name,
          age: profile.age,
          hasName,
          hasValidAge
        });
      }
      
      return isValid;
    });

    console.log('Valid profiles after filtering:', validProfiles.length);

    // If no valid profiles, try with even more lenient criteria
    let finalProfiles = validProfiles;
    if (validProfiles.length === 0) {
      console.log('No valid profiles found with strict criteria, trying lenient filtering...');
      finalProfiles = profiles.filter(profile => profile.id && profile.id.trim().length > 0);
      console.log('Profiles with lenient filtering:', finalProfiles.length);
    }

    if (finalProfiles.length === 0) {
      console.log('No profiles found even with lenient filtering, returning empty array');
      return { success: true, data: [] };
    }

    // Get user emails from auth.users (with error handling)
    let authUsers: any[] = [];
    try {
      const { data: authData, error: authError } = await supabase
        .from('auth.users')
        .select('id, email')
        .in('id', finalProfiles.map(p => p.id));

      if (authError) {
        console.warn('Error fetching auth users (non-critical):', authError);
      } else {
        authUsers = authData || [];
      }
    } catch (authError) {
      console.warn('Failed to fetch auth users (non-critical):', authError);
    }

    // Combine profiles with emails and calculate match percentages
    const publicProfiles: PublicUserProfile[] = finalProfiles.map(profile => {
      const authUser = authUsers.find(u => u.id === profile.id);
      let matchPercentage = 15; // Default minimum
      
      try {
        matchPercentage = calculateMatchPercentage(currentUserProfile, profile);
      } catch (error) {
        console.warn('Error calculating match percentage for user:', profile.id, error);
      }
      
      // Ensure profile has minimum required data with fallbacks
      const enhancedProfile = {
        ...profile,
        name: profile.name || 'ანონიმური მომხმარებელი',
        age: profile.age || 25, // Default age if missing
        bio: profile.bio || 'ბიოგრაფია არ არის მითითებული',
        hobbies: profile.hobbies || [],
        availability: profile.availability || [],
        personality: profile.personality || {},
        social_level: profile.social_level || 3,
        email: authUser?.email,
        match_percentage: matchPercentage,
        interaction_status: null
      };
      
      return enhancedProfile;
    });

    // Sort by match percentage (highest first), then by creation date
    publicProfiles.sort((a, b) => {
      const matchDiff = (b.match_percentage || 0) - (a.match_percentage || 0);
      if (matchDiff !== 0) return matchDiff;
      
      // Secondary sort by created_at (newest first)
      const aDate = new Date(a.created_at || 0).getTime();
      const bDate = new Date(b.created_at || 0).getTime();
      return bDate - aDate;
    });

    console.log('Final public profiles to return:', publicProfiles.length);
    console.log('Sample profile:', publicProfiles[0] ? {
      id: publicProfiles[0].id,
      name: publicProfiles[0].name,
      age: publicProfiles[0].age,
      match_percentage: publicProfiles[0].match_percentage
    } : 'No profiles');

    return { success: true, data: publicProfiles };
  } catch (error) {
    console.error('Error in getUsersForMeetups:', error);
    return { success: false, error: 'An unexpected error occurred while loading users' };
  }
}

// Create or update user interaction (like/dislike)
export const createUserInteraction = async (userId: string, targetUserId: string, interactionType: 'like' | 'dislike'): Promise<{ success: boolean; error?: string; isMatch?: boolean }> => {
  try {
    // Validate inputs
    if (!userId || !targetUserId || !interactionType) {
      return { success: false, error: 'Missing required parameters' };
    }

    if (userId === targetUserId) {
      return { success: false, error: 'Cannot interact with yourself' };
    }

    if (!['like', 'dislike'].includes(interactionType)) {
      return { success: false, error: 'Invalid interaction type' };
    }

    // Check if target user exists
    const { data: targetProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', targetUserId)
      .single();

    if (profileError || !targetProfile) {
      return { success: false, error: 'Target user not found' };
    }

    // Create the interaction
    const { error } = await supabase
      .from('user_interactions')
      .upsert({
        user_id: userId,
        target_user_id: targetUserId,
        interaction_type: interactionType
      }, {
        onConflict: 'user_id,target_user_id'
      });

    if (error) {
      console.error('Error creating user interaction:', error);
      return { success: false, error: 'Failed to save interaction' };
    }

    // Check if this created a match (only for likes)
    let isMatch = false;
    if (interactionType === 'like') {
      try {
        const { data: reverseInteraction, error: reverseError } = await supabase
          .from('user_interactions')
          .select('interaction_type')
          .eq('user_id', targetUserId)
          .eq('target_user_id', userId)
          .single();

        if (!reverseError && reverseInteraction?.interaction_type === 'like') {
          isMatch = true;
        }
      } catch (error) {
        console.warn('Error checking for match:', error);
      }
    }

    return { success: true, isMatch };
  } catch (error) {
    console.error('Error in createUserInteraction:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Get user's liked profiles (favorites)
export const getUserFavorites = async (userId: string): Promise<{ success: boolean; data?: PublicUserProfile[]; error?: string }> => {
  try {
    // Get current user's profile for match calculation
    const currentUserProfile = await getUserProfile(userId);
    if (!currentUserProfile) {
      return { success: false, error: 'Current user profile not found' };
    }

    // Get liked user IDs
    const { data: likedInteractions, error: interactionError } = await supabase
      .from('user_interactions')
      .select('target_user_id')
      .eq('user_id', userId)
      .eq('interaction_type', 'like');

    if (interactionError) {
      console.error('Error fetching liked interactions:', interactionError);
      return { success: false, error: interactionError.message };
    }

    if (!likedInteractions || likedInteractions.length === 0) {
      return { success: true, data: [] };
    }

    const likedUserIds = likedInteractions.map(i => i.target_user_id);

    // Get profiles of liked users
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .in('id', likedUserIds);

    if (profilesError) {
      console.error('Error fetching liked profiles:', profilesError);
      return { success: false, error: profilesError.message };
    }

    // Get user emails from auth.users
    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('id, email')
      .in('id', likedUserIds);

    if (authError) {
      console.error('Error fetching auth users:', authError);
    }

    // Combine profiles with emails and match percentages
    const favoriteProfiles: PublicUserProfile[] = (profiles || []).map(profile => {
      const authUser = authUsers?.find(u => u.id === profile.id);
      const matchPercentage = calculateMatchPercentage(currentUserProfile, profile);
      
      return {
        ...profile,
        email: authUser?.email,
        match_percentage: matchPercentage,
        interaction_status: 'like' as const
      };
    });

    // Sort by match percentage (highest first)
    favoriteProfiles.sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0));

    return { success: true, data: favoriteProfiles };
  } catch (error) {
    console.error('Error in getUserFavorites:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Get user matches (mutual likes)
export const getUserMatches = async (userId: string): Promise<{ success: boolean; data?: PublicUserProfile[]; error?: string }> => {
  try {
    // Get current user's profile for match calculation
    const currentUserProfile = await getUserProfile(userId);
    if (!currentUserProfile) {
      return { success: false, error: 'Current user profile not found' };
    }

    // Get matches where current user is involved
    const { data: matches, error: matchError } = await supabase
      .from('user_matches')
      .select('user1_id, user2_id')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

    if (matchError) {
      console.error('Error fetching matches:', matchError);
      return { success: false, error: matchError.message };
    }

    if (!matches || matches.length === 0) {
      return { success: true, data: [] };
    }

    // Extract the other user IDs from matches
    const matchedUserIds = matches.map(match => 
      match.user1_id === userId ? match.user2_id : match.user1_id
    );

    // Get profiles of matched users
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .in('id', matchedUserIds);

    if (profilesError) {
      console.error('Error fetching matched profiles:', profilesError);
      return { success: false, error: profilesError.message };
    }

    // Get user emails from auth.users
    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('id, email')
      .in('id', matchedUserIds);

    if (authError) {
      console.error('Error fetching auth users:', authError);
    }

    // Combine profiles with emails and match percentages
    const matchedProfiles: PublicUserProfile[] = (profiles || []).map(profile => {
      const authUser = authUsers?.find(u => u.id === profile.id);
      const matchPercentage = calculateMatchPercentage(currentUserProfile, profile);
      
      return {
        ...profile,
        email: authUser?.email,
        match_percentage: matchPercentage,
        interaction_status: 'like' as const
      };
    });

    // Sort by match percentage (highest first)
    matchedProfiles.sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0));

    return { success: true, data: matchedProfiles };
  } catch (error) {
    console.error('Error in getUserMatches:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
