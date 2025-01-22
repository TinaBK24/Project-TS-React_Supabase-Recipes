import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Recipes from './pages/Recipes'
import RootLayout from './pages/RootLayout';
import Home from './pages/Home';
import { useState } from 'react';
import { Database } from './utils/database.types';
import AboutUs from './pages/AboutUs';
import Recipe from './pages/Recipe';
import Login from './pages/Login';
// import { UserProvider } from './context/UserContext';

function App() {
  const [popularRecipes, setPopularRecipes] = useState<Database['public']['Tables']['recipes']['Row'][]>([]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />} >
        <Route index element={<Home popularRecipes={popularRecipes} setPopularRecipes={setPopularRecipes} />} />
        <Route path='recipes' element={<Recipes popularRecipes={popularRecipes} setPopularRecipes={setPopularRecipes} />} />
        <Route path='recipes/:name' element={<Recipe />} />
        <Route path='about' element={<AboutUs />} />
        <Route path='login' element={<Login />} />
      </Route>
    )
  )

  return (
    <>
      {/* <UserProvider> */}
      <RouterProvider router={router} />
      {/* </UserProvider> */}
    </>
  )
}

export default App
