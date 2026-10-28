# Mi Despensa

Aplicación personal de gestión y recomendación de recetas. Esta entrega implementa
únicamente la **Fase 1: infraestructura mínima** del ROADMAP.

## Estructura

- `frontend/`: React 19, TypeScript 5, Vite 7, Tailwind CSS 4 y React Router 7.
  Pantallas vacías para `/`, `/despensa`, `/recetas` y `/recetas/:id`;
  navegación y comprobación de conexión en Inicio.
- `backend/`: Java 21, Maven, Spring Boot 3.5, Web, Validation, JPA, PostgreSQL y Flyway.
  Paquetes iniciales `controller` y `config`; las capas de negocio se incorporarán
  cuando se implemente cada fase.
- Especificaciones en la raíz. No hay entidades, datos de recetas, despensa,
  favoritos ni recomendaciones implementados.

## Requisitos locales

JDK 21 (incluyendo `javac`), Maven 3.9+, Node LTS 22.12+ (validado con Node 24)
y PostgreSQL 17 en ejecución. No se requiere Docker.
Los comandos siguientes usan Bash y se ejecutan desde la raíz del repositorio.

### 1. Base de datos

Con un usuario administrador de PostgreSQL, crear un rol privado y una base
vacía. `createuser` solicita la contraseña sin guardarla en comandos:

```bash
createuser -U postgres --pwprompt mi_despensa
createdb -U postgres --owner=mi_despensa mi_despensa
```

Según la instalación, puede ser necesario usar el usuario de sistema `postgres`
(por ejemplo, `sudo -u postgres createuser --pwprompt mi_despensa` y
`sudo -u postgres createdb --owner=mi_despensa mi_despensa`).
El rol de la aplicación necesita permisos sobre su propia base para Flyway.

### 2. Backend

```bash
cp backend/.env.example backend/.env
# Editar backend/.env: completar DB_PASSWORD y ajustar conexión si corresponde.
set -a
source backend/.env
set +a
cd backend
mvn spring-boot:run
```

Los valores de `.env` deben ser sintaxis Bash válida; usar comillas simples si
contienen caracteres especiales. Spring Boot no carga este archivo automáticamente:
hay que exportarlo en cada terminal que ejecute el backend o sus pruebas.

| Variable | Uso / valor predeterminado |
| --- | --- |
| `DB_URL` | JDBC; por defecto `jdbc:postgresql://localhost:5432/mi_despensa` |
| `DB_USERNAME` | Rol PostgreSQL, obligatorio |
| `DB_PASSWORD` | Contraseña PostgreSQL, obligatoria |
| `FRONTEND_ORIGIN` | Único origen CORS permitido; `http://localhost:5173` |
| `SERVER_ADDRESS` | Interfaz de escucha; `127.0.0.1` |
| `SERVER_PORT` | Puerto del backend; `8080` |

`GET http://127.0.0.1:8080/api/health` devuelve `{"status":"UP"}`.
Es una comprobación de servidor activo, sin datos sensibles; no consulta la base
en cada petición. El arranque exige conexión PostgreSQL y migraciones válidas.
Flyway ejecuta `V1__initialize.sql` (`SELECT 1`) y registra su historial.
No crea tablas de negocio. Hibernate valida el esquema y no lo modifica.

### 3. Frontend (otra terminal)

```bash
cp frontend/.env.example frontend/.env
cd frontend
npm ci
npm run dev
```

Abrir `http://localhost:5173`. Inicio debe mostrar «Servidor conectado».
Se puede navegar a Despensa y Recetas; el detalle vacío se puede visitar en
`/recetas/1`. No se realizan búsquedas ni operaciones de dominio.

Vite envía `/api` al backend mediante su proxy de desarrollo.
`API_PROXY_TARGET` (predeterminado `http://127.0.0.1:8080`) configura ese destino;
reiniciar Vite después de cambiarlo. No hay secretos ni variables de base de datos
en el frontend. El proxy es solo para desarrollo; un despliegue futuro necesita
servir `/api` mediante su propio servidor y fallback de rutas SPA.

## Verificaciones

Frontend, desde `frontend/`:

```bash
npm ci
npm run typecheck
npm test
npm run build
```

Las pruebas Vitest/React Testing Library cubren las cuatro rutas, ruta inexistente
y los estados de conexión y error del servidor. El build incluye TypeScript.
No hay un comando de lint configurado en esta fase.

Backend, desde `backend/`, con las variables exportadas y PostgreSQL activo:

```bash
mvn verify
```

Las tres pruebas de integración levantan Spring en un puerto aleatorio, consultan
el endpoint, verifican el historial real de Flyway sobre PostgreSQL y comprueban
CORS permitido/rechazado. Usar una base de desarrollo/pruebas; no producción.
No usan H2 ni omiten la conexión real. `mvn verify` genera el JAR:

```bash
java -jar target/mi-despensa-0.1.0-SNAPSHOT.jar
```

Con ambos servidores activos, desde otra terminal:

```bash
curl --fail http://127.0.0.1:8080/api/health
curl --fail http://127.0.0.1:5173/api/health
```

Ambos deben devolver `{"status":"UP"}`; la segunda petición valida el proxy.
Para confirmar Flyway, con el cliente PostgreSQL conectado a la base:

```sql
SELECT version, description, success FROM flyway_schema_history;
```

## Entorno en la nube

Las herramientas publicadas se activan con
`source /workspace/.cloud-tools/activate.sh`. La instancia de desarrollo fue
preparada con una base `mi_despensa`, un rol del mismo nombre y credencial aleatoria
en `backend/.env` (ignorado por Git). Para repetir los comandos Maven en esta nube,
usar `mvn -s /workspace/.cloud-tools/maven-settings.xml ...`; ese archivo auxiliar
configura el proxy de la plataforma y no es necesario localmente.

Los procesos no sobreviven necesariamente a un reinicio. El PostgreSQL de esta
instancia se inicia con:

```bash
source /workspace/.cloud-tools/activate.sh
pg_ctl -D /workspace/.cloud-tools/pgdata -l /workspace/.cloud-tools/postgres.log \
  -o "-k /workspace/.cloud-tools/socket -h 127.0.0.1" start
```

Si ya está activo, no iniciarlo de nuevo. Esta configuración auxiliar de la
instancia no modifica ni publica la configuración guardada del entorno.

## Límites y siguiente paso

Uso privado/local, sin autenticación. Mantener PostgreSQL y backend en loopback;
no exponer una API de escritura pública. `.env`, artefactos y dependencias están
excluidos de Git; `.env.example` no contiene contraseñas.

La Fase 2 será ingredientes y despensa, únicamente cuando se solicite.
