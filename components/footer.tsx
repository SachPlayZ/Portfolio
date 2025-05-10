"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Globe } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <motion.footer
      className="glass-nav py-8 mt-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold gradient-text mb-2">
              Sachindra Kumar Singh
            </h3>
            <p className="text-gray-400 max-w-md">
              Full Stack Web Developer & Web3 Smart Contract Developer
              passionate about building innovative solutions.
            </p>
          </div>

          <div className="flex space-x-6">
            <Link
              href="https://github.com/sachplayz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Github size={24} />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://linkedin.com/in/singhsach"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Linkedin size={24} />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="mailto:ssachinsingh99@gmail.com"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Mail size={24} />
              <span className="sr-only">Email</span>
            </Link>
            <Link
              href="https://sachplayz.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <Globe size={24} />
              <span className="sr-only">Portfolio</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} Sachindra Kumar Singh. All rights
            reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
