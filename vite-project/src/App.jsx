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
  Collapse,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Bars4Icon,
  GlobeAmericasIcon,
  NewspaperIcon,
  PhoneIcon,
  RectangleGroupIcon,
  SquaresPlusIcon,
  MoonIcon,
  TagIcon,
  UserGroupIcon,
  SunIcon
} from "@heroicons/react/24/solid";

import './App.css'
import Createfunc from './Create'
import { Connection, Connections, Endpoints } from './Connection'
import { Analytics } from "@vercel/analytics/react"
import '@heroicons/react'
import Profile from './Profile';
import Explore from './Explore';
import PAHCreate from './Polkadot Asset Hub/Create';
import PAHExplore from './Polkadot Asset Hub/Explore';
import PAHProfile from './Polkadot Asset Hub/Profile';
import PAHItems from './Polkadot Asset Hub/item'
import PAHDetails from './Polkadot Asset Hub/Details';
import PAHTeleport from './Polkadot Asset Hub/Teleport'
import AHKCreate from './Kusama Asset Hub/Create';
import AHKExplore from './Kusama Asset Hub/Explore';
import AHKProfile from './Kusama Asset Hub/Profile';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import RImage from '/src/assets/R.png';
import DotIcon from '/src/assets/Untitled design.png';
import KSMIcon from '/src/assets/Untitled design (1).png';

export const themes = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(JSON.parse(localStorage.getItem("theme")));

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


const navListMenuItems = [
  {
    title: "Polkadot Asset Hub",
    description: "Asset parachain on polkadot network",
    // icon: "/src/assets/images.png",
    icon: `${DotIcon}`,
  },
  {
    title: "Kusama Asset Hub",
    description: "Asset parachain on Kusama network",
    // icon: "/src/assets/images (1).png",
    icon: `${KSMIcon}`,
    mode: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
    <path fill-rule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.196 9a1.5 1.5 0 0 1-1.299 2.25H2.804a1.5 1.5 0 0 1-1.3-2.25l5.197-9ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 1 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" />
  </svg>
  ,  
  },
];
 
