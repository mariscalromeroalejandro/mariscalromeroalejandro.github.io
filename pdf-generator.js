/**
 * Generador de PDF con estilos visuales del formulario
 * Mantiene el mismo formato azul pastel y Times New Roman
 */

class StyledPDFGenerator {
  constructor() {
    this.colors = {
      pastelBlue: "#B8D4F0",
      pastelBlueLight: "#D6E8F5",
      pastelBlueDark: "#9BC4E8",
      pastelBlueDarker: "#7AB3E0",
      darkText: "#2c3e50",
      lightGray: "#f8f9fa",
    };
  }

  async generateStyledPDF(formData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    // Configurar fuente Times New Roman
    doc.setFont("times", "normal");

    let yPosition = 20;

    // Header con logo y estilo del formulario
    yPosition = await this.addStyledHeader(doc, yPosition);
    yPosition += 10;

    // Datos del cliente con estilo de tarjeta
    yPosition = this.addStyledSection(doc, "DATOS DEL CLIENTE", yPosition);
    yPosition = this.addClientData(doc, formData, yPosition);
    yPosition += 10;

    // Información general
    yPosition = this.addStyledSection(doc, "INFORMACIÓN GENERAL", yPosition);
    yPosition = this.addGeneralInfo(doc, formData, yPosition);
    yPosition += 10;

    // Propiedades si existen
    if (formData.propiedades && formData.propiedades.length > 0) {
      yPosition = this.checkPageBreak(doc, yPosition, 40);
      yPosition = this.addStyledSection(doc, "PROPIEDADES", yPosition);
      yPosition = this.addProperties(doc, formData.propiedades, yPosition);
      yPosition += 10;
    }

    // Contactos si existen
    if (formData.contactos && formData.contactos.length > 0) {
      yPosition = this.checkPageBreak(doc, yPosition, 40);
      yPosition = this.addStyledSection(doc, "PERSONAS DE CONTACTO", yPosition);
      yPosition = this.addContacts(doc, formData.contactos, yPosition);
      yPosition += 10;
    }

    // Notas adicionales si existen
    if (formData.notasAdicionales) {
      yPosition = this.checkPageBreak(doc, yPosition, 30);
      yPosition = this.addStyledSection(doc, "NOTAS ADICIONALES", yPosition);
      yPosition = this.addNotes(doc, formData.notasAdicionales, yPosition);
    }

    // Footer
    this.addFooter(doc);

    return doc;
  }

  async addStyledHeader(doc, yPosition) {
    // Fondo azul pastel para el header extendido
    doc.setFillColor(184, 212, 240); // pastel-blue
    doc.rect(0, 0, 210, 45, "F");

    let currentY = yPosition;

    // Cargar y añadir el logo (con fallback)
    const logoInfo = await loadLogoWithFallback();
    if (logoInfo) {
      // Calcular dimensiones manteniendo proporción
      const dimensions = calculateLogoDimensions(
        logoInfo.originalWidth,
        logoInfo.originalHeight
      );
      const logoX = (210 - dimensions.width) / 2;

      doc.addImage(
        logoInfo.dataURL,
        "PNG",
        logoX,
        currentY - 5,
        dimensions.width,
        dimensions.height
      );
      currentY += dimensions.height + 5;
    }

    // Título principal
    currentY += 10; // <- agrega 10mm más de espacio
    doc.setTextColor(44, 62, 80); // dark text
    doc.setFontSize(20);
    doc.setFont("times", "bold");
    doc.text("FORMULARIO DE CLIENTE", 105, currentY, { align: "center" });
    // Línea decorativa
    doc.setDrawColor(155, 196, 232); // pastel-blue-dark
    doc.setLineWidth(1);
    doc.line(20, currentY + 5, 190, currentY + 5);

    return currentY + 15;
  }

  addStyledSection(doc, title, yPosition) {
    // Fondo suave para la sección
    doc.setFillColor(214, 232, 245); // pastel-blue-light
    doc.rect(15, yPosition - 5, 180, 12, "F");

    // Borde izquierdo azul
    doc.setFillColor(123, 179, 224); // pastel-blue-darker
    doc.rect(15, yPosition - 5, 3, 12, "F");

    // Título de la sección
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(14);
    doc.setFont("times", "bold");
    doc.text(title, 25, yPosition + 2);

    return yPosition + 15;
  }

  addClientData(doc, formData, yPosition) {
    const data = [
      { label: "Nombre:", value: formData.nombreCliente },
      { label: "DNI:", value: formData.dni },
      { label: "Teléfono:", value: formData.telefono || "No proporcionado" },
      { label: "Email:", value: formData.email || "No proporcionado" },
    ];

    return this.addDataRows(doc, data, yPosition);
  }

