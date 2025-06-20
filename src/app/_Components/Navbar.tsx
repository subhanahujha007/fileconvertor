import React from 'react'
import Image from 'next/image'
import {BsGithub} from"react-icons/bs"
import {GrMenu} from "react-icons/gr"
import Link from 'next/link'
import {
    Sheet,
    SheetContent,SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
}
from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ui/mode-toogle'
const Navbar = () => {
  return (
    <nav className='fixed top-0 left-1/2 -translate-x-1/2 z-50 
  w-full h-24 
  backdrop-blur-md 
  bg-white bg-opacity-30 dark:bg-gray-900 dark:bg-opacity-50
  text-black dark:text-white
  flex justify-between items-center px-6 sm:px-10 md:px-16 lg:px-24'>
<Link href="/">
<Image
src={"/Logo.png"}
alt='Logo'
className='cursor-pointer w-40'
height={100}
width={170}
/>
</Link>

<div className='gap-1 md:gap-2 lg:gap-4 hidden md:flex'>
<Link href="/">
<Button variant={"ghost"} className='text-md font-semibold'>
Home
</Button>
</Link>

<Link href="/Privacy-policy">
<Button variant={"ghost"} className='text-md font-semibold'>
Privacy Policy
</Button>
</Link>

<Link href="/About">
<Button variant={"ghost"} className='text-md font-semibold'>
About
</Button>
</Link>
</div>
<div className='flex flex-row gap-4'>
<ModeToggle/>
<Link href="https://github.com/subhanahujha007/">
<Button className='bg-orange-700 text-white items-center rounded-full w-fit hidden md:flex'
size={"lg"}>
Go to Repo 
<span className='text-xl'> <BsGithub size={20}/> </span> 
</Button>
</Link>
</div>

{/*Mobile View*/ }
<Sheet>
  <SheetTrigger className='block md:hidden p-3'>
    <span className='text-2xl'>
        <GrMenu/>
    </span>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Click the tabs to visit these pages</SheetTitle>
      <SheetDescription>
        These are the Links 
      </SheetDescription>
      <div className="width-full space-y-3">
        <Link href="/">
<Button variant={"ghost"} className='text-md font-semibold'>
Home
</Button>
</Link>

<Link href="/Privacy-policy">
<Button variant={"ghost"} className='text-md font-semibold'>
Privacy Policy
</Button>
</Link>

<Link href="/About">
<Button variant={"ghost"} className='text-md font-semibold'>
About
</Button>
</Link>

<Link href="https://github.com/subhanahujha007/">
<Button className='bg-orange-700 text-white items-center rounded-full w-fit hidden md:flex'
size={"lg"}>
Go to Repo 
<span className='text-xl'> <BsGithub size={7}/> </span> 
</Button>
</Link>
</div>
    </SheetHeader>
  </SheetContent>
</Sheet>

    </nav>
  )
}

export default Navbar