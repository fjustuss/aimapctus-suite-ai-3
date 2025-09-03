// Aimapctus Suite AI - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initPricingToggle();
    initFAQ();
    initModal();
    initScrollAnimations();
    initFormHandling();
    initSmoothScrolling();
    initScrollToTop();
    initAdminAccess();
    initCTAButtons();
    
    console.log('Aimapctus Suite AI loaded successfully!');
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.4)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Pricing toggle functionality
function initPricingToggle() {
    const toggle = document.getElementById('pricing-toggle');
    const amounts = document.querySelectorAll('.amount');
    
    if (toggle) {
        toggle.addEventListener('change', () => {
            const isYearly = toggle.checked;
            
            amounts.forEach(amount => {
                const monthlyPrice = parseInt(amount.dataset.monthly);
                const yearlyPrice = parseInt(amount.dataset.yearly);
                
                if (isYearly) {
                    amount.textContent = yearlyPrice;
                    // Add animation
                    amount.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        amount.style.transform = 'scale(1)';
                    }, 200);
                } else {
                    amount.textContent = monthlyPrice;
                    // Add animation
                    amount.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        amount.style.transform = 'scale(1)';
                    }, 200);
                }
            });
        });
    }
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        }
    });
}

// Modal functionality
function initModal() {
    const modal = document.getElementById('contact-modal');
    const modalClose = document.getElementById('modal-close');
    const contactTriggers = document.querySelectorAll('[href="#contact"]');
    const ctaButtons = document.querySelectorAll('.btn');
    
    // Open modal function
    function openModal() {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Close modal function
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Event listeners
    contactTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });
    
    // Check for CTA buttons that should open the contact modal
    ctaButtons.forEach(button => {
        const text = button.textContent.toLowerCase();
        if (text.includes('contato') || text.includes('falar') || text.includes('agendar')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        }
    });
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Animate elements on scroll
    const animateElements = document.querySelectorAll(`
        .feature-card,
        .testimonial-card,
        .pricing-card,
        .step,
        .faq-item
    `);
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Counter animation for stats
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Counter animation function
function animateCounter(element) {
    const target = element.textContent;
    const isPercentage = target.includes('%');
    const isPlus = target.includes('+');
    const numericValue = parseInt(target.replace(/[^\d]/g, ''));
    
    let current = 0;
    const increment = numericValue / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        if (numericValue >= 1000) {
            displayValue = (displayValue / 1000).toFixed(1) + 'k';
        }
        
        if (isPercentage) {
            displayValue += '%';
        }
        if (isPlus) {
            displayValue += '+';
        }
        
        element.textContent = displayValue;
    }, 20);
}

// Form handling
function initFormHandling() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;
            
            try {
                // Try to submit to Supabase
                if (window.supabaseClient && window.supabaseClient.isInitialized) {
                    const result = await window.supabaseClient.submitContactForm(data);
                    
                    if (result.success) {
                        // Success with Supabase
                        submitButton.innerHTML = '<i class="fas fa-check"></i> Enviado!';
                        submitButton.style.background = 'var(--accent-color)';
                        
                        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                        
                        // Log activity
                        await window.supabaseClient.logActivity({
                            type: 'contact_form_submission',
                            description: `Nova mensagem de contato de ${data.name} (${data.email})`,
                            metadata: { email: data.email, company: data.company }
                        });
                    } else {
                        throw new Error(result.error);
                    }
                } else {
                    // Fallback to local storage if Supabase is not available
                    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
                    submissions.push({
                        ...data,
                        id: Date.now(),
                        timestamp: new Date().toISOString(),
                        status: 'new'
                    });
                    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
                    
                    submitButton.innerHTML = '<i class="fas fa-check"></i> Enviado!';
                    submitButton.style.background = 'var(--accent-color)';
                    
                    showNotification('Mensagem salva localmente. Configure Supabase para envio em nuvem.', 'warning');
                }
                
                // Reset form
                contactForm.reset();
                
                // Close modal
                setTimeout(() => {
                    const modal = document.getElementById('contact-modal');
                    if (modal) {
                        modal.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                    
                    // Reset button
                    submitButton.innerHTML = originalText;
                    submitButton.style.background = '';
                    submitButton.disabled = false;
                }, 2000);
                
            } catch (error) {
                console.error('Error submitting form:', error);
                
                submitButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erro';
                submitButton.style.background = 'var(--danger-color)';
                
                showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
                
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.style.background = '';
                    submitButton.disabled = false;
                }, 3000);
            }
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip modal triggers and empty links
            if (href === '#' || href.includes('contact')) {
                return;
            }
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to top functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--gradient-primary);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top when clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.transform = 'translateY(-3px)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.transform = 'translateY(0)';
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--accent-color)' : 'var(--primary-color)'};
        color: white;
        padding: 16px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 2000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 400px;
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    const notificationClose = notification.querySelector('.notification-close');
    notificationClose.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.3s ease;
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    const autoRemoveTimer = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Manual close
    notificationClose.addEventListener('click', () => {
        clearTimeout(autoRemoveTimer);
        removeNotification(notification);
    });
    
    // Hover effects
    notificationClose.addEventListener('mouseenter', () => {
        notificationClose.style.opacity = '1';
    });
    
    notificationClose.addEventListener('mouseleave', () => {
        notificationClose.style.opacity = '0.7';
    });
}

function removeNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// CTA Button interactions
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('#start-free-trial, #watch-demo');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const buttonText = button.textContent.toLowerCase();
            
            if (buttonText.includes('demo')) {
                e.preventDefault();
                showNotification('Demo em breve! Cadastre-se para ser notificado.', 'info');
            } else if (buttonText.includes('grátis') || buttonText.includes('teste')) {
                e.preventDefault();
                showNotification('Redirecionando para cadastro...', 'success');
                
                // Simulate redirect after delay
                setTimeout(() => {
                    // Here you would typically redirect to your signup page
                    console.log('Redirecting to signup...');
                }, 2000);
            }
        });
    });
});

// Performance optimizations
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if there are images with data-src
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelectorAll('img[data-src]').length > 0) {
        initLazyLoading();
    }
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard navigation for mobile menu
    const hamburger = document.getElementById('nav-hamburger');
    if (hamburger) {
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                hamburger.click();
            }
        });
        
        // Make hamburger focusable
        hamburger.setAttribute('tabindex', '0');
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('role', 'button');
    }
    
    // Add focus management for modal
    const modal = document.getElementById('contact-modal');
    if (modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstFocusable) {
                            e.preventDefault();
                            lastFocusable.focus();
                        }
                    } else {
                        if (document.activeElement === lastFocusable) {
                            e.preventDefault();
                            firstFocusable.focus();
                        }
                    }
                }
            });
            
            // Focus first element when modal opens
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        if (modal.classList.contains('active')) {
                            setTimeout(() => firstFocusable.focus(), 100);
                        }
                    }
                });
            });
            
            observer.observe(modal, { attributes: true });
        }
    }
});

// Admin access functionality
function initAdminAccess() {
    const adminBtn = document.querySelector('.admin-access-btn');
    
    if (adminBtn) {
        let clickCount = 0;
        let clickTimer = null;
        
        // Show admin hint after 30 seconds on page
        setTimeout(() => {
            if (Math.random() < 0.3) { // 30% chance to show hint
                const hint = document.createElement('div');
                hint.innerHTML = '<i class="fas fa-arrow-up"></i> Admin';
                hint.style.cssText = `
                    position: absolute;
                    bottom: 40px;
                    right: 0;
                    background: var(--primary-color);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 10px;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                    white-space: nowrap;
                `;
                
                adminBtn.parentElement.style.position = 'relative';
                adminBtn.parentElement.appendChild(hint);
                
                setTimeout(() => hint.style.opacity = '0.8', 100);
                setTimeout(() => {
                    hint.style.opacity = '0';
                    setTimeout(() => hint.remove(), 300);
                }, 3000);
            }
        }, 30000);
        
        adminBtn.addEventListener('click', function(e) {
            clickCount++;
            
            // Require 3 clicks within 2 seconds to access admin
            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 2000);
                
                e.preventDefault();
                showNotification('Clique mais 2 vezes para acessar a área administrativa', 'info');
                return false;
            } else if (clickCount === 2) {
                e.preventDefault();
                showNotification('Mais 1 clique para confirmar acesso', 'warning');
                return false;
            } else if (clickCount >= 3) {
                clearTimeout(clickTimer);
                showNotification('Redirecionando para área administrativa...', 'success');
                
                // Allow the link to proceed
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1000);
                
                return false;
            }
        });
        
        // Add subtle pulse animation on hover
        adminBtn.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 1s infinite';
        });
        
        adminBtn.addEventListener('mouseleave', function() {
            this.style.animation = '';
        });
    }
}

// Add pulse animation to CSS
const pulseCSS = `
@keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
}
`;

// Inject pulse animation CSS
const style = document.createElement('style');
style.textContent = pulseCSS;
document.head.appendChild(style);

// CTA Buttons functionality
function initCTAButtons() {
    // Redirect CTA buttons to onboarding
    document.querySelectorAll('.btn').forEach(button => {
        const text = button.textContent.toLowerCase();
        if (text.includes('teste') || 
            text.includes('começar') || 
            text.includes('experimentar') ||
            text.includes('grátis') ||
            button.id === 'start-free-trial') {
            
            button.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = './onboarding.html';
            });
        }
    });
    
    // Specific button handlers
    const startTrialBtn = document.getElementById('start-free-trial');
    if (startTrialBtn) {
        startTrialBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = './onboarding.html';
        });
    }
}