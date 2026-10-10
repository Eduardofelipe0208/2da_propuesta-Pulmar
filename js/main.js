/* Archivo: js/main.js | Acción: REEMPLAZAR */

document.addEventListener('DOMContentLoaded', () => {
    // Configuraciones de contacto corporativo y envío real de correo
    const CONTACT_CONFIG = {
        email: 'eduardofelipe020800@gmail.com',
        whatsappNumber: '584120936783', // Código internacional +58 (Venezuela) para 04120936783
        displayPhone: '0412-0936783',
        // Endpoint para envío directo al correo desde el formulario
        formSubmitAjaxUrl: 'https://formsubmit.co/ajax/eduardofelipe020800@gmail.com',
        formSubmitTabUrl: 'https://formsubmit.co/eduardofelipe020800@gmail.com'
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
    const fleetCards = document.querySelectorAll('.fleet-unit-card');

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
    const serviceLinks = document.querySelectorAll('.service-cta-link');
    const fleetSelectBtns = document.querySelectorAll('.fleet-select-btn');

    serviceLinks.forEach(link => {
        link.addEventListener('click', () => {
            const selectedService = link.getAttribute('data-service');
            if (selectedService && serviceTypeSelect) {
                serviceTypeSelect.value = selectedService;
            }
        });
    });

    fleetSelectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedUnit = btn.getAttribute('data-unit');
            if (selectedUnit && vehicleTypeSelect) {
                vehicleTypeSelect.value = selectedUnit;
            }
        });
    });

    // 5. Envío simultáneo a WhatsApp y Correo Electrónico (Evitando bloqueo de multipestañas del navegador)
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

    const builderActions = document.querySelector('.builder-actions');
    const outputActions = document.querySelector('.output-actions');
    let submitBtn = null;

    if (builderActions) {
        submitBtn = builderActions.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<span>Enviar a WhatsApp y Correo</span><span aria-hidden="true">&rarr;</span>';
        }
    }

    // Botones de acción individual para abrir cada canal en su propia pestaña
    if (outputActions) {
        const btnWhatsappDirect = document.createElement('button');
        btnWhatsappDirect.type = 'button';
        btnWhatsappDirect.id = 'btn-send-whatsapp';
        btnWhatsappDirect.className = 'btn-Action-solid';
        btnWhatsappDirect.textContent = 'Abrir WhatsApp';

        const btnGmailDirect = document.createElement('button');
        btnGmailDirect.type = 'button';
        btnGmailDirect.id = 'btn-send-gmail';
        btnGmailDirect.className = 'btn-Action-outline';
        btnGmailDirect.textContent = 'Abrir en Gmail';

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

    if (quoteForm) {
        quoteForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const companyName = document.getElementById('company-name').value.trim();
            const contactPerson = document.getElementById('contact-person').value.trim();
            const serviceType = document.getElementById('service-type').value;
            const vehicleType = document.getElementById('vehicle-type').value;
            const modalityType = document.getElementById('modality-type').value;
            const unitsCount = document.getElementById('units-count').value || '1';
            const operationDetails = document.getElementById('operation-details').value.trim();

            if (!companyName || !contactPerson || !operationDetails) {
                errorMsg.hidden = false;
                return;
            }

            errorMsg.hidden = true;

            const currentDate = new Date().toLocaleDateString('es-VE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Documento estructurado para correo e impresión
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

            // Mensaje optimizado con formato para WhatsApp
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

            // Mostrar resumen en pantalla inmediatamente
            summaryPre.textContent = summaryDocument;
            outputPanel.hidden = false;
            copyFeedback.hidden = false;
            copyFeedback.textContent = `Enviando solicitud al correo ${CONTACT_CONFIG.email} y abriendo WhatsApp...`;
            outputPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Acción 1 (Síncrona al clic): Abrir pestaña de WhatsApp (los navegadores permiten 1 window.open por clic)
            window.open(latestWhatsappUrl, '_blank', 'noopener,noreferrer');

            // Acción 2: Disparar apertura del cliente de correo mediante cambio de ubicación mailto (no requiere segunda ventana emergente)
            setTimeout(() => {
                window.location.href = latestMailtoUrl;
            }, 350);

            // Acción 3: Enviar el correo automáticamente en segundo plano vía FormSubmit AJAX a eduardofelipe020800@gmail.com
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Enviando solicitud...</span>';
            }

            try {
                const response = await fetch(CONTACT_CONFIG.formSubmitAjaxUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
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
                    })
                });

                const result = await response.json();

                if (response.ok && (result.success === 'true' || result.success === true)) {
                    copyFeedback.textContent = `¡Solicitud enviada con éxito a ${CONTACT_CONFIG.email} y abierta en WhatsApp (${CONTACT_CONFIG.displayPhone})!`;
                } else {
                    copyFeedback.textContent = `Se abrió WhatsApp y su aplicación de correo. Si prefiere redactar desde el navegador, pulse "Abrir en Gmail". (Nota: Si es el primer envío con FormSubmit, revise la bandeja de ${CONTACT_CONFIG.email} para activar el formulario).`;
                }
            } catch (error) {
                copyFeedback.textContent = `Se abrió WhatsApp (${CONTACT_CONFIG.displayPhone}) y su cliente de correo para ${CONTACT_CONFIG.email}. También puede pulsar "Abrir en Gmail" arriba.`;
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Enviar a WhatsApp y Correo</span><span aria-hidden="true">&rarr;</span>';
                }
            }
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const textToCopy = summaryPre.textContent;
            if (!textToCopy) return;

            try {
                await navigator.clipboard.writeText(textToCopy);
                copyFeedback.textContent = '¡Resumen copiado exitosamente al portapapeles!';
                copyFeedback.hidden = false;
            } catch (err) {
                const tempArea = document.createElement('textarea');
                tempArea.value = textToCopy;
                document.body.appendChild(tempArea);
                tempArea.select();
                document.execCommand('copy');
                document.body.removeChild(tempArea);
                copyFeedback.textContent = '¡Resumen copiado exitosamente al portapapeles!';
                copyFeedback.hidden = false;
            }
        });
    }

    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
});