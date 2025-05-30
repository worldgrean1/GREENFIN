'use client';

import {
  Phone,
  MessageSquare,
  MapPin,
  Send,
  Users,
  Mail,
  SunMedium,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useState, useRef } from 'react';
import { TypingTextAnimation } from '@/components/animations/text/TypingTextAnimation';

// Official Brand CSS from Brand Guidelines
const brandCSS = `
  /* Official GREAN WORLD Brand Colors - 60-30-10 Rule */
  :root {
    --grean-primary: #3dd56d;
    --grean-secondary: #2bb757;
    --grean-accent: #23a455;
  }

  /* Official Brand Typography Classes */
  .typography-display {
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  .typography-h1 {
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .typography-h2 {
    font-weight: 600;
    line-height: 1.25;
  }

  .typography-h3 {
    font-weight: 600;
    line-height: 1.3;
  }

  .typography-body {
    font-weight: 400;
    line-height: 1.6;
  }

  .typography-small {
    font-weight: 500;
    line-height: 1.4;
  }

  /* GreenContact Animation Keyframes */
  @keyframes slideInFromLeft {
    0% {
      opacity: 0;
      transform: translateX(-100px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @keyframes slideInFromRight {
    0% {
      opacity: 0;
      transform: translateX(100px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }

  @keyframes fadeInScale {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideOutToLeft {
    0% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateX(-100px) scale(0.95);
    }
  }

  @keyframes slideOutToRight {
    0% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateX(100px) scale(0.95);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  /* Animation Classes */
  .card-slide-in-left {
    animation: slideInFromLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  .card-slide-in-right {
    animation: slideInFromRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  .card-fade-in-scale {
    animation: fadeInScale 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  .card-slide-out-left {
    animation: slideOutToLeft 0.6s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
  }

  .card-slide-out-right {
    animation: slideOutToRight 0.6s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
  }

  .card-pulse {
    animation: pulse 2s infinite;
  }

  /* Initial hidden state */
  .card-hidden {
    opacity: 0;
    transform: translateY(80px) scale(0.95);
  }

  /* Form field animations */
  .field-fade-in {
    animation: fadeInScale 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
`;

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated, options]);

  return { ref, isIntersecting, hasAnimated };
};

// Component props type
interface GreenContactProps {
  noSeam?: boolean;
}

