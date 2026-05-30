import ModernHeader from '@/components/public/layout/ModernHeader'
import Footer from '@/components/public/layout/Footer'
import WhatsAppButton from '@/components/public/shared/WhatsAppButton'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ModernHeader />
      <main className="min-h-screen pt-[130px]">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
