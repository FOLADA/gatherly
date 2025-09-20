-- Gatherly Database Schema
-- Run these SQL commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    max_participants INTEGER,
    image_url TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event participants table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS event_participants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Row Level Security (RLS) Policies

-- Enable RLS on events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Anyone can view events" ON events
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create events" ON events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own events" ON events
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own events" ON events
    FOR DELETE USING (auth.uid() = created_by);

-- Enable RLS on event_participants table
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

-- Event participants policies
CREATE POLICY "Anyone can view event participants" ON event_participants
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can join events" ON event_participants
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can leave events they joined" ON event_participants
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS events_date_idx ON events(date);
CREATE INDEX IF NOT EXISTS events_category_idx ON events(category);
CREATE INDEX IF NOT EXISTS events_created_by_idx ON events(created_by);
CREATE INDEX IF NOT EXISTS event_participants_event_id_idx ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS event_participants_user_id_idx ON event_participants(user_id);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for events table
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PEOPLE SELECTION MODULE SCHEMA
-- ============================================

-- User interactions table (likes/dislikes for people matching)
CREATE TABLE IF NOT EXISTS user_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('like', 'dislike')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, target_user_id)
);

-- User matches table (when two users like each other)
CREATE TABLE IF NOT EXISTS user_matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user1_id, user2_id),
    CHECK (user1_id < user2_id) -- Ensure consistent ordering to avoid duplicates
);

-- RLS Policies for user_interactions
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own interactions" ON user_interactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interactions" ON user_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions" ON user_interactions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions" ON user_interactions
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_matches
ALTER TABLE user_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own matches" ON user_matches
    FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "System can create matches" ON user_matches
    FOR INSERT WITH CHECK (true); -- Handled by trigger function

-- Performance indexes
CREATE INDEX IF NOT EXISTS user_interactions_user_id_idx ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS user_interactions_target_user_id_idx ON user_interactions(target_user_id);
CREATE INDEX IF NOT EXISTS user_interactions_type_idx ON user_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS user_matches_user1_id_idx ON user_matches(user1_id);
CREATE INDEX IF NOT EXISTS user_matches_user2_id_idx ON user_matches(user2_id);

-- Function to create matches when mutual likes occur
CREATE OR REPLACE FUNCTION create_match_on_mutual_like()
RETURNS TRIGGER AS $$
BEGIN
    -- Only proceed if this is a 'like' interaction
    IF NEW.interaction_type = 'like' THEN
        -- Check if the target user has also liked this user
        IF EXISTS (
            SELECT 1 FROM user_interactions 
            WHERE user_id = NEW.target_user_id 
            AND target_user_id = NEW.user_id 
            AND interaction_type = 'like'
        ) THEN
            -- Create a match (ensure consistent ordering)
            INSERT INTO user_matches (user1_id, user2_id)
            VALUES (
                LEAST(NEW.user_id, NEW.target_user_id),
                GREATEST(NEW.user_id, NEW.target_user_id)
            )
            ON CONFLICT (user1_id, user2_id) DO NOTHING;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create matches
CREATE TRIGGER trigger_create_match_on_mutual_like
    AFTER INSERT ON user_interactions
    FOR EACH ROW
    EXECUTE FUNCTION create_match_on_mutual_like();

-- Function to remove matches when a like is removed
CREATE OR REPLACE FUNCTION remove_match_on_unlike()
RETURNS TRIGGER AS $$
BEGIN
    -- If a like is being removed or changed to dislike, remove any existing match
    IF OLD.interaction_type = 'like' AND (NEW.interaction_type = 'dislike' OR NEW IS NULL) THEN
        DELETE FROM user_matches 
        WHERE (user1_id = LEAST(OLD.user_id, OLD.target_user_id) 
               AND user2_id = GREATEST(OLD.user_id, OLD.target_user_id));
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to remove matches when likes are removed
CREATE TRIGGER trigger_remove_match_on_unlike
    AFTER UPDATE OR DELETE ON user_interactions
    FOR EACH ROW
    EXECUTE FUNCTION remove_match_on_unlike();
