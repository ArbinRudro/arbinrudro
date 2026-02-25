document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Navbar Effect
    const mainNav = document.getElementById('mainNav');

    const toggleNavbarBackground = () => {
        if (window.scrollY > 50) {
            mainNav.classList.add('navbar-scrolled');
        } else {
            mainNav.classList.remove('navbar-scrolled');
        }
    };

    // Initial check and scroll event listener
    toggleNavbarBackground();
    window.addEventListener('scroll', toggleNavbarBackground);

    // 2. Smooth Scrolling & Active Link updating
    // Note: ScrollSpy by Bootstrap can be used, but since we're writing Vanilla JS:
    const navLinks = document.querySelectorAll('.nav-link:not([href="#"])');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.getElementById('navbarResponsive');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerOffset = 70; // Adjust depending on navbar height
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });

                    // Close collapse on mobile after clicking
                    if (window.getComputedStyle(navbarToggler).display !== 'none') {
                        // Using Bootstrap 5 collapse API (if included in HTML via script)
                        // Or just remove the 'show' class natively
                        if (navbarCollapse.classList.contains('show')) {
                            navbarCollapse.classList.remove('show');
                        }
                    }
                }
            }
        });
    });

    // 3. Portfolio Filtering
    const filterButtons = document.querySelectorAll('.portfolio-filter li');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === itemCategory) {
                    item.style.display = 'block';
                    // Need a slight delay to trigger opacity transition nicely if desired, 
                    // otherwise block setting immediately displays it.
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300); // match CSS transition duration
                }
            });
        });
    });

    // 4. Progress Bar Animation on Scroll using IntersectionObserver
    const progressElements = document.querySelectorAll('.progress');

    const animateProgress = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressDiv = entry.target;
                const bar = progressDiv.querySelector('.progress-bar');
                const value = progressDiv.getAttribute('aria-valuenow');
                if (bar && value) {
                    bar.style.width = value + '%';
                }
                observer.unobserve(progressDiv); // Animate only once
            }
        });
    };

    const progressObserver = new IntersectionObserver(animateProgress, {
        threshold: 0.5,
        rootMargin: "0px 0px -50px 0px"
    });

    progressElements.forEach(el => {
        progressObserver.observe(el);
    });

    // 5. Scroll to Top Button
    const scrollTopBtn = document.getElementById('scrollToTop');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 6. Contact Form AJAX Submission
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('formSuccessMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default full-page submission

            if (!contactForm.checkValidity()) {
                event.stopPropagation();
                contactForm.classList.add('was-validated');
                return;
            }

            // If valid, submit via AJAX
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                _captcha: "false",
                _template: "table"
            };

            fetch("https://formsubmit.co/ajax/anupme01@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(response => response.json())
                .then(data => {
                    // Determine if successful
                    if (data.success) {
                        successMessage.classList.remove('d-none');
                        contactForm.reset();
                        contactForm.classList.remove('was-validated');

                        // Hide success message after 5 seconds
                        setTimeout(() => {
                            successMessage.classList.add('d-none');
                        }, 5000);
                    } else {
                        alert("Oops! Something went wrong.");
                    }
                })
                .catch(error => {
                    console.log(error);
                    alert("Oops! There was a problem submitting your form.");
                })
                .finally(() => {
                    submitBtn.textContent = "Send Message";
                    submitBtn.disabled = false;
                });

        }, false);
    }
});
