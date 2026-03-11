import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — brand / visual ── */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[42%] relative flex-col justify-between overflow-hidden bg-gray-900 p-10">

        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(225,85,21,0.12)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(225,85,21,0.08)_0%,_transparent_60%)]" />

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-2.5 w-fit">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">GP</span>
          </div>
          <span className="text-white/80 font-medium text-sm tracking-wide">Ghumo Phiro India</span>
        </Link>

        {/* Hero text */}
        <div className="relative space-y-5">
          <div className="space-y-2">
            <p className="text-white/30 text-xs font-medium uppercase tracking-widest">
              Incredible India
            </p>
            <h2 className="text-3xl font-semibold text-white/90 leading-snug">
              Discover the<br />
              <span className="text-primary-400">Magic of Rajasthan</span>
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Curated tours across Jaipur, Udaipur, Jaisalmer and beyond.
            </p>
          </div>

          {/* Minimal stats */}
          <div className="flex items-center gap-6 pt-1">
            {[
              { value: '500+', label: 'Travelers' },
              { value: '50+',  label: 'Packages'  },
              { value: '4.9★', label: 'Rating'    },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-white/80 font-semibold text-base">{value}</p>
                <p className="text-white/30 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative">
          <p className="text-white/25 text-xs italic">
            "Not all those who wander are lost."
          </p>
          <p className="text-white/20 text-xs mt-0.5">— J.R.R. Tolkien</p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
        {/* Mobile logo */}
        <div className="lg:hidden px-6 pt-6">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GP</span>
            </div>
            <span className="font-bold text-gray-900">Ghumo Phiro India</span>
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-10">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Ghumo Phiro India. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
