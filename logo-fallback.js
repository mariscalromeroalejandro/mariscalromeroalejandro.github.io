/**
 * Generador de logo de respaldo para PDFs
 * Crea un logo simple si no se encuentra image.png
 */

function createFallbackLogo() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Configurar canvas con mejor proporción
    canvas.width = 300;
    canvas.height = 120;
    
    // Fondo azul pastel
    ctx.fillStyle = '#B8D4F0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Borde
    ctx.strokeStyle = '#7AB3E0';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Círculo decorativo
    ctx.fillStyle = '#7AB3E0';
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(60, 60, 30, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // Texto principal
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 28px Times New Roman';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MI EMPRESA', canvas.width / 2, canvas.height / 2 - 10);
    
    // Subtítulo
    ctx.font = '14px Times New Roman';
    ctx.fillText('Gestión de Propiedades', canvas.width / 2, canvas.height / 2 + 15);
    
    // Línea decorativa
    ctx.strokeStyle = '#7AB3E0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 85);
    ctx.lineTo(200, 85);
    ctx.stroke();
    
    return canvas.toDataURL('image/png');
}

// Función mejorada para cargar logo con fallback y calcular dimensiones
async function loadLogoWithFallback() {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = function() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/png');
                
                // Devolver tanto la imagen como sus dimensiones originales
                resolve({
                    dataURL: dataURL,
                    originalWidth: img.width,
                    originalHeight: img.height
                });
            } catch (error) {
                console.log('Error procesando logo, usando fallback');
                resolve(createFallbackLogoWithDimensions());
            }
        };
        
        img.onerror = function() {
            console.log('Logo no encontrado, usando fallback');
            resolve(createFallbackLogoWithDimensions());
        };
        
        // Intentar cargar el logo
        img.src = 'image.png';
        
        // Timeout con fallback
        setTimeout(() => {
            console.log('Timeout cargando logo, usando fallback');
            resolve(createFallbackLogoWithDimensions());
        }, 2000);
    });
}

function createFallbackLogoWithDimensions() {
    const logoData = createFallbackLogo();
    return {
        dataURL: logoData,
        originalWidth: 300,
        originalHeight: 120
    };
}

// Función para calcular dimensiones manteniendo proporción
function calculateLogoDimensions(originalWidth, originalHeight, maxWidth = 50, maxHeight = 25) {
    const aspectRatio = originalWidth / originalHeight;
    
    let width = maxWidth;
    let height = width / aspectRatio;
    
    // Si la altura calculada excede el máximo, ajustar por altura
    if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
    }
    
    return { width, height };
}