// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.getElementById('contact-form');
const backToTopBtn = document.getElementById('back-to-top');
const currentYear = document.getElementById('current-year');
const viewToggles = document.querySelectorAll('.view-toggle');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const skillItems = document.querySelectorAll('.skill-item');
const timelineItems = document.querySelectorAll('.timeline-item');
const contactFormConfig = window.contactFormConfig || {};
const contactDeliveryConfig = {
    recipientEmail: contactFormConfig.recipientEmail || 'r6461719@gmail.com',
    recipientPhone: contactFormConfig.recipientPhone || '+9779706299586',
    emailjs: {
        publicKey: contactFormConfig.emailjs?.publicKey || '',
        serviceId: contactFormConfig.emailjs?.serviceId || '',
        templateId: contactFormConfig.emailjs?.templateId || ''
    }
};
let isEmailJsInitialized = false;

// Set current year in footer
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Theme Toggle
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Smooth Scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navigation Active State
function initNavActiveState() {
    const sections = document.querySelectorAll('section');
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe skill items
    skillItems.forEach(item => observer.observe(item));
    
    // Observe timeline items
    timelineItems.forEach(item => observer.observe(item));
    
    // Observe project cards
    projectCards.forEach(card => observer.observe(card));
    
    // Animate skill bars
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItem = entry.target;
                const skillPercent = skillItem.getAttribute('data-skill');
                const skillProgress = skillItem.querySelector('.skill-progress');
                
                setTimeout(() => {
                    skillProgress.style.width = `${skillPercent}%`;
                }, 300);
            }
        });
    }, { threshold: 0.5 });
    
    skillItems.forEach(item => skillObserver.observe(item));
}

// Animate Stats Counter
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const target = parseInt(statNumber.getAttribute('data-count'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        statNumber.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        statNumber.textContent = Math.floor(current) + '+';
                    }
                }, 16);
                
                observer.unobserve(statNumber); // Stop observing once animated
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(number => observer.observe(number));
}

// Experience View Toggle
function initExperienceViewToggle() {
    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const view = toggle.getAttribute('data-view');
            
            // Update active button
            viewToggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
            
            // Show/hide views
            if (view === 'timeline') {
                document.querySelector('.experience-timeline').style.display = 'block';
                document.querySelector('.experience-cards').style.display = 'none';
            } else {
                document.querySelector('.experience-timeline').style.display = 'none';
                document.querySelector('.experience-cards').style.display = 'grid';
            }
        });
    });
}

