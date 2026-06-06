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
      className={`fixed inset-0 z-200 flex items-center justify-center h-screen px-4 sm:px-6 transition-all duration-500 bg-neutral-950/40 backdrop-blur-sm
        ${closing ? 'opacity-0 scale-98' : 'opacity-100 scale-100'}`}
    >
      <div className="bg-white border border-neutral-200 shadow-xl w-full max-w-md text-center p-8 sm:p-10 transition-all rounded-xs">
        <div className="manrope inline-block bg-neutral-100 text-neutral-800 px-3 py-1 mb-6 font-bold uppercase tracking-widest text-[10px]">
          System Update
        </div>
        
        <h2 className="lora text-3xl sm:text-4xl font-medium mb-4 tracking-tight text-neutral-900 leading-snug">
          Welcome to <span className="italic">EZ News</span>
        </h2>
        
        <div className="space-y-2 mb-8">
          <p className="lora text-neutral-600 text-base font-normal leading-relaxed">
            Stay updated with trending news across all categories.
          </p>
          <p className="manrope text-[11px] font-bold uppercase tracking-widest text-neutral-400">
            Fresh updates synchronized every few hours.
          </p>
        </div>

        <div className="space-y-2.5">
          <div className="w-full h-1 bg-neutral-100 overflow-hidden rounded-full">
            <div
              className="h-full bg-neutral-900 transition-all duration-50 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center manrope text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
            <span className={progress === 100 ? "text-neutral-900" : "animate-pulse"}>
              {progress === 100 ? "Ready" : "Initializing Feed..."}
            </span>
            <span className="text-neutral-700 font-extrabold">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal