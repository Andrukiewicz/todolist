"use client"

import Image from "next/image"
import Theme from "./Theme"

export default function Header() {
  return (
    <div className='p-4 bg-gray-50 dark:bg-gray-900 shadow-highlight h-16'>
      <div className='max-w-4xl flex w-full m-auto justify-between'>
        <div className='flex items-center space-x-2'>
          <Image src='/trello.png' width={30} height={30} alt='Trollo' />
          <h1 className='text-2xl font-bold'>Trollo</h1>
        </div>
        <div className='flex space-x-4'>
          <Theme />
        </div>
      </div>
    </div>
  )
}
