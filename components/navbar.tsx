"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Code, Briefcase, BookOpen, Award, Mail } from "lucide-react";

const navItems = [
  { name: "Home", href: "#home", icon: Home },
  { name: "Skills", href: "#skills", icon: Code },
  { name: "Projects", href: "#projects", icon: Briefcase },
  { name: "Journey", href: "#journey", icon: BookOpen },
  { name: "Experience", href: "#experience", icon: Award },
  { name: "Contact", href: "#contact", icon: Mail },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed right-8 top-1/3 -translate-y-1/2 z-50 flex flex-col items-center gap-4 ${
        isScrolled
          ? "glass-nav p-2 rounded-full"
          : "bg-black/20 p-2 rounded-full"
      }`}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {navItems.map((item) => (
        <motion.div
          key={item.name}
          className="group relative flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
        >
          <Link
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            className="flex items-center justify-center p-2 text-gray-300 hover:text-purple-400 transition-colors duration-300"
          >
            <item.icon size={20} />
            <span className="absolute right-full mr-2 bg-black/80 px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.name}
            </span>
          </Link>
        </motion.div>
      ))}
    </motion.nav>
  );
}
