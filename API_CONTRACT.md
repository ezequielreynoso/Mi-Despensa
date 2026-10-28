# Mi Despensa — Contrato de API REST (borrador v1)

**Base:** `/api` · **Formato:** JSON · **Errores:** status HTTP correcto y cuerpo consistente, sin stack traces.

Los siguientes ejemplos usan IDs ilustrativos. Los nombres de tipos deben mantenerse consistentes entre DTOs Java e interfaces TypeScript.

## Ingredientes y despensa

| Método | Ruta | Propósito |
|---|---|---|
| `GET` | `/api/ingredients?search=zan` | Buscar en catálogo (con límite razonable) |
| `GET` | `/api/pantry` | Listar ingredientes guardados |
| `PUT` | `/api/pantry/{ingredientId}` | Agregar ingrediente a despensa; operación idempotente |
| `DELETE` | `/api/pantry/{ingredientId}` | Quitar ingrediente de despensa; idempotente |

Respuesta de `GET /api/ingredients`:

```json
[
  { "id": 7, "name": "Zanahoria", "category": "Verduras" }
]
```

Respuesta de `GET /api/pantry`: mismo formato (array de ingredientes). El backend controla IDs inexistentes con `404` al agregar; quitar un ausente no debe fallar (puede devolver `204`).

## Recomendador y catálogo

`POST /api/recommendations`

Este endpoint se usa para las tarjetas de **Inicio** y la grilla de **Explorar recetas**. Trabaja con la **selección temporal enviada por el frontend**, no asume que sea igual a la despensa persistente. El `POST` aquí calcula un resultado: **no modifica datos**.

Solicitud:

```json
{
  "ingredientIds": [5, 7],
  "search": "",
  "availability": "UP_TO_TWO_MISSING",
  "fiberFilter": "ANY",
  "favoritesOnly": false
}
```

Opciones:
- `availability`: `ALL`, `READY`, `UP_TO_TWO_MISSING`.
- `fiberFilter`: `ANY`, `HIGHER_ESTIMATED_ONLY`.
- `search`: texto por título, opcional, sin distinción de mayúsculas/minúsculas.
- `favoritesOnly`: booleano.
- Para Inicio, tomar los 3 primeros resultados de `UP_TO_TWO_MISSING`.
- Para Explorar, usar el filtro elegido por la persona, incluyendo `ALL`.

Respuesta:

```json
[
  {
    "id": 21,
    "title": "Croquetas de lentejas",
    "description": "Croquetas al horno con verduras",
    "imagePath": null,
    "prepMinutes": 30,
    "servings": 2,
    "fiberCategory": "HIGHER_ESTIMATED",
    "isFavorite": true,
    "requiredIngredientCount": 3,
    "matchedIngredientCount": 2,
    "missingIngredientIds": [12],
    "missingIngredientNames": ["Huevo"],
    "missingCount": 1,
    "matchPercentage": 66.67
  }
]
```

**Reglas en el servidor:**
1. Sanitizar/validar IDs (no negativos, sin duplicados); IDs desconocidos deben producir error de validación o respuesta clara, nunca resultados silenciosamente engañosos.
2. No contar ingredientes `optional=true` al buscar faltantes.
3. `READY`: 0 faltantes.
4. `UP_TO_TWO_MISSING`: <=2 faltantes y >=1 ingrediente obligatorio coincidente.
5. `ALL`: devuelve todas las recetas compatibles con búsqueda, fibra y favoritos, incluso si 0 ingredientes coinciden.
6. Orden estable: en `ALL`, recetas con al menos una coincidencia antes de 0 coincidencias; luego menos faltantes, categoría de fibra priorizada, porcentaje de coincidencia descendente, tiempo ascendente, título ascendente. En otros modos, menos faltantes y los mismos desempates.
7. `fiberCategory = UNKNOWN` no satisface `HIGHER_ESTIMATED_ONLY`.
8. Sin resultados => `200 []`.

## Detalle de receta

`GET /api/recipes/{id}`

```json
{
  "id": 21,
  "title": "Croquetas de lentejas",
  "description": "Croquetas al horno con verduras",
  "imagePath": null,
  "prepMinutes": 30,
  "servings": 2,
  "fiberCategory": "HIGHER_ESTIMATED",
  "fiberSourceNote": "Estimación documentada para la receta",
  "isFavorite": true,
  "ingredients": [
    { "ingredientId": 5, "name": "Lentejas", "amount": 300, "unit": "g", "note": "cocidas", "optional": false },
    { "ingredientId": 7, "name": "Zanahoria", "amount": 1, "unit": "unidad", "note": "rallada", "optional": false },
    { "ingredientId": 12, "name": "Huevo", "amount": 1, "unit": "unidad", "note": "", "optional": false }
  ],
  "steps": [
    { "number": 1, "instruction": "Pisar las lentejas cocidas." },
    { "number": 2, "instruction": "Mezclar con los demás ingredientes." }
  ]
}
```

- `404` si la receta no existe.
- El frontend puede comparar `ingredientId` del detalle contra la selección temporal para destacar faltantes; la lógica de ranking y filtros se mantiene en el backend.

## Favoritos

| Método | Ruta | Propósito |
|---|---|---|
| `PUT` | `/api/favorites/{recipeId}` | Marcar favorito (idempotente) |
| `DELETE` | `/api/favorites/{recipeId}` | Desmarcar favorito (idempotente) |

- `isFavorite` se incorpora a las respuestas de recetas y detalle; no hace falta un endpoint extra para el primer MVP.
- Los favoritos residen en PostgreSQL y sobreviven a recargas.

## Errores, versiones y comportamiento

```json
{
  "code": "RECIPE_NOT_FOUND",
  "message": "No encontramos la receta solicitada."
}
```

- `400`: filtros inválidos o datos mal formados.
- `404`: recurso inexistente.
- `500`: error inesperado, sin revelar información sensible.
- DTOs para request/response y validación con Bean Validation.
- Definir límites de tamaño para entradas y búsqueda; considerar paginación cuando el catálogo supere el MVP.
- API sin credenciales incrustadas, sin CORS abierto indiscriminadamente, y **no disponible públicamente sin protección** mientras sea de usuario único.
