document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('clientForm');
    const addPropertyBtn = document.getElementById('addPropertyBtn');
    const numPropiedadesInput = document.getElementById('numPropiedades');
    const propiedadesSection = document.getElementById('propiedadesSection');
    const propiedadesContainer = document.getElementById('propiedadesContainer');
    
    const addContactBtn = document.getElementById('addContactBtn');
    const contactosSection = document.getElementById('contactosSection');
    const contactosContainer = document.getElementById('contactosContainer');
    
    let propertyCount = 0;
    let contactCount = 0;
    
    // Botón para generar PDF
    const generatePdfBtn = document.getElementById('generatePdfBtn');
    
    // Elementos para campos condicionales
    const licenciasSiRadio = document.getElementById('licenciasSi');
    const licenciasNoRadio = document.getElementById('licenciasNo');
    const numeroLicenciaDiv = document.getElementById('numeroLicenciaDiv');
    const numeroLicenciaInput = document.getElementById('numeroLicencia');
    
    const registroSiRadio = document.getElementById('registroSi');
    const registroNoRadio = document.getElementById('registroNo');
    const numeroRegistroDiv = document.getElementById('numeroRegistroDiv');
    const numeroRegistroInput = document.getElementById('numeroRegistro');
    
    // Manejar añadir propiedad
    addPropertyBtn.addEventListener('click', function() {
        propertyCount++;
        numPropiedadesInput.value = propertyCount;
        addPropertyForm(propertyCount);
        
        // Mostrar la sección de propiedades si está oculta
        if (propiedadesSection.style.display === 'none') {
            propiedadesSection.style.display = 'block';
        }
    });
    
    // Manejar añadir contacto
    addContactBtn.addEventListener('click', function() {
        contactCount++;
        addContactForm(contactCount);
        
        // Mostrar la sección de contactos si está oculta
        if (contactosSection.style.display === 'none') {
            contactosSection.style.display = 'block';
        }
    });
    
    // Manejar generación de PDF con estilos
    generatePdfBtn.addEventListener('click', function() {
        generatePDF();
    });
    
    // Manejar generación de PDF básico
    const generateBasicPdfBtn = document.getElementById('generateBasicPdfBtn');
    if (generateBasicPdfBtn) {
        generateBasicPdfBtn.addEventListener('click', async function() {
            await generateBasicPDF();
        });
    }
    
    
    // Manejar cambios en licencias turísticas
    licenciasSiRadio.addEventListener('change', function() {
        if (this.checked) {
            showConditionalField(numeroLicenciaDiv, numeroLicenciaInput, true);
        }
    });
    
    licenciasNoRadio.addEventListener('change', function() {
        if (this.checked) {
            hideConditionalField(numeroLicenciaDiv, numeroLicenciaInput);
        }
    });
    
    // Manejar cambios en registro turístico
    registroSiRadio.addEventListener('change', function() {
        if (this.checked) {
            showConditionalField(numeroRegistroDiv, numeroRegistroInput, true);
        }
    });
    
    registroNoRadio.addEventListener('change', function() {
        if (this.checked) {
            hideConditionalField(numeroRegistroDiv, numeroRegistroInput);
        }
    });
    
    function showConditionalField(divElement, inputElement, required = false) {
        divElement.style.display = 'block';
        divElement.classList.add('conditional-field');
        setTimeout(() => {
            divElement.classList.add('show');
        }, 10);
        
        if (required) {
            inputElement.setAttribute('required', 'required');
        }
    }
    
    function hideConditionalField(divElement, inputElement) {
        divElement.classList.remove('show');
        setTimeout(() => {
            divElement.style.display = 'none';
            divElement.classList.remove('conditional-field');
        }, 300);
        
        inputElement.removeAttribute('required');
        inputElement.value = '';
    }
    
    async function generatePDF() {
        // Validar campos requeridos antes de generar PDF
        const nombreCliente = document.getElementById('nombreCliente').value.trim();
        const dni = document.getElementById('dni').value.trim();
        
        if (!nombreCliente || !dni) {
            alert('Por favor, complete al menos los campos requeridos (Nombre de Cliente y DNI) antes de generar el PDF.');
            return;
        }
        
        // Recopilar datos del formulario
        const formData = collectFormData();
        
        // Generar PDF con estilos usando el generador externo
        const success = await generateStyledPDF(formData);
        
        if (success) {
            // Mostrar mensaje de éxito
            showPdfSuccessMessage();
        }
    }
    
    async function generateBasicPDF() {
        // Validar campos requeridos antes de generar PDF
        const nombreCliente = document.getElementById('nombreCliente').value.trim();
        const dni = document.getElementById('dni').value.trim();
        
        if (!nombreCliente || !dni) {
            alert('Por favor, complete al menos los campos requeridos (Nombre de Cliente y DNI) antes de generar el PDF.');
            return;
        }
        
        // Recopilar datos del formulario
        const formData = collectFormData();
        
        // Crear PDF básico usando jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Configurar fuente
        doc.setFont('times', 'normal');
        
        let yPosition = 20;
        
        // Cargar y añadir logo (con fallback)
        const logoInfo = await loadLogoWithFallback();
        if (logoInfo) {
            // Calcular dimensiones manteniendo proporción
            const dimensions = calculateLogoDimensions(logoInfo.originalWidth, logoInfo.originalHeight);
            const logoX = (210 - dimensions.width) / 2;
            
            doc.addImage(logoInfo.dataURL, 'PNG', logoX, yPosition - 5, dimensions.width, dimensions.height);
            yPosition += dimensions.height + 5;
        }
        
        // Título
        doc.setFontSize(20);
        doc.setFont('times', 'bold');
        doc.text('FORMULARIO DE CLIENTE', 105, yPosition, { align: 'center' });
        
        // Línea separadora
        doc.setLineWidth(0.5);
        doc.line(20, yPosition + 5, 190, yPosition + 5);
        
        yPosition += 20;
        
        // Datos del cliente
        doc.setFontSize(14);
        doc.setFont('times', 'bold');
        doc.text('DATOS DEL CLIENTE', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(11);
        doc.setFont('times', 'normal');
        doc.text(`Nombre: ${formData.nombreCliente}`, 25, yPosition);
        yPosition += 7;
        doc.text(`DNI: ${formData.dni}`, 25, yPosition);
        yPosition += 7;
        doc.text(`Teléfono: ${formData.telefono || 'No proporcionado'}`, 25, yPosition);
        yPosition += 7;
        doc.text(`Email: ${formData.email || 'No proporcionado'}`, 25, yPosition);
        yPosition += 15;
        
        // Información general
        doc.setFontSize(14);
        doc.setFont('times', 'bold');
        doc.text('INFORMACIÓN GENERAL', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(11);
        doc.setFont('times', 'normal');
        doc.text(`Número de propiedades: ${formData.numPropiedades || '0'}`, 25, yPosition);
        yPosition += 7;
        doc.text(`Licencias turísticas: ${formData.licenciasTuristicas}`, 25, yPosition);
        yPosition += 7;
        
        if (formData.numeroLicencia) {
            doc.text(`Número de licencia: ${formData.numeroLicencia}`, 25, yPosition);
            yPosition += 7;
        }
        
        doc.text(`Registro turístico: ${formData.registroTuristico}`, 25, yPosition);
        yPosition += 7;
        
        if (formData.numeroRegistro) {
            doc.text(`Número de registro: ${formData.numeroRegistro}`, 25, yPosition);
            yPosition += 7;
        }
        
        yPosition += 10;
        
        // Propiedades
        if (formData.propiedades.length > 0) {
            doc.setFontSize(14);
            doc.setFont('times', 'bold');
            doc.text('PROPIEDADES', 20, yPosition);
            yPosition += 10;
            
            formData.propiedades.forEach((prop, index) => {
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFontSize(12);
                doc.setFont('times', 'bold');
                doc.text(`Propiedad ${index + 1}:`, 25, yPosition);
                yPosition += 7;
                
                doc.setFontSize(11);
                doc.setFont('times', 'normal');
                doc.text(`Nombre: ${prop.nombre || 'No especificado'}`, 30, yPosition);
                yPosition += 6;
                doc.text(`Dirección: ${prop.direccionLinea || 'No especificada'}`, 30, yPosition);
                yPosition += 6;
                doc.text(`Ciudad: ${prop.ciudad || 'No especificada'}`, 30, yPosition);
                yPosition += 6;
                doc.text(`Provincia: ${prop.provincia || 'No especificada'}`, 30, yPosition);
                yPosition += 6;
                doc.text(`Código Postal: ${prop.codigoPostal || 'No especificado'}`, 30, yPosition);
                yPosition += 6;
                doc.text(`País: ${prop.pais || 'No especificado'}`, 30, yPosition);
                yPosition += 10;
            });
        }
        
        // Contactos
        if (formData.contactos.length > 0) {
            if (yPosition > 200) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.setFontSize(14);
            doc.setFont('times', 'bold');
            doc.text('PERSONAS DE CONTACTO', 20, yPosition);
            yPosition += 10;
            
            formData.contactos.forEach((contacto, index) => {
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFontSize(12);
                doc.setFont('times', 'bold');
                doc.text(`Contacto ${index + 1}:`, 25, yPosition);
                yPosition += 7;
                
                doc.setFontSize(11);
                doc.setFont('times', 'normal');
                doc.text(`Nombre: ${contacto.nombre}`, 30, yPosition);
                yPosition += 6;
                doc.text(`Cargo/Rol: ${contacto.cargo || 'No especificado'}`, 30, yPosition);
                yPosition += 6;
                doc.text(`Teléfono: ${contacto.telefono || 'No proporcionado'}`, 30, yPosition);
                yPosition += 6;
                doc.text(`Email: ${contacto.email || 'No proporcionado'}`, 30, yPosition);
                yPosition += 10;
            });
        }
        
        // Notas adicionales
        if (formData.notasAdicionales) {
            if (yPosition > 220) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.setFontSize(14);
            doc.setFont('times', 'bold');
            doc.text('NOTAS ADICIONALES', 20, yPosition);
            yPosition += 10;
            
            doc.setFontSize(11);
            doc.setFont('times', 'normal');
            const splitNotes = doc.splitTextToSize(formData.notasAdicionales, 170);
            doc.text(splitNotes, 25, yPosition);
            yPosition += splitNotes.length * 6;
        }
        
        // Fecha de generación
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
        
        yPosition += 20;
        doc.setFontSize(10);
        doc.setFont('times', 'italic');
        doc.text(`Documento generado el: ${new Date().toLocaleString('es-ES')}`, 20, yPosition);
        
        // Abrir PDF en nueva ventana
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        
        // Mostrar mensaje de éxito
        showPdfSuccessMessage();
    }
    

    
    function collectFormData() {
        const formData = {
            nombreCliente: document.getElementById('nombreCliente').value.trim(),
            dni: document.getElementById('dni').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            email: document.getElementById('email').value.trim(),
            numPropiedades: document.getElementById('numPropiedades').value,
            licenciasTuristicas: document.querySelector('input[name="licenciasTuristicas"]:checked')?.value || 'No especificado',
            numeroLicencia: numeroLicenciaInput.value.trim(),
            registroTuristico: document.querySelector('input[name="registroTuristico"]:checked')?.value || 'No especificado',
            numeroRegistro: numeroRegistroInput.value.trim(),
            notasAdicionales: document.getElementById('notasAdicionales').value.trim(),
            propiedades: [],
            contactos: []
        };
        
        // Recopilar datos de propiedades
        for (let i = 1; i <= propertyCount; i++) {
            const propertyDiv = document.getElementById(`property-${i}`);
            if (propertyDiv) {
                const propiedad = {
                    numero: i,
                    nombre: document.getElementById(`nombrePropiedad${i}`)?.value.trim() || '',
                    direccionLinea: document.getElementById(`direccionLinea${i}`)?.value.trim() || '',
                    ciudad: document.getElementById(`ciudad${i}`)?.value.trim() || '',
                    provincia: document.getElementById(`provincia${i}`)?.value.trim() || '',
                    codigoPostal: document.getElementById(`codigoPostal${i}`)?.value.trim() || '',
                    pais: document.getElementById(`pais${i}`)?.value.trim() || ''
                };
                formData.propiedades.push(propiedad);
            }
        }
        
        // Recopilar datos de contactos
        for (let i = 1; i <= contactCount; i++) {
            const contactDiv = document.getElementById(`contact-${i}`);
            if (contactDiv) {
                const contacto = {
                    numero: i,
                    nombre: document.getElementById(`nombreContacto${i}`)?.value.trim() || '',
                    cargo: document.getElementById(`cargoContacto${i}`)?.value.trim() || '',
                    telefono: document.getElementById(`telefonoContacto${i}`)?.value.trim() || '',
                    email: document.getElementById(`emailContacto${i}`)?.value.trim() || ''
                };
                formData.contactos.push(contacto);
            }
        }
        
        return formData;
    }
    
    function showPdfSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-info alert-dismissible fade show position-fixed';
        successDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
        successDiv.innerHTML = `
            <strong><i class="fas fa-file-pdf"></i> PDF Generado!</strong> El documento se ha abierto en una nueva ventana.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 4000);
    }
    
    function addPropertyForm(propertyNumber) {
        const propertyDiv = document.createElement('div');
        propertyDiv.className = 'property-card new-property';
        propertyDiv.id = `property-${propertyNumber}`;
        
        propertyDiv.innerHTML = `
            <div class="property-header">
                <h5 class="property-title">Propiedad ${propertyNumber}</h5>
                <button type="button" class="btn btn-remove-property" onclick="removeProperty(${propertyNumber})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="row">
                <div class="col-12 mb-3">
                    <label for="nombrePropiedad${propertyNumber}" class="form-label">Nombre de la Propiedad</label>
                    <input type="text" class="form-control" id="nombrePropiedad${propertyNumber}" name="nombrePropiedad${propertyNumber}" placeholder="Ej: Casa de playa, Apartamento centro...">
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="direccionLinea${propertyNumber}" class="form-label">Dirección</label>
                    <input type="text" class="form-control" id="direccionLinea${propertyNumber}" name="direccionLinea${propertyNumber}" placeholder="Calle, número, piso...">
                </div>
                <div class="col-md-6 mb-3">
                    <label for="ciudad${propertyNumber}" class="form-label">Ciudad</label>
                    <input type="text" class="form-control" id="ciudad${propertyNumber}" name="ciudad${propertyNumber}" placeholder="Ciudad">
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label for="provincia${propertyNumber}" class="form-label">Provincia</label>
                    <input type="text" class="form-control" id="provincia${propertyNumber}" name="provincia${propertyNumber}" placeholder="Provincia">
                </div>
                <div class="col-md-4 mb-3">
                    <label for="codigoPostal${propertyNumber}" class="form-label">Código Postal</label>
                    <input type="text" class="form-control" id="codigoPostal${propertyNumber}" name="codigoPostal${propertyNumber}" placeholder="00000">
                </div>
                <div class="col-md-4 mb-3">
                    <label for="pais${propertyNumber}" class="form-label">País</label>
                    <input type="text" class="form-control" id="pais${propertyNumber}" name="pais${propertyNumber}" placeholder="País" value="España">
                </div>
            </div>
        `;
        
        propiedadesContainer.appendChild(propertyDiv);
    }
    
    function addContactForm(contactNumber) {
        const contactDiv = document.createElement('div');
        contactDiv.className = 'contact-card new-contact';
        contactDiv.id = `contact-${contactNumber}`;
        
        contactDiv.innerHTML = `
            <div class="contact-header">
                <h5 class="contact-title">Persona de Contacto ${contactNumber}</h5>
                <button type="button" class="btn btn-remove-contact" onclick="removeContact(${contactNumber})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="nombreContacto${contactNumber}" class="form-label">Nombre <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="nombreContacto${contactNumber}" name="nombreContacto${contactNumber}" placeholder="Nombre completo" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="cargoContacto${contactNumber}" class="form-label">Cargo/Rol</label>
                    <input type="text" class="form-control" id="cargoContacto${contactNumber}" name="cargoContacto${contactNumber}" placeholder="Ej: Gerente, Administrador...">
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="telefonoContacto${contactNumber}" class="form-label">Teléfono de Contacto</label>
                    <input type="tel" class="form-control" id="telefonoContacto${contactNumber}" name="telefonoContacto${contactNumber}" placeholder="Teléfono">
                </div>
                <div class="col-md-6 mb-3">
                    <label for="emailContacto${contactNumber}" class="form-label">Email</label>
                    <input type="email" class="form-control" id="emailContacto${contactNumber}" name="emailContacto${contactNumber}" placeholder="email@ejemplo.com">
                </div>
            </div>
        `;
        
        contactosContainer.appendChild(contactDiv);
        
        // Añadir validación en tiempo real para teléfono del contacto
        const telefonoInput = contactDiv.querySelector(`#telefonoContacto${contactNumber}`);
        telefonoInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9+\-\s]/g, '');
            e.target.value = value;
        });
    }
    
    // Función global para remover propiedad
    window.removeProperty = function(propertyNumber) {
        const propertyDiv = document.getElementById(`property-${propertyNumber}`);
        if (propertyDiv) {
            propertyDiv.remove();
            propertyCount--;
            numPropiedadesInput.value = propertyCount;
            
            // Ocultar sección si no hay propiedades
            if (propertyCount === 0) {
                propiedadesSection.style.display = 'none';
            }
            
            // Renumerar propiedades restantes
            renumberProperties();
        }
    };
    
    // Función global para remover contacto
    window.removeContact = function(contactNumber) {
        const contactDiv = document.getElementById(`contact-${contactNumber}`);
        if (contactDiv) {
            contactDiv.remove();
            contactCount--;
            
            // Ocultar sección si no hay contactos
            if (contactCount === 0) {
                contactosSection.style.display = 'none';
            }
            
            // Renumerar contactos restantes
            renumberContacts();
        }
    };
    
    function renumberProperties() {
        const propertyCards = propiedadesContainer.querySelectorAll('.property-card');
        propertyCards.forEach((card, index) => {
            const newNumber = index + 1;
            const oldId = card.id;
            const oldNumber = oldId.split('-')[1];
            
            // Actualizar ID del contenedor
            card.id = `property-${newNumber}`;
            
            // Actualizar título
            const title = card.querySelector('.property-title');
            title.textContent = `Propiedad ${newNumber}`;
            
            // Actualizar botón de eliminar
            const removeBtn = card.querySelector('.btn-remove-property');
            removeBtn.setAttribute('onclick', `removeProperty(${newNumber})`);
            
            // Actualizar IDs y names de todos los inputs
            const inputs = card.querySelectorAll('input');
            inputs.forEach(input => {
                const oldName = input.name;
                const oldId = input.id;
                
                if (oldName) {
                    input.name = oldName.replace(oldNumber, newNumber);
                }
                if (oldId) {
                    input.id = oldId.replace(oldNumber, newNumber);
                }
            });
            
            // Actualizar labels
            const labels = card.querySelectorAll('label');
            labels.forEach(label => {
                const forAttr = label.getAttribute('for');
                if (forAttr) {
                    label.setAttribute('for', forAttr.replace(oldNumber, newNumber));
                }
            });
        });
    }
    
    function renumberContacts() {
        const contactCards = contactosContainer.querySelectorAll('.contact-card');
        contactCards.forEach((card, index) => {
            const newNumber = index + 1;
            const oldId = card.id;
            const oldNumber = oldId.split('-')[1];
            
            // Actualizar ID del contenedor
            card.id = `contact-${newNumber}`;
            
            // Actualizar título
            const title = card.querySelector('.contact-title');
            title.textContent = `Persona de Contacto ${newNumber}`;
            
            // Actualizar botón de eliminar
            const removeBtn = card.querySelector('.btn-remove-contact');
            removeBtn.setAttribute('onclick', `removeContact(${newNumber})`);
            
            // Actualizar IDs y names de todos los inputs
            const inputs = card.querySelectorAll('input');
            inputs.forEach(input => {
                const oldName = input.name;
                const oldId = input.id;
                
                if (oldName) {
                    input.name = oldName.replace(oldNumber, newNumber);
                }
                if (oldId) {
                    input.id = oldId.replace(oldNumber, newNumber);
                }
            });
            
            // Actualizar labels
            const labels = card.querySelectorAll('label');
            labels.forEach(label => {
                const forAttr = label.getAttribute('for');
                if (forAttr) {
                    label.setAttribute('for', forAttr.replace(oldNumber, newNumber));
                }
            });
        });
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar campos requeridos
        const nombreCliente = document.getElementById('nombreCliente').value.trim();
        const dni = document.getElementById('dni').value.trim();
        
        if (!nombreCliente || !dni) {
            alert('Por favor, complete todos los campos requeridos (Nombre de Cliente y DNI).');
            return;
        }
        
        // Validar campos condicionales requeridos
        const licenciasSi = document.querySelector('input[name="licenciasTuristicas"]:checked')?.value === 'si';
        const registroSi = document.querySelector('input[name="registroTuristico"]:checked')?.value === 'si';
        
        if (licenciasSi && !numeroLicenciaInput.value.trim()) {
            alert('Por favor, ingrese el número de licencia turística.');
            numeroLicenciaInput.focus();
            return;
        }
        
        if (registroSi && !numeroRegistroInput.value.trim()) {
            alert('Por favor, ingrese el número de registro turístico.');
            numeroRegistroInput.focus();
            return;
        }
        
        // Validar nombres de contactos requeridos
        for (let i = 1; i <= contactCount; i++) {
            const contactDiv = document.getElementById(`contact-${i}`);
            if (contactDiv) {
                const nombreContacto = document.getElementById(`nombreContacto${i}`)?.value.trim();
                if (!nombreContacto) {
                    alert(`Por favor, complete el nombre de la Persona de Contacto ${i}.`);
                    return;
                }
            }
        }
        
        // Recopilar datos del formulario
        const formData = collectFormData();
        
        // Crear el cuerpo del email
        let propiedadesText = '';
        if (formData.propiedades.length > 0) {
            propiedadesText = '\nDETALLE DE PROPIEDADES:\n';
            formData.propiedades.forEach((prop, index) => {
                propiedadesText += `
Propiedad ${index + 1}:
- Nombre: ${prop.nombre || 'No especificado'}
- Dirección: ${prop.direccionLinea || 'No especificada'}
- Ciudad: ${prop.ciudad || 'No especificada'}
- Provincia: ${prop.provincia || 'No especificada'}
- Código Postal: ${prop.codigoPostal || 'No especificado'}
- País: ${prop.pais || 'No especificado'}
`;
            });
        }
        
        let contactosText = '';
        if (formData.contactos.length > 0) {
            contactosText = '\nPERSONAS DE CONTACTO:\n';
            formData.contactos.forEach((contacto, index) => {
                contactosText += `
Contacto ${index + 1}:
- Nombre: ${contacto.nombre}
- Cargo/Rol: ${contacto.cargo || 'No especificado'}
- Teléfono: ${contacto.telefono || 'No proporcionado'}
- Email: ${contacto.email || 'No proporcionado'}
`;
            });
        }
        
        const emailBody = `
Nuevo formulario de cliente recibido:

DATOS DEL CLIENTE:
- Nombre: ${formData.nombreCliente}
- DNI: ${formData.dni}
- Teléfono: ${formData.telefono || 'No proporcionado'}
- Email: ${formData.email || 'No proporcionado'}

INFORMACIÓN GENERAL:
- Número de propiedades: ${formData.numPropiedades || '0'}
- Licencias turísticas: ${formData.licenciasTuristicas}${formData.numeroLicencia ? `\n- Número de licencia: ${formData.numeroLicencia}` : ''}
- Registro turístico: ${formData.registroTuristico}${formData.numeroRegistro ? `\n- Número de registro: ${formData.numeroRegistro}` : ''}
${propiedadesText}${contactosText}
NOTAS ADICIONALES:
${formData.notasAdicionales || 'Ninguna'}

---
Formulario enviado el: ${new Date().toLocaleString('es-ES')}
        `.trim();
        
        // Crear el enlace mailto
        const subject = encodeURIComponent(`Nuevo Cliente: ${formData.nombreCliente}`);
        const body = encodeURIComponent(emailBody);
        const mailtoLink = `mailto:alexmariscalromero@gmail.com?subject=${subject}&body=${body}`;
        
        // Abrir el cliente de correo
        window.location.href = mailtoLink;
        
        // Mostrar mensaje de confirmación
        showSuccessMessage();
        
        // Limpiar formulario después de un breve delay
        setTimeout(() => {
            form.reset();
            // Limpiar propiedades
            propiedadesContainer.innerHTML = '';
            propertyCount = 0;
            numPropiedadesInput.value = '0';
            propiedadesSection.style.display = 'none';
            
            // Limpiar contactos
            contactosContainer.innerHTML = '';
            contactCount = 0;
            contactosSection.style.display = 'none';
            
            // Limpiar campos condicionales
            hideConditionalField(numeroLicenciaDiv, numeroLicenciaInput);
            hideConditionalField(numeroRegistroDiv, numeroRegistroInput);
        }, 2000);
    });
    
    function showSuccessMessage() {
        // Crear elemento de mensaje de éxito
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
        successDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
        successDiv.innerHTML = `
            <strong>¡Éxito!</strong> El formulario se ha procesado correctamente. Se abrirá su cliente de correo.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(successDiv);
        
        // Remover el mensaje después de 5 segundos
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }
    
    // Validación en tiempo real para DNI
    document.getElementById('dni').addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9A-Za-z]/g, '');
        if (value.length > 9) {
            value = value.substring(0, 9);
        }
        e.target.value = value.toUpperCase();
    });
    
    // Validación en tiempo real para teléfono
    document.getElementById('telefono').addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9+\-\s]/g, '');
        e.target.value = value;
    });
});