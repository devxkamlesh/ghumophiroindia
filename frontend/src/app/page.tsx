'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { tourService } from '@/services/api';
import { formatCurrency } from '@/lib/utils';
import { 
  Clock, Users, MapPin, Star, Award, Shield, HeadphonesIcon, 
  ArrowRight, Phone, Search, CheckCircle2,
  TrendingUp, Heart, Sparkles
} from 'lucide-react';
import type { Tour } from '@/types';

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
      {/* Hero Section with Search */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCAzNmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center text-white mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>Explore Incredible India</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Discover the Magic<br />of Rajasthan
            </h1>
            <p className="text-lg md:text-xl mb-4 max-w-3xl mx-auto text-white/90">
              Jaipur • Udaipur • Jaisalmer • Jodhpur • Golden Triangle & Beyond
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2">
                <Star className="fill-yellow-400 text-yellow-400" size={18} />
                <span className="font-semibold">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span className="font-semibold">500+ Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={18} />
                <span className="font-semibold">10+ Years Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={18} />
                <span className="font-semibold">Safe & Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <HeadphonesIcon size={18} />
                <span className="font-semibold">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <Card className="max-w-4xl mx-auto shadow-2xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 text-center">Find Your Perfect Tour</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input placeholder="Where to?" className="md:col-span-2" />
                <Input type="number" placeholder="Duration (days)" />
                <Input type="number" placeholder="Travelers" />
              </div>
              <Link href="/tours" className="block mt-4">
                <Button className="w-full gradient-primary text-lg py-6">
                  <Search className="mr-2" size={20} />
                  Search Tours
                </Button>
              </Link>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Popular searches: 
                <Link href="/tours" className="ml-2 text-primary hover:underline">Golden Triangle</Link>
                <Link href="/tours" className="ml-2 text-primary hover:underline">Jaipur City Tour</Link>
                <Link href="/tours" className="ml-2 text-primary hover:underline">Desert Safari</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="section-padding bg-gradient-to-b from-white to-orange-50/30 dark:from-background dark:to-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-semibold mb-4">
                <TrendingUp className="inline mr-1" size={14} />
                TRENDING NOW
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Tours</h2>
              <p className="text-muted-foreground text-lg">
                Handpicked experiences showcasing the best of Rajasthan
              </p>
            </div>
            <Link href="/tours" className="hidden md:block">
              <Button variant="outline" size="lg">
                View All Tours
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground mt-4">Loading amazing tours...</p>
            </div>
          ) : featuredTours.length === 0 ? (
            <Card className="p-12 text-center">
              <MapPin className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-muted-foreground">No tours available. Check back soon!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTours.slice(0, 6).map((tour) => (
                <Card key={tour.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0">
                  <div className="relative h-64 w-full overflow-hidden">
                    {tour.images && tour.images[0] ? (
                      <Image
                        src={tour.images[0]}
                        alt={tour.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full gradient-secondary flex items-center justify-center">
                        <MapPin className="text-white" size={64} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white dark:bg-gray-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star className="fill-yellow-400 text-yellow-400" size={14} />
                      <span>Featured</span>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-2 rounded-full">
                      <Heart size={18} className="text-gray-600 dark:text-gray-300" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 mb-2">
                      <MapPin size={14} />
                      <span className="font-medium capitalize">{tour.category}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {tour.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {tour.shortDescription || tour.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{tour.duration} Days</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>Max {tour.maxGroupSize}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Starting from</div>
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(tour.price)}
                        </div>
                      </div>
                      <Link href={`/tours/${tour.id}`}>
                        <Button className="gradient-primary">
                          View Details
                          <ArrowRight className="ml-2" size={16} />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12 md:hidden">
            <Link href="/tours">
              <Button size="lg" variant="outline">
                View All Tours
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
              SIMPLE PROCESS
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Book your dream tour in 4 easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Browse & Choose',
                description: 'Explore our curated tours or build your custom itinerary',
                icon: Search,
              },
              {
                step: '2',
                title: 'Get in Touch',
                description: 'Submit your inquiry and our experts will contact you within 24 hours',
                icon: Phone,
              },
              {
                step: '3',
                title: 'Customize & Book',
                description: 'Finalize your itinerary, dates, and make secure payment',
                icon: CheckCircle2,
              },
              {
                step: '4',
                title: 'Travel & Enjoy',
                description: 'Relax and enjoy your perfectly planned Indian adventure',
                icon: Heart,
              },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <item.icon className="text-white" size={36} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center font-bold text-primary border-4 border-background">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-transparent" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Card className="max-w-3xl mx-auto gradient-primary text-white p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to start your journey?</h3>
              <p className="text-white/90 mb-6">
                Join 500+ happy travelers who trusted us with their Indian adventure
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tours">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    Browse Tours
                  </Button>
                </Link>
                <Link href="/custom-tour">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary">
                    Build Custom Tour
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-gradient-to-b from-orange-50/30 to-white dark:from-background dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold mb-4">
              WHY GHUMO FIRO INDIA
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your trusted partner for unforgettable Rajasthan experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Safe & Secure',
                description: 'Licensed guides, insured vehicles, and 24/7 support for worry-free travel',
                gradient: 'from-orange-400 to-pink-500',
              },
              {
                icon: Award,
                title: 'Expert Guides',
                description: 'Local experts with deep knowledge of history, culture, and hidden gems',
                gradient: 'from-blue-400 to-purple-500',
              },
              {
                icon: HeadphonesIcon,
                title: '24/7 Support',
                description: 'Round-the-clock assistance before, during, and after your journey',
                gradient: 'from-green-400 to-teal-500',
              },
              {
                icon: Sparkles,
                title: 'Customizable',
                description: 'Tailor every aspect of your tour to match your preferences and budget',
                gradient: 'from-pink-400 to-red-500',
              },
              {
                icon: Users,
                title: 'Small Groups',
                description: 'Intimate experiences with small group sizes for personalized attention',
                gradient: 'from-purple-400 to-pink-500',
              },
              {
                icon: Star,
                title: 'Best Price',
                description: 'Competitive pricing with no hidden fees and flexible payment options',
                gradient: 'from-yellow-400 to-orange-500',
              },
            ].map((item, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-0">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <item.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { value: '500+', label: 'Happy Travelers' },
              { value: '10+', label: 'Years Experience' },
              { value: '4.9/5', label: 'Average Rating' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-white dark:bg-gray-900 shadow-lg">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            LIMITED TIME OFFER
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Your Dream Journey Starts Here
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Book now and get 15% OFF on your first tour. Expert planning, unforgettable experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/custom-tour">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                Plan My Trip
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6">
                Speak to Expert
              </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
            <a href="tel:+919876543210" className="flex items-center gap-2 hover:underline">
              <Phone size={16} />
              <span>Call Now +91 98765 43210</span>
            </a>
            <a href="https://wa.me/919876543210" className="flex items-center gap-2 hover:underline">
              <Phone size={16} />
              <span>WhatsApp Chat Instantly</span>
            </a>
          </div>
          <p className="mt-4 text-white/80 text-sm">Response Time: Under 2 Hours</p>
        </div>
      </section>
    </div>
  );
}