export default function GreenContact({ noSeam = false }: GreenContactProps) {
  const { effectiveTheme, isDark, isLight } = useTheme();

  // Animation states for different sections
  const contactForm = useIntersectionObserver();
  const contactInfo = useIntersectionObserver();
  const formFields = useIntersectionObserver();
  const contactButtons = useIntersectionObserver();

  // Separate ref for the form element
  const formRef = useRef<HTMLFormElement>(null);

  // Inject brand CSS
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = brandCSS;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <section
      id="green-contact"
      className="relative w-full flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 lg:py-16"
    >
      {/* Contact Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12 lg:mb-16 relative z-10">
        <div className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium mb-6 shadow-lg typography-small ${
          isDark
            ? 'bg-[#3DD56D]/20 text-[#3DD56D] border border-[#3DD56D]/20'
            : 'bg-[#2bb757]/20 text-[#2bb757] border border-[#2bb757]/20'
        }`}>
          <Mail className="mr-2 h-5 w-5" /> Contact
        </div>
        <div className="mb-4">
          <h1 className={`text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight flex flex-col sm:flex-row items-center justify-center gap-2 text-center ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <TypingTextAnimation
              text="We'd Love to Hear From You"
              speed="medium"
              className="inline-block"
            />
          </h1>
        </div>
        <p
          className={`typography-body text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          Our team is ready to answer your questions, provide support, or help
          you get started with clean energy solutions. Reach out and let's
          connect!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
          <a href="#contact-form" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-lg font-bold px-8 py-4 text-white shadow-lg hover:scale-105 transition focus:outline-none focus:ring-2 min-h-[48px] touch-friendly bg-gradient-to-r from-[#3DD56D] to-[#2bb757] focus:ring-[#3DD56D]">
              <Send className="mr-2 h-5 w-5" /> Send a Message
            </button>
          </a>
          <a href="tel:+251913330000" className="w-full sm:w-auto">
            <button
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-lg font-bold px-8 py-4 border-2 shadow transition focus:outline-none focus:ring-2 min-h-[48px] touch-friendly border-[#3DD56D] text-[#3DD56D] hover:bg-[#3DD56D]/10 focus:ring-[#3DD56D] ${
                isDark ? 'bg-slate-800/80' : 'bg-white/80'
              }`}
            >
              <Phone className="mr-2 h-5 w-5" /> Call Us
            </button>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form Card */}
          <div
            ref={contactForm.ref}
            className={`rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl overflow-hidden relative group transition-shadow duration-300 ${
              isDark
                ? 'bg-gradient-to-br from-slate-800 to-slate-900/60 border border-slate-700/60'
                : 'bg-gradient-to-br from-white to-green-50/60 border border-green-200/60'
            } ${
              contactForm.hasAnimated
                ? (contactForm.isIntersecting ? 'card-slide-in-left' : 'card-slide-out-left')
                : 'card-hidden'
            }`}
          >
            {/* Subtle decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#3DD56D]/10 rotate-45 transform origin-bottom-left"></div>
            </div>
            <div className="relative">
              <div className="flex items-center mb-6">
                <span className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold bg-[#3DD56D]/15 text-[#3DD56D] border border-[#3DD56D]/30 mr-3 shadow-sm">
                  <Mail className="h-5 w-5 mr-2" /> Get in Touch
                </span>
              </div>
              <h2
                className={`typography-h2 text-3xl md:text-4xl mb-4 tracking-tight ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                Contact Us
              </h2>
              <p
                className={`typography-body text-lg mb-8 leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Fill out the form below and our team will get back to you within
                24 hours.
              </p>
              <form
                ref={formRef}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className={`space-y-2 transition-all duration-300 ${
                    formFields.hasAnimated
                      ? (formFields.isIntersecting ? 'field-fade-in' : 'card-hidden')
                      : 'card-hidden'
                  }`}
                  style={{ animationDelay: formFields.hasAnimated ? '0.1s' : '0s' }}
                  >
                    <label
                      className={`typography-small text-sm ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                      htmlFor="name"
                    >
                      Full Name
                    </label>
                    <div className="relative group">
                      <input
                        className={`flex w-full border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3DD56D] focus:border-[#3DD56D] md:text-sm focus:border-[#3DD56D] focus:ring-[#3DD56D]/30 transition-all duration-300 h-12 pl-10 rounded-lg shadow-sm ${
                          isDark
                            ? 'text-white placeholder:text-gray-400 bg-slate-800/80 border-slate-600/60'
                            : 'text-green-900 placeholder:text-green-600/60 bg-white/80 border-green-200/60'
                        }`}
                        id="name"
                        placeholder="Your name"
                        required
                        name="name"
                      />
                      <div
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within:text-[#3DD56D] transition-colors ${
                          isDark ? 'text-gray-400' : 'text-green-600/60'
                        }`}
                      >
                        <Users className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  <div className={`space-y-2 transition-all duration-300 ${
                    formFields.hasAnimated
                      ? (formFields.isIntersecting ? 'field-fade-in' : 'card-hidden')
                      : 'card-hidden'
                  }`}
                  style={{ animationDelay: formFields.hasAnimated ? '0.2s' : '0s' }}
                  >
                    <label
                      className={`font-semibold text-sm ${
                        isDark ? 'text-white' : 'text-small-title'
                      }`}
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <div className="relative group">
                      <input
                        className={`flex w-full border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3DD56D] focus:border-[#3DD56D] md:text-sm focus:border-[#3DD56D] focus:ring-[#3DD56D]/30 transition-all duration-300 h-12 pl-10 rounded-lg shadow-sm ${
                          isDark
                            ? 'text-white placeholder:text-gray-400 bg-slate-800/80 border-slate-600/60'
                            : 'text-green-900 placeholder:text-green-600/60 bg-white/80 border-green-200/60'
                        }`}
                        id="email"
                        placeholder="Your email"
                        required
                        type="email"
                        name="email"
                      />
                      <div
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within:text-[#3DD56D] transition-colors ${
                          isDark ? 'text-gray-400' : 'text-green-600/60'
                        }`}
                      >
                        <Mail className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    <label
                      className={`font-semibold text-sm ${
                        isDark ? 'text-white' : 'text-small-title'
                      }`}
                      htmlFor="phone"
                    >
                      Phone Number
                    </label>
                    <div className="relative group">
                      <input
                        className={`flex w-full border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3DD56D] focus:border-[#3DD56D] md:text-sm focus:border-[#3DD56D] focus:ring-[#3DD56D]/30 transition-all duration-300 h-12 pl-10 rounded-lg shadow-sm ${
                          isDark
                            ? 'text-white placeholder:text-gray-400 bg-slate-800/80 border-slate-600/60'
                            : 'text-green-900 placeholder:text-green-600/60 bg-white/80 border-green-200/60'
                        }`}
                        id="phone"
                        placeholder="Your phone (optional)"
                        name="phone"
                      />
                      <div
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within:text-[#3DD56D] transition-colors ${
                          isDark ? 'text-gray-400' : 'text-green-600/60'
                        }`}
                      >
                        <Phone className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      className={`font-semibold text-sm ${
                        isDark ? 'text-white' : 'text-small-title'
                      }`}
                      htmlFor="subject"
                    >
                      Subject
                    </label>
                    <div className="relative group">
                      <input
                        className={`flex w-full border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3DD56D] focus:border-[#3DD56D] md:text-sm focus:border-[#3DD56D] focus:ring-[#3DD56D]/30 transition-all duration-300 h-12 pl-10 rounded-lg shadow-sm ${
                          isDark
                            ? 'text-white placeholder:text-gray-400 bg-slate-800/80 border-slate-600/60'
                            : 'text-green-900 placeholder:text-green-600/60 bg-white/80 border-green-200/60'
                        }`}
                        id="subject"
                        placeholder="How can we help?"
                        required
                        name="subject"
                      />
                      <div
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within:text-[#3DD56D] transition-colors ${
                          isDark ? 'text-gray-400' : 'text-green-600/60'
                        }`}
                      >
                        <SunMedium className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    className={`font-semibold text-sm ${
                      isDark ? 'text-white' : 'text-small-title'
                    }`}
                    htmlFor="interest"
                  >
                    I'm interested in
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className={`flex items-center justify-between border px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-full focus:border-[#3DD56D] focus:ring-[#3DD56D]/30 transition-all duration-300 h-12 rounded-lg shadow-sm ${
                        isDark
                          ? 'text-white placeholder:text-gray-400 bg-slate-800/80 border-slate-600/60'
                          : 'text-green-900 placeholder:text-green-600/60 bg-white/80 border-green-200/60'
                      }`}
                    >
                      <span style={{ pointerEvents: 'none' }}>
                        Select an option
                      </span>
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </button>
                    <select
                      aria-hidden="true"
                      tabIndex={-1}
                      className="absolute w-1 h-1 p-0 m-[-1px] overflow-hidden clip-rect-0 whitespace-nowrap border-0"
                    >
                      <option value="solar">Solar Energy Products</option>
                      <option value="stoves">Clean Cooking Stoves</option>
                      <option value="consulting">Energy Consulting</option>
                      <option value="distribution">
                        Distribution Partnership
                      </option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    className={`font-semibold text-sm ${
                      isDark ? 'text-white' : 'text-small-title'
                    }`}
                    htmlFor="message"
                  >
                    Your Message
                  </label>
                  <div className="relative group">
                    <textarea
                      className={`flex w-full border px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3DD56D] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:border-[#3DD56D] focus:ring-[#3DD56D]/30 transition-all duration-300 min-h-[120px] pl-10 pt-3 rounded-lg shadow-sm ${
                        isDark
                          ? 'text-white placeholder:text-gray-400 bg-slate-800/80 border-slate-600/60'
                          : 'text-green-900 placeholder:text-green-600/60 bg-white/80 border-green-200/60'
                      }`}
                      id="message"
                      name="message"
                      placeholder="Tell us more about your needs..."
                      required
                    ></textarea>
                    <div
                      className={`absolute left-3 top-3 group-focus-within:text-[#3DD56D] transition-colors ${
                        isDark ? 'text-gray-400' : 'text-green-600/60'
                      }`}
                    >
                      <Send className="h-4 w-4" />
                    </div>
                  </div>
                </div>
                <div
                  ref={contactButtons.ref}
                  className="pt-4"
                >
                  <button
                    className={`inline-flex items-center justify-center gap-2 whitespace-nowrap text-lg font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-4 py-2 text-white w-full group relative overflow-hidden rounded-full h-14 shadow-lg hover:shadow-xl bg-gradient-to-r from-[#3DD56D] to-[#2bb757] hover:from-[#2bb757] hover:to-[#3DD56D] focus-visible:ring-[#3DD56D] ${
                      contactButtons.hasAnimated
                        ? (contactButtons.isIntersecting ? 'card-pulse' : 'card-hidden')
                        : 'card-hidden'
                    }`}
                    type="submit"
                  >
                    <span className="relative z-10 flex items-center justify-center text-base font-medium">
                      Send Message
                      <span className="ml-2">
                        <Send className="h-4 w-4" />
                      </span>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div
              ref={contactInfo.ref}
              className={`rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl relative overflow-hidden group transition-shadow duration-300 ${
                isDark
                  ? 'bg-gradient-to-br from-slate-800 to-slate-900/60 border border-slate-700/60'
                  : 'bg-gradient-to-br from-white to-green-50/60 border border-green-200/60'
              } ${
                contactInfo.hasAnimated
                  ? (contactInfo.isIntersecting ? 'card-slide-in-right' : 'card-slide-out-right')
                  : 'card-hidden'
              }`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-[#3DD56D]/10 rotate-45 transform origin-bottom-left"></div>
              </div>
              <div>
                <h3
                  className={`typography-h3 text-xl mb-6 flex items-center ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  <MapPin className="h-5 w-5 mr-2 text-[#3DD56D]" /> Contact
                  Information
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div
                      className={`p-3 rounded-lg mr-4 mt-1 shadow-sm ${
                        isDark
                          ? 'bg-slate-700/80 border border-slate-600/60'
                          : 'bg-green-100/80 border border-green-200/60'
                      }`}
                    >
                      <MapPin className="h-5 w-5 text-[#3DD56D]" />
                    </div>
                    <div>
                      <p
                        className={`font-semibold ${
                          isDark ? 'text-white' : 'text-green-900'
                        }`}
                      >
                        Location
                      </p>
                      <p
                        className={`mt-1 font-medium ${
                          isDark ? 'text-gray-300' : 'text-green-700'
                        }`}
                      >
                        Kirkos Sub City Wereda 02
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-green-600'
                        }`}
                      >
                        Deberezeit road, Sierra Leone street
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-green-600'
                        }`}
                      >
                        Tegene Building (Global Hotel), 6th floor
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-green-600'
                        }`}
                      >
                        Addis Ababa, Ethiopia
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div
                      className={`p-3 rounded-lg mr-4 mt-1 shadow-sm ${
                        isDark
                          ? 'bg-slate-700/80 border border-slate-600/60'
                          : 'bg-green-100/80 border border-green-200/60'
                      }`}
                    >
                      <Mail className="h-5 w-5 text-[#3DD56D]" />
                    </div>
                    <div>
                      <p
                        className={`font-semibold ${
                          isDark ? 'text-white' : 'text-green-900'
                        }`}
                      >
                        Email Us
                      </p>
                      <p
                        className={`mt-1 group-hover:text-[#3DD56D] transition-colors font-medium ${
                          isDark ? 'text-gray-300' : 'text-green-700'
                        }`}
                      >
                        <a
                          href="mailto:info@greanworld.com"
                          className={`hover:text-[#3DD56D] transition-colors border-b border-dashed hover:border-[#3DD56D] ${
                            isDark ? 'border-gray-500' : 'border-green-300'
                          }`}
                        >
                          info@greanworld.com
                        </a>
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-green-600'
                        }`}
                      >
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div
                      className={`p-3 rounded-lg mr-4 mt-1 shadow-sm ${
                        isDark
                          ? 'bg-slate-700/80 border border-slate-600/60'
                          : 'bg-green-100/80 border border-green-200/60'
                      }`}
                    >
                      <Phone className="h-5 w-5 text-[#3DD56D]" />
                    </div>
                    <div>
                      <p
                        className={`font-semibold ${
                          isDark ? 'text-white' : 'text-green-900'
                        }`}
                      >
                        Call Us
                      </p>
                      <p
                        className={`mt-1 group-hover:text-[#3DD56D] transition-colors font-medium ${
                          isDark ? 'text-gray-300' : 'text-green-700'
                        }`}
                      >
                        <a
                          href="tel:+251913330000"
                          className={`hover:text-[#3DD56D] transition-colors border-b border-dashed hover:border-[#3DD56D] ${
                            isDark ? 'border-gray-500' : 'border-green-300'
                          }`}
                        >
                          (+251) 913 330000
                        </a>
                      </p>
                      <p
                        className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-green-600'
                        }`}
                      >
                        Mon-Fri from 8am to 5pm
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className={`rounded-2xl p-4 shadow-lg hover:shadow-xl relative overflow-hidden h-[300px] transition-shadow duration-300 ${
                isDark
                  ? 'bg-gradient-to-br from-slate-800 to-slate-900/60 border border-slate-700/60'
                  : 'bg-gradient-to-br from-white to-green-50/60 border border-green-200/60'
              }`}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className={`absolute inset-0 ${
                    isDark
                      ? 'bg-gradient-to-b from-slate-700/30 to-slate-800/50'
                      : 'bg-gradient-to-b from-green-50/30 to-green-100/50'
                  }`}
                ></div>
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-8">
                  {Array.from({ length: 96 }).map((_, i) => (
                    <div
                      key={i}
                      className={`border-[0.5px] ${
                        isDark ? 'border-slate-600/30' : 'border-green-200/30'
                      }`}
                    ></div>
                  ))}
                </div>
                <div
                  className="absolute top-0 left-0 w-full h-full opacity-30"
                  style={{ opacity: 0.3 }}
                >
                  <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[50%] rounded-full border border-[#3DD56D]/40">
                    <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] border-t border-l border-[#3DD56D]/40 rounded-tl-full"></div>
                    <div className="absolute top-[20%] left-[20%] w-[30%] h-[2px] bg-[#3DD56D]/40"></div>
                    <div className="absolute top-[50%] left-[10%] w-[80%] h-[2px] bg-[#3DD56D]/40"></div>
                    <div className="absolute top-[70%] left-[30%] w-[40%] h-[2px] bg-[#3DD56D]/40"></div>
                  </div>
                  <div className="absolute top-[35%] left-[45%] w-4 h-4 rounded-full border border-[#3DD56D]/50"></div>
                  <div className="absolute top-[45%] left-[55%] w-3 h-3 rounded-full border border-[#3DD56D]/50"></div>
                  <div className="absolute top-[55%] left-[42%] w-3 h-3 rounded-full border border-[#3DD56D]/50"></div>
                </div>
                <div className="absolute top-[45%] left-[53%] transform -translate-x-1/2 -translate-y-1/2">
                  <div className="map-pulse w-8 h-8 rounded-full bg-[#3DD56D]/15 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm"></div>
                  <div className="w-12 h-12 rounded-full bg-[#3DD56D]/10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping-slow"></div>
                  <div className="map-pin w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="bg-[#3DD56D] w-6 h-6 rounded-full flex items-center justify-center shadow-lg shadow-[#3DD56D]/30">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`absolute bottom-3 right-3 backdrop-blur-sm px-3 py-2 rounded-md text-xs shadow-sm font-medium ${
                  isDark
                    ? 'bg-slate-800/90 text-gray-300 border border-slate-600/60'
                    : 'bg-white/90 text-green-900 border border-green-200/60'
                }`}
              >
                Kirkos, Addis Ababa, Ethiopia
              </div>
              <div
                className={`absolute bottom-3 left-3 backdrop-blur-sm px-3 py-2 rounded-md text-xs shadow-sm font-medium ${
                  isDark
                    ? 'bg-slate-800/90 text-gray-300 border border-slate-600/60'
                    : 'bg-white/90 text-green-900 border border-green-200/60'
                }`}
              >
                8.993458, 38.759742
              </div>
              <div className="absolute top-3 right-3 flex flex-col space-y-1">
                <button
                  className={`w-6 h-6 border rounded flex items-center justify-center text-xs shadow-sm transition-colors ${
                    isDark
                      ? 'bg-slate-800/90 border-slate-600/60 text-gray-300 hover:bg-slate-700'
                      : 'bg-white/90 border-green-200/60 text-green-700 hover:bg-green-50'
                  }`}
                >
                  +
                </button>
                <button
                  className={`w-6 h-6 border rounded flex items-center justify-center text-xs shadow-sm transition-colors ${
                    isDark
                      ? 'bg-slate-800/90 border-slate-600/60 text-gray-300 hover:bg-slate-700'
                      : 'bg-white/90 border-green-200/60 text-green-700 hover:bg-green-50'
                  }`}
                >
                  -
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
