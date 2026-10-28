# Mi Despensa — Requisitos del MVP

**Versión:** 1.0 · **Estado:** especificación inicial para implementación · **Idioma de la interfaz:** español (Argentina)

## 1. Visión

Aplicación web responsive, diseñada primero para celulares, que permite guardar ingredientes disponibles en casa, seleccionar temporalmente cuáles se quieren utilizar hoy, y descubrir recetas según compatibilidad, faltantes, tiempo y aporte orientativo de fibra. Debe ayudar a variar los platos sin exigir que la persona mantenga cantidades exactas.

### Objetivos
- Reducir el esfuerzo de decidir qué cocinar.
- Aprovechar ingredientes disponibles sin ocultar recetas para las que falte poco.
- Facilitar opciones variadas, con atención especial a recetas con fibra.
- Servir como proyecto full stack de portfolio, con código entendible, pruebas y documentación.

### Stack acordado
- **Web:** React + TypeScript + Vite; Tailwind CSS; React Router; Fetch (TanStack Query solo si se justifica).
- **Servidor:** Java 21 + Spring Boot; Spring Web; Spring Data JPA; Bean Validation.
- **Persistencia:** PostgreSQL; migraciones Flyway recomendadas.
- **Pruebas:** JUnit 5/Mockito en backend; Vitest/React Testing Library en frontend.
- **Herramientas:** Git/GitHub; Codex para desarrollo asistido.

## 2. Alcance y decisiones

**Incluido:** 4 pantallas; catálogo de ingredientes; despensa persistente; selección temporal de ingredientes; ~30 recetas precargadas; recomendador basado en reglas; búsqueda y filtros; detalle con preparación, cantidades y porciones; favoritos persistentes; estados vacíos, errores y carga.

**Fuera del MVP:** cuentas y autenticación, varios usuarios, control de cantidades/stock, descuentos automáticos, vencimientos, listas de compra, planificación semanal, historial de comidas, recetas generadas por IA, carga de recetas por el usuario, notificaciones, valores nutricionales clínicos y PWA instalable.

**Seguridad de uso único:** sin autenticación y con datos compartidos para la única instalación. Solo usar en entorno privado/local; no exponer una API de escritura pública sin protección. Si se publica una demo, usar datos aislados o incorporar autenticación.

## 3. Conceptos de producto

### Despensa persistente
Lista de ingredientes que la persona tiene habitualmente en casa; se guarda en PostgreSQL. En MVP se registra **presencia**, no cantidad. Agregar o quitar ingredientes aquí no altera automáticamente una selección temporal ya iniciada.

### Selección de hoy
Lista de ingredientes elegidos para buscar recetas en una ocasión. Al usarla por primera vez se inicializa desde la despensa. Puede agregar o desmarcar otros ingredientes sin modificar la despensa. Persiste durante la navegación y, preferentemente, durante la sesión del navegador (`sessionStorage`). Un botón **Restablecer desde mi despensa** sobrescribe esta selección con el inventario guardado. Al abrir una sesión nueva se puede inicializar desde la despensa.

### Ingredientes principales y opcionales
Solo los **obligatorios** cuentan para calcular coincidencias y faltantes. Sal, pimienta, aceite u otros elementos pueden quedar como opcionales sin perjudicar la recomendación. El detalle muestra todos los ingredientes, incluyendo opcionales.

### Fibra
El MVP permite filtrar y priorizar por **categoría informativa** (por ejemplo `MAYOR_APORTE`, `MODERADA`, `SIN_DATOS`). Estas etiquetas deben basarse en una estimación revisada, con criterio y fuente documentados, no inventarse por el nombre de la receta. Si no hay datos confiables, mostrar **Sin datos** y no presentar gramos ni afirmaciones nutricionales precisas. En futuras versiones: estimaciones por porción a partir de cantidades y tablas nutricionales.

## 4. Pantallas y flujos

