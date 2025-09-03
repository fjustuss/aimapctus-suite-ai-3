// Authentication System for Aimapctus Suite AI
// Handles login, registration, and password recovery

class AuthSystem {
    constructor() {
        this.supabaseClient = window.supabaseClient;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthState();
    }

    setupEventListeners() {
        // Form submissions
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm')?.addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('forgotPasswordForm')?.addEventListener('submit', (e) => this.handleForgotPassword(e));

        // Form switching
        document.getElementById('show-register')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('register');
        });
        
        document.getElementById('show-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('login');
        });
        
        document.getElementById('forgot-password-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('forgot-password');
        });
        
        document.getElementById('back-to-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showForm('login');
        });
    }

    showForm(formType) {
        // Hide all forms
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('forgot-password-form').style.display = 'none';

        // Show selected form
        document.getElementById(`${formType}-form`).style.display = 'block';
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        this.showLoading(e.target);

        try {
            // For now, simulate login with Supabase user check
            const userCheck = await this.supabaseClient.getUsers({ search: email });
            
            if (userCheck.success && userCheck.data.length > 0) {
                // Store user session
                this.setUserSession(userCheck.data[0]);
                this.showSuccess('Login realizado com sucesso!');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = './dashboard.html';
                }, 1000);
            } else {
                this.showError('Email ou senha incorretos');
            }
        } catch (error) {
            this.showError('Erro ao fazer login: ' + error.message);
        } finally {
            this.hideLoading(e.target);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const plan = formData.get('plan');

        this.showLoading(e.target);

        try {
            // Create user in database
            const result = await this.supabaseClient.createUser({
                name: name,
                email: email,
                plan: plan,
                status: 'active'
            });

            if (result.success) {
                // Log activity
                await this.supabaseClient.logActivity({
                    type: 'user_signup',
                    description: `Novo usuário registrado: ${email}`,
                    metadata: { plan: plan }
                });

                this.showSuccess('Conta criada com sucesso! Redirecionando...');
                
                // Set user session
                this.setUserSession({
                    name: name,
                    email: email,
                    plan: plan,
                    status: 'active'
                });
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = './dashboard.html';
                }, 1500);
            } else {
                this.showError('Erro ao criar conta: ' + result.error);
            }
        } catch (error) {
            this.showError('Erro ao criar conta: ' + error.message);
        } finally {
            this.hideLoading(e.target);
        }
    }

    async handleForgotPassword(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');

        this.showLoading(e.target);

        try {
            // Check if user exists
            const userCheck = await this.supabaseClient.getUsers({ search: email });
            
            if (userCheck.success && userCheck.data.length > 0) {
                // Simulate sending password reset email
                this.showSuccess('Instruções enviadas para seu email!');
                setTimeout(() => {
                    this.showForm('login');
                }, 2000);
            } else {
                this.showError('Email não encontrado em nossa base de dados');
            }
        } catch (error) {
            this.showError('Erro ao enviar instruções: ' + error.message);
        } finally {
            this.hideLoading(e.target);
        }
    }

    setUserSession(userData) {
        localStorage.setItem('aimapctus_user', JSON.stringify({
            ...userData,
            loginTime: Date.now()
        }));
    }

    getUserSession() {
        const userData = localStorage.getItem('aimapctus_user');
        if (userData) {
            const user = JSON.parse(userData);
            // Check if session is still valid (24 hours)
            if (Date.now() - user.loginTime < 24 * 60 * 60 * 1000) {
                return user;
            } else {
                this.clearUserSession();
            }
        }
        return null;
    }

    clearUserSession() {
        localStorage.removeItem('aimapctus_user');
    }

    checkAuthState() {
        const user = this.getUserSession();
        if (user && window.location.pathname.includes('auth.html')) {
            // User is already logged in, redirect to dashboard
            window.location.href = './dashboard.html';
        }
    }

    showLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    }

    hideLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        
        // Restore original button text
        const originalText = submitBtn.getAttribute('data-original-text') || 'Enviar';
        submitBtn.innerHTML = originalText;
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelector('.auth-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `auth-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.querySelector('.auth-card').appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
});

// Export for use in other files
window.AuthSystem = AuthSystem;