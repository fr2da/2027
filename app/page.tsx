'use client'

import { useState, useEffect, useRef } from 'react'
import NumberFlow from '@number-flow/react'

export default function Page() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [isMusicButtonVisible, setIsMusicButtonVisible] = useState(true)
  const [volume, setVolume] = useState(50)
  const musicFrameRef = useRef<HTMLIFrameElement>(null)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateMusicVolume = (nextVolume: number) => {
    musicFrameRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: 'command',
        func: nextVolume === 0 ? 'mute' : 'setVolume',
        args: nextVolume === 0 ? [] : [nextVolume],
      }),
      'https://www.youtube.com',
    )
  }

  const cancelButtonHold = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
  }

  const startButtonHold = () => {
    cancelButtonHold()
    holdTimerRef.current = setTimeout(() => {
      setIsMusicPlaying(false)
      setIsMusicButtonVisible(false)
      holdTimerRef.current = null
    }, 3000)
  }

  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date('2027-01-01T00:00:00+09:00').getTime() - 1000
      const now = new Date().getTime()
      const difference = target - now

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-semibold text-gray-900">2027년까지:</h1>
        
        <div className="flex justify-center gap-3 sm:gap-8">
          <div className="flex flex-col items-center">
            <div className="mb-1 w-20 text-center text-5xl font-bold text-gray-900 sm:w-28 sm:text-7xl">
              <NumberFlow value={countdown.days} format={{ minimumIntegerDigits: 2 }} />
            </div>
            <div className="text-sm font-semibold text-gray-600">일</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="mb-1 w-20 text-center text-5xl font-bold text-gray-900 sm:w-28 sm:text-7xl">
              <NumberFlow value={countdown.hours} format={{ minimumIntegerDigits: 2 }} />
            </div>
            <div className="text-sm font-semibold text-gray-600">시</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="mb-1 w-20 text-center text-5xl font-bold text-gray-900 sm:w-28 sm:text-7xl">
              <NumberFlow value={countdown.minutes} format={{ minimumIntegerDigits: 2 }} />
            </div>
            <div className="text-sm font-semibold text-gray-600">분</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="mb-1 w-20 text-center text-5xl font-bold text-gray-900 sm:w-28 sm:text-7xl">
              <NumberFlow value={countdown.seconds} format={{ minimumIntegerDigits: 2 }} />
            </div>
            <div className="text-sm font-semibold text-gray-600">초</div>
          </div>
        </div>
      </div>
      <div className="fixed right-5 bottom-5 z-10 flex flex-col items-end gap-3 sm:right-8 sm:bottom-8">
        {isMusicPlaying && (
          <iframe
            ref={musicFrameRef}
            className="pointer-events-none absolute h-px w-px opacity-0"
            src="https://www.youtube.com/embed/rFZHOHl-L8A?autoplay=1&loop=1&playlist=rFZHOHl-L8A&enablejsapi=1"
            title="Lofi 음악"
            allow="autoplay; encrypted-media"
            onLoad={() => updateMusicVolume(volume)}
          />
        )}

        {isMusicButtonVisible && (
          <div className="group relative flex items-center">
            <label
              className="pointer-events-none absolute right-14 flex h-11 w-28 translate-x-2 items-center rounded-full bg-white px-3 opacity-0 shadow-lg ring-1 ring-gray-200 transition-all group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:opacity-100"
              htmlFor="music-volume"
            >
              <span className="sr-only">음악 볼륨</span>
              <input
                id="music-volume"
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(event) => {
                  const nextVolume = Number(event.target.value)
                  setVolume(nextVolume)
                  updateMusicVolume(nextVolume)
                }}
                className="w-full accent-gray-900"
                aria-label="음악 볼륨"
              />
            </label>
            <button
              type="button"
              onClick={() => setIsMusicPlaying((playing) => !playing)}
              onPointerDown={startButtonHold}
              onPointerUp={cancelButtonHold}
              onPointerCancel={cancelButtonHold}
              onPointerLeave={cancelButtonHold}
              className={`flex h-11 w-11 items-center justify-center rounded-full text-xl shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${
                isMusicPlaying ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 ring-1 ring-gray-200'
              }`}
              aria-label={isMusicPlaying ? '음악 끄기' : 'lofi 음악 재생'}
              title="짧게 눌러 음악 재생, 3초간 눌러 버튼 삭제"
              aria-pressed={isMusicPlaying}
            >
              ♪
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
