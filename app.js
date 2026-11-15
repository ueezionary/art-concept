document.addEventListener("DOMContentLoaded", () => {

    // Автоматически убираем висячие предлоги во всех текстах и заголовках
    document.querySelectorAll('p, h1, h2, h3, h4, .el-meta-val').forEach(el => {
        el.innerHTML = el.innerHTML.replace(/(^|\s)([а-яА-ЯёЁ]{1,2})\s+/g, '$1$2&nbsp;');
    });
    
    gsap.registerPlugin(ScrollTrigger);

    // =======================================================
    // 1. ПЛАВНЫЙ СКРОЛЛ (LENIS)
    // =======================================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });

    lenis.stop();

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);



    // =======================================================
    // 3. УМНЫЙ СТАРТ (ПРЕЛОАДЕР НА ГЛАВНОЙ ИЛИ ПЛАВНЫЙ ВХОД)
    // =======================================================
    const preloader = document.querySelector('.preloader');
    
    if (preloader) {
        gsap.set(".header", { y: -20, opacity: 0 });
        gsap.set("#line-group", { scaleX: 0, opacity: 0, transformOrigin: "center center" });
        gsap.set("#art-word", { x: 30, opacity: 0 });
        gsap.set("#concept-word", { x: -30, opacity: 0 });
        gsap.set(".hero-image", { scale: 1.15 });

        const loaderTl = gsap.timeline({
            onComplete: () => {
                lenis.start();
                ScrollTrigger.refresh();
            }
        });

        loaderTl
            .to(".preloader-logo-wrap", { opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.2 })
            .to(".preloader-logo-wrap", { opacity: 0, duration: 0.5, ease: "power2.in", delay: 0.4 })
            .to(".preloader", { yPercent: -100, duration: 1.2, ease: "power4.inOut" })
            .to(".hero-image", { scale: 1, duration: 1.5, ease: "power3.out" }, "-=1.2")
            .to(".header", { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
            .to(["#art-word", "#concept-word"], { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.8")
            .to("#line-group", { scaleX: 1, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6");

    } else {
        gsap.fromTo(document.body, 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.6, ease: "power2.inOut", onComplete: () => {
                lenis.start();
                ScrollTrigger.refresh();
            }}
        );

        const header = document.querySelector('.header');
        const heroImgs = document.querySelectorAll('.hero-image, .studio-hero-bg img, .compact-media img, .el-hero-bg img');
        const mainTitles = document.querySelectorAll('.intro-giant-title, .studio-hero-title, .projects-title, .el-project-title');

        if (heroImgs.length > 0) {
            gsap.fromTo(heroImgs, 
                { scale: 1.1, transformOrigin: "center center" }, 
                { scale: 1, duration: 1.8, ease: "power3.out", delay: 0.1 }
            );
        }
        
        if (mainTitles.length > 0) gsap.from(mainTitles, { y: 20, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.2 });
        if (header) gsap.from(header, { y: -15, opacity: 0, duration: 1, ease: "power3.out", delay: 0.3 });
    }

    // =======================================================
    // 4. ПАРАЛЛАКСЫ И ИСЧЕЗНОВЕНИЕ ЭЛЕМЕНТОВ
    // =======================================================
    if (document.querySelector(".hero-image")) {
        gsap.to(".hero-image", {
            y: "15%", ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });
    }

    if (document.querySelector(".hero-brand-center")) {
        gsap.to(".hero-brand-center", {
            opacity: 0, y: -40, scale: 0.95, ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "60% top", scrub: true }
        });
    }

    // =======================================================
    // 5. ЖУРНАЛЬНЫЙ MASK REVEAL (Блок философии)
    // =======================================================
    const flowSection = document.querySelector('#statement');
    if (flowSection) {
        document.querySelectorAll('.phrase-container .statement-row').forEach(row => {
            const wrapper = document.createElement('div');
            wrapper.className = 'line-mask';
            row.parentNode.insertBefore(wrapper, row);
            wrapper.appendChild(row);
        });

        const p1Lines = document.querySelectorAll('.phrase-1 .statement-row');
        const p2Lines = document.querySelectorAll('.phrase-2 .statement-row');
        const p3Lines = document.querySelectorAll('.phrase-3 .statement-row');
        const scatterItems = document.querySelectorAll('.scatter-item');

        gsap.set(p1Lines, { yPercent: 0 });
        gsap.set([p2Lines, p3Lines], { yPercent: 125 });

        const textTl = gsap.timeline({
            scrollTrigger: { trigger: flowSection, start: "top top", end: "bottom bottom", scrub: 1.2 }
        });

        textTl
            .to({}, { duration: 1.2 }) 
            .to(p1Lines, { yPercent: -125, stagger: 0.08, duration: 0.8, ease: "power3.in" })
            .to(p2Lines, { yPercent: 0, stagger: 0.08, duration: 0.9, ease: "power3.out" }, "-=0.2")
            .to({}, { duration: 1.2 })
            .to(p2Lines, { yPercent: -125, stagger: 0.08, duration: 0.8, ease: "power3.in" })
            .to(p3Lines, { yPercent: 0, stagger: 0.08, duration: 0.9, ease: "power3.out" }, "-=0.2")
            .to({}, { duration: 1.4 });

        scatterItems.forEach(item => {
            gsap.to(item, {
                y: item.getAttribute('data-speed'), 
                ease: "none",
                scrollTrigger: { trigger: flowSection, start: "top bottom", end: "bottom top", scrub: true }
            });
        });
    }

    // =======================================================
    // 6. ПОЯВЛЕНИЕ БЛОКОВ СНИЗУ (FADE UP)
    // =======================================================
    const fadeUpElements = document.querySelectorAll('.fade-up');
    if (fadeUpElements.length > 0) {
        fadeUpElements.forEach(el => {
            gsap.fromTo(el, 
                { y: 50, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" } }
            );
        });
    }

    // =======================================================
    // 7. АНИМАЦИЯ СПЛИТ-ЭКРАНОВ И УСЛУГ
    // =======================================================
    const splitSections = document.querySelectorAll('.split-teaser, .service-compact-section');
    if (splitSections.length > 0) {
        splitSections.forEach((section) => {
            const imgs = section.querySelectorAll('.split-image-col img, .split-img img, .compact-media img');
            const contentContainer = section.querySelector('.split-text-col, .compact-content');
            const contentElems = contentContainer ? contentContainer.children : null;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });

            if (imgs.length > 0) {
                tl.fromTo(imgs, 
                    { scale: 1.12, opacity: 0 }, 
                    { scale: 1, opacity: 1, duration: 1.4, stagger: 0.1, ease: "power3.out" },
                    0
                );
            }

            if (contentElems && contentElems.length > 0) {
                tl.fromTo(contentElems, 
                    { y: 30, opacity: 0 }, 
                    { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: "power2.out" },
                    0.2
                );
            }
        });
    }

    // =======================================================
    // 8. УМНЫЙ ХЕДЕР
    // =======================================================
    const headerEl = document.querySelector('.header');
    if (headerEl) {
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                headerEl.classList.add('header--hidden');
            } else if (currentScrollY < lastScrollY) {
                headerEl.classList.remove('header--hidden');
            }
            lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
        }, { passive: true });
    }

    // =======================================================
    // 9. АНИМАЦИЯ ОГРОМНОГО ЛОГОТИПА В ФУТЕРЕ
    // =======================================================
    const footerHugeLogo = document.querySelector('.footer-huge-logo');
    if (footerHugeLogo) {
        gsap.fromTo(footerHugeLogo, 
            { y: 150, opacity: 0, scale: 0.95 },
            { 
                y: 0, opacity: 0.15, scale: 1, duration: 1.8, ease: "power3.out",
                scrollTrigger: { trigger: "#footer", start: "top 75%" }
            }
        );
    }

    // =======================================================
    // 10. ФИЛЬТР ПРОЕКТОВ И ПЕРЕКЛЮЧАТЕЛЬ СЕТКА/СПИСОК
    // =======================================================
    const filterButtons = document.querySelectorAll(".filter-btn");
    const portfolioCards = document.querySelectorAll(".port-card");

    if (filterButtons.length > 0 && portfolioCards.length > 0) {
        function filterProjects(category) {
            portfolioCards.forEach(card => {
                if (card.getAttribute("data-category") === category) {
                    card.style.removeProperty('display');
                    gsap.fromTo(card, 
                        { opacity: 0, y: 15 }, 
                        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
                    );
                } else {
                    card.style.setProperty('display', 'none', 'important');
                }
            });
            setTimeout(() => ScrollTrigger.refresh(), 100);
        }

        const activeButton = document.querySelector(".filter-btn.active");
        if (activeButton) {
            filterProjects(activeButton.getAttribute("data-filter"));
        }

        filterButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                if (button.classList.contains("active")) return;
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                filterProjects(button.getAttribute("data-filter"));
            });
        });
    }

    const gridIcons = document.querySelectorAll('.grid-switcher .grid-icon');
    const portfolioGrid = document.querySelector('.portfolio-grid');

    if (gridIcons.length === 2 && portfolioGrid) {
        const btnGrid = gridIcons[0];
        const btnList = gridIcons[1];

        btnGrid.addEventListener('click', () => {
            if (btnGrid.classList.contains('active')) return;
            btnList.classList.remove('active');
            btnGrid.classList.add('active');
            portfolioGrid.classList.remove('list-view');
            setTimeout(() => ScrollTrigger.refresh(), 300);
        });

        btnList.addEventListener('click', () => {
            if (btnList.classList.contains('active')) return;
            btnGrid.classList.remove('active');
            btnList.classList.add('active');
            portfolioGrid.classList.add('list-view');
            setTimeout(() => ScrollTrigger.refresh(), 300);
        });
    }

    // =======================================================
    // 11. БУРГЕР МЕНЮ И ПОЯВЛЕНИЕ ПОРТРЕТОВ
    // =======================================================
    const burgerBtn = document.querySelector('.burger-btn');
    if (burgerBtn) {
        burgerBtn.addEventListener('click', () => {
            document.body.classList.toggle('menu-open');
        });
    }

    const premiumPhotos = document.querySelectorAll('.premium-photo-reveal img');
    if (premiumPhotos.length > 0) {
        premiumPhotos.forEach(photo => {
            gsap.fromTo(photo,
                { scale: 1.15, opacity: 0 },
                {
                    scale: 1, opacity: 1, duration: 1.8, ease: "power2.out",
                    scrollTrigger: {
                        trigger: photo.parentElement,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    // =======================================================
    // 12. БЕСШОВНЫЙ ПЕРЕХОД МЕЖДУ СТРАНИЦАМИ
    // =======================================================
    const internalLinks = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="mailto:"]):not([href^="tel:"]):not([href^="#"])');
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const destination = link.getAttribute('href');
            if (!destination || destination === '') return;
            e.preventDefault();
            if (lenis) lenis.stop();
            gsap.to(document.body, {
                opacity: 0,
                duration: 0.4,
                ease: "power2.inOut",
                onComplete: () => {
                    window.location.href = destination;
                }
            });
        });
    });

});

// Восстановление прозрачности для Safari (Кнопка "Назад")
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        gsap.set(document.body, { opacity: 1 });
    }
});