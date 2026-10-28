# Mi Despensa — Roadmap de implementación

**Regla de trabajo:** una fase a la vez. Antes de codificar: leer documentos, proponer un plan breve y señalar dudas. Después: ejecutar pruebas, explicar cambios y ofrecer pasos de verificación manual. Crear commits chicos con mensajes descriptivos.

## Fase 0 — Preparación del repositorio

- Crear repositorio Git con `frontend/`, `backend/` y los documentos de especificación en la raíz.
- Verificar requisitos locales: Java 21, Node LTS, npm y PostgreSQL. Docker Compose **opcional** para la base de datos.
- Añadir `.gitignore` adecuado y `README.md` con objetivos e instrucciones preliminares.
- Confirmar que nunca se versionan contraseñas ni `.env` reales.

**Aceptación:** carpetas y documentación presentes; repositorio inicial creado.

## Fase 1 — Infraestructura mínima

- Crear React + TypeScript + Vite.
- Configurar Tailwind CSS y React Router con cuatro rutas y layouts vacíos.
- Crear Spring Boot con REST, JPA, Validation y PostgreSQL; agregar Flyway.
- Configurar entornos por variables de entorno y CORS para localhost.
- Añadir endpoint de estado sencillo, sin datos sensibles (`GET /api/health`).
- Probar conexión entre frontend y backend y migración de base de datos.

**Aceptación:** `npm run dev` abre la web, el backend inicia, `/api/health` responde, y la base conecta con migraciones exitosas.

## Fase 2 — Ingredientes y despensa

- Modelar `ingredient` y `pantry_item` con migraciones.
- Seed inicial de ingredientes con categorías.
- Implementar `GET /api/ingredients`, `GET /api/pantry`, `PUT /api/pantry/{ingredientId}` y `DELETE /api/pantry/{ingredientId}`.
- Construir pantalla **Mi despensa**, incluidos estados de carga, error y vacío.
- Probar búsquedas, persistencia, repetición de `PUT`, y `DELETE` de elemento ausente.

**Aceptación:** se pueden agregar y quitar ingredientes y los datos permanecen al recargar.

## Fase 3 — Catálogo de recetas y favoritos

- Modelar `recipe`, `recipe_ingredient`, `recipe_step` y `favorite_recipe` con migraciones.
- Cargar dataset inicial de unas 30 recetas revisadas, con al menos 8 opciones de mayor aporte estimado de fibra respaldadas por criterios y fuentes documentadas.
- Implementar detalle `GET /api/recipes/{id}` y favoritos `PUT/DELETE /api/favorites/{id}`.
- Construir pantalla de **Detalle de receta** con placeholder de imagen si falta, ingredientes, pasos y botón favorito.
- No asignar cifras o niveles nutricionales infundados.

**Aceptación:** todas las recetas tienen al menos un ingrediente obligatorio, pasos ordenados; favoritos persisten y 404 funciona.

## Fase 4 — Motor de recomendaciones

- Implementar DTOs de `POST /api/recommendations`.
- Calcular presentes, faltantes y porcentaje solo con ingredientes obligatorios.
- Aplicar filtros `ALL`, `READY`, `UP_TO_TWO_MISSING`, búsqueda, favoritos y categoría de fibra.
- Ordenamiento determinista según `REQUIREMENTS.md`.
- Pruebas unitarias cubriendo recetas completas, 1 y 2 faltantes, cero coincidencias, opcionales, filtro y empates.

**Aceptación:** las pruebas automatizadas coinciden con reglas documentadas; endpoint devuelve tarjetas y listas correctas.

## Fase 5 — Experiencia de uso integrada

- Construir Inicio, selección de hoy y pantalla Explorar.
- Guardar selección de hoy en estado React y `sessionStorage`, inicializada una vez por sesión desde despensa.
- La edición temporal no cambia la despensa; botón Restablecer la copia de nuevo.
- Buscar, filtrar, entrar a detalle y regresar sin perder la selección.
- Ajustar mobile-first, accesibilidad y mensajes de error/vacío.
- Pruebas UI de los flujos principales.

**Aceptación:** completar desde móvil/emulador el flujo: agregar ingrediente en despensa → usarlo en Inicio → cambiar la selección → recibir recomendaciones → filtrar → abrir detalle → favoritar → volver.

## Fase 6 — Calidad y publicación

- Ejecutar tests de frontend y backend, revisar errores de compilación y lint.
- Refinar README con comandos exactos, variables de entorno y capturas.
- Evaluar seguridad del despliegue: sin login, **no publicar API modificable sin protección**. Preferir demo aislada/read-only o añadir acceso controlado antes de desplegar con escritura.
- Preparar demo y explicación técnica para portfolio.

**Aceptación:** build y tests pasan; instalación reproducible; documentación describe límites y decisiones.

## Después del MVP (no bloquear primera entrega)

Historial de platos, lista de compras, cantidades y unidades de despensa, planificación semanal, cálculo nutricional más detallado con fuentes, generación de recetas con IA, PWA y cuentas personales.
