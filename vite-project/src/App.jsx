import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  Switch,
  Chip,
  
} from "@material-tailwind/react";
import './App.css'
import Createfunc from './Create'
import { Connection, Connections, Endpoints } from './Connection'
import '@heroicons/react'
import DayNightToggle from 'react-day-and-night-toggle'
import Profile from './Profile';
import Explore from './Explore';

export const themes = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (isDarkMode) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [isDarkMode]);
  localStorage.setItem("theme", JSON.stringify(theme));

  return { isDarkMode, setIsDarkMode, theme, setTheme };
}


//main app
function App() {
  const [openRight, setOpenRight] = React.useState(false);
  const { isDarkMode, setIsDarkMode, theme, setTheme} = themes()
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia('(max-width: 600px)').matches);
    };

    // Initial check on mount
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  React.useEffect(() => {
    if (isDarkMode) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [isDarkMode]);
 
  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color={isDarkMode ? "white" : "black"}
        className="p-1 font-normal text-xl"
      >
        <a href="/Create" className="flex items-center text-xl">
          Create
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color={isDarkMode ? "white" : "black"}
        className="p-1 font-normal"
      >
        <a href="/Profile" className="flex items-center text-xl">
          Profile
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color={isDarkMode ? "white" : "black"}
        className="p-1 font-normal"
      >

        <a href="/Explore" className="flex items-center text-xl">
          Explore
        </a>
      </Typography>
      <Connection />
      <Endpoints />
    </ul>
  );

  const Mobilenavlist = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6" style={{ display: 'flex', alignItems: 'center' }}>
      <Typography
        as="li"
        variant="small"
        color={isDarkMode ? "white" : "black"}
        className="p-1 font-normal text-xl"
      >
        <a href="/Create" className="flex items-center text-xl">
          Create
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color={isDarkMode ? "white" : "black"}
        className="p-1 font-normal"
      >
        <a href="/Profile" className="flex items-center text-xl">
          Profile
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color={isDarkMode ? "white" : "black"}
        className="p-1 font-normal"
      >
        <a href="/Explore" className="flex items-center text-xl">
          Explore
        </a>
      </Typography>
      <Endpoints />
    </ul>
  );

  const openDrawerRight = () => setOpenRight(true);
  const closeDrawerRight = () => setOpenRight(false);
  return (
    <React.Fragment>
      <div className={theme}>
      <Navbar className={`sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 ${
            isDarkMode ? ' bg-gray-800 border-black' : 'border-white'
          }`}>
        <div className="flex items-center justify-between text-blue-gray-900">
        {
          isMobile? (
            <img src="/src/assets/R.png" width="50px" style={{ marginRight: '0.5rem' }}  />

          ) :  
          <Typography
        as="a"
        href="/"
        className="mr-4 cursor-pointer py-1.5 font-medium text-3xl flex items-center"
        color='pink'
        >
          <img src="/src/assets/R.png" width="50px" style={{ marginRight: '0.5rem' }}  />
        Remarker
        </Typography>
        }
          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>
            <DayNightToggle
      onChange={() => setIsDarkMode(!isDarkMode)}
      checked={isDarkMode}
    />
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={openDrawerRight}
            >
                <button
  type="button"
  className="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-gray-700 dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
  data-hs-collapse="#navbar-with-collapse"
  aria-controls="navbar-with-collapse"
  aria-label="Toggle navigation"
>
  <svg
    className="hs-collapse-open:hidden flex-shrink-0 w-4 h-4"
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1={3} x2={21} y1={6} y2={6} />
    <line x1={3} x2={21} y1={12} y2={12} />
    <line x1={3} x2={21} y1={18} y2={18} />
  </svg>
  <svg
    className="hs-collapse-open:block hidden flex-shrink-0 w-4 h-4"
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
</button>

            </IconButton>
          </div>
        </div>
      </Navbar>
      <div>
      <BrowserRouter>
      <Routes>
        <Route path='/Create' element={< Createfunc />}/>
        <Route path='/Profile' element={< Profile />}/>
        <Route path='/Explore' element={<Explore />} />
      </Routes>
      </BrowserRouter>
              </div>
      <Drawer
        placement="right"
        open={openRight}
        onClose={closeDrawerRight}
        className={`p-4 ${theme}`} // Apply bg-black for dark mode and bg-white for light mode
      >
        <div className="mb-6 flex items-center justify-between">
        <Connection />
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={closeDrawerRight}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        {Mobilenavlist}
        <div className="flex gap-2">
        </div>
      </Drawer>
      <footer className="flex w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 border-t border-blue-gray-50 py-6 text-center md:justify-between">
      <Chip variant="ghost"  className={"font-normal text-${theme} "} color='purple' value="&copy; 2024 Remarker" />
      <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
        <li>
          <a href="https://t.me/polkadotpunks"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 256 256"><path fill="currentColor" d="M234.27 29.22a5 5 0 0 0-5.1-.87L26.51 107.66a10.22 10.22 0 0 0 1.75 19.56L84 138.16V200a12 12 0 0 0 7.51 11.13A12.1 12.1 0 0 0 96 212a12 12 0 0 0 8.62-3.68l28-29l43 37.71a12 12 0 0 0 7.89 3a12.47 12.47 0 0 0 3.74-.59a11.87 11.87 0 0 0 8-8.72l40.62-176.6a5 5 0 0 0-1.6-4.9M28 117.38a2.13 2.13 0 0 1 1.42-2.27l174.65-68.35l-117 83.85l-57.26-11.24a2.12 2.12 0 0 1-1.81-1.99m70.87 85.38A4 4 0 0 1 92 200v-56.3l34.58 30.3Zm88.58 6.14a4 4 0 0 1-6.57 2.09l-86.45-75.81l131.7-94.38Z"/></svg></a>
        </li>
        <li>
          <a href="https://twitter.com/polkadot_punks"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M38.74 16.55v1c0 10.07-7.64 21.61-21.62 21.61c-4.13 0-8.17-1.19-11.62-3.45c.6.08 1.2.12 1.81.11c3.42 0 6.75-1.13 9.44-3.24a7.563 7.563 0 0 1-7.1-5.29c.47.1.96.15 1.44.15c.68 0 1.35-.09 2-.27A7.574 7.574 0 0 1 7 19.72v-.1c1.05.59 2.23.91 3.44.94A7.541 7.541 0 0 1 8.05 10.5c3.86 4.75 9.56 7.64 15.68 7.94a6.38 6.38 0 0 1-.21-1.74a7.546 7.546 0 0 1 7.27-7.82c2.24-.08 4.4.84 5.9 2.51c1.7-.34 3.33-.97 4.83-1.85a7.654 7.654 0 0 1-3.39 4.27c1.51-.21 2.98-.63 4.37-1.26c-1.01 1.55-2.28 2.9-3.76 4m-8.39-.08l2.5-2.51m-2.5 0l2.5 2.51"/></svg></a>
        </li>
        <li>
        <a href="https://discord.gg/dkDrzju9"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M17.54 34.22A47.42 47.42 0 0 1 14.68 38C7.3 37.79 4.5 33 4.5 33a44.83 44.83 0 0 1 4.81-19.52A16.47 16.47 0 0 1 18.69 10l1 2.31"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M17.85 22.67a3.48 3.48 0 0 0-3.37 3.9a3.38 3.38 0 0 0 3.31 3.22a3.53 3.53 0 0 0 3.43-3.9a3.45 3.45 0 0 0-3.37-3.22m-5.65-8.3a28.19 28.19 0 0 1 8.16-2.18A23.26 23.26 0 0 1 24 12a23.26 23.26 0 0 1 3.64.21a28.19 28.19 0 0 1 8.16 2.18m-7.47-2.09l1-2.31a16.47 16.47 0 0 1 9.38 3.51A44.83 44.83 0 0 1 43.5 33s-2.8 4.79-10.18 5a47.42 47.42 0 0 1-2.86-3.81m6.46-2.9a29.63 29.63 0 0 1-8.64 3.49a21.25 21.25 0 0 1-4.28.4h0a21.25 21.25 0 0 1-4.28-.4a29.63 29.63 0 0 1-8.64-3.49"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M30.15 22.67a3.48 3.48 0 0 1 3.37 3.9a3.38 3.38 0 0 1-3.31 3.22a3.53 3.53 0 0 1-3.43-3.9a3.45 3.45 0 0 1 3.37-3.22"/></svg></a>
        </li>
      </ul>
    </footer>
      </div>
      </React.Fragment>
  )
}
export default App