// Project Filtering
function initProjectFiltering() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Contact Form
function initContactForm() {
    if (!contactForm) return;

    const submitButton = contactForm.querySelector('.btn-submit');
    const submitButtonText = submitButton?.querySelector('.btn-text');
    const successMessage = document.getElementById('form-success');
    const fieldValidators = {
        name: (value) => (
            value.trim().length >= 2 ? '' : 'Name must be at least 2 characters.'
        ),
        email: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value.trim()) ? '' : 'Please enter a valid email address.';
        },
        phone: (value) => {
            if (!value.trim()) return '';
            const digitCount = value.replace(/\D/g, '').length;
            return digitCount >= 7 ? '' : 'Please enter a valid phone number.';
        },
        subject: (value) => (
            value.trim().length >= 3 ? '' : 'Subject must be at least 3 characters.'
        ),
        message: (value) => (
            value.trim().length >= 10 ? '' : 'Message must be at least 10 characters.'
        )
    };

    function isConfiguredEmailJsValue(value) {
        return Boolean(value) && !value.startsWith('YOUR_');
    }

    function canSendWithEmailJs() {
        return Boolean(window.emailjs)
            && isConfiguredEmailJsValue(contactDeliveryConfig.emailjs.publicKey)
            && isConfiguredEmailJsValue(contactDeliveryConfig.emailjs.serviceId)
            && isConfiguredEmailJsValue(contactDeliveryConfig.emailjs.templateId);
    }

    function setFormMessage(message, type = 'success') {
        if (!successMessage) return;

        successMessage.textContent = message;
        successMessage.classList.toggle('is-visible', Boolean(message));
        successMessage.classList.toggle('is-error', type === 'error');
    }

    function setFieldError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (!errorElement) return;
        errorElement.textContent = message;
    }

    function validateField(fieldName) {
        const field = document.getElementById(fieldName);
        if (!field || !fieldValidators[fieldName]) return true;

        const message = fieldValidators[fieldName](field.value);
        setFieldError(fieldName, message);
        return !message;
    }

    function validateForm() {
        return Object.keys(fieldValidators).every(validateField);
    }

    function setSubmitState(isSubmitting) {
        if (!submitButton) return;

        submitButton.disabled = isSubmitting;
        submitButton.setAttribute('aria-busy', String(isSubmitting));

        if (submitButtonText) {
            submitButtonText.textContent = isSubmitting ? 'Sending...' : 'Send Message';
        }
    }

    function getFormData() {
        return {
            name: document.getElementById('name')?.value.trim() || '',
            email: document.getElementById('email')?.value.trim() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            subject: document.getElementById('subject')?.value.trim() || '',
            message: document.getElementById('message')?.value.trim() || ''
        };
    }

    function buildMailtoLink(formData) {
        const subject = encodeURIComponent(`[Portfolio Contact] ${formData.subject}`);
        const body = encodeURIComponent(
            `Name: ${formData.name}\n`
            + `Email: ${formData.email}\n`
            + `Phone: ${formData.phone || 'Not provided'}\n\n`
            + `${formData.message}`
        );

        return `mailto:${contactDeliveryConfig.recipientEmail}?subject=${subject}&body=${body}`;
    }

    async function sendWithEmailJs(formData) {
        if (!canSendWithEmailJs()) return false;

        if (!isEmailJsInitialized) {
            window.emailjs.init({
                publicKey: contactDeliveryConfig.emailjs.publicKey
            });
            isEmailJsInitialized = true;
        }

        await window.emailjs.send(
            contactDeliveryConfig.emailjs.serviceId,
            contactDeliveryConfig.emailjs.templateId,
            {
                from_name: formData.name,
                reply_to: formData.email,
                phone: formData.phone || 'Not provided',
                subject: formData.subject,
                message: formData.message,
                to_email: contactDeliveryConfig.recipientEmail,
                contact_number: `${Date.now()}`
            }
        );

        return true;
    }

    Object.keys(fieldValidators).forEach((fieldName) => {
        const field = document.getElementById(fieldName);
        if (!field) return;

        field.addEventListener('input', () => {
            validateField(fieldName);
            if (successMessage?.classList.contains('is-visible')) {
                setFormMessage('');
            }
        });
    });

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        setFormMessage('');

        if (!validateForm()) {
            setFormMessage('Please fix the highlighted fields and try again.', 'error');
            return;
        }

        const formData = getFormData();
        setSubmitState(true);

        try {
            const sentDirectly = await sendWithEmailJs(formData);

            if (sentDirectly) {
                setFormMessage('Message sent successfully. I will get back to you soon.');
                contactForm.reset();
                Object.keys(fieldValidators).forEach((fieldName) => setFieldError(fieldName, ''));
                return;
            }

            window.location.href = buildMailtoLink(formData);
            setFormMessage('Your email app is opening with the message pre-filled.');
        } catch (error) {
            console.error('Contact form delivery failed:', error);
            window.location.href = buildMailtoLink(formData);
            setFormMessage('Direct sending is unavailable right now. Your email app is opening instead.', 'error');
        } finally {
            setSubmitState(false);
        }
    });
}

// Back to Top Button
function initBackToTop() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Typing Effect
function initTypingEffect() {
    const typingText = document.querySelector('.typing-text');
    const texts = ['Web Developer', 'AI Enthusiast', 'Problem Solver', 'Tech Innovator'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 1500); // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500); // Pause before typing next
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    
    // Start typing effect
    setTimeout(type, 1000);
}

// Image Preloader for better UX
function initImagePreloader() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Check if image is already loaded
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            
            img.addEventListener('error', () => {
                console.error(`Failed to load image: ${img.src}`);
                // You could set a placeholder image here
            });
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initSmoothScroll();
    initNavActiveState();
    initScrollAnimations();
    initStatsCounter();
    initExperienceViewToggle();
    initProjectFiltering();
    initContactForm();
    initBackToTop();
    initTypingEffect();
    initImagePreloader();
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.service-card, .project-card, .experience-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Initialize newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('.newsletter-input');
            if (input.value.trim()) {
                alert('Thank you for subscribing!');
                input.value = '';
            }
        });
    }
});
