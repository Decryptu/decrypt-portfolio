"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  Contact,
  Ellipsis,
  FlaskConical,
  Home,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NavigationBar = () => {
  const [state, setState] = useState<{
    currentPath: string;
    isSubMenuVisible: boolean;
    isFirstLoad: boolean;
    tooltip: string | null;
  }>({
    currentPath: "/",
    isSubMenuVisible: false,
    isFirstLoad: true,
    tooltip: null,
  });
  const ellipsisRef = useRef<HTMLButtonElement>(null);
  const subMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setState((prev) => ({
        ...prev,
        currentPath: window.location.pathname,
        isFirstLoad: false,
      }));
    }
  }, []);

  const handleLinkClick = (path: string) =>
    setState((prev) => ({ ...prev, currentPath: path }));
  const handleEllipsisClick = () =>
    setState((prev) => ({
      ...prev,
      isSubMenuVisible: !prev.isSubMenuVisible,
    }));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        subMenuRef.current &&
        ellipsisRef.current &&
        !subMenuRef.current.contains(event.target as Node) &&
        !ellipsisRef.current.contains(event.target as Node)
      ) {
        setState((prev) => ({
          ...prev,
          isSubMenuVisible: false,
        }));
      }
    };

    if (state.isSubMenuVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [state.isSubMenuVisible]);

  const navItems = [
    { path: "/", Icon: Home, label: "Home" },
    {
      path: "/projects",
      Icon: BriefcaseBusiness,
      label: "Projects",
    },
    {
      path: "/experiments",
      Icon: FlaskConical,
      label: "Laboratory",
    },
    { path: "/contact", Icon: Contact, label: "Contact" },
  ] as const;

  const isMobile = () => window.innerWidth < 768 || "ontouchstart" in window;

  return (
    <div
      className={`navbar-parent fixed inset-x-0 bottom-4 flex items-center justify-center transition-opacity duration-1000 ${
        state.isFirstLoad ? "opacity-0" : "opacity-100"
      } animate-fadeIn`}
      style={{ zIndex: 1000 }}
    >
      {/* Gradient stroke wrapper */}
      <div className="rounded-lg bg-gradient-to-br from-0% from-zinc-500 to-50% to-zinc-800 p-px shadow-lg">
        <div className="flex items-center space-x-2 rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-800 p-1">
          {navItems.map(({ path, Icon, label }) => (
            <Link
              className={`relative flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-zinc-700/75 ${
                state.currentPath === path ? "rounded-md bg-zinc-700/75" : ""
              }`}
              href={path}
              key={path}
              onClick={() => handleLinkClick(path)}
              onMouseEnter={() =>
                !isMobile() &&
                setState((prev) => ({
                  ...prev,
                  tooltip: label,
                }))
              }
              onMouseLeave={() =>
                setState((prev) => ({
                  ...prev,
                  tooltip: null,
                }))
              }
            >
              <Icon
                className={`h-6 w-6 ${
                  state.currentPath === path
                    ? "stroke-zinc-200"
                    : "stroke-zinc-50"
                }`}
                strokeWidth={1.25}
              />
              {state.tooltip === label && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 transform rounded bg-gradient-to-b from-zinc-800 to-zinc-800 px-2 py-1 text-xs text-zinc-50 shadow-lg">
                  {label}
                </span>
              )}
            </Link>
          ))}
          {/* Separator */}
          <div className="h-6 w-px bg-zinc-400" />
          {/* More Options Icon */}
          <button
            className="relative flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-zinc-700"
            onClick={handleEllipsisClick}
            onMouseEnter={() =>
              !isMobile() &&
              setState((prev) => ({
                ...prev,
                tooltip: "More",
              }))
            }
            onMouseLeave={() =>
              setState((prev) => ({ ...prev, tooltip: null }))
            }
            ref={ellipsisRef}
            type="button"
          >
            <Ellipsis className="h-6 w-6 stroke-zinc-50" strokeWidth={1.5} />
            {state.tooltip === "More" && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 transform rounded bg-gradient-to-b from-zinc-800 to-zinc-800 px-2 py-1 text-xs text-zinc-50 shadow-lg">
                More
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sub Menu */}
      {state.isSubMenuVisible && (
        <div className="absolute bottom-14 left-1/2 translate-x-6 transform shadow-lg">
          {/* Gradient stroke wrapper for submenu */}
          <div className="rounded-lg bg-gradient-to-br from-0% from-zinc-600 to-35% to-zinc-800 p-px">
            <div
              className="rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-800 py-2 text-zinc-50 hover:text-zinc-50"
              ref={subMenuRef}
            >
              <SubMenuLink
                href="https://twitter.com/DecryptTV"
                label="Twitter"
              />
              <SubMenuLink href="https://github.com/Decryptu" label="GitHub" />
              <SubMenuLink
                href="https://dribbble.com/Decrypt"
                label="Dribbble"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SubMenuLink = ({ href, label }: { href: string; label: string }) => (
  <a
    className="mx-2 flex items-center justify-center rounded-md px-2 py-2 transition-colors hover:bg-zinc-700/75 hover:text-zinc-50"
    href={href}
    rel="noopener noreferrer"
    target="_blank"
  >
    {label}
    <ArrowUpRight className="ml-1 h-4 w-4" strokeWidth={1.25} />
  </a>
);

export default NavigationBar;
