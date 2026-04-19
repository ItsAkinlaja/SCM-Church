-- Create tables for SCM (Successful Christian Missions)

-- Members Table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  birthday DATE,
  department TEXT,
  anniversary DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  description TEXT,
  banner_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly Study Materials Table
CREATE TABLE IF NOT EXISTS weekly_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  week_date DATE NOT NULL,
  file_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaders Table
DROP TABLE IF EXISTS leaders;
CREATE TABLE leaders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  bio TEXT, -- Added for detailed biographies
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prayer Requests Table
CREATE TABLE IF NOT EXISTS prayer_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  request TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonies Table
CREATE TABLE IF NOT EXISTS testimonies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ministry Settings Table (Singleton)
DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
  ministry_name TEXT NOT NULL DEFAULT 'Successful Christian Missions',
  ministry_logo TEXT,
  vision TEXT,
  mission TEXT,
  description TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  social_links JSONB DEFAULT '{"facebook": "", "twitter": "", "instagram": "", "youtube": ""}'::jsonb,
  hero_slides JSONB DEFAULT '[{"url": "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop", "tag": "Successful Christian Missions", "title": "A beautiful church home for worship, word, and prayer.", "subtitle": "Successful Christian Missions International is a Pentecostal church founded in Ile-Ife, Nigeria, dedicated to ministering the gospel through Worship, Word, and Prayer."}, {"url": "https://ik.imagekit.io/scmchurch/daniel-schaffer-arwwg4geM2A-unsplash.jpg", "tag": "Our Vision", "title": "Built on the solid rock of God''s eternal word.", "subtitle": "Our teachings center on salvation, holiness, the kingdom of God, peace, love, and hope as revealed by the Holy Spirit."}, {"url": "https://ik.imagekit.io/scmchurch/jametlene-reskp-YUVZOGlHfdk-unsplash.jpg", "tag": "Our Mission", "title": "United in prayer, strengthened in fellowship.", "subtitle": "Join a community of believers dedicated to kingdom expansion and spiritual excellence since July 18, 1999."}]'::jsonb,
  pillars JSONB DEFAULT '[{"icon": "Landmark", "title": "Worship", "description": "Reverent gatherings designed for heartfelt praise, spiritual renewal, and genuine fellowship."}, {"icon": "BookOpenText", "title": "Word", "description": "Bible-based teaching that forms disciples, strengthens conviction, and builds mature believers."}, {"icon": "HeartHandshake", "title": "Prayer", "description": "A praying church where burdens are shared, faith is stirred, and lives are lifted before God."}]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT settings_singleton CHECK (id = '00000000-0000-0000-0000-000000000001'::uuid)
);

-- Insert initial settings
INSERT INTO settings (id, ministry_name, phone, address, description, mission, vision, ministry_logo)
VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Successful Christian Missions',
    '+234 803 382 9978',
    'Irebami Street, Off Fajuyi Road, Ile Ife. Box 1726, lle-Ife, Osun State, Nigeria',
    'Successful Christian Missions International is a Pentecostal church that was founded in Ile-Ife, Osun state, Nigeria in July 18, 1999 to minister the gospel of Christ to the mankind. We practice three things; Worship, Words and Prayer as Holy Ghost has laid it in our hearts. Our teachings centered on salvation, holiness, kingdom of God, peace, love and hope.',
    'We are committed to developing spiritual leaders of excellence to bring the gospel of Christ to all mankind.',
    'Growing Disciples to expand God’s kingdom through the living words to bring hope to the lost.',
    'https://ik.imagekit.io/scmchurch/WhatsApp_Image_2026-03-27_at_05.29.17-removebg-preview.png'
)
ON CONFLICT (id) DO UPDATE SET
    ministry_name = EXCLUDED.ministry_name,
    phone = EXCLUDED.phone,
    address = EXCLUDED.address,
    description = EXCLUDED.description,
    mission = EXCLUDED.mission,
    vision = EXCLUDED.vision,
    ministry_logo = EXCLUDED.ministry_logo,
    updated_at = NOW();

-- Insert General Overseer
INSERT INTO leaders (name, role, bio, photo_url)
VALUES (
    'Pastor (Prof.) Rufus A. Adedoyin',
    'General Overseer',
    'Rufus A. Adedoyin is a professor of cardiopulmonary Physical Therapy who has published over 170 papers in reputable journals worldwide. He has held several positions in academics such as course coordinator, head of Department, Vice Dean, acting Dean and Dean in the Academics. He has led his professional associations at different levels as a state chairman, editor in chief and president of national body. Pastor Adedoyin became born again in 1986 under the ministration of late apostle Obadare of the Christ Apostolic Church. He had offered spiritual services while he was at the Christ Apostolic Church such choir leader, evangelist and pastor between 1986-1999. He planned to travel abroad for greener pasture like his professional colleagues did, but God commanded him to stay in Nigeria to do his work. He responded to the call of God by establishing the Successful Christian Missions a name God revealed to him in a vision in 1998.',
    'https://ik.imagekit.io/scmchurch/Professor%20R.%20A.%20Adedoyin.jpg'
)
ON CONFLICT (name) DO UPDATE SET
    bio = EXCLUDED.bio,
    photo_url = EXCLUDED.photo_url,
    role = EXCLUDED.role;

