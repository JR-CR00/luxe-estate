# Real Estate App (Next.js) - Checklist de Mejores Prácticas

Una lista condensada y directa de reglas, optimizaciones y funcionalidades a seguir para plataformas inmobiliarias.

## ⚡ Performance & Arquitectura (Next.js)
*   [ ] **Caché y Revalidación (ISR):** Generar páginas estáticas de propiedades y revalidar bajo demanda (Webhooks) al editar en BD.
*   [ ] **Server Components por Defecto:** UI estática (listas, detalles) renderizada en servidor. JS del cliente solo para mapas y calculadoras.
*   [ ] **Imágenes Optimizadas (`<Image>`):**
    *   Cargar solo formatos modernos (WebP/AVIF).
    *   Usar `priority={true}` **únicamente** en la imagen principal (LCP).
    *   Implementar `placeholder="blur"` para evitar saltos visuales (Layout Shifts).
*   [ ] **Lazy Loading:** Retrasar la carga de fotos secundarias de galerías, videos embebidos y librerías pesadas como mapas.

## 🗄️ Base de Datos & Supabase
*   [ ] **Búsqueda Geoespacial (PostGIS):** Usar la extensión nativa para búsquedas complejas por mapa (polígonos, cercanía, bounding boxes).
*   [ ] **Indexación Estratégica:** Índices obligatorios en columnas de filtros pesados: `precio`, `tipo_propiedad`, `habitaciones`, `status`, `is_featured`.
*   [ ] **RLS (Row Level Security):**
    *   *Lectura Pública:* Propiedades activas.
    *   *Privado:* Borradores, datos de contacto del dueño, registros financieros solo para admins/agentes creadores.

## 🔎 SEO y Viralidad
*   [ ] **Metadatos y Open Graph Dinámicos:** Usar `generateMetadata` para inyectar foto, título y precio. Crucial para compartir enlaces por WhatsApp/Redes Sociales.
*   [ ] **Schema Markup (JSON-LD):** Inyectar estructura `RealEstateListing` para mostrar precio y disponibilidad directamente en los resultados de Google (Rich Snippets).
*   [ ] **Sitemaps Dinámicos:** Archivo `sitemap.ts` leyendo directamente de Supabase propiedades activas (actualizado al instante).
*   [ ] **URLs Semánticas:** URLs ricas en palabras clave (ej. `/propiedades/venta-casa-playa-miami-[id]`).

## 🎨 UX, Diseño y Búsqueda
*   [ ] **Estado de Filtros en la URL (Search Params):** Guardar todo filtro (precio, cuartos, tipo) en la URL (ej. `?precio_max=500000`). Permite compartir búsquedas y navegar sin perder estado.
*   [ ] **Estética Premium ("Vibe"):** Paletas de colores curadas (ej. dark modes elegantes), tipografía limpia (Inter/Outfit) y bordes sutiles o 'glassmorphism'.
*   [ ] **Micro-interacciones:** Animaciones suaves al hacer hover en tarjetas y transiciones fluidas de página para transmitir lujo y calidad.
*   [ ] **Mapas Inteligentes (Clustering):** Agrupar múltiples pines en el mapa para no colapsar la memoria del navegador.

## 💎 Funcionalidades Clave Recomendadas
*   [ ] **Sistema de Favoritos/Wishlist:** `localStorage` para anónimos, Base de datos para usuarios registrados.
*   [ ] **Calculadora de Hipotecas:** Interfaz interactiva de cliente con sliders integrados en el detalle de cada propiedad.
*   [ ] **Tours 360º / Videos:** Soporte nativo para embeds (Matterport, YouTube) que retienen la atención.
*   [ ] **Herramienta de Comparación:** UI para poner 2-3 propiedades lado a lado (analizar precio/m2, amenidades, antigüedad).
*   [ ] **Alertas de Mercado:** Sistema (Cron/Webhooks) para enviar emails cuando una propiedad baja de precio o entra una nueva en la zona deseada.
