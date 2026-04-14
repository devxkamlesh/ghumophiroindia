'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Glow } from '@/components/ui/glow';
import { ContainerScroll, ContainerSticky, GalleryContainer, GalleryCol } from '@/components/ui/container-scroll';
import { tourService } from '@/services/api';
import { formatCurrency, cn } from '@/lib/utils';
import { 
  Clock, Users, MapPin, Star, Award, Shield, 
  ArrowRight, Phone, DollarSign, Compass, Heart
} from 'lucide-react';
import type { Tour } from '@/types';

// Optimized Rajasthan Gallery Images - Reduced for better performance
const RAJASTHAN_IMAGES_1 = [
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=75',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&auto=format&fit=crop&q=75',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=75',
  'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&auto=format&fit=crop&q=75',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop&q=75',
];

const RAJASTHAN_IMAGES_2 = [
  'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&auto=format&fit=crop&q=75',
  'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?w=600&auto=format&fit=crop&q=75',
  'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&auto=format&fit=crop&q=75',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=75',
  'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600&auto=format&fit=crop&q=75',
];

const RAJASTHAN_IMAGES_3 = [
  'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600&auto=format&fit=crop&q=75',
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=75',
  'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&auto=format&fit=crop&q=75',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&auto=format&fit=crop&q=75',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=75',
];

// Popular Destinations Data
const destinations = [
  {
    name: 'Jaipur',
    description: 'The Pink City - A blend of royal heritage and vibrant culture',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2400&auto=format&fit=crop',
    highlights: ['Amber Fort', 'City Palace', 'Hawa Mahal'],
  },
  {
    name: 'Udaipur',
    description: 'The City of Lakes - Romance and architectural splendor',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2400&auto=format&fit=crop',
    highlights: ['Lake Pichola', 'City Palace', 'Jag Mandir'],
  },
  {
    name: 'Jaisalmer',
    description: 'The Golden City - Desert adventures and ancient forts',
    image: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?q=80&w=2400&auto=format&fit=crop',
    highlights: ['Jaisalmer Fort', 'Sand Dunes', 'Patwon Ki Haveli'],
  },
];

// Features Data
const features = [
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Licensed & insured with 24/7 support for your peace of mind',
    gradient: 'from-orange-500 to-pink-500',
  },
  {
    icon: Award,
    title: 'Expert Guides',
    description: 'Local knowledge and authentic experiences with certified guides',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Star,
    title: 'Best Prices',
    description: 'No hidden fees with our best price guarantee and exclusive deals',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Phone,
    title: '24/7 Support',
    description: 'Always available to assist you throughout your journey',
    gradient: 'from-green-500 to-emerald-500',
  },
];

