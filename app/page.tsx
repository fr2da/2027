'use client'

import { useState, useEffect } from 'react'
import NumberFlow from '@number-flow/react'
import Confetti from 'react-confetti'

export default function Page() {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [themeTransition, setThemeTransition] = useState<{
    isDark: boolean
  } | null>(null)

  useEffect(() => {
    const themeColor = isDarkMode ? '#000000' : '#ffffff'
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light'
    document.documentElement.style.backgroundColor = themeColor
    document.body.style.backgroundColor = themeColor
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor)
  }, [isDarkMode])

  const toggleTheme = () => {
    if (themeTransition) return

    const nextIsDark = !isDarkMode
    setIsDarkMode(nextIsDark)
    setThemeTransition({
      isDark: nextIsDark,
    })
  }

  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date('2027-01-01T00:00:00+09:00').getTime()
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
        setIsFinished(true)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main
      className={`relative flex min-h-[100dvh] items-center justify-center overflow-hidden ${
        isDarkMode ? 'theme-dark' : 'theme-light'
      }`}
      onClick={toggleTheme}
    >
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-semibold text-current">2027년까지:</h1>
        
        <div className="flex justify-center gap-3 sm:gap-8">
          <div className="flex flex-col items-center">
            <div className="mb-1 w-20 text-center text-5xl font-bold text-current sm:w-28 sm:text-7xl">
              <NumberFlow value={countdown.days} format={{ minimumIntegerDigits: 2 }} />
            </div>
            <div className="text-sm font-semibold opacity-60">일</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="mb-1 w-20 text-center text-5xl font-bold text-current sm:w-28 sm:text-7xl">
              <NumberFlow value={countdown.hours} format={{ minimumIntegerDigits: 2 }} />
            </div>
            <div className="text-sm font-semibold opacity-60">시</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="mb-1 w-20 text-center text-5xl font-bold text-current sm:w-28 sm:text-7xl">
              <NumberFlow value={countdown.minutes} format={{ minimumIntegerDigits: 2 }} />
            </div>
            <div className="text-sm font-semibold opacity-60">분</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="mb-1 w-20 text-center text-5xl font-bold text-current sm:w-28 sm:text-7xl">
              <NumberFlow value={countdown.seconds} format={{ minimumIntegerDigits: 2 }} />
            </div>
            <div className="text-sm font-semibold opacity-60">초</div>
          </div>
        </div>
      </div>
      {themeTransition && (
        <div
          className={`theme-fade pointer-events-none fixed inset-0 z-10 ${
            themeTransition.isDark ? 'theme-light' : 'theme-dark'
          }`}
          onAnimationEnd={() => {
            setThemeTransition(null)
          }}
        />
      )}
      {isFinished && (
        <div className="pointer-events-none fixed inset-0 z-20">
          <Confetti recycle={false} numberOfPieces={1000} />
        </div>
      )}
    </main>
  )
}
