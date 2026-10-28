# Primer mensaje para Codex

Vamos a empezar el proyecto **Mi Despensa**. El repositorio tiene estos documentos:

- `REQUIREMENTS.md`: objetivo, pantallas, requisitos y reglas de negocio.
- `DATA_MODEL.md`: modelo de datos.
- `API_CONTRACT.md`: endpoints y DTOs previstos.
- `ROADMAP.md`: fases y criterios de aceptación.
- `AGENTS.md`: convenciones y forma de trabajo.

**Tu tarea actual es SOLO la Fase 1 (infraestructura mínima) de `ROADMAP.md`.** No implementes todavía recetas, despensa, favoritos ni recomendador.

1. Primero, leé todos esos documentos y revisá qué archivos hay en el repositorio.
2. Proponé un plan conciso con la estructura de carpetas y las dependencias mínimas necesarias.
3. Creá `frontend/` con React + TypeScript + Vite, Tailwind y React Router. Dejá rutas vacías para `/`, `/despensa`, `/recetas`, `/recetas/:id`.
4. Creá `backend/` con Java 21, Spring Boot, Spring Web, JPA, Validation, PostgreSQL y Flyway. Prepará variables de entorno de ejemplo y un endpoint simple `GET /api/health`.
5. Configurá CORS solo para el frontend de desarrollo y evitá credenciales incrustadas.
6. Añadí instrucciones claras para ejecutar frontend, backend y base de datos localmente.
7. Ejecutá las verificaciones y pruebas que puedan correr en este entorno; informá cuáles no pudiste ejecutar.
8. Cerrá con resumen de archivos creados, comandos y pasos manuales que tengo que realizar.

**Criterio de aceptación:** el frontend levanta, se ven las cuatro rutas vacías, el backend responde en `/api/health`, PostgreSQL conecta y Flyway corre sin errores.

No avances a la Fase 2 sin que te lo solicite.
