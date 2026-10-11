/* Archivo: js/main.js | Acción: REEMPLAZAR */

document.addEventListener('DOMContentLoaded', () => {
    // Configuraciones de contacto corporativo y envío real de correo
    const CONTACT_CONFIG = {
        email: 'Pulmarconstruccionesca@gmail.com',
        whatsappNumber: '584140492563', // Código internacional +58 (Venezuela) para 0414-0492563
        displayPhone: '0414-0492563',
        formSubmitAjaxUrl: 'https://formsubmit.co/ajax/Pulmarconstruccionesca@gmail.com',
        formSubmitTabUrl: 'https://formsubmit.co/Pulmarconstruccionesca@gmail.com'
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

    // 3. Filtrado Interactivo de Flota Vehicular (Compatible con tarjetas y pestañas)
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

    // 5. Lógica para los 2 Botones Independientes: "Enviar por WhatsApp" y "Enviar por Correo"
    const quoteForm = document.getElementById('quote-builder-form');
    const btnWhatsapp = document.getElementById('btn-submit-whatsapp');
    const btnEmail = document.getElementById('btn-submit-email');
    const errorMsg = document.getElementById('form-error-msg');
    const outputPanel = document.getElementById('quote-output-panel');
    const statusPill = document.getElementById('output-status-pill');
    const summaryPre = document.getElementById('quote-summary-text');
    const copyBtn = document.getElementById('btn-copy-quote');
    const printBtn = document.getElementById('btn-print-quote');
    const copyFeedback = document.getElementById('copy-feedback');
    const hiddenSubject = document.getElementById('hidden-email-subject');

    // Función que valida el formulario y prepara los textos y enlaces actualizados
    const prepareQuoteData = () => {
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
        if (hiddenSubject) {
            hiddenSubject.value = emailSubject;
        }

        const summaryDocument = [
            '============================================================',
            'SOLICITUD DE COTIZACIÓN CORPORATIVA',
            'PARA: PULMAR CONSTRUCCIONES, C.A. (RIF: J-40651947-2)',
            `FECHA DE EMISIÓN: ${currentDate}`,
            '============================================================',
            '',
            '1. DATOS DEL SOLICITANTE',
            `   • Empresa / Institución: ${companyName}`,
            `   • Contacto / Cargo: ${contactPerson}`,
            '',
            '2. REQUERIMIENTO TÉCNICO DE FLOTA Y SERVICIO',
            `   • Línea de Servicio: ${serviceType}`,
            `   • Tipo de Unidad: ${vehicleType}`,
            `   • Modalidad Operativa: ${modalityType}`,
            `   • Cantidad Estimada: ${unitsCount} unidad(es)`,
            '',
            '3. ESPECIFICACIONES DE RUTA Y OPERACIÓN',
            `   ${operationDetails}`,
            '',
            '============================================================',
            `Atención Comercial: ${CONTACT_CONFIG.displayPhone} | ${CONTACT_CONFIG.email}`,
            'PULMAR CONSTRUCCIONES, C.A. - Transporte y Alquiler de Vehículos'
        ].join('\n');

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
        const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_CONFIG.email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(summaryDocument)}`;

        const directWaLink = document.getElementById('direct-wa-link');
        const directGmailLink = document.getElementById('direct-gmail-link');
        if (directWaLink) directWaLink.href = whatsappUrl;
        if (directGmailLink) directGmailLink.href = gmailWebUrl;

        if (summaryPre) summaryPre.textContent = summaryDocument;
        if (outputPanel) {
            outputPanel.hidden = false;
            outputPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        const emailPayload = {
            _subject: emailSubject,
            _template: 'table',
            _captcha: 'false',
            Empresa_o_Institucion: companyName,
            Persona_de_Contacto: contactPerson,
            Servicio_Requerido: serviceType,
            Tipo_de_Unidad: vehicleType,
            Modalidad_Operativa: modalityType,
            Cantidad_de_Unidades: unitsCount,
            Detalles_de_Operacion: operationDetails,
            Fecha_de_Solicitud: currentDate
        };

        return {
            whatsappUrl,
            gmailWebUrl,
            emailPayload
        };
    };

    // Función auxiliar para enviar el correo en una pestaña dedicada mediante FormSubmit POST
    const submitEmailInNewTab = (fieldsObj) => {
        const tempForm = document.createElement('form');
        tempForm.method = 'POST';
        tempForm.action = CONTACT_CONFIG.formSubmitTabUrl;
        tempForm.target = '_blank';
        tempForm.style.display = 'none';

        Object.entries(fieldsObj).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            tempForm.appendChild(input);
        });

        document.body.appendChild(tempForm);
        tempForm.submit();
        setTimeout(() => {
            if (document.body.contains(tempForm)) {
                document.body.removeChild(tempForm);
            }
        }, 1000);
    };

    // BOTÓN 1: Enviar por WhatsApp
    if (btnWhatsapp) {
        btnWhatsapp.addEventListener('click', () => {
            const data = prepareQuoteData();
            if (!data) return;

            if (statusPill) statusPill.textContent = 'WHATSAPP ABIERTO';
            if (copyFeedback) {
                copyFeedback.hidden = false;
                copyFeedback.textContent = `Se ha abierto WhatsApp (${CONTACT_CONFIG.displayPhone}) con su solicitud lista para enviar.`;
            }

            window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
        });
    }

    // BOTÓN 2: Enviar por Correo
    if (btnEmail) {
        btnEmail.addEventListener('click', async () => {
            const data = prepareQuoteData();
            if (!data) return;

            if (statusPill) statusPill.textContent = 'CORREO ENVIADO';
            if (copyFeedback) {
                copyFeedback.hidden = false;
                copyFeedback.textContent = `Enviando solicitud al correo ${CONTACT_CONFIG.email}...`;
            }

            // Abre la pestaña de envío de correo a Pulmarconstruccionesca@gmail.com
            submitEmailInNewTab(data.emailPayload);

            // Envío adicional por AJAX si corre sobre http/https
            if (window.location.protocol.startsWith('http')) {
                try {
                    await fetch(CONTACT_CONFIG.formSubmitAjaxUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(data.emailPayload)
                    });
                } catch (_) {
                    // Respaldado por la pestaña POST abierta
                }
            }
        });
    }

    // Si el usuario presiona Enter dentro de un input del formulario, por defecto valida y abre WhatsApp
    if (quoteForm) {
        quoteForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (btnWhatsapp) {
                btnWhatsapp.click();
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
                    copyFeedback.textContent = '¡Resumen copiado exitosamente al portapapeles!';
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
                    copyFeedback.textContent = '¡Resumen copiado exitosamente al portapapeles!';
                    copyFeedback.hidden = false;
                }
            }
        });
    }

    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
});