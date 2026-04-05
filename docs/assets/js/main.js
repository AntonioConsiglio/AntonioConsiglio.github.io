/**
 * Main JavaScript for Portfolio - Single Page Application
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- Navigation & Scroll Effects --- */
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section, main');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    window.addEventListener('scroll', () => {
        // Navbar styling on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    /* --- Mobile Menu Toggle --- */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.navbar');
    
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            nav.classList.toggle('mobile-nav-active');
            const icon = mobileBtn.querySelector('i');
            if (nav.classList.contains('mobile-nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when a link is clicked
        const mobileLinks = document.querySelectorAll('.nav-links a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('mobile-nav-active');
                if(mobileBtn.querySelector('i')) {
                    const icon = mobileBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    /* --- Intersection Observer for Animations --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.fade-in-up');
    animateElements.forEach(el => observer.observe(el));

    /* --- Typewriter Effect --- */
    const typeWriterElement = document.querySelector('.typewriter-text');
    if (typeWriterElement) {
        const words = ['Computer Vision', 'Deep Learning', 'Edge AI', 'GenAI Workflows'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typeWriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typeWriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end of word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before next word
            }

            setTimeout(type, typeSpeed);
        }

        // Start typing effect slightly after load
        setTimeout(type, 1000);
    }

    /* --- Particle Constellation Background --- */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function initParticles() {
            particlesArray = [];
            // Adjust particle count based on screen size for performance
            let numberOfParticles = (canvas.height * canvas.width) / 15000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 0.5;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = 'rgba(148, 163, 184, 0.3)';

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function connectParticles() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                                   ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(99, 102, 241,' + opacityValue * 0.2 + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            requestAnimationFrame(animateParticles);
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connectParticles();
        }

        window.addEventListener('resize', () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
            initParticles();
        });

        initParticles();
        animateParticles();
    }
});
