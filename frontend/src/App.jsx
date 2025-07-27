import { BrowserRouter, replace, Route, Routes } from 'react-router-dom'
import './App.css'
import NewsContext from './context/NewsContext'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import SingleCategory from './pages/SingleCategory'

function App() {

  return (
    <>
      <BrowserRouter>

        <NewsContext>

          <Routes>

            <Route
            element={<Home/>}
            path='/'/>

            <Route
            element={<SingleCategory/>}
            path='/:category'/>

            <Route
            element={<NotFound/>}
            path='/not-found'/>
            
          </Routes>

        </NewsContext>

      </BrowserRouter>
    </>
  )
}

export default App
