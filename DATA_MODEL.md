# Mi Despensa — Modelo de datos del MVP

## Principios

- PostgreSQL es la fuente de verdad de ingredientes de catálogo, despensa, recetas y favoritos.
- No habrá usuarios ni autenticación en v1. Los datos representan **una sola instalación privada**; no exponer operaciones de modificación sin protección en Internet.
- La selección **«Ingredientes para hoy» NO se guarda en PostgreSQL**: vive en estado React y puede mantenerse en `sessionStorage` para no perderse al navegar/recargar en la misma sesión.
- No hay cantidades almacenadas en la despensa. Las **cantidades de una receta** son diferentes y sí se almacenan.
- Nombres legibles, claves foráneas, restricciones de unicidad y migraciones versionadas.

## Entidades

### `ingredient`
| Campo | Tipo sugerido | Descripción |
|---|---|---|
| `id` | BIGINT PK | Identificador |
| `name` | VARCHAR(120) NOT NULL | Nombre visible, p.ej. «Zanahoria» |
| `category` | VARCHAR(50) nullable | Verduras, legumbres, cereales, etc. |

**Restricción:** nombre único sin distinguir mayúsculas/minúsculas (índice único sobre `lower(name)` o columna normalizada equivalente).

### `recipe`
| Campo | Tipo sugerido | Descripción |
|---|---|---|
| `id` | BIGINT PK | Identificador |
| `title` | VARCHAR(160) NOT NULL | Nombre de receta |
| `description` | TEXT nullable | Resumen breve |
| `prep_minutes` | INT NOT NULL | Tiempo estimado, positivo |
| `servings` | INT NOT NULL | Porciones, positivo |
| `image_path` | VARCHAR(500) nullable | Imagen propia/local o URL permitida; UI usa placeholder si falta |
| `fiber_category` | VARCHAR(30) NOT NULL | `HIGHER_ESTIMATED`, `MODERATE_ESTIMATED` o `UNKNOWN` |
| `fiber_source_note` | TEXT nullable | Justificación/fuente de la estimación nutricional |

No asignar categorías «estimadas» sin evaluación trazable; si faltan datos, usar `UNKNOWN`.

### `recipe_ingredient`
| Campo | Tipo sugerido | Descripción |
|---|---|---|
| `recipe_id` | BIGINT FK | Receta |
| `ingredient_id` | BIGINT FK | Ingrediente |
| `amount` | NUMERIC(10,2) nullable | Cantidad de la receta |
| `unit` | VARCHAR(30) nullable | g, ml, unidad, cucharada, etc. |
| `optional` | BOOLEAN NOT NULL DEFAULT FALSE | Si es opcional no cuenta como faltante |
| `note` | VARCHAR(200) nullable | p.ej. «cocidas» o «rallada» |

**Clave primaria compuesta:** (`recipe_id`, `ingredient_id`). Si se necesita repetir un ingrediente con distintas preparaciones en una misma receta, refactorizar más adelante a ID propio.

### `recipe_step`
| Campo | Tipo sugerido | Descripción |
|---|---|---|
| `id` | BIGINT PK | Identificador |
| `recipe_id` | BIGINT FK | Receta |
| `step_number` | INT NOT NULL | Número de paso desde 1 |
| `instruction` | TEXT NOT NULL | Texto de la instrucción |

**Restricción:** (`recipe_id`, `step_number`) único.

### `pantry_item`
| Campo | Tipo sugerido | Descripción |
|---|---|---|
| `ingredient_id` | BIGINT PK + FK | Ingrediente presente en despensa |
| `added_at` | TIMESTAMPTZ | Fecha de incorporación |

No registrar stock ni cantidades en esta versión.

### `favorite_recipe`
| Campo | Tipo sugerido | Descripción |
|---|---|---|
| `recipe_id` | BIGINT PK + FK | Receta favorita |
| `created_at` | TIMESTAMPTZ | Fecha de guardado |

## Relaciones

```text
ingredient (1) ---- (*) recipe_ingredient (*) ---- (1) recipe
       |                                            |      |
       |                                            |      +--- (*) recipe_step
       +---- (0..1) pantry_item                    +---------- (0..1) favorite_recipe
```

- Una receta tiene muchos ingredientes y varios pasos.
- Un ingrediente puede participar en muchas recetas.
- Un ingrediente puede aparecer una vez en la despensa de la única instalación.
- Una receta puede estar una vez en favoritos.

## Reglas de integridad

1. Toda receta publicable tiene al menos un ingrediente **obligatorio** (regla validada en servicio/seeding).
2. `prep_minutes > 0`, `servings > 0`, `step_number >= 1`.
3. No duplicar ingredientes, favoritos ni relaciones receta-ingrediente.
4. No devolver entidades JPA directamente desde el controlador: usar DTOs y evitar ciclos de serialización.
5. Evitar borrados accidentales en cascada de ingredientes de catálogo; el borrado de despensa o favoritos no elimina la receta o el ingrediente.
6. Las migraciones van en `backend/src/main/resources/db/migration/` y se ejecutan con Flyway.

## Datos iniciales

- Catálogo básico de ingredientes habituales, con nombres coherentes (singular, tildes y equivalencias normalizadas).
- Aproximadamente 30 recetas variadas (verduras, legumbres, cereales, pastas, tartas, huevos, etc.).
- Pasos y cantidades realistas; marcar opcionales los condimentos si aparecen.
- No atribuir números nutricionales inventados. Usar `UNKNOWN` si no se revisó la estimación.
- Crear migraciones idempotentes para datos iniciales o scripts claros ejecutables una única vez. Nunca duplicar entradas al reiniciar.

## Evolución prevista

Al sumar multiusuario: `user` y claves `user_id` en `pantry_item` y `favorite_recipe`. Al sumar stock: `quantity`, `unit` y un flujo explícito de consumo. El recomendador debe seguir aceptando una selección de IDs por petición, independientemente de la despensa.