function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [network,setNetwork]= useState(JSON.parse(localStorage.getItem("Network")) || "Polkadot Asset Hub")
  localStorage.setItem("Network", JSON.stringify(network))
  const renderItems = navListMenuItems.map(
    ({ icon, title, description, mode }, key) => (
      title === "Kusama Asset Hub"? <MenuItem className={`flex items-center gap-3 rounded-lg ${network === title ? "border-2 border-pink-400" : "" }${title === "Kusama Asset Hub"? "disabled" : ""}`}>
      <div className="flex items-center justify-center rounded-lg !bg-blue-gray-50 p-2">
{/* Conditionally render image if 'icon' is a string representing an image path */}
{typeof icon === 'string' ? (
  <img src={icon} alt={title} className="h-6 text-gray-900 w-6" />
) : (
  // Render React element if 'icon' is a valid React component
  React.createElement(icon, {
    strokeWidth: 2,
    className: "h-6 text-gray-900 w-6",
  })
)}
</div>

        <div>
        <Typography
            variant="paragraph"
            className="text-xs !font-medium text-blue-gray-500"
            style={{float: "right"}}
          >
            {mode}
          </Typography>
          <Typography
            variant="h6"
            color="blue-gray"
            className="flex items-center text-sm font-bold"
          >
            {title}
          </Typography>
          <Typography
            variant="paragraph"
            className="text-xs !font-medium text-blue-gray-500"
          >
            {description}
          </Typography>
        </div>
      </MenuItem> :<a href={`/${title}/Explore`} key={key} onClick={() => setNetwork(title)}>
        <MenuItem className={`flex items-center gap-3 rounded-lg ${network === title ? "border-2 border-pink-400" : "" }`}>
        <div className="flex items-center justify-center rounded-lg !bg-blue-gray-50 p-2">
  {/* Conditionally render image if 'icon' is a string representing an image path */}
  {typeof icon === 'string' ? (
    <img src={icon} alt={title} className="h-6 text-gray-900 w-6" />
  ) : (
    // Render React element if 'icon' is a valid React component
    React.createElement(icon, {
      strokeWidth: 2,
      className: "h-6 text-gray-900 w-6",
    })
  )}
</div>

          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="flex items-center text-sm font-bold"
            >
              {title}
            </Typography>
            <Typography
              variant="paragraph"
              className="text-xs !font-medium text-blue-gray-500"
            >
              {description}
            </Typography>
          </div>
        </MenuItem>
      </a>
    ),
  );
 
  return (
    <React.Fragment>
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ mainAxis: 20 }}
        placement="bottom"
        allowHover={true}
      >
        <MenuHandler>
          <Typography as="div" variant="small" className="font-medium">
            <ListItem
              className="flex items-center gap-2 py-2 pr-4 font-medium text-gray-900"
              selected={isMenuOpen || isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((cur) => !cur)}
            >
              Networks
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`block h-3 w-3 transition-transform lg:hidden ${
                  isMobileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden max-w-screen-xl rounded-xl lg:block">
          <ul className="grid grid-cols-3 gap-y-2 outline-none outline-0">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <div className="block lg:hidden">
        <Collapse open={isMobileMenuOpen}>{renderItems}</Collapse>
      </div>
    </React.Fragment>
  );
}

//main app
function App() {
  const [openRight, setOpenRight] = React.useState(false);
  const { isDarkMode, setIsDarkMode, theme, setTheme} = themes()
  const [isMobile, setIsMobile] = useState(false)
  const network = JSON.parse(localStorage.getItem("Network"))

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
        <a href={`/${network}/Create`} className="flex items-center text-xl">
          Create
        </a>
      </Typography>

      <Typography
        as="li"
        variant="small"
        color={isDarkMode ? "white" : "black"}
        className="p-1 font-normal"
      >
        <a href={`/${network}/Profile`} className="flex items-center text-xl">
        Portfolio
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color={isDarkMode ? "white" : "black"}
        className="p-1 font-normal"
      >

        <a href={`/${network}/Explore`} className="flex items-center text-xl">
          Collections
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color={isDarkMode ? "white" : "black"}
        className="p-1 font-normal"
      >

        <a href={`/${network}/Teleport`} className="flex items-center text-xl">
          Teleport
        </a>
      </Typography>
      <NavListMenu />
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
        <a href={`/${network}/Create`} className="flex items-center text-xl">
          Create
        </a>
      </Typography>

      <Typography
        as="li"
        variant="small"
        color={isDarkMode ? "white" : "black"}
        className="p-1 font-normal"
      >
        <a href={`/${network}/Profile`} className="flex items-center text-xl">
          Portfolio
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color={isDarkMode ? "white" : "black"}
        className="p-1 font-normal"
      >
        <a href={`/${network}/Explore`} className="flex items-center text-xl">
        Collections
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color={isDarkMode ? "white" : "black"}
        className="p-1 font-normal"
      >
        <a href={`/${network}/Teleport`} className="flex items-center text-xl">
          Teleport
        </a>
      </Typography>
      <NavListMenu />
      <Endpoints />
    </ul>
  );

  const openDrawerRight = () => setOpenRight(true);
  const closeDrawerRight = () => setOpenRight(false);
  
  return (
    <React.Fragment>
      <Analytics/>
      <ThirdwebProvider clientId="019cf278511f800d2a474ef346ebc669">
      <div >
      <Navbar className={`sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 ${
            isDarkMode ? ' bg-gray-800 border-black' : 'border-white'
          }`}>
        <div className="flex items-center justify-between text-blue-gray-900">
        {
          isMobile? (
            <img src={RImage} alt="R Logo" width="50px" style={{ marginRight: '0.5rem' }} />

          ) :  
          <Typography
        as="a"
        href="/"
        className="mr-4 cursor-pointer py-1.5 font-medium text-3xl flex items-center"
        color='pink'
        >
          <img src={RImage} width="50px" style={{ marginRight: '0.5rem' }}  />
        Remarker
        </Typography>
        }
          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>
          {
            // Theme Changer JSX
//         <div className="flex items-center justify-center rounded-lg !bg-blue-gray-50 p-2" onClick={() => setIsDarkMode(!isDarkMode)}>
//   {/* Conditionally render sun or moon icon based on 'isDarkMode' state */}
//   {isDarkMode ? (
//     // If dark mode is enabled, render moon icon
//     React.createElement(MoonIcon, {
//       strokeWidth: 2,
//       className: "h-5 text-gray-900 w-5",
//     })
//   ) : (
//     // If dark mode is disabled, render sun icon
//     React.createElement(SunIcon, {
//       strokeWidth: 2,
//       className: "h-5 text-gray-900 w-5",
//     })
//   )}
// </div>
      }
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
        <Route path="/Polkadot%20Asset%20Hub/Create" element={<PAHCreate />} />
        <Route path="/Polkadot%20Asset%20Hub/Profile" element={<PAHProfile />} />
        <Route path="/Polkadot%20Asset%20Hub/Explore" element={<PAHExplore />} />
        <Route path="/Polkadot%20Asset%20Hub/marketplace/:id/:name" element={<PAHItems />} />
        <Route path="/Polkadot%20Asset%20Hub/Details/:collectionId/:itemId" element={<PAHDetails />} />
        <Route path="/Polkadot%20Asset%20Hub/Teleport" element={<PAHTeleport />} />
        <Route path="/Kusama%20Asset%20Hub/Create" element={<AHKCreate />} />
        <Route path="/Kusama%20Asset%20Hub/Profile" element={<AHKProfile />} />
        <Route path="/Kusama%20Asset%20Hub/Explore" element={<AHKExplore />} />
        <Route path="/" element={<PAHExplore />} />

      </Routes>
      </BrowserRouter>
              </div>
      <Drawer
        placement="right"
        open={openRight}
        onClose={closeDrawerRight}
        className={`p-4 `} // Apply bg-black for dark mode and bg-white for light mode
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
        <div style={{ position: 'absolute', bottom: 0, left: 0 }}>
      </div>
        <div className="flex gap-2">
        </div>
      </Drawer>
      <footer className="flex w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 border-t border-blue-gray-50 py-6 text-center md:justify-between">
      <Chip variant="ghost"  className={"font-normal text- "} color='purple' value="&copy; 2024 Remarker" />
      <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
        <li>
          <a href="https://www.youtube.com/channel/UCgBdYI6j7M5xnaDPcXat4GQ"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 50 50">
<path d="M 24.402344 9 C 17.800781 9 11.601563 9.5 8.300781 10.199219 C 6.101563 10.699219 4.199219 12.199219 3.800781 14.5 C 3.402344 16.898438 3 20.5 3 25 C 3 29.5 3.398438 33 3.898438 35.5 C 4.300781 37.699219 6.199219 39.300781 8.398438 39.800781 C 11.902344 40.5 17.898438 41 24.5 41 C 31.101563 41 37.097656 40.5 40.597656 39.800781 C 42.800781 39.300781 44.699219 37.800781 45.097656 35.5 C 45.5 33 46 29.402344 46.097656 24.902344 C 46.097656 20.402344 45.597656 16.800781 45.097656 14.300781 C 44.699219 12.101563 42.800781 10.5 40.597656 10 C 37.097656 9.5 31 9 24.402344 9 Z M 24.402344 11 C 31.601563 11 37.398438 11.597656 40.199219 12.097656 C 41.699219 12.5 42.898438 13.5 43.097656 14.800781 C 43.699219 18 44.097656 21.402344 44.097656 24.902344 C 44 29.199219 43.5 32.699219 43.097656 35.199219 C 42.800781 37.097656 40.800781 37.699219 40.199219 37.902344 C 36.597656 38.601563 30.597656 39.097656 24.597656 39.097656 C 18.597656 39.097656 12.5 38.699219 9 37.902344 C 7.5 37.5 6.300781 36.5 6.101563 35.199219 C 5.300781 32.398438 5 28.699219 5 25 C 5 20.398438 5.402344 17 5.800781 14.902344 C 6.101563 13 8.199219 12.398438 8.699219 12.199219 C 12 11.5 18.101563 11 24.402344 11 Z M 19 17 L 19 33 L 33 25 Z M 21 20.402344 L 29 25 L 21 29.597656 Z"></path>
</svg></a>
        </li>
        <li>
          <a href="https://x.com/Remarker_io"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 50 50">
<path d="M 11 4 C 7.1456661 4 4 7.1456661 4 11 L 4 39 C 4 42.854334 7.1456661 46 11 46 L 39 46 C 42.854334 46 46 42.854334 46 39 L 46 11 C 46 7.1456661 42.854334 4 39 4 L 11 4 z M 11 6 L 39 6 C 41.773666 6 44 8.2263339 44 11 L 44 39 C 44 41.773666 41.773666 44 39 44 L 11 44 C 8.2263339 44 6 41.773666 6 39 L 6 11 C 6 8.2263339 8.2263339 6 11 6 z M 13.085938 13 L 22.308594 26.103516 L 13 37 L 15.5 37 L 23.4375 27.707031 L 29.976562 37 L 37.914062 37 L 27.789062 22.613281 L 36 13 L 33.5 13 L 26.660156 21.009766 L 21.023438 13 L 13.085938 13 z M 16.914062 15 L 19.978516 15 L 34.085938 35 L 31.021484 35 L 16.914062 15 z"></path>
</svg></a>
        </li>
        <li>
        <a href="https://discord.gg/ryjwDBCtUp"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 50 50">
<path d="M 18.90625 7 C 18.90625 7 12.539063 7.4375 8.375 10.78125 C 8.355469 10.789063 8.332031 10.800781 8.3125 10.8125 C 7.589844 11.480469 7.046875 12.515625 6.375 14 C 5.703125 15.484375 4.992188 17.394531 4.34375 19.53125 C 3.050781 23.808594 2 29.058594 2 34 C 1.996094 34.175781 2.039063 34.347656 2.125 34.5 C 3.585938 37.066406 6.273438 38.617188 8.78125 39.59375 C 11.289063 40.570313 13.605469 40.960938 14.78125 41 C 15.113281 41.011719 15.429688 40.859375 15.625 40.59375 L 18.0625 37.21875 C 20.027344 37.683594 22.332031 38 25 38 C 27.667969 38 29.972656 37.683594 31.9375 37.21875 L 34.375 40.59375 C 34.570313 40.859375 34.886719 41.011719 35.21875 41 C 36.394531 40.960938 38.710938 40.570313 41.21875 39.59375 C 43.726563 38.617188 46.414063 37.066406 47.875 34.5 C 47.960938 34.347656 48.003906 34.175781 48 34 C 48 29.058594 46.949219 23.808594 45.65625 19.53125 C 45.007813 17.394531 44.296875 15.484375 43.625 14 C 42.953125 12.515625 42.410156 11.480469 41.6875 10.8125 C 41.667969 10.800781 41.644531 10.789063 41.625 10.78125 C 37.460938 7.4375 31.09375 7 31.09375 7 C 31.019531 6.992188 30.949219 6.992188 30.875 7 C 30.527344 7.046875 30.234375 7.273438 30.09375 7.59375 C 30.09375 7.59375 29.753906 8.339844 29.53125 9.40625 C 27.582031 9.09375 25.941406 9 25 9 C 24.058594 9 22.417969 9.09375 20.46875 9.40625 C 20.246094 8.339844 19.90625 7.59375 19.90625 7.59375 C 19.734375 7.203125 19.332031 6.964844 18.90625 7 Z M 18.28125 9.15625 C 18.355469 9.359375 18.40625 9.550781 18.46875 9.78125 C 16.214844 10.304688 13.746094 11.160156 11.4375 12.59375 C 11.074219 12.746094 10.835938 13.097656 10.824219 13.492188 C 10.816406 13.882813 11.039063 14.246094 11.390625 14.417969 C 11.746094 14.585938 12.167969 14.535156 12.46875 14.28125 C 17.101563 11.410156 22.996094 11 25 11 C 27.003906 11 32.898438 11.410156 37.53125 14.28125 C 37.832031 14.535156 38.253906 14.585938 38.609375 14.417969 C 38.960938 14.246094 39.183594 13.882813 39.175781 13.492188 C 39.164063 13.097656 38.925781 12.746094 38.5625 12.59375 C 36.253906 11.160156 33.785156 10.304688 31.53125 9.78125 C 31.59375 9.550781 31.644531 9.359375 31.71875 9.15625 C 32.859375 9.296875 37.292969 9.894531 40.3125 12.28125 C 40.507813 12.460938 41.1875 13.460938 41.8125 14.84375 C 42.4375 16.226563 43.09375 18.027344 43.71875 20.09375 C 44.9375 24.125 45.921875 29.097656 45.96875 33.65625 C 44.832031 35.496094 42.699219 36.863281 40.5 37.71875 C 38.5 38.496094 36.632813 38.84375 35.65625 38.9375 L 33.96875 36.65625 C 34.828125 36.378906 35.601563 36.078125 36.28125 35.78125 C 38.804688 34.671875 40.15625 33.5 40.15625 33.5 C 40.570313 33.128906 40.605469 32.492188 40.234375 32.078125 C 39.863281 31.664063 39.226563 31.628906 38.8125 32 C 38.8125 32 37.765625 32.957031 35.46875 33.96875 C 34.625 34.339844 33.601563 34.707031 32.4375 35.03125 C 32.167969 35 31.898438 35.078125 31.6875 35.25 C 29.824219 35.703125 27.609375 36 25 36 C 22.371094 36 20.152344 35.675781 18.28125 35.21875 C 18.070313 35.078125 17.8125 35.019531 17.5625 35.0625 C 16.394531 34.738281 15.378906 34.339844 14.53125 33.96875 C 12.234375 32.957031 11.1875 32 11.1875 32 C 10.960938 31.789063 10.648438 31.699219 10.34375 31.75 C 9.957031 31.808594 9.636719 32.085938 9.53125 32.464844 C 9.421875 32.839844 9.546875 33.246094 9.84375 33.5 C 9.84375 33.5 11.195313 34.671875 13.71875 35.78125 C 14.398438 36.078125 15.171875 36.378906 16.03125 36.65625 L 14.34375 38.9375 C 13.367188 38.84375 11.5 38.496094 9.5 37.71875 C 7.300781 36.863281 5.167969 35.496094 4.03125 33.65625 C 4.078125 29.097656 5.0625 24.125 6.28125 20.09375 C 6.90625 18.027344 7.5625 16.226563 8.1875 14.84375 C 8.8125 13.460938 9.492188 12.460938 9.6875 12.28125 C 12.707031 9.894531 17.140625 9.296875 18.28125 9.15625 Z M 18.5 21 C 15.949219 21 14 23.316406 14 26 C 14 28.683594 15.949219 31 18.5 31 C 21.050781 31 23 28.683594 23 26 C 23 23.316406 21.050781 21 18.5 21 Z M 31.5 21 C 28.949219 21 27 23.316406 27 26 C 27 28.683594 28.949219 31 31.5 31 C 34.050781 31 36 28.683594 36 26 C 36 23.316406 34.050781 21 31.5 21 Z M 18.5 23 C 19.816406 23 21 24.265625 21 26 C 21 27.734375 19.816406 29 18.5 29 C 17.183594 29 16 27.734375 16 26 C 16 24.265625 17.183594 23 18.5 23 Z M 31.5 23 C 32.816406 23 34 24.265625 34 26 C 34 27.734375 32.816406 29 31.5 29 C 30.183594 29 29 27.734375 29 26 C 29 24.265625 30.183594 23 31.5 23 Z"></path>
</svg></a>
        </li>
      </ul>
    </footer>
      </div>
      </ThirdwebProvider>
      </React.Fragment>
  )
}
export default App
