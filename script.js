document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Theme Toggle (Light / Dark Mode)
    // ==========================================================================
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const body = document.body;

    // Check saved theme or default to dark
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        updateThemeToggleIcons('light');
    } else {
        body.classList.remove('light-mode');
        updateThemeToggleIcons('dark');
    }

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateThemeToggleIcons(isLight ? 'light' : 'dark');
        });
    });

    function updateThemeToggleIcons(theme) {
        themeToggleBtns.forEach(btn => {
            const sunIcon = btn.querySelector('.fi-sun');
            const moonIcon = btn.querySelector('.fi-moon');
            if (theme === 'light') {
                if (sunIcon) sunIcon.style.display = 'none';
                if (moonIcon) moonIcon.style.display = 'block';
            } else {
                if (sunIcon) sunIcon.style.display = 'block';
                if (moonIcon) moonIcon.style.display = 'none';
            }
        });
    }

    // ==========================================================================
    // Mobile Menu Helper
    // ==========================================================================
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle) {
                navToggle.checked = false; // Close menu when link is clicked
            }
        });
    });

    // ==========================================================================
    // Resume Modal Overlay
    // ==========================================================================
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const viewResumeBtns = document.querySelectorAll('.view-resume-btn');

    viewResumeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (modalOverlay) {
                modalOverlay.classList.add('active');
                body.style.overflow = 'hidden'; // Lock body scroll
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            closeModal();
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Escape key closes modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            body.style.overflow = ''; // Unlock body scroll
        }
    }

    // ==========================================================================
    // Scroll Active Navigation Highlight
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const menuLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY + 150; // offset for nav height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // Skill Level Animations on Intersection
    // ==========================================================================
    const progressBars = document.querySelectorAll('.skill-progress-bar');
    
    if ('IntersectionObserver' in window && progressBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const targetVal = progressBar.getAttribute('data-percentage');
                    progressBar.style.width = targetVal + '%';
                    skillsObserver.unobserve(progressBar);
                }
            });
        }, { threshold: 0.1 });

        progressBars.forEach(bar => {
            bar.style.width = '0%'; // Start at 0
            skillsObserver.observe(bar);
        });
    } else {
        // Fallback for older browsers
        progressBars.forEach(bar => {
            const targetVal = bar.getAttribute('data-percentage');
            bar.style.width = targetVal + '%';
        });
    }

    // ==========================================================================
    // FormSubmit AJAX Handler (Smooth AJAX Submission with Alerts)
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending Message...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const data = {
                Name: formData.get('name'),
                Email: formData.get('email'),
                Message: formData.get('message')
            };

            fetch("https://formsubmit.co/ajax/sricharangoud0608@gmail.com", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(res => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                if (res.success === "true" || res.success) {
                    showToast('success', 'Thank you! Your message has been sent successfully.');
                    contactForm.reset();
                } else {
                    showToast('error', 'Oops! Failed to send email. Please try again.');
                }
            })
            .catch(error => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                showToast('error', 'Oops! Something went wrong. Please check your connection and try again.');
            });
        });
    }

    // Toast alert builder
    function showToast(type, message) {
        const toast = document.createElement('div');
        toast.className = `toast-alert toast-${type}`;
        
        const icon = type === 'success' ? '✔' : '✖';
        toast.innerHTML = `<span class="toast-icon">${icon}</span> <span class="toast-msg">${message}</span>`;
        
        document.body.appendChild(toast);
        
        // Trigger reflow for slide-in animation
        toast.offsetHeight;
        toast.classList.add('visible');
        
        // Remove after 4.5 seconds
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4500);
    }
});
