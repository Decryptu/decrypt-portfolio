"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Home,
  BriefcaseBusiness,
  Contact,
  Ellipsis,
  ArrowUpRight,
} from "lucide-react";

const NavigationBar = () => {
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [isSubMenuVisible, setSubMenuVisible] = useState<boolean>(false);
  const [isFirstLoad, setFirstLoad] = useState<boolean>(true);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const ellipsisRef = useRef<HTMLButtonElement>(null);
  const subMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set the initial path based on the window's location to sync server/client rendering
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      setCurrentPath(path);
      setFirstLoad(false);
    }
  }, []);

  const handleLinkClick = (path: string) => {
    setCurrentPath(path); // Update current path on click
  };

  const handleEllipsisClick = () => {
    setSubMenuVisible(!isSubMenuVisible);
  };

  // This effect sets up an event listener for clicks on the document
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        subMenuRef.current &&
        ellipsisRef.current &&
        !subMenuRef.current.contains(event.target as Node) &&
        !ellipsisRef.current.contains(event.target as Node)
      ) {
        setSubMenuVisible(false);
      }
    };

    // Add event listener when the submenu is visible
    if (isSubMenuVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSubMenuVisible]); // Re-run effect if isSubMenuVisible changes

  return (
    <div
      className={`fixed inset-x-0 bottom-4 flex justify-center items-center navbar-parent transition-opacity duration-1000 ${
        isFirstLoad ? "opacity-0" : "opacity-100"
      } animate-fadeIn`}
      style={{ zIndex: 1000 }}
    >
      <div className="flex items-center space-x-2 rounded-2xl bg-white px-3 py-2 shadow-[0_3px_10px_rgb(0,0,0,0.1)]">
        {/* Home Icon */}
        <Link href="/" passHref legacyBehavior>
          <a
            className={`relative flex items-center justify-center w-8 h-8 ${
              currentPath === "/" ? "bg-zinc-200 rounded-md" : ""
            }`}
            onMouseEnter={() => setTooltip("Home")}
            onMouseLeave={() => setTooltip(null)}
            onClick={() => handleLinkClick("/")}
          >
            <Home strokeWidth={1.25} className="w-6 h-6" />
            {tooltip === "Home" && (
              <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-white text-black text-xs rounded shadow-lg">
                Home
              </span>
            )}
          </a>
        </Link>

        {/* Briefcase Icon */}
        <Link href="/projects" passHref legacyBehavior>
          <a
            className={`relative flex items-center justify-center w-8 h-8 ${
              currentPath === "/projects" ? "bg-zinc-200 rounded-md" : ""
            }`}
            onMouseEnter={() => setTooltip("Projects")}
            onMouseLeave={() => setTooltip(null)}
            onClick={() => handleLinkClick("/projects")}
          >
            <BriefcaseBusiness strokeWidth={1.25} className="w-6 h-6" />
            {tooltip === "Projects" && (
              <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-white text-black text-xs rounded shadow-lg">
                Projects
              </span>
            )}
          </a>
        </Link>

        {/* Contact Icon */}
        <Link href="/contact" passHref legacyBehavior>
          <a
            className={`relative flex items-center justify-center w-8 h-8 ${
              currentPath === "/contact" ? "bg-zinc-200 rounded-md" : ""
            }`}
            onMouseEnter={() => setTooltip("Contact")}
            onMouseLeave={() => setTooltip(null)}
            onClick={() => handleLinkClick("/contact")}
          >
            <Contact strokeWidth={1.25} className="w-6 h-6" />
            {tooltip === "Contact" && (
              <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-white text-black text-xs rounded shadow-lg">
                Contact
              </span>
            )}
          </a>
        </Link>

        {/* Separator */}
        <div className="w-px h-6 bg-zinc-200" />

        {/* More Options Icon */}
        <button
          ref={ellipsisRef}
          onClick={handleEllipsisClick}
          className="relative flex items-center justify-center w-8 h-8"
          onMouseEnter={() => setTooltip("More")}
          onMouseLeave={() => setTooltip(null)}
        >
          <Ellipsis strokeWidth={1.5} className="w-6 h-6" />
          {tooltip === "More" && (
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-white text-black text-xs rounded shadow-lg">
              More
            </span>
          )}
        </button>
      </div>

      {/* Sub Menu */}
      {isSubMenuVisible && (
        <div
          ref={subMenuRef}
          className="absolute bottom-14 left-1/2 transform translate-x-2 bg-white rounded-lg shadow-2xl py-2"
        >
          <SubMenuLink href="https://twitter.com/DecryptTV" label="Twitter" />
          <SubMenuLink href="https://github.com/Decryptu" label="GitHub" />
          <SubMenuLink href="https://dribbble.com/Decrypt" label="Dribbble" />
        </div>
      )}
    </div>
  );
};

const SubMenuLink = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center px-2 mx-2 py-2 hover:bg-zinc-200 hover:rounded-md"
  >
    {label}
    <ArrowUpRight strokeWidth={1.25} className="ml-1 w-4 h-4" />
  </a>
);

export default NavigationBar;
