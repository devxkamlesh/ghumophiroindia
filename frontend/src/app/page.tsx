'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { tourService } from '@/services/api';
import { formatCurrency } from '@/lib/utils';
import { Clock, Users, MapPin, Star, Award, Shield, HeadphonesIcon, ArrowRight, Phone, Mail } from 'lucide-react';
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
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-pink-600 to-purple-700" />
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
            ✨ Best Tours and Travel Agency in Rajasthan
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Discover the Royal Heritage<br />of Rajasthan
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Experience the magic of Rajasthan with our expertly curated tour packages. 
            From majestic forts to vibrant culture, create memories that last forever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button size="lg" className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90">
                Explore Tours
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-primary">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Total Places</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">Popular Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-muted-foreground">Successful Trips</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Offers - Featured Tours */}
      <section className="py-16 bg-gradient-to-b from-white to-orange-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold mb-4">
              BEST OFFERS
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Travel Packages</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Deals made especially for you. Everything you need—on a budget.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground mt-4">Loading amazing tours...</p>
            </div>
          ) : featuredTours.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-muted-foreground">No tours available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTours.map((tour) => (
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
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                        <MapPin className="text-white" size={64} />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-orange-600 mb-2">
                      <MapPin size={14} />
                      <span className="font-medium">{tour.category}</span>
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
                        <Button className="bg-orange-500 hover:bg-orange-600">
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

          <div className="text-center mt-12">
            <Link href="/tours">
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white">
                View All Packages
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              WHY CHOOSE US
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">We Make Your Journey Memorable</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your satisfaction is our priority. We provide the best services to make your trip unforgettable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl hover:bg-orange-50 transition-colors">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Guides</h3>
              <p className="text-muted-foreground">
                Professional local guides with deep knowledge of Rajasthan's history and culture
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-orange-50 transition-colors">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3">Safe & Secure</h3>
              <p className="text-muted-foreground">
                Your safety is our priority with verified accommodations and transport
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-orange-50 transition-colors">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3">Best Prices</h3>
              <p className="text-muted-foreground">
                Competitive pricing with no hidden costs. Get the best value for your money
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:bg-orange-50 transition-colors">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <HeadphonesIcon className="text-white" size={36} />
              </div>
              <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
              <p className="text-muted-foreground">
                Round-the-clock customer support to assist you throughout your journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Explore Rajasthan?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Book your dream tour today and experience the magic of Rajasthan with Ghumo Firo India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/tours">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                Browse All Tours
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-white">
              <Phone size={20} />
              <span className="text-lg font-semibold">+91 9876543210</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
