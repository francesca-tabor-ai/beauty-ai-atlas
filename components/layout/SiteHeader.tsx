"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { SearchDropdown } from "@/components/search/SearchDropdown";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/brands", label: "Brands" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/ai", label: "AI" },
  { href: "/jobs", label: "Jobs" },
  { href: "/projects", label: "Projects" },
  { href: "/timeline", label: "Timeline" },
  { href: "/paths", label: "Paths" },
];

export function SiteHeader() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { theme, setTheme } = useTheme();

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Check app_metadata for admin role
          const role = user.app_metadata?.role;
          setIsAdmin(role === "admin");
        }
      } catch (error) {
        // Silently fail - user is not authenticated or error occurred
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Beauty × AI Atlas</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none rounded-sm motion-reduce:transition-none"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side: Search, Theme, Admin, Mobile Menu */}
        <div className="flex items-center space-x-2">
          {/* Search Input (Desktop) */}
          <div className="hidden md:flex items-center">
            <SearchDropdown />
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="relative"
            >
              <Sun
                className={cn(
                  "h-5 w-5 absolute transition-all duration-200 ease-out",
                  theme === "dark"
                    ? "rotate-90 scale-105 opacity-100"
                    : "rotate-0 scale-100 opacity-0"
                )}
              />
              <Moon
                className={cn(
                  "h-5 w-5 absolute transition-all duration-200 ease-out",
                  theme === "dark"
                    ? "rotate-0 scale-100 opacity-0"
                    : "rotate-90 scale-105 opacity-100"
                )}
              />
            </Button>
          )}

          {/* Admin Link */}
          {isAdmin && (
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                Admin
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu
              className={cn(
                "h-5 w-5 absolute transition-all duration-200 ease-out",
                mobileMenuOpen
                  ? "rotate-90 opacity-0 scale-0"
                  : "rotate-0 opacity-100 scale-100"
              )}
            />
            <X
              className={cn(
                "h-5 w-5 absolute transition-all duration-200 ease-out",
                mobileMenuOpen
                  ? "rotate-0 opacity-100 scale-100"
                  : "rotate-90 opacity-0 scale-0"
              )}
            />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "border-t md:hidden overflow-hidden transition-all duration-[320ms] ease-out motion-reduce:transition-none",
          mobileMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        {mobileMenuOpen && (
          <div className="container mx-auto px-4 py-4 space-y-3">
            {/* Mobile Search */}
            <div className="md:hidden">
              <SearchDropdown />
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground hover:bg-accent rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none motion-reduce:transition-none"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

