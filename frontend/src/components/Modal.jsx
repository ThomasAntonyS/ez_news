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
    }, 6000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [onClose])

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center h-screen
        px-4 sm:px-6 transition-all duration-500 bg-black/40
        ${closing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
    >
      <div className="bg-white border-[6px] border-black sm:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] w-full 
        max-w-md sm:max-w-lg md:max-w-xl 
        text-center p-8 sm:p-12 transition-all"
      >
        <div className="inline-block bg-black text-white px-4 py-1 mb-6 font-black uppercase tracking-wide text-xs">
          System Message
        </div>
        
        <h2 className="text-3xl sm:text-5xl font-black mb-4 uppercase tracking-tighter leading-none">
          Welcome to <br/> 
          <span className="bg-blur-lg px-2">EZ News</span>
        </h2>
        
        <div className="space-y-4 mb-10">
          <p className="text-lg sm:text-xl font-bold uppercase leading-tight italic">
            Stay updated with trending news across all categories.
          </p>
          <p className="text-sm sm:text-base font-medium uppercase tracking-wide text-zinc-600">
            Fresh news available every few hours.
          </p>
        </div>

        <div className="relative w-full h-10 border-4 border-black bg-white overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-50 ease-linear flex items-center justify-end px-2"
            style={{ width: `${progress}%` }}
          >
            <span className="text-white font-black text-xs">
              {progress}%
            </span>
          </div>
        </div>
        
        <div className="mt-4 text-[10px] font-black text-black animate-pulse">
          Initializing Articles...
        </div>
      </div>
    </div>
  )
}

export default Modal