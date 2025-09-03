// Supabase Configuration and API Functions
// Aimapctus Suite AI - Database Integration

class SupabaseClient {
    constructor() {
        // Try to get credentials from config file
        const config = window.AIMAPCTUS_CONFIG?.supabase || window.supabaseConfig;
        
        if (!config || !config.url || !config.anonKey) {
            console.log('⚠️ Configuração do Supabase não encontrada - usando modo demonstração');
            this.supabaseUrl = null;
            this.supabaseKey = null;
            this.isDemoMode = true;
        } else {
            this.supabaseUrl = config.url;
            this.supabaseKey = config.anonKey || config.key;
            this.isDemoMode = config.isDemoMode || false;
        }
        
        this.supabase = null;
        this.isInitialized = false;
        
        // Initialize Supabase when the script loads
        this.init();
    }
    
    async init() {
        try {
            // Check if we have valid credentials
            if (!this.supabaseUrl || !this.supabaseKey || this.isDemoMode) {
                console.log('🔧 Modo demonstração ativado - Supabase desabilitado');
                console.log('💡 Para usar Supabase real:');
                console.log('1. Edite o arquivo js/config/config.js');
                console.log('2. Substitua os valores de demonstração pelas suas credenciais');
                console.log('3. Configure isDemoMode: false');
                this.isInitialized = false;
                this.isDemoMode = true;
                return false;
            }
            
            // Load Supabase from CDN if not already loaded
            if (typeof window.supabase === 'undefined') {
                await this.loadSupabaseSDK();
            }
            
            // Initialize Supabase client
            this.supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
            this.isInitialized = true;
            
            console.log('✅ Supabase inicializado com sucesso');
            return true;
        } catch (error) {
            console.error('❌ Falha ao inicializar Supabase:', error);
            this.isInitialized = false;
            this.isDemoMode = true;
            return false;
        }
    }
    
