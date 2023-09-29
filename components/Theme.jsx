import { useEffect, useState } from "react"
import { BoltSlashIcon, BoltIcon } from "@heroicons/react/24/solid"

export default function Theme() {
  const [isDarkMode, setDarkMode] = useState(false)

  const handleDarkModeChange = () => {
    const newDarkMode = !isDarkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("theme", newDarkMode ? "dark" : "light")
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  useEffect(() => {
    const localTheme = localStorage.getItem("theme")

    if (localTheme === "dark") {
      document.documentElement.classList.add("dark")
      setDarkMode(true)
    } else if (localTheme === "light") {
      document.documentElement.classList.remove("dark")
      setDarkMode(false)
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      localStorage.setItem("theme", "dark")
      document.documentElement.classList.add("dark")
      setDarkMode(true)
    } else {
      localStorage.setItem("theme", "light")
      document.documentElement.classList.remove("dark")
      setDarkMode(false)
    }
  }, [])
  return (
    <div className='flex flex-row gap-1 items-center'>
      <label className='relative inline-flex cursor-pointer items-center'>
        <span className='sr-only'>Tryb ciemny</span>
        <input
          id='DarkModeCheckbox'
          type='checkbox'
          checked={isDarkMode}
          onChange={handleDarkModeChange}
          className='peer sr-only'
        />
        <div className="peer relative h-7 w-14 rounded-full bg-gray-100 after:absolute after:top-0.5 after:left-[2px] peer-checked:after:left-[5px] after:h-6 after:w-6 after:rounded-full after:bg-neutral-500 after:dark:bg-neutral-700 after:shadow-highlight after:transition-all after:content-[''] peer-checked:bg-neutral-100 peer-checked:dark:bg-gray-800 shadow-inner peer-checked:after:translate-x-full peer-checked:after:border-none">
          {isDarkMode ? (
            <BoltSlashIcon
              className='absolute inline-block h-6 w-6 left-0.5 top-0.5 rounded-full text-neutral-100'
              aria-hidden='true'
            />
          ) : (
            <BoltIcon
              className='absolute inline-block h-6 w-6 right-0.5 top-0.5 text-yellow-500'
              aria-hidden='true'
            />
          )}
        </div>
      </label>
    </div>
  )
}