### P1 — Inicio (`/`)
- Mensaje principal «¿Qué cocino hoy?».
- Mostrar selección actual de ingredientes en chips/controles grandes.
- Buscar/agregar ingredientes a la selección y quitar ingredientes con un toque.
- Acción **Restablecer desde mi despensa**.
- Mostrar hasta 3 mejores recetas según selección y reglas del backend.
- Cada tarjeta informa título, tiempo, categoría de fibra (si la hay), número/nombre de faltantes y vínculo al detalle.
- Acción **Explorar todas las recetas** lleva a `/recetas` y conserva la selección.
- Si no hay ingredientes, explicar cómo comenzar y ofrecer navegar a la despensa.

### P2 — Mi despensa (`/despensa`)
- Listar ingredientes persistentes.
- Buscar en catálogo de ingredientes, agregarlos y quitarlos de forma idempotente.
- Mostrar estado vacío si aún no hay ingredientes.
- Acción **Usar mi despensa para cocinar** copia los ingredientes al selector temporal y navega a Inicio.
- No registrar cantidades o unidades de stock.

### P3 — Explorar recetas (`/recetas`)
- Listado de recetas con búsqueda por nombre.
- Filtros de disponibilidad: **Todas**, **Sin faltantes**, **Hasta 2 faltantes**.
- Filtro por recetas de **mayor aporte estimado de fibra** (solo datos con categoría validada); sin datos no satisfacen ese filtro.
- Filtro opcional **Solo favoritas** (puede ubicarse en esta pantalla).
- Mostrar tiempo, categoría de fibra, faltantes y estado de favorita.
- Ordenar según reglas de recomendación del backend; mostrar mensaje si no hay coincidencias y botón para limpiar filtros.
- Permitir entrar al detalle de cualquier receta.

### P4 — Detalle de receta (`/recetas/:id`)
- Título, descripción, imagen si existe (con placeholder de respaldo), tiempo de preparación y porciones.
- Ingredientes con cantidades, unidades y condición de opcionales u obligatorios.
- Indicar, a partir de la **selección de hoy**, cuáles ingredientes obligatorios faltan.
- Pasos numerados y ordenados de preparación.
- Agregar/quitar favoritos (persistente).
- Volver a explorar sin perder filtros ni selección cuando sea posible.
- Si el ID no existe, mostrar estado 404 amigable.

### Navegación
Barra inferior en móvil: **Inicio**, **Despensa**, **Recetas**. En escritorio puede pasar a barra superior o lateral. Detalle es una ruta accesible desde Inicio/Recetas, no una cuarta pestaña fija.

## 5. Requisitos funcionales verificables

| ID | Requisito | Criterio de aceptación |
|---|---|---|
| RF-01 | Consultar catálogo de ingredientes | Buscar «zan» devuelve «Zanahoria», sin duplicados. |
| RF-02 | Administrar despensa | Agregar/quitar un ingrediente persiste al refrescar; agregar dos veces no duplica. |
| RF-03 | Inicializar selección temporal | En una sesión nueva, la selección arranca con la despensa guardada. |
| RF-04 | Editar selección sin alterar despensa | Agregar «Tomate» a hoy no lo agrega a despensa. |
| RF-05 | Restablecer selección | Copia exactamente la despensa actual, descartando modificaciones temporales. |
| RF-06 | Obtener recomendaciones | A cada receta se le calculan ingredientes obligatorios presentes/faltantes, usando IDs. |
| RF-07 | Filtrar por disponibilidad | Sin faltantes requiere 0 faltantes; hasta 2 requiere 0–2; todas incluye también recetas con 0 coincidencias. |
| RF-08 | Buscar recetas | Buscar por nombre funciona sin distinguir mayúsculas/minúsculas. |
| RF-09 | Filtrar por fibra | Solo devuelve recetas categorizadas con mayor aporte estimado y origen confiable. |
| RF-10 | Consultar detalle | Muestra cantidades, porciones, pasos ordenados e ingredientes faltantes. |
| RF-11 | Guardar favoritos | Marcar/desmarcar persiste y se refleja en listado y detalle. |
| RF-12 | Conservar contexto de navegación | Entrar a detalle y volver no borra ingredientes seleccionados. |
| RF-13 | Manejar estados de interfaz | Carga, vacío, error de red y recurso inexistente tienen mensajes claros. |
| RF-14 | Adaptación móvil | Funcional en ancho móvil, sin scroll horizontal y con botones cómodos. |

