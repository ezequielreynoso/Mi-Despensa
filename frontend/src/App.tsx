import { NavLink, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { PantryPage } from './pages/PantryPage'
import { RecipesPage } from './pages/RecipesPage'
import { RecipeDetailPage } from './pages/RecipeDetailPage'

export function App() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-8">
      <header className="mb-10">
        <p className="mb-4 text-xl font-bold">Mi Despensa</p>
        <nav aria-label="Navegación principal" className="flex gap-6">
          <NavLink to="/" end>Inicio</NavLink>
          <NavLink to="/despensa">Despensa</NavLink>
          <NavLink to="/recetas">Recetas</NavLink>
        </nav>
      </header>
      <main><Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/despensa" element={<PantryPage />} />
        <Route path="/recetas" element={<RecipesPage />} />
        <Route path="/recetas/:id" element={<RecipeDetailPage />} />
        <Route path="*" element={<h1 className="text-2xl">Página no encontrada</h1>} />
      </Routes></main>
    </div>
  )
}
