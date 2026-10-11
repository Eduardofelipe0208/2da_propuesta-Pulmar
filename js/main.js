/* Archivo: js/main.js | Acción: REEMPLAZAR */

document.addEventListener('DOMContentLoaded', () => {
    const CONTACT_CONFIG = {
        email: 'Pulmarconstruccionesca@gmail.com',
        whatsappNumber: '584140492563',
        displayPhone: '0414-0492563'
    };

    // 1. Año dinámico en el footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Control de Header en Scroll y Menú Móvil
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    const handleScroll = () => {
        if (!header) return;
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

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

    // 3. Filtrado Interactivo de Flota Vehicular
    const fleetTabs = document.querySelectorAll('.fleet-tab');
    const fleetCards = document.querySelectorAll('.fleet-unit-card, .fleet-card');

    fleetTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');

            fleetTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            fleetCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 4. Preselección automática en el configurador al hacer clic en un Servicio o Unidad de la Flota
    const serviceTypeSelect = document.getElementById('service-type');
    const vehicleTypeSelect = document.getElementById('vehicle-type');
    const prefillElements = document.querySelectorAll('.service-cta-link, .fleet-select-btn, [data-service], [data-unit]');

    prefillElements.forEach(el => {
        el.addEventListener('click', () => {
            const selectedService = el.getAttribute('data-service');
            const selectedUnit = el.getAttribute('data-unit');

            if (selectedService && serviceTypeSelect) {
                serviceTypeSelect.value = selectedService;
            }
            if (selectedUnit && vehicleTypeSelect) {
                vehicleTypeSelect.value = selectedUnit;
            }
        });
    });

    // 5. Lógica del Formulario: Vista previa del mensaje + apertura del correo en otra pestaña listo para enviar
    const quoteForm = document.getElementById('quote-builder-form');
    const btnWhatsapp = document.getElementById('btn-submit-whatsapp');
    const btnPreviewEmail = document.getElementById('btn-preview-email');
    const btnOpenEmailTab = document.getElementById('btn-open-email-tab');
    const btnOpenMailtoApp = document.getElementById('btn-open-mailto-app');
    const errorMsg = document.getElementById('form-error-msg');
    const outputPanel = document.getElementById('quote-output-panel');
    const statusPill = document.getElementById('output-status-pill');
    const summaryPre = document.getElementById('quote-summary-text');
    const copyBtn = document.getElementById('btn-copy-quote');
    const copyFeedback = document.getElementById('copy-feedback');

    // Función que valida los campos y construye el mensaje y las URLs de correo y WhatsApp
    const buildSummaryAndValidate = () => {
        const companyName = document.getElementById('company-name').value.trim();
        const contactPerson = document.getElementById('contact-person').value.trim();
        const serviceType = document.getElementById('service-type').value;
        const vehicleType = document.getElementById('vehicle-type').value;
        const modalityType = document.getElementById('modality-type').value;
        const unitsCount = document.getElementById('units-count').value || '1';
        const operationDetails = document.getElementById('operation-details').value.trim();

        if (!companyName || !contactPerson || !operationDetails) {
            if (errorMsg) errorMsg.hidden = false;
            return null;
        }

        if (errorMsg) errorMsg.hidden = true;

        const currentDate = new Date().toLocaleDateString('es-VE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const emailSubject = `Solicitud de Cotización Corporativa - ${companyName} | Pulmar Construcciones, C.A.`;

        // Mensaje que aparece en la vista previa y se carga dentro del correo[cite: 2, 5, 29, 32]
        const summaryDocument = [
            'SOLICITUD DE COTIZACIÓN CORPORATIVA',
            'PARA: PULMAR CONSTRUCCIONES, C.A. (RIF: J-40651947-2)',
            `FECHA: ${currentDate}`,
            '------------------------------------------------------------',
            '1. DATOS DEL SOLICITANTE',
            `• Empresa / Institución: ${companyName}`,
            `• Persona de Contacto: ${contactPerson}`,
            '',
            '2. REQUERIMIENTO DE FLOTA Y SERVICIO',
            `• Servicio Requerido: ${serviceType}`,
            `• Tipo de Unidad: ${vehicleType}`,
            `• Modalidad Operativa: ${modalityType}`,
            `• Cantidad de Unidades: ${unitsCount} unidad(es)`,
            '',
            '3. RUTA, DESTINO Y DETALLES DE LA SOLICITUD',
            operationDetails,
            '------------------------------------------------------------',
            `Destinatario: ${CONTACT_CONFIG.email} | Teléfono: ${CONTACT_CONFIG.displayPhone}`
        ].join('\n');

        // Mensaje optimizado para WhatsApp[cite: 2, 5, 29, 32]
        const whatsappMessage = [
            '*SOLICITUD DE COTIZACIÓN - PULMAR CONSTRUCCIONES, C.A.*',
            `Fecha: ${currentDate}`,
            '',
            '*1. Datos del Solicitante:*',
            `• Empresa/Institución: ${companyName}`,
            `• Contacto/Cargo: ${contactPerson}`,
            '',
            '*2. Requerimiento Operativo:*',
            `• Servicio: ${serviceType}`,
            `• Unidad: ${vehicleType}`,
            `• Modalidad: ${modalityType}`,
            `• Cantidad: ${unitsCount} unidad(es)`,
            '',
            '*3. Especificaciones de Ruta/Operación:*',
            operationDetails
        ].join('\n');

        const whatsappUrl = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        // URL que abre otra pestaña directamente en el redactor de Gmail con destinatario, asunto y cuerpo precargados
        const gmailComposeTabUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_CONFIG.email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(summaryDocument)}`;

        // URL mailto para quienes usan aplicación de correo en celular o PC
        const mailtoAppUrl = `mailto:${CONTACT_CONFIG.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(summaryDocument)}`;

        return {
            summaryDocument,
            whatsappUrl,
            gmailComposeTabUrl,
            mailtoAppUrl
        };
    };

    // BOTÓN 1: Enviar por WhatsApp
    if (btnWhatsapp) {
        btnWhatsapp.addEventListener('click', () => {
            const data = buildSummaryAndValidate();
            if (!data) return;

            if (summaryPre) summaryPre.textContent = data.summaryDocument;
            if (btnOpenEmailTab) btnOpenEmailTab.href = data.gmailComposeTabUrl;
            if (btnOpenMailtoApp) btnOpenMailtoApp.href = data.mailtoAppUrl;

            if (statusPill) {
                statusPill.textContent = 'WHATSAPP ABIERTO';
                statusPill.style.backgroundColor = '#8D1A1A';
            }

            if (outputPanel) outputPanel.hidden = false;
            if (copyFeedback) {
                copyFeedback.hidden = false;
                copyFeedback.textContent = `Se ha abierto WhatsApp (${CONTACT_CONFIG.displayPhone}) en otra pestaña con su mensaje listo.`;
            }

            window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
        });
    }

    // BOTÓN 2: Al pulsar "Enviar por Correo", muestra allí mismo el mensaje que se enviará y prepara el botón que abre la pestaña del correo
    if (btnPreviewEmail) {
        btnPreviewEmail.addEventListener('click', () => {
            const data = buildSummaryAndValidate();
            if (!data) return;

            if (summaryPre) summaryPre.textContent = data.summaryDocument;
            if (btnOpenEmailTab) btnOpenEmailTab.href = data.gmailComposeTabUrl;
            if (btnOpenMailtoApp) btnOpenMailtoApp.href = data.mailtoAppUrl;

            if (statusPill) {
                statusPill.textContent = 'VERIFIQUE SU MENSAJE';
                statusPill.style.backgroundColor = '#163F6B';
            }

            if (copyFeedback) {
                copyFeedback.hidden = false;
                copyFeedback.textContent = `Revise el mensaje arriba y haga clic en "Abrir mi Correo con este Mensaje" para abrir la pestaña de su correo y enviarlo a ${CONTACT_CONFIG.email}.`;
            }

            if (outputPanel) {
                outputPanel.hidden = false;
                outputPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // Cuando el usuario hace clic en "Abrir mi Correo con este Mensaje"
    if (btnOpenEmailTab) {
        btnOpenEmailTab.addEventListener('click', () => {
            if (statusPill) {
                statusPill.textContent = 'CORREO ABIERTO EN OTRA PESTAÑA';
                statusPill.style.backgroundColor = '#8D1A1A';
            }
            if (copyFeedback) {
                copyFeedback.hidden = false;
                copyFeedback.textContent = `¡Listo! Se abrió su correo en una nueva pestaña con el mensaje cargado para ${CONTACT_CONFIG.email}. Solo presione "Enviar" dentro de su correo.`;
            }
        });
    }

    // Evitar recargas si presionan Enter dentro de un campo
    if (quoteForm) {
        quoteForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (btnPreviewEmail) {
                btnPreviewEmail.click();
            }
        });
    }

    // 6. Copiar resumen al portapapeles
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const textToCopy = summaryPre ? summaryPre.textContent : '';
            if (!textToCopy) return;

            try {
                await navigator.clipboard.writeText(textToCopy);
                if (copyFeedback) {
                    copyFeedback.textContent = '¡Mensaje copiado exitosamente al portapapeles!';
                    copyFeedback.hidden = false;
                }
            } catch (err) {
                const tempArea = document.createElement('textarea');
                tempArea.value = textToCopy;
                document.body.appendChild(tempArea);
                tempArea.select();
                document.execCommand('copy');
                document.body.removeChild(tempArea);
                if (copyFeedback) {
                    copyFeedback.textContent = '¡Mensaje copiado exitosamente al portapapeles!';
                    copyFeedback.hidden = false;
                }
            }
        });
    }
});