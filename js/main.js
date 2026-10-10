/* Archivo: js/main.js | Acción: CREAR */
/* Gestión interactiva de navegación, filtrado de flota y apertura simultánea de 2 pestañas (WhatsApp y Correo)[cite: 20, 23, 24, 25, 26] */

document.addEventListener('DOMContentLoaded', () => {
    const CONTACT_CONFIG = {
        email: 'eduardofelipe020800@gmail.com',
        whatsappNumber: '584120936783',
        displayPhone: '0412-0936783'
    };

    // 1. Año actual en el footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Navegación fija y menú móvil
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateHeaderOnScroll = () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
    updateHeaderOnScroll();

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 3. Filtrado de flota por categoría (Encava 32 puestos, Pick-Up Doble Cabina, Sport Wagon)[cite: 24, 25, 26]
    const fleetTabs = document.querySelectorAll('.fleet-tab');
    const fleetCards = document.querySelectorAll('.fleet-card');

    fleetTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            fleetCards.forEach(card => {
                if (card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });     