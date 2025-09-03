// Onboarding System for Aimapctus Suite AI
// Handles multi-step registration and user data collection

class OnboardingSystem {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.userData = {};
        this.supabaseClient = window.supabaseClient;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgressBar();
        this.initPasswordStrength();
    }

    setupEventListeners() {
        // Form submissions
        document.getElementById('account-form')?.addEventListener('submit', (e) => this.handleAccountForm(e));
        document.getElementById('platforms-form')?.addEventListener('submit', (e) => this.handlePlatformsForm(e));
        document.getElementById('plan-form')?.addEventListener('submit', (e) => this.handlePlanForm(e));
        document.getElementById('complete-form')?.addEventListener('submit', (e) => this.handleCompleteForm(e));

        // Navigation buttons
        document.getElementById('back-step-1')?.addEventListener('click', () => this.goToStep(1));
        document.getElementById('back-step-2')?.addEventListener('click', () => this.goToStep(2));
        document.getElementById('back-step-3')?.addEventListener('click', () => this.goToStep(3));

        // Success actions
        document.getElementById('go-to-dashboard')?.addEventListener('click', () => this.goToDashboard());
        document.getElementById('watch-tutorial')?.addEventListener('click', () => this.watchTutorial());

        // Email confirmation actions
        document.getElementById('resend-email')?.addEventListener('click', () => this.resendConfirmationEmail());
        document.getElementById('continue-without-confirmation')?.addEventListener('click', () => this.continueWithoutConfirmation());

        // Password toggle
        document.getElementById('password-toggle')?.addEventListener('click', () => this.togglePassword());

        // Platform selection
        this.setupPlatformSelection();
        
        // Plan selection
        this.setupPlanSelection();
    }

    setupPlatformSelection() {
        const platformCards = document.querySelectorAll('.platform-card');
        platformCards.forEach(card => {
            card.addEventListener('click', () => {
                const checkbox = card.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                card.classList.toggle('selected', checkbox.checked);
            });
        });
    }

    setupPlanSelection() {
        const planOptions = document.querySelectorAll('.plan-option');
        planOptions.forEach(option => {
            option.addEventListener('click', () => {
                const radio = option.querySelector('input[type="radio"]');
                radio.checked = true;
                
                // Remove selected class from all options
                planOptions.forEach(opt => opt.classList.remove('selected'));
                // Add selected class to clicked option
                option.classList.add('selected');
            });
        });
    }

    initPasswordStrength() {
        const passwordInput = document.getElementById('password');
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');

        if (passwordInput && strengthBar) {
            passwordInput.addEventListener('input', (e) => {
                const password = e.target.value;
                const strength = this.calculatePasswordStrength(password);
                
                strengthBar.className = `strength-bar ${strength.level}`;
                strengthText.textContent = strength.text;
            });
        }
    }

    calculatePasswordStrength(password) {
        let score = 0;
        
        // Length check
        if (password.length >= 6) score += 1;
        if (password.length >= 10) score += 1;
        
        // Character variety
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/\d/.test(password)) score += 1;
        if (/[^\w\s]/.test(password)) score += 1;

        if (score < 2) return { level: 'weak', text: 'Fraca' };
        if (score < 4) return { level: 'fair', text: 'Razoável' };
        if (score < 6) return { level: 'good', text: 'Boa' };
        return { level: 'strong', text: 'Forte' };
    }

    // Function to handle email confirmation from link
    static async handleEmailConfirmation() {
        try {
            // Check URL parameters for confirmation token
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            const type = urlParams.get('type');
            
            if (token && type === 'signup') {
                // User clicked on confirmation link
                const supabaseClient = window.supabaseClient;
                
                if (supabaseClient && supabaseClient.isInitialized) {
                    // Get current user to check if confirmation was successful
                    const { user } = await supabaseClient.getCurrentUser();
                    
                    if (user && user.email_confirmed_at) {
                        // Email confirmed successfully
                        const userData = JSON.parse(localStorage.getItem('aimapctus_user') || '{}');
                        userData.emailConfirmed = true;
                        userData.confirmationDate = new Date().toISOString();
                        userData.needsVerification = false;
                        localStorage.setItem('aimapctus_user', JSON.stringify(userData));
                        
                        // Log activity
                        await supabaseClient.logActivity({
                            type: 'email_confirmed',
                            description: `Email confirmado com sucesso: ${user.email}`,
                            metadata: {
                                email: user.email,
                                confirmed_at: user.email_confirmed_at,
                                method: 'supabase_auth_link'
                            }
                        });
                        
                        // Show success message and redirect
                        const onboarding = new OnboardingSystem();
                        onboarding.showNotification('Email confirmado com sucesso! 🎉 Bem-vindo ao Aimapctus!', 'success');
                        
                        setTimeout(() => {
                            window.location.href = './dashboard.html';
                        }, 2000);
                        
                        return true;
                    }
                }
            }
            
            return false;
        } catch (error) {
            console.error('Erro ao processar confirmação de email:', error);
            return false;
        }
    }

    togglePassword() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('password-toggle');
        const icon = toggleBtn.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    async handleAccountForm(e) {
        e.preventDefault();
        
        if (!this.validateAccountForm()) {
            return;
        }

        const formData = new FormData(e.target);
        
        // Store account data
        this.userData.firstName = formData.get('firstName');
        this.userData.lastName = formData.get('lastName');
        this.userData.email = formData.get('email');
        this.userData.password = formData.get('password');
        this.userData.newsletter = formData.get('newsletter') === 'on';

        this.goToStep(2);
    }

    validateAccountForm() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const termsAccept = document.getElementById('termsAccept').checked;

        let isValid = true;

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(msg => msg.textContent = '');

        if (!firstName) {
            this.showFieldError('firstName', 'Nome é obrigatório');
            isValid = false;
        }

        if (!lastName) {
            this.showFieldError('lastName', 'Sobrenome é obrigatório');
            isValid = false;
        }

        if (!email || !this.isValidEmail(email)) {
            this.showFieldError('email', 'Email válido é obrigatório');
            isValid = false;
        }

        if (password.length < 6) {
            this.showFieldError('password', 'Senha deve ter pelo menos 6 caracteres');
            isValid = false;
        }

        if (password !== confirmPassword) {
            this.showFieldError('confirmPassword', 'Senhas não coincidem');
            isValid = false;
        }

        if (!termsAccept) {
            this.showNotification('Você deve aceitar os termos de uso para continuar', 'error');
            isValid = false;
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = '#ef4444';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
        }
    }

    async handlePlatformsForm(e) {
        e.preventDefault();
        
        // Get selected platforms
        const selectedPlatforms = [];
        document.querySelectorAll('input[name="platforms"]:checked').forEach(checkbox => {
            selectedPlatforms.push(checkbox.value);
        });

        if (selectedPlatforms.length === 0) {
            this.showNotification('Selecione pelo menos uma plataforma', 'error');
            return;
        }

        // Get selected niche
        const selectedNiche = document.querySelector('input[name="niche"]:checked')?.value;
        
        if (!selectedNiche) {
            this.showNotification('Selecione seu nicho principal', 'error');
            return;
        }

        // Store platform and niche data
        this.userData.platforms = selectedPlatforms;
        this.userData.niche = selectedNiche;

        this.goToStep(3);
    }

    async handlePlanForm(e) {
        e.preventDefault();
        
        const selectedPlan = document.querySelector('input[name="plan"]:checked')?.value;
        
        if (!selectedPlan) {
            this.showNotification('Selecione um plano para continuar', 'error');
            return;
        }

        // Store plan data
        this.userData.plan = selectedPlan;

        this.goToStep(4);
        this.updateSummary();
    }

    async handleCompleteForm(e) {
        e.preventDefault();
        
        this.showLoading(e.target);

        try {
            // Create user account with Supabase Auth
            const result = await this.createUserAccount();
            
            if (result.success) {
                if (result.needsVerification) {
                    // Show email confirmation step if email needs verification
                    this.showEmailConfirmationStep();
                } else {
                    // User is already verified, go directly to success
                    this.showSuccessStep();
                }
            } else {
                this.showNotification('Erro ao criar conta: ' + result.error, 'error');
            }
        } catch (error) {
            this.showNotification('Erro inesperado: ' + error.message, 'error');
        } finally {
            this.hideLoading(e.target);
        }
    }

    async createUserAccount() {
        try {
            // Use Supabase Auth for user registration with email confirmation
            const result = await this.supabaseClient.signUpWithEmail(
                this.userData.email,
                this.userData.password,
                {
                    name: `${this.userData.firstName} ${this.userData.lastName}`,
                    plan: this.userData.plan,
                    platforms: this.userData.platforms,
                    niche: this.userData.niche,
                    newsletter: this.userData.newsletter
                }
            );

            if (result.success) {
                // Log activity
                await this.supabaseClient.logActivity({
                    type: 'user_registration',
                    description: `Usuário se registrou: ${this.userData.email}`,
                    metadata: {
                        plan: this.userData.plan,
                        platforms: this.userData.platforms,
                        niche: this.userData.niche,
                        needsVerification: result.needsVerification
                    }
                });

                // Store user session data
                this.setUserSession({
                    name: `${this.userData.firstName} ${this.userData.lastName}`,
                    email: this.userData.email,
                    plan: this.userData.plan,
                    platforms: this.userData.platforms,
                    niche: this.userData.niche,
                    emailConfirmed: !result.needsVerification,
                    needsVerification: result.needsVerification
                });

                return { 
                    success: true, 
                    needsVerification: result.needsVerification,
                    user: result.data.user
                };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    setUserSession(userData) {
        localStorage.setItem('aimapctus_user', JSON.stringify({
            ...userData,
            loginTime: Date.now(),
            onboardingCompleted: true,
            emailConfirmed: userData.emailConfirmed || false,
            needsVerification: userData.needsVerification || false
        }));
    }

    updateSummary() {
        document.getElementById('summary-name').textContent = `${this.userData.firstName} ${this.userData.lastName}`;
        document.getElementById('summary-email').textContent = this.userData.email;
        document.getElementById('summary-platforms').textContent = this.userData.platforms.join(', ');
        document.getElementById('summary-niche').textContent = this.getNicheDisplayName(this.userData.niche);
        document.getElementById('summary-plan').textContent = this.getPlanDisplayName(this.userData.plan);
    }

    getNicheDisplayName(niche) {
        const niches = {
            'danca': 'Dança & Música',
            'comedia': 'Comédia',
            'educacao': 'Educação',
            'lifestyle': 'Lifestyle',
            'games': 'Games',
            'culinaria': 'Culinária',
            'fitness': 'Fitness',
            'beleza': 'Beleza',
            'negocios': 'Negócios',
            'outro': 'Outro'
        };
        return niches[niche] || niche;
    }

    getPlanDisplayName(plan) {
        const plans = {
            'criador': 'Criador (R$ 29,90/mês)',
            'influencer': 'Influencer Pro (R$ 49,90/mês)'
        };
        return plans[plan] || plan;
    }

    goToStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.onboarding-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show target step
        document.getElementById(`step-${stepNumber}`).classList.add('active');

        this.currentStep = stepNumber;
        this.updateProgressBar();
    }

    showSuccessStep() {
        document.querySelectorAll('.onboarding-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById('success-step').classList.add('active');
        
        // Update progress to show completion
        this.currentStep = this.totalSteps + 1;
        this.updateProgressBar();
    }

    showEmailConfirmationStep() {
        document.querySelectorAll('.onboarding-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById('email-confirmation-step').classList.add('active');
        
        // Update the email in the confirmation message
        document.getElementById('confirmation-email').textContent = this.userData.email;
        
        // Simulate sending confirmation email
        this.sendConfirmationEmail();
        
        // Update progress to show completion
        this.currentStep = this.totalSteps + 1;
        this.updateProgressBar();
    }

    async sendConfirmationEmail() {
        try {
            // Use Supabase's built-in email confirmation resend
            const result = await this.supabaseClient.resendConfirmation(this.userData.email);
            
            if (result.success) {
                // Log activity
                await this.supabaseClient.logActivity({
                    type: 'email_confirmation_sent',
                    description: `Email de confirmação enviado para: ${this.userData.email}`,
                    metadata: {
                        email: this.userData.email,
                        timestamp: new Date().toISOString(),
                        method: 'supabase_auth'
                    }
                });

                console.log('📧 Email de confirmação enviado pelo Supabase para:', this.userData.email);
                return { success: true };
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Erro ao enviar email de confirmação:', error);
            throw error;
        }
    }

    async resendConfirmationEmail() {
        const button = document.getElementById('resend-email');
        const originalText = button.innerHTML;
        
        // Show loading state
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
        
        try {
            await this.sendConfirmationEmail();
            this.showNotification('Email de confirmação reenviado com sucesso!', 'success');
            
            // Update button to show success
            button.innerHTML = '<i class="fas fa-check"></i> <span>Enviado!</span>';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = originalText;
            }, 3000);
        } catch (error) {
            this.showNotification('Erro ao reenviar email: ' + error.message, 'error');
            button.disabled = false;
            button.innerHTML = originalText;
        }
    }

    continueWithoutConfirmation() {
        // Mark user as unconfirmed in session
        const userData = JSON.parse(localStorage.getItem('aimapctus_user') || '{}');
        userData.emailConfirmed = false;
        userData.confirmationSkipped = true;
        localStorage.setItem('aimapctus_user', JSON.stringify(userData));
        
        this.showNotification('Você pode confirmar o email mais tarde no dashboard', 'info');
        
        // Proceed to dashboard
        this.goToDashboard();
    }

    updateProgressBar() {
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });
    }

    goToDashboard() {
        window.location.href = './dashboard.html';
    }

    watchTutorial() {
        // Open tutorial video or page
        window.open('https://www.youtube.com/watch?v=tutorial_id', '_blank');
    }

    showLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando conta...';
    }

    hideLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-rocket"></i> <span>Criar Minha Conta</span>';
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.onboarding-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `onboarding-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 9999;
            animation: slideInFromRight 0.3s ease;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        `;

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

// Initialize onboarding when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Check for email confirmation first
    const confirmed = await OnboardingSystem.handleEmailConfirmation();
    
    if (!confirmed) {
        // Only initialize onboarding if not handling confirmation
        new OnboardingSystem();
    }
});

// Export for use in other files
window.OnboardingSystem = OnboardingSystem;