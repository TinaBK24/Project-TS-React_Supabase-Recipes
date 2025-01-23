import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Recipes from './pages/Recipes'
import RootLayout from './pages/RootLayout';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Recipe from './pages/Recipe';
import Login from './pages/Login';
import { UserProvider } from './context/UserContext';
import MyRecipes from './pages/MyRecipes';

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout />} >
        <Route index element={<Home />} />
        <Route path='recipes' element={<Recipes />} />
        <Route path='my-recipes' element={<MyRecipes />} />
        <Route path='recipes/:name' element={<Recipe />} />
        <Route path='about' element={<AboutUs />} />
        <Route path='login' element={<Login />} />
      </Route>
    )
  )

  return (
    <>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </>
  )
}

export default App
