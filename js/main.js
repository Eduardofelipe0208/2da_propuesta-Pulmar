/* Archivo: js/main.js | Acción: REEMPLAZAR */

document.addEventListener('DOMContentLoaded', () => {
    // Configuraciones de contacto corporativo y envío real de correo
    const CONTACT_CONFIG = {
        email: 'Pulmarconstruccionesca@gmail.com',
        whatsappNumber: '584120936783', // Código internacional +58 (Venezuela) para 04120936783
        displayPhone: '0412-0936783',
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

    // 5. Envío simultáneo a WhatsApp y Correo Electrónico (Abriendo 2 pestañas reales)
    const quoteForm = document.getElementById('quote-builder-form');
    const errorMsg = document.getElementById('form-error-msg');
    const outputPanel = document.getElementById('quote-output-panel');
    const summaryPre = document.getElementById('quote-summary-text');
    const copyBtn = document.getElementById('btn-copy-quote');
    const printBtn = document.getElementById('btn-print-quote');
    const copyFeedback = document.getElementById('copy-feedback');

    let latestWhatsappUrl = '';
    let latestGmailTabUrl = '';
    let latestMailtoUrl = '';

    const builderActions = document.querySelector('.builder-actions, .form-submit-row');
    const outputActions = document.querySelector('.output-actions, .output-buttons-grid, .result-actions-row');
    let submitBtn = quoteForm ? quoteForm.querySelector('button[type="submit"]') : null;

    if (submitBtn) {
        submitBtn.innerHTML = '<span>Enviar a WhatsApp y Correo</span><span aria-hidden="true">&rarr;</span>';
    }

    // Inyectar botones de respaldo en el panel de salida si no existen ya en el HTML
    if (outputActions && !document.getElementById('btn-send-whatsapp') && !document.getElementById('direct-wa-link')) {
        const btnWhatsappDirect = document.createElement('button');
        btnWhatsappDirect.type = 'button';
        btnWhatsappDirect.id = 'btn-send-whatsapp';
        btnWhatsappDirect.className = 'btn-Action-solid';
        btnWhatsappDirect.textContent = 'Abrir WhatsApp';

        const btnGmailDirect = document.createElement('button');
        btnGmailDirect.type = 'button';
        btnGmailDirect.id = 'btn-send-gmail';
        btnGmailDirect.className = 'btn-Action-outline';
        btnGmailDirect.textContent = 'Redactar en Gmail';

        const btnMailtoDirect = document.createElement('button');
        btnMailtoDirect.type = 'button';
        btnMailtoDirect.id = 'btn-send-mailto';
        btnMailtoDirect.className = 'btn-Action-outline';
        btnMailtoDirect.textContent = 'App de Correo';

        outputActions.prepend(btnMailtoDirect);
        outputActions.prepend(btnGmailDirect);
        outputActions.prepend(btnWhatsappDirect);

        btnWhatsappDirect.addEventListener('click', () => {
            if (latestWhatsappUrl) {
                window.open(latestWhatsappUrl, '_blank', 'noopener,noreferrer');
            }
        });

        btnGmailDirect.addEventListener('click', () => {
            if (latestGmailTabUrl) {
                window.open(latestGmailTabUrl, '_blank', 'noopener,noreferrer');
            }
        });

        btnMailtoDirect.addEventListener('click', () => {
            if (latestMailtoUrl) {
                window.location.href = latestMailtoUrl;
            }
        });
    }

    // Función auxiliar que crea y envía un formulario POST en una nueva pestaña hacia el correo
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
            document.body.removeChild(tempForm);
        }, 1000);
    };

    if (quoteForm) {
        quoteForm.addEventListener('submit', async (event) => {
            // Detenemos el submit por defecto para controlar exactamente la validación y las 2 pestañas
            event.preventDefault();

            const companyName = document.getElementById('company-name').value.trim();
            const contactPerson = document.getElementById('contact-person').value.trim();
            const serviceType = document.getElementById('service-type').value;
            const vehicleType = document.getElementById('vehicle-type').value;
            const modalityType = document.getElementById('modality-type').value;
            const unitsCount = document.getElementById('units-count').value || '1';
            const operationDetails = document.getElementById('operation-details').value.trim();

            if (!companyName || !contactPerson || !operationDetails) {
                if (errorMsg) errorMsg.hidden = false;
                return;
            }

            if (errorMsg) errorMsg.hidden = true;

            const currentDate = new Date().toLocaleDateString('es-VE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Documento estructurado para correo e impresión[cite: 2, 5]
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

            // Mensaje optimizado con formato para WhatsApp[cite: 2, 5]
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

            const emailSubject = `Solicitud de Cotización Corporativa - ${companyName} | Pulmar Construcciones, C.A.`;

            // Preparar URLs de WhatsApp, Gmail Web y Mailto
            latestWhatsappUrl = `https://wa.me/${CONTACT_CONFIG.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            latestGmailTabUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_CONFIG.email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(summaryDocument)}`;
            latestMailtoUrl = `mailto:${CONTACT_CONFIG.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(summaryDocument)}`;

            // Actualizar enlaces si existen en el HTML
            const directWaLink = document.getElementById('direct-wa-link');
            const directGmailLink = document.getElementById('direct-gmail-link');
            if (directWaLink) directWaLink.href = latestWhatsappUrl;
            if (directGmailLink) directGmailLink.href = latestGmailTabUrl;

            // Mostrar resumen en pantalla inmediatamente
            if (summaryPre) summaryPre.textContent = summaryDocument;
            if (outputPanel) {
                outputPanel.hidden = false;
                outputPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            if (copyFeedback) {
                copyFeedback.hidden = false;
                copyFeedback.textContent = `Abriendo pestaña de WhatsApp (${CONTACT_CONFIG.displayPhone}) y pestaña de envío de correo (${CONTACT_CONFIG.email})...`;
            }

            // Datos estructurados para el envío de correo
            const emailPayload = {
                _subject: emailSubject,
                _template: 'table',
                _captcha: 'false',
                Empresa_o_Institucion: companyName,
                Persona_de_Contacto: contactPerson,
                Linea_de_Servicio: serviceType,
                Tipo_de_Unidad: vehicleType,
                Modalidad_Operativa: modalityType,
                Cantidad_de_Unidades: unitsCount,
                Especificaciones_de_Operacion: operationDetails,
                Fecha_de_Solicitud: currentDate
            };

            // PESTAÑA 1: Abrir WhatsApp
            window.open(latestWhatsappUrl, '_blank', 'noopener,noreferrer');

            // PESTAÑA 2: Enviar correo abriendo pestaña de confirmación de FormSubmit
            // (Al usar tempForm.submit() con target="_blank" dentro del mismo evento submit, se envía aunque la web esté en file:// local)
            submitEmailInNewTab(emailPayload);

            // Respaldo adicional en segundo plano vía AJAX (por si el sitio está alojado en un servidor http/https)
            if (window.location.protocol.startsWith('http')) {
                try {
                    await fetch(CONTACT_CONFIG.formSubmitAjaxUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(emailPayload)
                    });
                } catch (_) {
                    // Silencioso porque la pestaña POST principal ya gestionó el envío
                }
            }
        });
    }

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