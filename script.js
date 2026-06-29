document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Mobile Navigation Drawer
    const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
        mobileDrawer.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = ''; // Re-enable background scrolling
    }

    if (mobileToggleBtn) {
        mobileToggleBtn.addEventListener('click', openDrawer);
    }

    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', closeDrawer);
    }

    // Close drawer when a navigation link is clicked
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // Close drawer if clicking outside it
    document.addEventListener('click', (e) => {
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
            if (!mobileDrawer.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
                closeDrawer();
            }
        }
    });

    // 3. Project Grid Filtering with Smooth Transitions
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');

                if (filterValue === 'all' || categories.includes(filterValue)) {
                    // Show item
                    card.style.display = 'flex';
                    // Trigger reflow/animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    // Hide item
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // Match transition length
                }
            });
        });
    });

    // 4. Scroll Reveal (Intersection Observer)
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Once revealed, we don't need to observe it anymore
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 5. Navigation Scroll Spy & Header Blur Effect
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    // Add scroll listener for active section indicator and header styles
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100; // Offset for header height

        // 5a. Scroll Spy
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // 5b. Dynamic Header shadow/opacity on scroll
        if (header) {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
                header.style.backgroundColor = 'rgba(248, 250, 252, 0.95)';
            } else {
                header.style.boxShadow = 'none';
                header.style.backgroundColor = 'rgba(248, 250, 252, 0.85)';
            }
        }
    });

    // 6. Contact Form Submission (Static Friendly Handling)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            const actionUrl = contactForm.getAttribute('action');

            // If it's still pointing to the default placeholder endpoint, intercept it to showcase success
            if (actionUrl.includes('placeholder')) {
                e.preventDefault();

                formStatus.className = 'form-message-status success';
                formStatus.innerHTML = `
                    <i data-lucide="check-circle" style="width: 1.1rem; height: 1.1rem; display: inline; vertical-align: middle; margin-right: 0.25rem;"></i>
                    <strong>Demo sent!</strong> On GitHub Pages, update the form's action attribute in <code>index.html</code> with a valid Formspree endpoint key to receive actual emails.
                `;
                
                // Re-init lucide icons in the newly inserted HTML
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }

                contactForm.reset();
            } else {
                // If the action is customized, let it submit naturally but give simple feedback
                formStatus.className = 'form-message-status success';
                formStatus.innerText = 'Submitting message...';
            }
        });
    }
});
