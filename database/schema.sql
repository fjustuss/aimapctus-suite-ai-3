-- Aimapctus Suite AI - Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'criador' CHECK (plan IN ('criador', 'influencer')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    source VARCHAR(100) DEFAULT 'website'
);

-- App Settings Table
CREATE TABLE IF NOT EXISTS app_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    company_name VARCHAR(255) DEFAULT 'Aimapctus Suite AI',
    contact_email VARCHAR(255) DEFAULT 'contact@aimapctus.com',
    maintenance_mode BOOLEAN DEFAULT FALSE,
    google_analytics_id VARCHAR(100),
    stripe_api_key VARCHAR(255),
    sendgrid_api_key VARCHAR(255),
    max_content_per_user INTEGER DEFAULT 1000,
    max_users_per_account INTEGER DEFAULT 50,
    auto_backup BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_settings CHECK (id = 1)
);

-- Activity Log Table
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage Analytics Table
CREATE TABLE IF NOT EXISTS usage_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    feature VARCHAR(100) NOT NULL,
    usage_count INTEGER DEFAULT 1,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, feature, date)
);

-- Revenue Tracking Table
CREATE TABLE IF NOT EXISTS revenue_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    plan VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50),
    stripe_payment_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    billing_period_start DATE,
    billing_period_end DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);

CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_log_type ON activity_log(type);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);

CREATE INDEX IF NOT EXISTS idx_usage_analytics_user_feature_date ON usage_analytics(user_id, feature, date);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_date ON usage_analytics(date);

CREATE INDEX IF NOT EXISTS idx_revenue_records_created_at ON revenue_records(created_at);
CREATE INDEX IF NOT EXISTS idx_revenue_records_user_id ON revenue_records(user_id);

-- Create Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create Triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at 
    BEFORE UPDATE ON contact_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_app_settings_updated_at ON app_settings;
CREATE TRIGGER update_app_settings_updated_at 
    BEFORE UPDATE ON app_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO app_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Insert sample data for demonstration
INSERT INTO users (name, email, plan, status) VALUES 
    ('Ana Silva', 'ana@exemplo.com', 'influencer', 'active'),
    ('Carlos Santos', 'carlos@exemplo.com', 'criador', 'active'),
    ('Maria Costa', 'maria@exemplo.com', 'influencer', 'inactive'),
    ('João Oliveira', 'joao@exemplo.com', 'criador', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample activity log
INSERT INTO activity_log (type, description, user_id) VALUES 
    ('user_signup', 'Novo usuário registrado: ana@exemplo.com', (SELECT id FROM users WHERE email = 'ana@exemplo.com')),
    ('content_created', '1,247 novos conteúdos criados hoje', NULL),
    ('system_alert', 'Limite de API próximo ao máximo (85%)', NULL),
    ('backup_completed', 'Backup automático concluído com sucesso', NULL),
    ('subscription_activated', '23 novas assinaturas Pro ativadas', NULL);

-- Insert sample revenue data
INSERT INTO revenue_records (amount, plan, user_id, billing_period_start, billing_period_end) VALUES 
    (49.90, 'influencer', (SELECT id FROM users WHERE email = 'ana@exemplo.com'), '2024-01-01', '2024-01-31'),
    (29.90, 'criador', (SELECT id FROM users WHERE email = 'carlos@exemplo.com'), '2024-01-01', '2024-01-31'),
    (49.90, 'influencer', (SELECT id FROM users WHERE email = 'maria@exemplo.com'), '2024-01-01', '2024-01-31');

-- Enable Row Level Security (Optional - for production)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Create policies (Example - adjust based on your needs)
-- CREATE POLICY "Public read access for users" ON users FOR SELECT USING (true);
-- CREATE POLICY "Admin full access" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;