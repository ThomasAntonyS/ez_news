import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NewsContext from './context/NewsContext'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import SingleCategory from './pages/SingleCategory'
import Search from './pages/Search'
import Modal from './components/Modal'
import './App.css'

function App() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('seenWelcomePopup')
    if (!hasSeenPopup) {
      setShowModal(true)
      sessionStorage.setItem('seenWelcomePopup', 'true')
    }
  }, [])

  return (
    <div className={showModal ? 'overflow-hidden' : ''}>
      {showModal && <Modal onClose={() => setShowModal(false)} />}

      <BrowserRouter>
        <NewsContext>
          <Routes>
            <Route element={<Home />} path='/' />
            <Route element={<SingleCategory />} path='/:category' />
            <Route element={<Search />} path='/search/:q' />
            <Route element={<NotFound />} path='/error-not-found' />
          </Routes>
        </NewsContext>
      </BrowserRouter>
    </div>
  )
}

export default App
