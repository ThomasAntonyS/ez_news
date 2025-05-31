import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import NewsContext from './context/NewsContext'
import Home from './pages/Home'
import NotFound from './components/NotFound'
import SingleCategory from './components/SingleCategory'

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
            path='/*'/>
            
          </Routes>

        </NewsContext>

      </BrowserRouter>
    </>
  )
}

export default App
