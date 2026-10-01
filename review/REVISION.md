# Revisión de diseño — Excelencia Funeraria

Rama: `codex/mejoras-diseno`. Base: `origin/main`, commit `ce2493b`.
Fecha: 1 de octubre de 2026. Implementación para revisión previa a fusión.

## Cambios

- Tipografía y colores unificados, textos mayores, botones y tarjetas con bordes suaves.
- Encabezado fijo, anclas con espacio y contacto móvil que se oculta al editar campos.
- Hero con servicio y cobertura claros; contacto antes de la foto en móvil.
- Cinco iconos SVG diferentes, cuadrícula equilibrada y selección conservada al contactar.
- Paquetes compactos con detalle accesible, exclusiones visibles y comparación de 12 conceptos. Las omisiones se muestran como “Por confirmar”.
- Selección de servicio o paquete trasladada al formulario y a los enlaces de WhatsApp.
- Proceso conectado visualmente, galería editorial, etiquetas de cobertura e imágenes de referencia identificadas.
- Validación junto a cada campo, foco en el primer error y conservación de valores.
- Animaciones breves mediante IntersectionObserver; alternativa con movimiento reducido. Contenido, enlaces y detalles disponibles sin JavaScript.
- Candidatos WebP de 480 px, srcset, tamaños reservados y fuentes WOFF2 locales con precarga de las dos fuentes críticas.

## Comprobaciones

`verify.cjs` utiliza Playwright con Microsoft Edge. Iniciar `python -m http.server 4173 --bind 127.0.0.1` y ejecutar `node verify.cjs` con Playwright disponible (o definir `PLAYWRIGHT_MODULE` con su ruta).

- 360, 390, 768, 1024 y 1440 px: sin desbordamiento del documento; imágenes cargadas y un solo H1.
- Selección de Plata y Traslados, texto de WhatsApp y foco del selector verificados.
- Ancla de contacto por debajo del encabezado fijo.
- Errores obligatorios y teléfono inválido; corrección sin borrar valores.
- Apertura de WhatsApp interceptada durante las pruebas: ningún mensaje enviado.
- FAQ y comparación operadas con teclado; sin errores JavaScript.
- Barra móvil oculta durante edición y restaurada al salir.
- Vista equivalente a 200% de un ancho de 1440 px (720 px CSS). No sustituye una prueba con zoom nativo ni con teclado virtual de un teléfono físico.
- Sin JavaScript: contenido y detalles disponibles, contacto directo funcional y formulario deshabilitado con explicación para evitar envío accidental de datos en URL.
- Sintaxis de JavaScript y `git diff --check` correctos.

Resultados de tamaños y flujo: [checks.json](checks.json). Medición Lighthouse móvil: [lighthouse-mobile.json](lighthouse-mobile.json). El informe de laboratorio local no mide INP real ni percentiles de usuarios reales; no garantiza Core Web Vitals de producción.

## Capturas

- [Escritorio completo](1440.png)
- [Móvil completo](390.png)
- [Hero escritorio](desktop-hero.png)
- [Hero móvil](mobile-hero.png)
- [Paquetes escritorio](desktop-packages.png)
- [Comparación abierta en móvil](comparison-mobile.png)

## Pendiente del negocio

Precios, teléfono, servicios, inclusiones y exclusiones originales conservados. No se añadieron testimonios, oficinas, certificaciones ni popularidad inventada. El aviso de privacidad sigue identificado como provisional; requiere datos validados del responsable. Las fotografías siguen siendo referencias hasta recibir material propio autorizado. La necesidad comercial del teléfono obligatorio no se modificó.

Esta rama no debe fusionarse hasta la aprobación visual del usuario. GitHub Pages publica desde `main`; la vista local permite revisar esta propuesta por separado.

## Medición final de laboratorio

Lighthouse 13.5.0: rendimiento 95/100; accesibilidad automática 100/100. LCP 2.4 s; CLS 0; TBT 180 ms.