-- Programmes Table (Recurring Activities)
CREATE TABLE IF NOT EXISTS programmes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  day_of_week TEXT, -- For weekly (e.g., 'Tuesday', 'Thursday')
  occurrence TEXT, -- 'Weekly', 'Monthly', 'Annual'
  time TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default programmes based on user info
INSERT INTO programmes (title, day_of_week, occurrence, time) VALUES
('God Can Do it Again (Prayer Session)', 'Tuesday', 'Weekly', '4:00pm'),
('Bible Study', 'Thursday', 'Weekly', '4:00pm'),
('Worship Service', 'Sunday', 'Weekly', '8:30am'),
('Success Night', 'Last Friday', 'Monthly', '10:00pm'),
('Holy Communion', 'Last Sunday', 'Monthly', '11:30am'),
('Prayer Session', '1st Day', 'Monthly', 'Morning')
ON CONFLICT DO NOTHING;

-- Row Level Security (RLS)
-- Enable RLS for all tables to fix security vulnerabilities
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaders ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
DROP POLICY IF EXISTS "Allow public read access for settings" ON settings;
CREATE POLICY "Allow public read access for settings" ON settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access for programmes" ON programmes;
CREATE POLICY "Allow public read access for programmes" ON programmes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access for events" ON events;
CREATE POLICY "Allow public read access for events" ON events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access for weekly_materials" ON weekly_materials;
CREATE POLICY "Allow public read access for weekly_materials" ON weekly_materials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access for announcements" ON announcements;
CREATE POLICY "Allow public read access for announcements" ON announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access for leaders" ON leaders;
CREATE POLICY "Allow public read access for leaders" ON leaders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access for approved testimonies" ON testimonies;
CREATE POLICY "Allow public read access for approved testimonies" ON testimonies FOR SELECT USING (is_approved = true);

-- Create policies for public insert
DROP POLICY IF EXISTS "Allow public insert for prayer_requests" ON prayer_requests;
CREATE POLICY "Allow public insert for prayer_requests" ON prayer_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert for testimonies" ON testimonies;
CREATE POLICY "Allow public insert for testimonies" ON testimonies FOR INSERT WITH CHECK (true);

-- Create policies for admin access (assuming authentication)
DROP POLICY IF EXISTS "Allow authenticated full access for settings" ON settings;
CREATE POLICY "Allow authenticated full access for settings" ON settings FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access for programmes" ON programmes;
CREATE POLICY "Allow authenticated full access for programmes" ON programmes FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access for members" ON members;
CREATE POLICY "Allow authenticated full access for members" ON members FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access for events" ON events;
CREATE POLICY "Allow authenticated full access for events" ON events FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access for weekly_materials" ON weekly_materials;
CREATE POLICY "Allow authenticated full access for weekly_materials" ON weekly_materials FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access for announcements" ON announcements;
CREATE POLICY "Allow authenticated full access for announcements" ON announcements FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access for leaders" ON leaders;
CREATE POLICY "Allow authenticated full access for leaders" ON leaders FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access for prayer_requests" ON prayer_requests;
CREATE POLICY "Allow authenticated full access for prayer_requests" ON prayer_requests FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access for testimonies" ON testimonies;
CREATE POLICY "Allow authenticated full access for testimonies" ON testimonies FOR ALL TO authenticated USING (true);

-- Phase 2 Tables: Messages, Subscribers, Gallery, Sermons

-- Messages Table (Contact Form Integration)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscribers Table (Newsletter Integration)
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Table (Photo Management)
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sermons Table (Media Block)
CREATE TABLE IF NOT EXISTS sermons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  preacher TEXT NOT NULL,
  service_type TEXT DEFAULT 'Sunday Service',
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Phase 2 Tables
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;

-- Phase 2 Public Policies
DROP POLICY IF EXISTS "Allow public insert for messages" ON messages;
CREATE POLICY "Allow public insert for messages" ON messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert for subscribers" ON subscribers;
CREATE POLICY "Allow public insert for subscribers" ON subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access for gallery" ON gallery;
CREATE POLICY "Allow public read access for gallery" ON gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access for sermons" ON sermons;
CREATE POLICY "Allow public read access for sermons" ON sermons FOR SELECT USING (true);

-- Phase 2 Admin Policies
DROP POLICY IF EXISTS "Allow authenticated full access for messages" ON messages;
CREATE POLICY "Allow authenticated full access for messages" ON messages FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access for subscribers" ON subscribers;
CREATE POLICY "Allow authenticated full access for subscribers" ON subscribers FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access for gallery" ON gallery;
CREATE POLICY "Allow authenticated full access for gallery" ON gallery FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access for sermons" ON sermons;
CREATE POLICY "Allow authenticated full access for sermons" ON sermons FOR ALL TO authenticated USING (true);
