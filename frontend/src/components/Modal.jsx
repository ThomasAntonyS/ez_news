import React, { useEffect, useState } from 'react'

const Modal = ({ onClose }) => {
  const [progress, setProgress] = useState(0)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 100))
    }, 50)

    const timeout = setTimeout(() => {
      setClosing(true)
      setTimeout(() => {
        onClose()
      }, 500)
    }, 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [onClose])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center h-screen
        px-4 sm:px-6 transition-all duration-500 
        ${closing ? 'opacity-0 -translate-y-12' : 'opacity-100 translate-y-0'}
        backdrop-blur-lg`}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full 
        max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-4xl
        text-center p-6 sm:p-8 lg:p-10 transition-all duration-300 ease-in-out"
      >
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold mb-3">
          Welcome to EZ News
        </h2>
        <p className="text-sm sm:text-lg lg:text-xl text-gray-700">
          Stay updated with trending news across all categories.
        </p>
        <p className="text-sm sm:text-lg lg:text-xl text-gray-700 mt-2">
          News updates every <span className="text-black font-bold">2 hours</span>.
        </p>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mt-8">
          <div
            className="h-full bg-black transition-all duration-50 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default Modal
