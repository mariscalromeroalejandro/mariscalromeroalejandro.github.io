# Formulario de Cliente

Un formulario completo para gestión de clientes con generación de PDFs profesionales.

## Características

- **Formulario dinámico** con campos condicionales
- **Gestión de propiedades** ilimitadas
- **Personas de contacto** múltiples
- **Generación de PDF** con dos opciones:
  - PDF con estilos (mantiene el diseño del formulario)
  - PDF básico (formato simple)
- **Envío por email** automático
- **Diseño responsive** con Bootstrap
- **Colores azul pastel** y fuente Times New Roman

## Logo Personalizado

### Para usar tu propio logo:

1. **Coloca tu logo** en el directorio raíz con el nombre `image.png`
2. **Formatos soportados**: PNG, JPG, GIF, SVG
3. **Recomendaciones**:
   - Proporción recomendada: 2.5:1 (ancho:alto)
   - Tamaño máximo: 300x120 píxeles
   - Fondo transparente para mejor integración

### Logo automático:

Si no proporcionas un logo, el sistema generará automáticamente uno con:
- Colores del tema (azul pastel)
- Texto "MI EMPRESA"
- Subtítulo "Gestión de Propiedades"
- Diseño profesional

## Archivos del proyecto

- `index.html` - Formulario principal
- `styles.css` - Estilos del formulario
- `script.js` - Lógica principal
- `pdf-generator.js` - Generador de PDF con estilos
- `logo-fallback.js` - Generador de logo automático
- `logo-example.svg` - Ejemplo de logo en SVG

## Uso

1. Abre `index.html` en tu navegador
2. Completa los campos del formulario
3. Añade propiedades y contactos según necesites
4. Genera PDF o envía por email

## Personalización

### Cambiar colores:
Edita las variables CSS en `styles.css`:
```css
:root {
    --pastel-blue: #B8D4F0;
    --pastel-blue-light: #D6E8F5;
    --pastel-blue-dark: #9BC4E8;
    --pastel-blue-darker: #7AB3E0;
}
```

### Cambiar email de destino:
Edita la línea en `script.js`:
```javascript
const mailtoLink = `mailto:tu-email@ejemplo.com?subject=${subject}&body=${body}`;
```

## Compatibilidad

- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Dispositivos móviles y tablets
- Generación de PDF del lado del cliente (sin servidor)

## Dependencias

- Bootstrap 5.3.0
- Font Awesome 6.0.0
- jsPDF 2.5.1

Todas las dependencias se cargan desde CDN, no requiere instalación local.