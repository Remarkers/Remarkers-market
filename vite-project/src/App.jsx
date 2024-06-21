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
  const [network,setNetwork]= useState(JSON.parse(localStorage.getItem("Network")))
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
      </MenuItem> :<a href={`/${title}`} key={key} onClick={() => setNetwork(title)}>
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
      <ThirdwebProvider clientId="019cf278511f800d2a474ef346ebc669">
      <div className={theme}>
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
        <div style={{ position: 'absolute', bottom: 0, left: 0 }}>
      </div>
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
      </ThirdwebProvider>
      </React.Fragment>
  )
}
export default App
