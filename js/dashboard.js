// Dashboard JavaScript - Aimapctus Suite AI
// Handles user dashboard functionality and interactions

class DashboardManager {
    constructor() {
        this.currentUser = null;
        this.supabaseClient = window.supabaseClient;
        this.init();
    }

    async init() {
        await this.loadUserData();
        this.setupEventListeners();
        this.checkEmailConfirmation();
        this.updateStats();
    }

    async loadUserData() {
        try {
            // Get user data from localStorage (from onboarding)
            const userData = localStorage.getItem('aimapctus_user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
                this.updateUserInfo();
            }

            // Also try to get from Supabase if available
            if (this.supabaseClient && this.supabaseClient.isInitialized) {
                const { user } = await this.supabaseClient.getCurrentUser();
                if (user) {
                    this.currentUser = {
                        ...this.currentUser,
                        id: user.id,
                        email: user.email,
                        emailConfirmed: !!user.email_confirmed_at,
                        supabaseUser: user
                    };
                    this.updateUserInfo();
                }
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
        }
    }

    updateUserInfo() {
        if (!this.currentUser) return;

        // Update user name in header
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && this.currentUser.name) {
            userNameElement.textContent = this.currentUser.name;
        }

        // Update welcome message
        const welcomeTitle = document.querySelector('.welcome-title');
        if (welcomeTitle && this.currentUser.name) {
            const firstName = this.currentUser.name.split(' ')[0];
            welcomeTitle.textContent = `Bem-vindo, ${firstName}! 🚀`;
        }
    }

    checkEmailConfirmation() {
        if (!this.currentUser) return;

        const confirmationAlert = document.getElementById('email-confirmation-alert');
        
        // Show alert if email is not confirmed
        if (this.currentUser.needsVerification || !this.currentUser.emailConfirmed) {
            if (confirmationAlert) {
                confirmationAlert.style.display = 'block';
            }
        } else {
            if (confirmationAlert) {
                confirmationAlert.style.display = 'none';
            }
        }
    }

    setupEventListeners() {
        // Profile dropdown toggle
        const userProfile = document.getElementById('user-profile');
        const profileDropdown = document.getElementById('profile-dropdown');
        
        if (userProfile && profileDropdown) {
            userProfile.addEventListener('click', (e) => {
                e.stopPropagation();
                profileDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userProfile.contains(e.target)) {
                    profileDropdown.classList.remove('active');
                }
            });
        }

        // Logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Resend confirmation email
        const resendBtn = document.getElementById('resend-confirmation');
        if (resendBtn) {
            resendBtn.addEventListener('click', () => {
                this.resendConfirmationEmail();
            });
        }

        // Quick action cards
        this.setupQuickActions();

        // Navigation links
        this.setupNavigation();
    }

    setupQuickActions() {
        // Create Video
        const createVideoBtn = document.getElementById('create-video');
        if (createVideoBtn) {
            createVideoBtn.addEventListener('click', () => {
                this.showComingSoon('Gerador de Vídeos com IA');
            });
        }

        // Create Thumbnail
        const createThumbnailBtn = document.getElementById('create-thumbnail');
        if (createThumbnailBtn) {
            createThumbnailBtn.addEventListener('click', () => {
                this.showComingSoon('Gerador de Thumbnails');
            });
        }

        // Get Hashtags
        const getHashtagsBtn = document.getElementById('get-hashtags');
        if (getHashtagsBtn) {
            getHashtagsBtn.addEventListener('click', () => {
                this.showComingSoon('Hashtags Trending');
            });
        }

        // Analyze Trends
        const analyzeTrendsBtn = document.getElementById('analyze-trends');
        if (analyzeTrendsBtn) {
            analyzeTrendsBtn.addEventListener('click', () => {
                this.showComingSoon('Análise de Trends');
            });
        }

        // Start Creating button
        const startCreatingBtn = document.getElementById('start-creating');
        if (startCreatingBtn) {
            startCreatingBtn.addEventListener('click', () => {
                this.showComingSoon('Criador de Conteúdo');
            });
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Handle navigation (placeholder for future implementation)
                const href = link.getAttribute('href');
                if (href && href !== '#dashboard') {
                    this.showComingSoon('Funcionalidade');
                }
            });
        });
    }

    async resendConfirmationEmail() {
        if (!this.currentUser || !this.currentUser.email) {
            this.showNotification('Erro: Email do usuário não encontrado', 'error');
            return;
        }

        const resendBtn = document.getElementById('resend-confirmation');
        const originalText = resendBtn.innerHTML;
        
        try {
            // Show loading state
            resendBtn.disabled = true;
            resendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            if (this.supabaseClient && this.supabaseClient.isInitialized) {
                const result = await this.supabaseClient.resendConfirmation(this.currentUser.email);
                
                if (result.success) {
                    this.showNotification('Email de confirmação reenviado com sucesso!', 'success');
                    resendBtn.innerHTML = '<i class="fas fa-check"></i> Enviado!';
                } else {
                    throw new Error(result.error);
                }
            } else {
                throw new Error('Supabase não inicializado');
            }
        } catch (error) {
            console.error('Erro ao reenviar email:', error);
            this.showNotification('Erro ao reenviar email: ' + error.message, 'error');
            resendBtn.innerHTML = originalText;
        } finally {
            resendBtn.disabled = false;
            
            // Reset button after 3 seconds
            setTimeout(() => {
                resendBtn.innerHTML = originalText;
            }, 3000);
        }
    }

    async handleLogout() {
        try {
            this.showLoading();
            
            // Sign out from Supabase
            if (this.supabaseClient && this.supabaseClient.isInitialized) {
                await this.supabaseClient.signOut();
            }
            
            // Clear local storage
            localStorage.removeItem('aimapctus_user');
            
            // Redirect to home page
            window.location.href = './index.html';
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            this.showNotification('Erro ao sair da conta', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async updateStats() {
        // Mock stats for now - will be replaced with real data
        const stats = {
            totalVideos: 0,
            totalViews: 0,
            totalLikes: 0,
            totalShares: 0
        };

        // Animate numbers
        this.animateNumber('total-videos', stats.totalVideos);
        this.animateNumber('total-views', stats.totalViews);
        this.animateNumber('total-likes', stats.totalLikes);
        this.animateNumber('total-shares', stats.totalShares);
    }

    animateNumber(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = 0;
        const duration = 1000;
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            element.textContent = currentValue.toLocaleString('pt-BR');

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };

        requestAnimationFrame(updateNumber);
    }

    showComingSoon(feature) {
        this.showNotification(`${feature} em desenvolvimento! Em breve teremos esta funcionalidade disponível. 🚀`, 'info');
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.dashboard-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `dashboard-notification ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 
                    type === 'info' ? 'info-circle' : 'bell';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 
                        type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 
                        'rgba(59, 130, 246, 0.9)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            z-index: 9999;
            animation: slideInFromRight 0.3s ease;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            max-width: 400px;
            backdrop-filter: blur(10px);
        `;

        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
        `;

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s ease;
            font-size: 1rem;
            padding: 0.25rem;
        `;

        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.opacity = '1';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.opacity = '0.7';
        });

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInFromRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
});

// Export for use in other files
window.DashboardManager = DashboardManager;