    async loadSupabaseSDK() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    // Contact Form Functions
    async submitContactForm(formData) {
        if (!this.isInitialized) {
            throw new Error('Supabase not initialized');
        }
        
        try {
            const { data, error } = await this.supabase
                .from('contact_submissions')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        company: formData.company || null,
                        message: formData.message,
                        created_at: new Date().toISOString(),
                        status: 'new'
                    }
                ]);
            
            if (error) throw error;
            
            console.log('✅ Contact form submitted successfully:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error submitting contact form:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Newsletter Subscription
    async subscribeNewsletter(email) {
        if (!this.isInitialized) {
            throw new Error('Supabase not initialized');
        }
        
        try {
            const { data, error } = await this.supabase
                .from('newsletter_subscribers')
                .insert([
                    {
                        email: email,
                        subscribed_at: new Date().toISOString(),
                        status: 'active'
                    }
                ]);
            
            if (error) throw error;
            
            console.log('✅ Newsletter subscription successful:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error subscribing to newsletter:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Authentication Functions
    async signUpWithEmail(email, password, userData = {}) {
        if (!this.isInitialized) {
            throw new Error('Supabase not initialized');
        }
        
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        name: userData.name || '',
                        plan: userData.plan || 'criador',
                        platforms: userData.platforms || [],
                        niche: userData.niche || '',
                        newsletter: userData.newsletter || false
                    }
                }
            });
            
            if (error) throw error;
            
            console.log('✅ User signup successful:', data);
            return { success: true, data, needsVerification: !data.user?.email_confirmed_at };
        } catch (error) {
            console.error('❌ Error during signup:', error);
            return { success: false, error: error.message };
        }
    }
    
    async signInWithEmail(email, password) {
        if (!this.isInitialized) {
            throw new Error('Supabase not initialized');
        }
        
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            console.log('✅ User signin successful:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error during signin:', error);
            return { success: false, error: error.message };
        }
    }
    
    async signOut() {
        if (!this.isInitialized) {
            throw new Error('Supabase not initialized');
        }
        
        try {
            const { error } = await this.supabase.auth.signOut();
            
            if (error) throw error;
            
            console.log('✅ User signout successful');
            return { success: true };
        } catch (error) {
            console.error('❌ Error during signout:', error);
            return { success: false, error: error.message };
        }
    }
    
    async resendConfirmation(email) {
        if (!this.isInitialized) {
            throw new Error('Supabase not initialized');
        }
        
        try {
            const { data, error } = await this.supabase.auth.resend({
                type: 'signup',
                email: email
            });
            
            if (error) throw error;
            
            console.log('✅ Confirmation email resent:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error resending confirmation:', error);
            return { success: false, error: error.message };
        }
    }
    
    async getCurrentUser() {
        if (!this.isInitialized) {
            throw new Error('Supabase not initialized');
        }
        
        try {
            const { data: { user }, error } = await this.supabase.auth.getUser();
            
            if (error) throw error;
            
            return { success: true, user };
        } catch (error) {
            console.error('❌ Error getting current user:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Setup auth state listener
    onAuthStateChange(callback) {
        if (!this.isInitialized) {
            console.error('Supabase not initialized');
            return;
        }
        
        return this.supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session);
            callback(event, session);
        });
    }

    // User Management Functions (Admin)
    async getUsers(filters = {}) {
        if (!this.isInitialized) {
            throw new Error('Supabase not initialized');
        }
        
        try {
            let query = this.supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });
            
            // Apply filters
            if (filters.status) {
                query = query.eq('status', filters.status);
            }
            
            if (filters.search) {
                query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching users:', error);
            return { success: false, error: error.message };
        }
    }
    
    async createUser(userData) {
        if (!this.isInitialized) {
            throw new Error('Supabase not initialized');
        }
        
        try {
            const { data, error } = await this.supabase
                .from('users')
                .insert([
                    {
                        name: userData.name,
                        email: userData.email,
                        plan: userData.plan || 'starter',
                        status: userData.status || 'active',
                        created_at: new Date().toISOString()
                    }
                ]);
            
            if (error) throw error;
            
            console.log('✅ User created successfully:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error creating user:', error);
            return { success: false, error: error.message };
        }
    }
    
    async updateUser(userId, updates) {
        if (!this.isInitialized) {
            throw new Error('Supabase not initialized');
        }
        
        try {
            const { data, error } = await this.supabase
                .from('users')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);
            
            if (error) throw error;
            
            console.log('✅ User updated successfully:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error updating user:', error);
            return { success: false, error: error.message };
        }
    }
    
    async toggleUserStatus(userId) {
        if (!this.isInitialized) {
            throw new Error('Supabase not initialized');
        }
        
        try {
            // First get current status
            const { data: currentUser, error: fetchError } = await this.supabase
                .from('users')
                .select('status')
                .eq('id', userId)
                .single();
            
            if (fetchError) throw fetchError;
            
            const newStatus = currentUser.status === 'active' ? 'inactive' : 'active';
            
            const { data, error } = await this.supabase
                .from('users')
                .update({ 
                    status: newStatus,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);
            
            if (error) throw error;
            
            console.log('✅ User status toggled successfully:', data);
            return { success: true, data, newStatus };
        } catch (error) {
            console.error('❌ Error toggling user status:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Analytics Functions
    async getAnalytics() {
        if (!this.isInitialized) {
            throw new Error('Supabase not initialized');
        }
        
        try {
            // Get user count
            const { count: userCount, error: userError } = await this.supabase
                .from('users')
                .select('*', { count: 'exact' });
            
            if (userError) throw userError;
            
            // Get active users count
            const { count: activeUserCount, error: activeError } = await this.supabase
                .from('users')
                .select('*', { count: 'exact' })
                .eq('status', 'active');
            
            if (activeError) throw activeError;
            
            // Get contact submissions count
            const { count: contactCount, error: contactError } = await this.supabase
                .from('contact_submissions')
                .select('*', { count: 'exact' });
            
            if (contactError) throw contactError;
            
            // Get newsletter subscribers count
            const { count: subscriberCount, error: subscriberError } = await this.supabase
                .from('newsletter_subscribers')
                .select('*', { count: 'exact' })
                .eq('status', 'active');
            
            if (subscriberError) throw subscriberError;
            
            return {
                success: true,
                data: {
                    totalUsers: userCount || 0,
                    activeUsers: activeUserCount || 0,
                    contactSubmissions: contactCount || 0,
                    newsletterSubscribers: subscriberCount || 0
                }
            };
        } catch (error) {
            console.error('❌ Error fetching analytics:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Settings Functions
    async getSettings() {
        if (!this.isInitialized) {
            throw new Error('Supabase not initialized');
        }
        
        try {
            const { data, error } = await this.supabase
                .from('app_settings')
                .select('*')
                .order('updated_at', { ascending: false })
                .limit(1)
                .single();
            
            if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
                throw error;
            }
            
            return { success: true, data: data || {} };
        } catch (error) {
            console.error('❌ Error fetching settings:', error);
            return { success: false, error: error.message };
        }
    }
    
    async updateSettings(settings) {
        if (!this.isInitialized) {
            throw new Error('Supabase not initialized');
        }
        
        try {
            const { data, error } = await this.supabase
                .from('app_settings')
                .upsert({
                    id: 1, // Single settings record
                    ...settings,
                    updated_at: new Date().toISOString()
                });
            
            if (error) throw error;
            
            console.log('✅ Settings updated successfully:', data);
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error updating settings:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Activity Log Functions
    async logActivity(activity) {
        if (!this.isInitialized) {
            throw new Error('Supabase not initialized');
        }
        
        try {
            const { data, error } = await this.supabase
                .from('activity_log')
                .insert([
                    {
                        type: activity.type,
                        description: activity.description,
                        user_id: activity.userId || null,
                        metadata: activity.metadata || {},
                        created_at: new Date().toISOString()
                    }
                ]);
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error logging activity:', error);
            return { success: false, error: error.message };
        }
    }
    
    async getRecentActivity(limit = 10) {
        if (!this.isInitialized) {
            throw new Error('Supabase not initialized');
        }
        
        try {
            const { data, error } = await this.supabase
                .from('activity_log')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(limit);
            
            if (error) throw error;
            
            return { success: true, data };
        } catch (error) {
            console.error('❌ Error fetching recent activity:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Helper function to check connection
    async testConnection() {
        if (!this.isInitialized) {
            return { success: false, error: 'Supabase not initialized' };
        }
        
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select('count')
                .limit(1);
            
            if (error) throw error;
            
            return { success: true, message: 'Connection successful' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Create global instance
window.supabaseClient = new SupabaseClient();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SupabaseClient;
}