  addGeneralInfo(doc, formData, yPosition) {
    const data = [
      {
        label: "Número de propiedades:",
        value: formData.numPropiedades || "0",
      },
      { label: "Licencias turísticas:", value: formData.licenciasTuristicas },
    ];

    if (formData.numeroLicencia) {
      data.push({
        label: "Número de licencia:",
        value: formData.numeroLicencia,
      });
    }

    data.push({
      label: "Registro turístico:",
      value: formData.registroTuristico,
    });

    if (formData.numeroRegistro) {
      data.push({
        label: "Número de registro:",
        value: formData.numeroRegistro,
      });
    }

    return this.addDataRows(doc, data, yPosition);
  }

  addProperties(doc, propiedades, yPosition) {
    propiedades.forEach((prop, index) => {
      yPosition = this.checkPageBreak(doc, yPosition, 35);

      // Subtítulo de propiedad con fondo
      doc.setFillColor(248, 249, 250); // light gray
      doc.rect(20, yPosition - 3, 170, 8, "F");

      doc.setTextColor(123, 179, 224);
      doc.setFontSize(12);
      doc.setFont("times", "bold");
      doc.text(`Propiedad ${index + 1}`, 25, yPosition + 2);
      yPosition += 12;

      const propData = [
        { label: "Nombre:", value: prop.nombre || "No especificado" },
        {
          label: "Dirección:",
          value: prop.direccionLinea || "No especificada",
        },
        { label: "Ciudad:", value: prop.ciudad || "No especificada" },
        { label: "Provincia:", value: prop.provincia || "No especificada" },
        {
          label: "Código Postal:",
          value: prop.codigoPostal || "No especificado",
        },
        { label: "País:", value: prop.pais || "No especificado" },
      ];

      yPosition = this.addDataRows(doc, propData, yPosition, 30);
      yPosition += 5;
    });

    return yPosition;
  }

  addContacts(doc, contactos, yPosition) {
    contactos.forEach((contacto, index) => {
      yPosition = this.checkPageBreak(doc, yPosition, 30);

      // Subtítulo de contacto con fondo
      doc.setFillColor(248, 249, 250);
      doc.rect(20, yPosition - 3, 170, 8, "F");

      doc.setTextColor(123, 179, 224);
      doc.setFontSize(12);
      doc.setFont("times", "bold");
      doc.text(`Contacto ${index + 1}`, 25, yPosition + 2);
      yPosition += 12;

      const contactData = [
        { label: "Nombre:", value: contacto.nombre },
        { label: "Cargo/Rol:", value: contacto.cargo || "No especificado" },
        { label: "Teléfono:", value: contacto.telefono || "No proporcionado" },
        { label: "Email:", value: contacto.email || "No proporcionado" },
      ];

      yPosition = this.addDataRows(doc, contactData, yPosition, 30);
      yPosition += 5;
    });

    return yPosition;
  }

  addNotes(doc, notas, yPosition) {
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(11);
    doc.setFont("times", "normal");

    // Fondo suave para las notas
    const notesHeight = Math.max(20, Math.ceil(notas.length / 80) * 6);
    doc.setFillColor(248, 249, 250);
    doc.rect(20, yPosition - 3, 170, notesHeight, "F");

    const splitNotes = doc.splitTextToSize(notas, 160);
    doc.text(splitNotes, 25, yPosition + 3);

    return yPosition + splitNotes.length * 5 + 10;
  }

  addDataRows(doc, data, yPosition, leftMargin = 25) {
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(11);

    data.forEach((item) => {
      yPosition = this.checkPageBreak(doc, yPosition, 8);

      // Label en negrita
      doc.setFont("times", "bold");
      doc.text(item.label, leftMargin, yPosition);

      // Valor en normal
      doc.setFont("times", "normal");
      const labelWidth = doc.getTextWidth(item.label);
      doc.text(item.value, leftMargin + labelWidth + 3, yPosition);

      yPosition += 6;
    });

    return yPosition;
  }

  checkPageBreak(doc, yPosition, requiredSpace) {
    if (yPosition + requiredSpace > 280) {
      doc.addPage();
      return 20;
    }
    return yPosition;
  }

  addFooter(doc) {
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Línea superior del footer
      doc.setDrawColor(184, 212, 240);
      doc.setLineWidth(0.5);
      doc.line(20, 285, 190, 285);

      // Fecha de generación
      doc.setTextColor(123, 179, 224);
      doc.setFontSize(9);
      doc.setFont("times", "italic");
      doc.text(
        `Documento generado el: ${new Date().toLocaleString("es-ES")}`,
        20,
        290
      );

      // Número de página
      doc.text(`Página ${i} de ${pageCount}`, 190, 290, { align: "right" });
    }
  }
}

// Función principal para generar PDF con estilos
async function generateStyledPDF(formData) {
  try {
    const generator = new StyledPDFGenerator();
    const doc = await generator.generateStyledPDF(formData);

    // Descargar PDF directamente
    const fileName = `formulario_cliente_${formData.nombreCliente || 'cliente'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    return true;
  } catch (error) {
    console.error("Error generando PDF:", error);
    alert("Error al generar el PDF. Por favor, inténtelo de nuevo.");
    return false;
  }
}
