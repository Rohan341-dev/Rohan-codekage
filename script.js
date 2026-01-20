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

// Set current year in footer
currentYear.textContent = new Date().getFullYear();

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

// Form Validation
function initFormValidation() {
    function validateForm() {
        let isValid = true;
        
        // Name validation
        const nameInput = document.getElementById('name');
        const nameError = document.getElementById('name-error');
        if (nameInput.value.trim().length < 2) {
            nameError.textContent = 'Name must be at least 2 characters';
            isValid = false;
        } else {
            nameError.textContent = '';
        }
        
        // Email validation
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        } else {
            emailError.textContent = '';
        }
        
        // Message validation
        const messageInput = document.getElementById('message');
        const messageError = document.getElementById('message-error');
        if (messageInput.value.trim().length < 10) {
            messageError.textContent = 'Message must be at least 10 characters';
            isValid = false;
        } else {
            messageError.textContent = '';
        }
        
        return isValid;
    }
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show success message
            const successMessage = document.getElementById('form-success');
            successMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
            successMessage.style.color = '#2ed573';
            
            // Reset form
            contactForm.reset();
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                successMessage.textContent = '';
            }, 5000);
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
    initFormValidation();
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