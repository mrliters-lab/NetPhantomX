/* ============================================
   NetPhantomX — Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // Matrix Digital Rain
    // ==========================================
    const canvas = document.getElementById('matrix-rain');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`アイウエオカキクケコサシスセソタチツテト';
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    window.addEventListener('resize', () => {
        columns = Math.floor(canvas.width / fontSize);
        drops = Array(columns).fill(1);
    });

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff41';
        ctx.font = `${fontSize}px "Fira Code", monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            // Vary brightness for depth
            const alpha = Math.random() * 0.5 + 0.1;
            ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
            ctx.fillText(text, x, y);

            // Bright head character
            if (Math.random() > 0.95) {
                ctx.fillStyle = '#ffffff';
                ctx.fillText(text, x, y);
            }

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        setInterval(drawMatrix, 50);
    }

    // ==========================================
    // Typing Animation
    // ==========================================
    const typedTextEl = document.getElementById('typedText');
    const terminalOutput = document.getElementById('terminalOutput');
    const commands = [
        {
            cmd: 'npx phantomx --scan target.com',
            output: [
                '[*] Initializing scan engine...',
                '[+] DNS enumeration complete: 12 subdomains found',
                '[+] Port scan: 847 open ports detected',
                '[!] 3 critical vulnerabilities identified',
                '[*] Generating report... DONE',
                '[✓] Scan complete in 14.7s'
            ]
        },
        {
            cmd: 'phantomx intel --threat-level high',
            output: [
                '[*] Querying threat intelligence feeds...',
                '[+] 200+ sources analyzed',
                '[!] 2 active threats matching profile',
                '[+] IOCs updated in local database',
                '[✓] Intelligence report ready'
            ]
        },
        {
            cmd: 'phantomx audit --framework NIST',
            output: [
                '[*] Loading NIST CSF 2.0 framework...',
                '[+] Analyzing 108 control points...',
                '[+] 94 controls compliant',
                '[!] 14 controls need attention',
                '[✓] Compliance score: 87%'
            ]
        }
    ];

    let cmdIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isOutputting = false;
    let outputLineIndex = 0;
    let typingSpeed = 60;
    let pauseTime = 2000;

    function typeCommand() {
        const current = commands[cmdIndex];

        if (!isDeleting && !isOutputting) {
            // Typing
            if (charIndex < current.cmd.length) {
                typedTextEl.textContent = current.cmd.substring(0, charIndex + 1);
                charIndex++;
                setTimeout(typeCommand, typingSpeed + Math.random() * 40);
            } else {
                // Done typing, show output
                isOutputting = true;
                outputLineIndex = 0;
                terminalOutput.innerHTML = '';
                terminalOutput.classList.add('visible');
                setTimeout(typeCommand, 500);
            }
        } else if (isOutputting) {
            // Showing output lines
            if (outputLineIndex < current.output.length) {
                const line = document.createElement('div');
                line.className = 'output-line';
                line.textContent = current.output[outputLineIndex];
                terminalOutput.appendChild(line);
                outputLineIndex++;
                setTimeout(typeCommand, 200 + Math.random() * 100);
            } else {
                // Done outputting, pause then delete
                isOutputting = false;
                isDeleting = true;
                setTimeout(typeCommand, pauseTime);
            }
        } else if (isDeleting) {
            // Deleting
            if (charIndex > 0) {
                typedTextEl.textContent = current.cmd.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(typeCommand, 25);
            } else {
                // Done deleting, move to next command
                isDeleting = false;
                terminalOutput.classList.remove('visible');
                terminalOutput.innerHTML = '';
                cmdIndex = (cmdIndex + 1) % commands.length;
                setTimeout(typeCommand, 400);
            }
        }
    }

    if (!prefersReducedMotion) {
        setTimeout(typeCommand, 1200);
    } else {
        typedTextEl.textContent = commands[0].cmd;
    }

    // ==========================================
    // Navbar Scroll Behavior
    // ==========================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ==========================================
    // Mobile Menu Toggle
    // ==========================================
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ==========================================
    // Active Nav Link on Scroll
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollPos = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ==========================================
    // Scroll Animations (IntersectionObserver)
    // ==========================================
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: show all
        animateElements.forEach(el => el.classList.add('visible'));
    }

    // ==========================================
    // Counter Animation
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-count'));
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;

            if (isDecimal) {
                el.textContent = current.toFixed(1);
            } else {
                el.textContent = Math.floor(current);
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(el => counterObserver.observe(el));
    }

    // ==========================================
    // Status Bar Animation
    // ==========================================
    const statusBars = document.querySelectorAll('.status-bar-fill[data-width]');

    if ('IntersectionObserver' in window) {
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width');
                    entry.target.style.width = width + '%';
                    barObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statusBars.forEach(el => barObserver.observe(el));
    }

    // ==========================================
    // Contact Form Handling
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('.cyber-btn');
        const originalText = btn.querySelector('.btn-glitch').textContent;
        btn.querySelector('.btn-glitch').textContent = 'ENCRYPTING...';
        btn.disabled = true;
        btn.style.opacity = '0.6';

        // Simulate sending
        setTimeout(() => {
            formStatus.textContent = '[✓] Transmission sent successfully';
            formStatus.className = 'form-status success';
            btn.querySelector('.btn-glitch').textContent = originalText;
            btn.disabled = false;
            btn.style.opacity = '1';
            contactForm.reset();

            setTimeout(() => {
                formStatus.textContent = '';
            }, 5000);
        }, 2000);
    });

    // ==========================================
    // Neon Hover Glow on Cards
    // ==========================================
    const glowCards = document.querySelectorAll('.service-card, .tool-card, .testimonial-card');

    glowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (prefersReducedMotion) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.background = `radial-gradient(
                300px circle at ${x}px ${y}px,
                rgba(0, 255, 65, 0.06),
                transparent 60%
            )`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = '';
        });
    });

    // ==========================================
    // Smooth Scroll for Anchor Links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // Custom Cursor Glow (Desktop Only)
    // ==========================================
    if (window.innerWidth > 768 && !prefersReducedMotion) {
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 255, 65, 0.04) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
            opacity: 0;
        `;
        document.body.appendChild(glow);

        let cursorX = 0, cursorY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            glow.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
        });

        function animateGlow() {
            glowX += (cursorX - glowX) * 0.1;
            glowY += (cursorY - glowY) * 0.1;
            glow.style.left = glowX + 'px';
            glow.style.top = glowY + 'px';
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }

    // ==========================================
    // Initialize — show hero animations
    // ==========================================
    setTimeout(() => {
        document.querySelectorAll('.hero .animate-on-scroll').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 150);
        });
    }, 200);

});
