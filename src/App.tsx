import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from './components/Layout'
import { RecipeListPage } from './pages/RecipeListPage'
import { RecipePage } from './pages/RecipePage'
import { ErrorPage, NotFoundPage } from './pages/NotFoundPage'

const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <RecipeListPage /> },
        { path: 'recept/:slug', element: <RecipePage /> },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  // "/recipes/" in production, matching `base` in vite.config.ts
  { basename: import.meta.env.BASE_URL },
)

export function App() {
  return <RouterProvider router={router} />
}
