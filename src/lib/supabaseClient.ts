import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

export const uploadProfileImage = async (file: File, userId: string): Promise<string | null> => {
  try {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
      return null;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      return null;
    }
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = fileName


    console.log('Attempting to upload file:', filePath, 'Size:', file.size, 'Type:', file.type);
    
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Allow overwriting existing files
      })
    
    console.log('Upload result:', { data, error });

    if (error) {
      console.error('Error uploading image:', error)
      console.error('Error details:', {
        message: error.message,
        name: error.name
      });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(filePath)

    console.log('Image uploaded successfully:', publicUrl);
    return publicUrl
  } catch (error) {
    console.error('Error in uploadProfileImage:', error)
    return null
  }
}

export const upsertUserProfile = async (profileData: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('users')
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
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
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
        }
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
    localStorage.removeItem('sb-' + supabaseUrl.split('//')[1].split('.')[0] + '-auth-token')
  } catch (error) {
    console.error('Error clearing auth state:', error)
  }
}

// Simplified approach - let Supabase handle duplicate detection during actual signup
export const checkUserExistsBySignup = async (email: string): Promise<{ exists: boolean; error?: string }> => {
  // Instead of making dummy signup requests (which cause rate limiting),
  // we'll rely on Supabase's built-in duplicate detection during the actual signup
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
