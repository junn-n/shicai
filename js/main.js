/**
 * 平会石材 - 主交互脚本
 */

document.addEventListener('DOMContentLoaded', function() {

    // ===== DOM Elements =====
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const heroParticles = document.getElementById('heroParticles');
    const navLinks = document.querySelectorAll('.nav-link');

    // ===== Create Hero Particles =====
    function createParticles() {
        if (!heroParticles) return;
        const count = 30;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(212,168,83,${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatParticle ${Math.random() * 15 + 10}s linear infinite;
                animation-delay: ${Math.random() * 10}s;
            `;
            heroParticles.appendChild(particle);
        }
    }

    // Add particle animation keyframes
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes floatParticle {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; }
        }
    `;
    document.head.appendChild(particleStyle);

    createParticles();

    // ===== Navbar Scroll Effect =====
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbar);
    updateNavbar(); // initial check

    // ===== Active Nav Link on Scroll =====
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        let current = '';
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ===== Mobile Menu Toggle =====
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ===== Back to Top =====
    function toggleBackToTop() {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleBackToTop);

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== Smooth scroll for all anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Scroll Reveal Animation =====
    const revealElements = document.querySelectorAll(
        '.product-card, .service-card, .gallery-item, .highlight-item, .contact-info-card, .contact-form-card, .featured-card, .craft-item, .guide-card, .faq-item, .process-step'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // ===== Contact Form =====
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const interest = document.getElementById('interest').value;
        const message = document.getElementById('message').value.trim();

        if (!name || !phone) {
            showFormMessage('请填写姓名和联系电话', 'error');
            return;
        }

        if (!/^1[3-9]\d{9}$/.test(phone)) {
            showFormMessage('请输入正确的手机号码', 'error');
            return;
        }

        // Build message for WeChat/phone sharing
        const fullMessage =
            `【石材咨询】%0A` +
            `姓名：${name}%0A` +
            `电话：${phone}%0A` +
            `意向：${interest || '未选择'}%0A` +
            `留言：${message || '无'}`;

        // In a real site, you would send this to a server
        // For now, show success and offer to call directly
        showFormMessage('留言提交成功！您也可以直接拨打电话咨询', 'success');

        // Offer to open phone dialer
        setTimeout(() => {
            const callNow = confirm('是否立即拨打电话 15011542596 咨询？');
            if (callNow) {
                window.location.href = 'tel:15011542596';
            }
        }, 500);

        // Reset form
        contactForm.reset();
    });

    function showFormMessage(msg, type) {
        // Remove existing message
        const existingMsg = document.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();

        const msgEl = document.createElement('div');
        msgEl.className = 'form-message';
        msgEl.textContent = msg;
        msgEl.style.cssText = `
            margin-top: 16px;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            text-align: center;
            animation: fadeUp 0.3s ease;
            ${
                type === 'success'
                    ? 'background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9;'
                    : 'background: #ffebee; color: #c62828; border: 1px solid #ffcdd2;'
            }
        `;

        contactForm.appendChild(msgEl);

        if (type === 'success') {
            setTimeout(() => {
                if (msgEl.parentNode) msgEl.remove();
            }, 6000);
        }
    }

    // ===== Gallery Lightbox Effect =====
    const galleryItems = document.querySelectorAll('.gallery-img');

    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.innerHTML = '<div class="lightbox-overlay"></div><div class="lightbox-content"><button class="lightbox-close">&times;</button><img class="lightbox-image" src="" alt=""><div class="lightbox-caption"></div></div>';
    document.body.appendChild(lightbox);

    const lightboxOverlay = lightbox.querySelector('.lightbox-overlay');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    function openLightbox(imgElement) {
        const bgImage = imgElement.style.backgroundImage;
        const url = bgImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
        const caption = imgElement.querySelector('.gallery-caption');
        if (url) {
            lightboxImage.src = url;
            lightboxCaption.innerHTML = caption ? caption.innerHTML : '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeLightbox();
    });

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            openLightbox(this);
        });
    });

    // ===== Product Card Click =====
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            const interestSelect = document.getElementById('interest');

            // Scroll to contact form and pre-select the category
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });

            if (interestSelect) {
                setTimeout(() => {
                    interestSelect.value = category;
                    interestSelect.focus();
                }, 800);
            }
        });
    });

    // ===== Parallax-like effect on hero =====
    const hero = document.querySelector('.hero');

    if (hero) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;

            if (scrollY < heroHeight) {
                const opacity = 1 - scrollY / (heroHeight * 0.8);
                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.opacity = Math.max(opacity, 0);
                    heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                }
            }
        });
    }

    // ===== Craft Tabs =====
    const craftTabs = document.querySelectorAll('.craft-tab');
    const craftPanels = document.querySelectorAll('.craft-panel');

    craftTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            craftTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            craftPanels.forEach(p => p.classList.remove('active'));
            const targetPanel = document.getElementById('panel-' + targetTab);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });

    // ===== Color Filter =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCardsFilter = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            productCardsFilter.forEach(card => {
                if (filter === 'all') {
                    card.classList.remove('hidden');
                } else {
                    const colors = card.dataset.color;
                    if (colors && colors.includes(filter)) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                }
            });
        });
    });

    // ===== FAQ Accordion =====
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('open');
            // Close all
            faqItems.forEach(i => i.classList.remove('open'));
            // Open clicked (unless it was already open)
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    // ===== Featured Card Click =====
    const featuredCards = document.querySelectorAll('.featured-card');

    featuredCards.forEach(card => {
        card.addEventListener('click', function() {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ===== Service card hover enhancement =====
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            serviceCards.forEach(c => {
                if (c !== card) {
                    c.style.opacity = '0.7';
                    c.style.transform = 'scale(0.98)';
                }
            });
        });

        card.addEventListener('mouseleave', function() {
            serviceCards.forEach(c => {
                c.style.opacity = '1';
                c.style.transform = '';
            });
        });
    });

    // ===== Console welcome =====
    console.log('%c平会石材 %c欢迎您的访问',
        'font-size:24px;font-weight:bold;color:#8B7355;',
        'font-size:14px;color:#666;');
    console.log('%c地址：密云区建材城西区南门中庭2号 | 电话：15011542596',
        'font-size:12px;color:#999;');

});