export default function HomePage() {
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const tours = await tourService.getFeatured();
        setFeaturedTours(Array.isArray(tours) ? tours : []);
      } catch (error) {
        console.error('Failed to fetch featured tours:', error);
        setFeaturedTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Immersive Gallery Scroll - Optimized */}
      <section className="relative bg-gradient-to-br from-orange-100 via-pink-100 to-orange-200">
        {/* Vibrant Background Effects */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Animated Gradient */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              background: "radial-gradient(circle at 50% 50%, hsl(30, 100%, 65%), hsl(340, 100%, 65%))",
              filter: "blur(120px)",
            }}
          />
        </div>

        {/* Dark Overlay for Better Text Contrast - Initially visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 z-[5] pointer-events-none" />

        {/* Additional Black Overlay Between Text and Images - Appears during scroll */}
        <div className="absolute inset-0 bg-black/70 z-[15] pointer-events-none opacity-0 transition-opacity duration-700" id="scroll-overlay" />

        {/* Sticky Hero Content */}
        <div className="sticky top-16 md:top-20 z-40 px-3 sm:px-4 md:px-6 pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Main Heading */}
            <div className="mb-4 sm:mb-6">
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-2 sm:mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-white drop-shadow-lg">
                  Discover{' '}
                </span>
                <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-orange-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Rajasthan
                </span>
              </motion.h1>
              <motion.p 
                className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 font-bold tracking-wide drop-shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Jaipur • Udaipur • Jaisalmer
              </motion.p>
            </div>

            {/* Trust Badges */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {[
                { icon: Star, text: '4.9/5', color: 'orange' },
                { icon: Award, text: '14+ Years', color: 'pink' },
                { icon: Shield, text: 'Safe', color: 'orange' },
              ].map((badge, idx) => (
                <motion.div 
                  key={idx}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full bg-white shadow-xl border border-white/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.08, y: -2 }}
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <badge.icon className={`text-orange-600 ${badge.icon === Star ? 'fill-current' : ''}`} size={12} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-gray-900">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Search Card - Optimized */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0 bg-white rounded-xl sm:rounded-2xl md:rounded-3xl">
                <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
                  {[
                    { icon: MapPin, label: 'Where to?', value: 'Select destination' },
                    { icon: DollarSign, label: 'Budget', value: 'Select budget' },
                    { icon: Users, label: 'Travelers', value: 'Select travelers' },
                  ].map((item, idx) => (
                    <Link key={idx} href="/tours" className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 bg-gray-50 rounded-lg sm:rounded-xl md:rounded-2xl hover:bg-gray-100 transition-colors group">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <item.icon className="text-orange-500" size={16} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground font-medium mb-0.5">{item.label}</p>
                        <p className="font-semibold text-xs sm:text-sm truncate">{item.value}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/tours">
                  <Button className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-pink-600 hover:from-orange-600 hover:via-pink-600 hover:to-pink-700 py-4 sm:py-5 md:py-6 text-sm sm:text-base font-semibold shadow-lg rounded-lg sm:rounded-xl md:rounded-2xl transition-all hover:shadow-xl">
                    Search Tours
                  </Button>
                </Link>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Optimized Gallery Scroll Animation */}
        <div className="relative z-10 -mt-16 sm:-mt-24 md:-mt-32">
          <ContainerScroll className="relative h-[280vh]">
            <ContainerSticky className="h-screen flex items-center justify-center">
              <GalleryContainer className="px-2 sm:px-4 max-w-7xl mx-auto">
                <GalleryCol yRange={['0%', '-20%']} className="-mt-2">
                  {RAJASTHAN_IMAGES_1.map((imageUrl, index) => (
                    <motion.img
                      key={index}
                      className="aspect-video block h-auto max-h-full w-full rounded-lg shadow-lg"
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      src={imageUrl}
                      alt={`Rajasthan ${index + 1}`}
                      loading={index < 1 ? "eager" : "lazy"}
                      decoding="async"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true, margin: "-100px" }}
                    />
                  ))}
                </GalleryCol>
                <GalleryCol className="mt-[-50%]" yRange={['25%', '-10%']}>
                  {RAJASTHAN_IMAGES_2.map((imageUrl, index) => (
                    <motion.img
                      key={index}
                      className="aspect-video block h-auto max-h-full w-full rounded-lg shadow-lg"
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      src={imageUrl}
                      alt={`Rajasthan ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true, margin: "-100px" }}
                    />
                  ))}
                </GalleryCol>
                <GalleryCol yRange={['0%', '-20%']} className="-mt-2">
                  {RAJASTHAN_IMAGES_3.map((imageUrl, index) => (
                    <motion.img
                      key={index}
                      className="aspect-video block h-auto max-h-full w-full rounded-lg shadow-lg"
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      src={imageUrl}
                      alt={`Rajasthan ${index + 1}`}
                      loading="lazy"
                      decoding="async"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true, margin: "-100px" }}
                    />
                  ))}
                </GalleryCol>
              </GalleryContainer>
            </ContainerSticky>
          </ContainerScroll>
        </div>
      </section>

      {/* Featured Tours - Redesigned */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-2 md:mb-3">
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Featured Tours
                </span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
                Handpicked experiences showcasing the best of Rajasthan
              </p>
            </motion.div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12 md:py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
            </div>
          ) : featuredTours.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
                <MapPin className="text-orange-500" size={32} />
              </div>
              <p className="text-sm md:text-base text-muted-foreground">No tours available at the moment</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-8 md:mb-10">
                {featuredTours.slice(0, 3).map((tour, index) => (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/tours/${tour.id}`}>
                      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white h-full">
                        {/* Image Container */}
                        <div className="relative h-56 md:h-64 overflow-hidden">
                          {tour.images && tour.images[0] ? (
                            <Image
                              src={tour.images[0]}
                              alt={tour.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center">
                              <MapPin className="text-white" size={40} />
                            </div>
                          )}
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          
                          {/* Category Badge */}
                          <div className="absolute top-3 left-3 md:top-4 md:left-4 px-2.5 py-1 md:px-3 md:py-1.5 bg-white rounded-full text-xs font-bold capitalize shadow-lg">
                            {tour.category}
                          </div>

                          {/* Price Badge */}
                          <div className="absolute top-3 right-3 md:top-4 md:right-4 px-2.5 py-1 md:px-3 md:py-1.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full text-xs md:text-sm font-bold shadow-lg">
                            {formatCurrency(tour.price)}
                          </div>

                          {/* Bottom Info Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                            <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2 line-clamp-2 drop-shadow-lg">
                              {tour.title}
                            </h3>
                            <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm">
                              <div className="flex items-center gap-1 md:gap-1.5">
                                <Clock size={14} className="md:w-4 md:h-4" />
                                <span>{tour.duration} Days</span>
                              </div>
                              <div className="flex items-center gap-1 md:gap-1.5">
                                <Users size={14} className="md:w-4 md:h-4" />
                                <span>Max {tour.maxGroupSize}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <CardContent className="p-4 md:p-5">
                          <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 line-clamp-3">
                            {tour.shortDescription || tour.description}
                          </p>

                          {/* CTA Button */}
                          <Button 
                            className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-pink-600 hover:from-orange-600 hover:via-pink-600 hover:to-pink-700 text-white font-semibold rounded-xl group-hover:shadow-lg transition-all text-sm md:text-base py-2 md:py-2.5"
                          >
                            View Details
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center">
                <Link href="/tours">
                  <Button 
                    size="lg"
                    variant="outline" 
                    className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold px-6 md:px-8 rounded-full transition-all text-sm md:text-base"
                  >
                    Explore All Tours
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-2 md:mb-3">
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Popular Destinations
                </span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
                Discover the most sought-after cities in Rajasthan
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="group relative h-[400px] md:h-[450px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* Image with scale effect */}
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Mobile: Always visible info at bottom */}
                <div className="md:hidden absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {destination.name}
                  </h3>
                  <p className="text-sm text-white/90 mb-3">
                    {destination.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 border border-white/30"
                      >
                        <p className="text-xs text-white font-medium">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop: Hover Content - slides up on hover */}
                <div className="hidden md:block absolute inset-x-6 bottom-6 p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200 transition-all duration-500 translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {destination.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {destination.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Top Attractions
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {destination.highlights.map((highlight) => (
                          <div
                            key={highlight}
                            className="rounded-full bg-orange-50 px-3 py-1 border border-orange-200"
                          >
                            <p className="text-xs text-orange-600 font-medium">
                              {highlight}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Redesigned */}
      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-2 md:mb-3">
                <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Why Choose Us
                </span>
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
                Experience the difference with our exceptional service
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="h-full p-5 md:p-6 rounded-2xl bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div
                    className={cn(
                      'w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 md:mb-4 text-white',
                      feature.gradient
                    )}
                  >
                    <feature.icon size={28} className="md:w-8 md:h-8" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <div
                    className={cn(
                      'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none',
                      feature.gradient
                    )}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Glow variant="center" />
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-orange-600 via-pink-600 to-purple-700 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-sm md:text-base text-white/90 mb-6 md:mb-8 max-w-xl mx-auto px-4">
              Book now and get 15% OFF on your first tour
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-6 md:mb-8 px-4">
              <Link href="/custom-tour" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-semibold px-6 md:px-8 py-5 md:py-6 text-sm md:text-base rounded-xl">
                  Plan My Trip
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-6 md:px-8 py-5 md:py-6 text-sm md:text-base rounded-xl">
                  Contact Us
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 md:gap-4 text-xs md:text-sm text-white/90">
              <a href="tel:+919876543210" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Phone size={14} className="md:w-4 md:h-4" />
                <span>+91 98765 43210</span>
              </a>
              <span className="hidden sm:inline">•</span>
              <span>Response Time: Under 2 Hours</span>
            </div>
          </motion.div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Glow variant="center" />
        </div>
      </section>
    </div>
  );
}
