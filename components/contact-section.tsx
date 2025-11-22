"use client";

import React, { useState } from "react";
import { Instrument_Serif, Roboto_Condensed } from "next/font/google";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
});

const robotoCondensed = Roboto_Condensed({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

export default function ContactSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="min-h-screen w-full bg-[#fdf5e7] flex flex-col justify-between pt-32 pb-8 relative overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-white/50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-64 bg-linear-to-t from-emerald-500/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 flex flex-col items-center relative z-10 flex-1 justify-center">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl">
          <h2
            className={`${instrumentSerif.className} text-5xl md:text-7xl font-normal text-slate-800 mb-6 tracking-tight`}
          >
            Wanna Know More? <br />
            <span className="text-[#3ba58b] italic">Contact Me.</span>
          </h2>
          <p className={`${robotoCondensed.className} text-slate-600 text-xl`}>
            Have a project in mind or just want to say hi? Drop me a message
            below.
          </p>
        </div>

        {/* Form - Blended & Minimal */}
        <div className="w-full max-w-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Input Group */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              {/* Name Input */}
              <div className="flex-1 relative group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`${robotoCondensed.className} w-full py-4 bg-transparent border-b-2 border-slate-300 text-slate-800 text-xl placeholder:text-slate-400 focus:outline-hidden focus:border-[#3ba58b] transition-all duration-300`}
                  placeholder="What's your name?"
                />
              </div>

              {/* Email Input */}
              <div className="flex-1 relative group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`${robotoCondensed.className} w-full py-4 bg-transparent border-b-2 border-slate-300 text-slate-800 text-xl placeholder:text-slate-400 focus:outline-hidden focus:border-[#3ba58b] transition-all duration-300`}
                  placeholder="Your email address?"
                />
              </div>
            </div>

            {/* Message Input */}
            <div className="relative group">
              <textarea
                id="message"
                name="message"
                required
                rows={1}
                style={{ minHeight: "60px" }}
                value={formData.message}
                onChange={(e) => {
                  handleChange(e);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                className={`${robotoCondensed.className} w-full py-4 bg-transparent border-b-2 border-slate-300 text-slate-800 text-xl placeholder:text-slate-400 focus:outline-hidden focus:border-[#3ba58b] transition-all duration-300 resize-none overflow-hidden`}
                placeholder="Wassup?"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className={cn(
                  "px-12 py-4 rounded-full font-bold text-white text-lg transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 transform",
                  isSuccess
                    ? "bg-emerald-500"
                    : "bg-[#3ba58b] hover:bg-[#2d8a73]" // Greenish Cyan Accent
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    Message Sent
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm text-center mt-2">{error}</p>
            )}
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-6 mt-20">
        <div className="w-full h-px bg-slate-200 mb-8" />
        <div className="flex flex-col md:flex-row justify-center items-center text-center">
          <p
            className={`${robotoCondensed.className} text-slate-500 flex items-center gap-1.5`}
          >
            Crafted with <span className="text-red-400">♥</span> by Sachindra.
          </p>
        </div>
      </div>
    </section>
  );
}