## 6. Reglas de recomendación (deterministas, sin IA)

1. Para cada receta, considerar solo ingredientes marcados como obligatorios.
2. Calcular `presentes`, `faltantes`, `totalObligatorios` y `porcentajeCoincidencia = presentes / totalObligatorios` (manejar denominador 0 de forma explícita; recetas válidas deberán tener al menos un ingrediente obligatorio).
3. Aplicar filtros según solicitud:
   - `ALL`: todas las recetas.
   - `READY`: exactamente 0 ingredientes obligatorios faltantes.
   - `UP_TO_TWO_MISSING`: a lo sumo 2 faltantes **y al menos 1 coincidencia** (evita sugerencias inconexas en modo recomendación).
4. Para ordenar: primero menos faltantes; luego categoría de fibra con mejor estimación documentada; luego mayor porcentaje de coincidencia; luego menor tiempo; y finalmente nombre para desempate estable. En `ALL`, recetas sin coincidencias van al final.
5. La búsqueda por título, filtro de fibra y favoritos aplican en conjunto con disponibilidad.
6. El backend calcula coincidencias y orden; el frontend muestra los datos devueltos. El frontend puede derivar visualmente los faltantes en el detalle desde los ingredientes y la selección, sin implementar otro recomendador.
7. Si no se cumplen filtros, devolver lista vacía, sin errores artificiales.

**Nota:** la categoría de fibra no representa recomendación médica ni una declaración legal de contenido de fibra. Dar prioridad a datos trazables y permitir `SIN_DATOS`.

## 7. Requisitos no funcionales

- REST con JSON, DTOs definidos, respuestas de error coherentes y validación de entrada.
- Nombres de código consistentes y fáciles de leer; interfaz en español.
- Esquema PostgreSQL versionado mediante migraciones.
- Datos iniciales reproducibles (~30 recetas variadas, ingredientes, pasos e ingredientes por receta), sin duplicar seeds al reiniciar; al menos 8 recetas deben tener una categoría de mayor aporte de fibra revisada y documentada, dejando `SIN_DATOS` cuando no exista información confiable.
- Configuración sensible por variables de entorno; `.env` fuera de Git.
- API segura para uso local; CORS limitado a frontend autorizado.
- Pruebas automáticas para coincidencias, filtros, favoritos y operaciones de despensa.
- Accesibilidad básica: labels, enfoque visible, mensajes legibles y navegación por teclado.
- Interfaz fluida y responsive; evitar consultas innecesarias y cargas excesivas.

## 8. Criterios de MVP terminado

- Puedo abrir la web desde móvil o escritorio y recorrer las 4 pantallas.
- Guardo ingredientes en despensa, recargo la página y se mantienen.
- Puedo modificar «hoy» sin cambiar despensa, y restablecerla cuando quiero.
- Veo recomendaciones correctas y puedo filtrar disponibilidad/recetas.
- Entro al detalle, veo cantidades y pasos, y vuelvo sin perder selección.
- Puedo guardar y retirar favoritos, y sobreviven al refresco.
- Las recomendaciones principales y la persistencia tienen tests que pasan.
- El README explica instalación, configuración, comandos, decisiones y limitaciones.

## 9. Pendientes para posteriores versiones

Cantidades de despensa; vencimientos; lista de compras; historial de comidas; variedad basada en historial; planificación semanal; perfiles y autenticación; información nutricional más detallada; recetas generadas por IA; opción PWA.
