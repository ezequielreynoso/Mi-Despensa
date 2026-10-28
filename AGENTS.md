# Instrucciones para Codex — Mi Despensa

## Contexto

El proyecto es una app web personal para elegir recetas según ingredientes disponibles, ampliar variedad de comidas y destacar opciones con fibra. Antes de trabajar, leer `REQUIREMENTS.md`, `DATA_MODEL.md`, `API_CONTRACT.md` y `ROADMAP.md`.

## Regla más importante

**Implementar únicamente la fase o tarea que solicite el usuario.** No agregar IA, cuentas, stock, lista de compras ni otras funciones «por si acaso». Si un requisito es ambiguo, documentar la suposición y sugerir la alternativa más sencilla; no introducir cambios grandes sin explicación.

## Tecnologías

- Frontend: React, TypeScript, Vite, Tailwind CSS y React Router.
- Backend: Java 21, Spring Boot, Spring Web, Bean Validation, Spring Data JPA.
- DB: PostgreSQL, Flyway.
- Pruebas: Vitest + React Testing Library, JUnit 5 + Mockito.
- Node y Java con versiones estables compatibles; no actualizar dependencias sin necesidad.

## Estilo y arquitectura

- Componentes React funcionales, props tipadas y hooks apropiados.
- Organizar frontend en `pages`, `components`, `services`, `types`, `hooks` y contexto de selección si hace falta.
- Backend por capas: `controller`, `service`, `repository`, `entity`, `dto`, `exception`, `config`.
- La regla de recomendación vive en el **servicio backend Java**; el frontend la presenta.
- Usar DTOs para las respuestas, nunca serializar entidades JPA directamente.
- Validar entradas, manejar errores HTTP con mensajes útiles, usar nombres claros.
- Separar efectos y llamadas a la API de la presentación; evitar componentes gigantes.
- Priorizar soluciones simples; no agregar Redux, microservicios o patrones complejos sin justificación.
- Mantener comentarios y documentación en español; nombres de símbolos de código consistentes en inglés si el proyecto adopta ese criterio.

## Persistencia y estado

- PostgreSQL guarda catálogo, despensa, recetas, pasos y favoritos.
- El selector temporal «para hoy» se maneja aparte y se mantiene durante navegación; puede persistir en `sessionStorage`.
- Nunca descontar ingredientes automáticamente: no hay cantidades de despensa en MVP.
- Las relaciones del esquema y las migraciones deben respetar `DATA_MODEL.md`.

## Fibra y contenido

- No inventar valores nutricionales ni etiquetas de alto contenido de fibra sin criterio trazable.
- Si faltan datos verificados, utilizar categoría `UNKNOWN` y mostrar «Sin datos».
- Las recomendaciones no deben presentarse como asesoramiento médico.

## Seguridad y calidad

- No poner secretos en código o Git. Crear `.env.example` sin valores sensibles cuando sea pertinente.
- Limitar CORS a orígenes necesarios en desarrollo.
- **Sin autenticación es solo una app de uso privado; no publicar endpoints de escritura en Internet.**
- Añadir o modificar pruebas para toda regla de negocio nueva.
- Ejecutar test/build/lint que correspondan. Si no pueden ejecutarse, decir por qué.
- Usar criterios de aceptación de `REQUIREMENTS.md` para verificar los resultados.

## Flujo de cada tarea

1. Inspeccionar estructura y estado actual del repositorio.
2. Describir el plan y los archivos que se modificarán.
3. Implementar solo el alcance solicitado.
4. Añadir pruebas pertinentes y ejecutar verificaciones disponibles.
5. Resumir cambios, comandos usados, decisiones y problemas pendientes.
6. Proponer el siguiente paso del roadmap, **sin implementarlo todavía**.
