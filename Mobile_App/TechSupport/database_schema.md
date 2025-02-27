# Database Schema Document

## Overview

This document outlines the database schema for TechFix, implemented in PostgreSQL via Supabase. The schema is designed to support all core features while maintaining data integrity, security, and scalability.

## Tables

### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    language_preference TEXT DEFAULT 'en',
    is_expert BOOLEAN DEFAULT FALSE,
    stripe_customer_id TEXT,
    settings JSONB DEFAULT '{}'::jsonb
);
```

### expert_profiles
```sql
CREATE TABLE expert_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    expertise_areas TEXT[],
    hourly_rate DECIMAL(10,2),
    availability_schedule JSONB,
    verification_status TEXT,
    rating DECIMAL(3,2),
    total_sessions INTEGER DEFAULT 0,
    stripe_connect_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);
```

### support_issues
```sql
CREATE TABLE support_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    status TEXT DEFAULT 'open',
    category TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### tutorial_videos
```sql
CREATE TABLE tutorial_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    author_id UUID REFERENCES users(id),
    category TEXT,
    tags TEXT[],
    duration INTEGER,
    views INTEGER DEFAULT 0,
    rating DECIMAL(3,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### consultations
```sql
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    expert_id UUID REFERENCES expert_profiles(id),
    issue_id UUID REFERENCES support_issues(id),
    status TEXT DEFAULT 'scheduled',
    scheduled_time TIMESTAMPTZ,
    duration INTEGER,
    amount DECIMAL(10,2),
    stripe_payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### chat_messages
```sql
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID REFERENCES consultations(id),
    sender_id UUID REFERENCES users(id),
    content TEXT,
    type TEXT DEFAULT 'text',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### reviews
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID REFERENCES consultations(id),
    reviewer_id UUID REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(consultation_id, reviewer_id)
);
```

### video_interactions
```sql
CREATE TABLE video_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID REFERENCES tutorial_videos(id),
    user_id UUID REFERENCES users(id),
    interaction_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(video_id, user_id, interaction_type)
);
```

### notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    title TEXT NOT NULL,
    content TEXT,
    type TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_expert ON users(is_expert) WHERE is_expert = TRUE;

-- Expert Profiles
CREATE INDEX idx_expert_profiles_rating ON expert_profiles(rating);
CREATE INDEX idx_expert_profiles_expertise ON expert_profiles USING GIN (expertise_areas);

-- Support Issues
CREATE INDEX idx_support_issues_status ON support_issues(status);
CREATE INDEX idx_support_issues_category ON support_issues(category);
CREATE INDEX idx_support_issues_tags ON support_issues USING GIN (tags);

-- Tutorial Videos
CREATE INDEX idx_tutorial_videos_category ON tutorial_videos(category);
CREATE INDEX idx_tutorial_videos_tags ON tutorial_videos USING GIN (tags);
CREATE INDEX idx_tutorial_videos_rating ON tutorial_videos(rating);

-- Consultations
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_scheduled_time ON consultations(scheduled_time);

-- Chat Messages
CREATE INDEX idx_chat_messages_consultation ON chat_messages(consultation_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);

-- Reviews
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

## Row Level Security (RLS) Policies

```sql
-- Users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Expert Profiles table
ALTER TABLE expert_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view expert profiles" ON expert_profiles
    FOR SELECT USING (true);
CREATE POLICY "Experts can update their own profile" ON expert_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Similar policies for other tables...
```

## Triggers

```sql
-- Update timestamps
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE trigger_set_timestamp();

-- Update expert rating
CREATE TRIGGER update_expert_rating
    AFTER INSERT ON reviews
    FOR EACH ROW
    EXECUTE PROCEDURE update_expert_rating();

-- Similar triggers for other tables...
```

This schema provides a solid foundation for the TechFix platform while maintaining flexibility for future enhancements. Regular reviews and optimizations will be performed based on usage patterns and performance metrics.
