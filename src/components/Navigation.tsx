'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sparkles, Menu, X } from 'lucide-react'
import logo from "../../public/logo.png"
import Image from 'next/image'
import AuthButton from './AuthButton'

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${
      isScrolled
        ? 'bg-[#0B0F2A]/95 backdrop-blur-2xl border-b border-[#C8A75E]/20 shadow-xl'
        : 'bg-[#0B0F2A]/0'
    }`}>
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 transition-all duration-300 ease-in-out">
        <div className={`flex items-center transition-all duration-300 ease-in-out ${
          isScrolled ? 'py-1.5' : 'py-3 md:py-5'
        }`}>
          {/* Brand Left Section - Anchored via mr-auto */}
          <Link href="/" className="flex items-center gap-1 sm:gap-1.5 group mr-auto" onClick={closeMobileMenu}>
            <div className={`transition-transform duration-300 ease-in-out ${isScrolled ? 'scale-75' : 'scale-100'}`}>
              <Image className='w-7 h-7 sm:w-9 sm:h-9' src={logo} alt='Interfaith Peace Bridge' />
            </div>
            <div className="flex items-center h-6 sm:h-7">
              <span className={`whitespace-nowrap transition-all duration-300 ease-in-out font-bold text-[#C8A75E] ${
                isScrolled
                  ? 'opacity-0 pointer-events-none absolute'
                  : 'opacity-100 relative text-xs sm:text-sm lg:text-base xl:text-lg'
              }`}>
                Interfaith Peace Bridge
              </span>
              <span className={`whitespace-nowrap transition-all duration-300 ease-in-out font-extrabold tracking-wider text-[#C8A75E] ${
                isScrolled
                  ? 'opacity-100 relative text-xs sm:text-sm'
                  : 'opacity-0 pointer-events-none absolute'
              }`}>
                IFPB
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Dynamically positioned between components */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 px-4">
            <NavLink href="/mission" active={isActive('/mission')}>
              Mission
            </NavLink>
            <NavLink href="/teachings" active={isActive('/teachings')}>
              Teachings
            </NavLink>
            <NavLink href="/sacred-texts-explorer" active={isActive('/sacred-texts-explorer')}>
              Sacred Texts
            </NavLink>
            <NavLink href="/truth" active={isActive('/truth')}>
              Truth
            </NavLink>
            <NavLink href="/traditions" active={isActive('/traditions')}>
              Traditions
            </NavLink>
            <NavLink href="/peace" active={isActive('/peace')}>
              Peace
            </NavLink>
            <NavLink href="/share-quotes" active={isActive('/share-quotes')}>
              Share
            </NavLink>
          </div>

          {/* Desktop Right Section - Anchored via ml-auto */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 ml-auto">
            <Link href="/join" className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 xl:px-4 py-1.5 bg-gradient-to-r from-[#c8a75e] to-[#d4b56d] text-[#0b0f2a] rounded-lg hover:shadow-premium transition-all whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5" />
              Join the Movement
            </Link>
            <AuthButton />
          </div>

          {/* Mobile UI Controls - Anchored via ml-auto */}
          <div className="flex items-center gap-1 lg:hidden ml-auto">
            <div className="flex items-center justify-center">
              <AuthButton />
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#f5f3ee] hover:text-[#c8a75e] hover:bg-[#c8a75e]/10 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden space-y-2 animate-fadeIn transition-all duration-300 ease-in-out ${
            isScrolled ? 'pb-2' : 'pb-4'
          }`}>
            <MobileNavLink href="/mission" active={isActive('/mission')} onClick={closeMobileMenu}>
              Our Mission
            </MobileNavLink>
            <MobileNavLink href="/teachings" active={isActive('/teachings')} onClick={closeMobileMenu}>
              Teachings
            </MobileNavLink>
            <MobileNavLink href="/sacred-texts-explorer" active={isActive('/sacred-texts-explorer')} onClick={closeMobileMenu}>
              Sacred Texts
            </MobileNavLink>
            <MobileNavLink href="/truth" active={isActive('/truth')} onClick={closeMobileMenu}>
              Truth
            </MobileNavLink>
            <MobileNavLink href="/traditions" active={isActive('/traditions')} onClick={closeMobileMenu}>
              Traditions
            </MobileNavLink>
            <MobileNavLink href="/peace" active={isActive('/peace')} onClick={closeMobileMenu}>
              Peace Work
            </MobileNavLink>
            <MobileNavLink href="/share-quotes" active={isActive('/share-quotes')} onClick={closeMobileMenu}>
              Share
            </MobileNavLink>
            <Link
              href="/join"
              className="btn-secondary w-full inline-flex items-center justify-center text-sm px-5 py-3 mt-3"
              onClick={closeMobileMenu}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Join the Movement
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`relative px-1.5 xl:px-2 py-1.5 rounded-md font-medium transition-all duration-300 text-xs xl:text-sm ${
        active
          ? 'text-[#c8a75e]'
          : 'text-[#f5f3ee]/80 hover:text-[#c8a75e]'
      }`}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#c8a75e] rounded-full"></span>
      )}
    </Link>
  )
}

function MobileNavLink({ href, active, children, onClick }: { href: string; active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
        active
          ? 'text-[#c8a75e] bg-[#c8a75e]/10 border-l-4 border-[#c8a75e]'
          : 'text-[#f5f3ee]/80 hover:text-[#c8a75e] hover:bg-[#c8a75e]/5 border-l-4 border-transparent'
      }`}
    >
      {children}
    </Link>
  )
}