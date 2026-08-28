document.addEventListener("DOMContentLoaded", () => {
    
    gsap.registerPlugin(ScrollTrigger);

    // =======================================================
    // 1. ПЛАВНЫЙ СКРОЛЛ (LENIS)
    // =======================================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });

    lenis.stop(); // Останавливаем скролл до конца стартовых анимаций

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // =======================================================
    // 2. КАСТОМНЫЙ КУРСОР
    // =======================================================
    const cursor = document.getElementById('cursor');
    if (cursor) {
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: "power2.out" });
        });
        document.addEventListener('mouseleave', () => gsap.to(cursor, { opacity: 0 }));
        document.addEventListener('mouseenter', () => gsap.to(cursor, { opacity: 1 }));
    }

    const cursorText = document.querySelector('.cursor-text');
    const portCards = document.querySelectorAll('.port-card');
    if (cursorText && portCards.length > 0) {
        portCards.forEach(card => {
            card.addEventListener('mouseenter', () => cursorText.style.opacity = '1');
            card.addEventListener('mouseleave', () => cursorText.style.opacity = '0');
        });
    }

    // =======================================================
    // 3. УМНЫЙ СТАРТ (ШТОРКА НА ГЛАВНОЙ ИЛИ ПЛАВНЫЙ ВХОД НА ОСТАЛЬНЫХ)
    // =======================================================
    const preloader = document.querySelector('.preloader');
    
    if (preloader) {
        // --- ЛОГИКА ДЛЯ ГЛАВНОЙ СТРАНИЦЫ (С СИНЕЙ ШТОРКОЙ) ---
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
        // --- ЛОГИКА ДЛЯ ОСТАЛЬНЫХ СТРАНИЦ (ЗАЩИТА ОТ МОРГАНИЯ) ---
        gsap.fromTo(document.body, 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.6, ease: "power2.inOut", onComplete: () => {
                lenis.start();
                ScrollTrigger.refresh();
            }}
        );

        const header = document.querySelector('.header');
        const heroImg = document.querySelector('.hero-image, .studio-hero-bg img, .compact-media img');
        const mainTitles = document.querySelectorAll('.intro-giant-title, .studio-hero-title, .projects-title');

        if (heroImg) gsap.from(heroImg, { scale: 1.05, duration: 1.5, ease: "power3.out", delay: 0.1 });
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
    // 7. ЛЮКСОВАЯ АНИМАЦИЯ СПЛИТ-ЭКРАНОВ И УСЛУГ
    // =======================================================
    const splitSections = document.querySelectorAll('.split-teaser, .service-compact-section');

    if (splitSections.length > 0) {
        splitSections.forEach((section) => {
            // Ищем все картинки внутри секции (и большую, и маленькую в тексте)
            const imgs = section.querySelectorAll('.split-image-col img, .split-img img, .compact-media img');
            
            // Ищем текстовый контейнер
            const contentContainer = section.querySelector('.split-text-col, .compact-content');
            const contentElems = contentContainer ? contentContainer.children : null;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                    toggleActions: "play none none reverse"
                }
            });

            // 1. Плавный зум картинок
            if (imgs.length > 0) {
                tl.fromTo(imgs, 
                    { scale: 1.12, opacity: 0 }, 
                    { scale: 1, opacity: 1, duration: 1.4, stagger: 0.1, ease: "power3.out" },
                    0
                );
            }

            // 2. Плавный каскадный подъем текстов, заголовка и ссылок
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
    // 10. БЕСШОВНЫЙ ВЫХОД (ПЛАВНОЕ РАСТВОРЕНИЕ ПРИ КЛИКЕ)
    // =======================================================
    const internalLinks = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="mailto:"]):not([href^="tel:"]):not([href^="#"])');

    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const destination = link.getAttribute('href');
            
            // Если ссылка пустая или это та же страница - игнорируем
            if (!destination || destination === '') return;
            
            e.preventDefault();
            
            if (lenis) lenis.stop(); // Блокируем скролл

            // Плавно растворяем всю страницу целиком
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

}); // ЗАКРЫВАЕМ DOMContentLoaded ЗДЕСЬ!

// =======================================================
// 11. ВОССТАНОВЛЕНИЕ ПРОЗРАЧНОСТИ ДЛЯ SAFARI (Кнопка "Назад")
// =======================================================
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        gsap.set(document.body, { opacity: 1 });
    }
});

/* =======================================================
   ФИЛЬТР ПРОЕКТОВ В ПОРТФОЛИО
   ======================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const portfolioCards = document.querySelectorAll(".port-card");

    if (filterButtons.length > 0 && portfolioCards.length > 0) {
        
        // Функция фильтрации
        function filterProjects(category) {
            portfolioCards.forEach(card => {
                if (card.getAttribute("data-category") === category) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        }

        // При загрузке страницы находим активную кнопку и фильтруем по ней сразу
        const activeButton = document.querySelector(".filter-btn.active");
        if (activeButton) {
            filterProjects(activeButton.getAttribute("data-filter"));
        }

        // Обработка кликов по кнопкам
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                // Убираем активный класс у всех
                filterButtons.forEach(btn => btn.classList.remove("active"));
                // Даем активный класс нажатой
                button.classList.add("active");
                // Фильтруем
                filterProjects(button.getAttribute("data-filter"));
            });
        });
    }
});