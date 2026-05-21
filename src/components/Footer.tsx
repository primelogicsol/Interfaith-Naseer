import Link from 'next/link'
import { Globe as Globe2 } from 'lucide-react'
import logo from "../../public/logo.png"
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0B0F2A] text-[#f5f3ee]/80 py-16 px-5">
      {/* <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#c8a75e] rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#d4b56d] rounded-full filter blur-3xl"></div>
      </div> */}

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-end lg:items-center space-x-2 mb-4 sm:mb-6">
              {/* <div className="w-10 h-10 rounded-xl bg-[#C8A75E] flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-[#0b0f2a]" />
              </div> */}
              <Image src={logo} className='w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 ' width={50} height={50} alt='Interfaith Peace Bridge' />
              <span className="text-lg sm:text-xl font-bold text-[#f5f3ee]">Interfaith Peace Bridge</span>
            </div>
            <p className="text-[#aab0d6] text-sm leading-relaxed">
              Uniting humanity through divine love, Sufi wisdom, and interfaith understanding.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#f5f3ee] mb-4 sm:mb-6 text-sm uppercase tracking-wider">Our Mission</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/founder" className="hover:text-[#c8a75e] transition-colors flex items-center group">
                <span className="w-1 h-1 bg-[#c8a75e] rounded-full mr-2 group-hover:w-2 transition-all"></span>
                Founder
              </Link></li>
              <li><Link href="/about" className="hover:text-[#c8a75e] transition-colors flex items-center group">
                <span className="w-1 h-1 bg-[#c8a75e] rounded-full mr-2 group-hover:w-2 transition-all"></span>
                About Us
              </Link></li>
              <li><Link href="/sufi-teachings" className="hover:text-[#c8a75e] transition-colors flex items-center group">
                <span className="w-1 h-1 bg-[#c8a75e] rounded-full mr-2 group-hover:w-2 transition-all"></span>
                Sufi Teachings
              </Link></li>
              <li><Link href="/approach" className="hover:text-[#c8a75e] transition-colors flex items-center group">
                <span className="w-1 h-1 bg-[#c8a75e] rounded-full mr-2 group-hover:w-2 transition-all"></span>
                Our Approach
              </Link></li>
              <li><Link href="/assessment" className="hover:text-[#c8a75e] transition-colors flex items-center group">
                <span className="w-1 h-1 bg-[#c8a75e] rounded-full mr-2 group-hover:w-2 transition-all"></span>
                Faith Assessment
              </Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#f5f3ee] mb-4 sm:mb-6 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/sacred-texts-explorer" className="hover:text-[#d4b56d] transition-colors flex items-center group">
                <span className="w-1 h-1 bg-[#d4b56d] rounded-full mr-2 group-hover:w-2 transition-all"></span>
                Sacred Texts Explorer
              </Link></li>
              <li><Link href="/peace-initiatives" className="hover:text-[#d4b56d] transition-colors flex items-center group">
                <span className="w-1 h-1 bg-[#d4b56d] rounded-full mr-2 group-hover:w-2 transition-all"></span>
                Peace Initiatives
              </Link></li>
              <li><Link href="/truth" className="hover:text-[#d4b56d] transition-colors flex items-center group">
                <span className="w-1 h-1 bg-[#d4b56d] rounded-full mr-2 group-hover:w-2 transition-all"></span>
                Truth Library
              </Link></li>
              <li><Link href="/traditions" className="hover:text-[#d4b56d] transition-colors flex items-center group">
                <span className="w-1 h-1 bg-[#d4b56d] rounded-full mr-2 group-hover:w-2 transition-all"></span>
                Traditions
              </Link></li>
            </ul>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-bold text-[#f5f3ee] mb-4 sm:mb-6 text-sm uppercase tracking-wider">Connect & Share</h4>
            <div className="space-y-3">
              <Link href="/contact-us" className="block w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold bg-[#c8a75e] hover:bg-[#d4b56d] text-[#0b0f2a] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center text-sm">
                Contact Us
              </Link>
              <Link href="/share-quotes" className="block w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold bg-[#9b59b6] hover:bg-[#8b4aa6] text-[#f5f3ee] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center text-sm">
                Share Sacred Wisdom
              </Link>
              <Link href="/subscribe" className="block w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold bg-[#C8A75E] hover:bg-[#D4B56D] text-[#0b0f2a] shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-center text-sm">
                Subscribe to Newsletter
              </Link>
              <Link href="/join" className="block w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold border-2 border-[#c8a75e] hover:border-[#d4b56d] text-[#c8a75e] hover:text-[#d4b56d] hover:bg-[#c8a75e]/10 transition-all duration-300 text-center text-sm">
                Join the Movement
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-[#c8a75e]/20 pt-8 sm:pt-10 text-center">
          <p className="text-[#aab0d6] italic mb-3 text-sm sm:text-base px-4">
            Managed By{' '}
            <a
              href="https://dkf.sufisciencecenter.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c8a75e] hover:text-[#d4b56d] font-semibold transition-colors duration-300 underline decoration-[#c8a75e]/30 hover:decoration-[#d4b56d]"
            >
              Dr Kumar Foundation USA
            </a>
            {' '} & Sponsored By{' '}
             <a
              href="https://sufisciencecenter.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c8a75e] hover:text-[#d4b56d] font-semibold transition-colors duration-300 underline decoration-[#c8a75e]/30 hover:decoration-[#d4b56d]"
            >
              Sufi Science Center
            </a>
          </p>
          <p className="text-xs sm:text-sm text-[#aab0d6]/60">&copy; 2026 Interfaith Peace Bridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
