'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { tourService } from '@/services/api';
import { formatCurrency } from '@/lib/utils';
import { Clock, Users, MapPin } from 'lucide-react';
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
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Explore Rajasthan with Ghumo Firo India
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Discover the royal heritage, vibrant culture, and stunning landscapes of Rajasthan
          </p>
          <Link href="/tours">
            <Button size="lg" className="text-lg px-8 py-6">
              Explore Tours
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Tours</h2>
          <p className="text-muted-foreground text-lg">
            Handpicked experiences for your perfect Rajasthan adventure
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading featured tours...</p>
          </div>
        ) : featuredTours.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured tours available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTours.slice(0, 6).map((tour) => (
              <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full">
                  {tour.images && tour.images[0] ? (
                    <Image
                      src={tour.images[0]}
                      alt={tour.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <MapPin className="text-muted-foreground" size={48} />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{tour.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {tour.shortDescription || tour.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{tour.duration} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>Max {tour.maxGroupSize}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(tour.price)}
                    </span>
                    <span className="text-sm text-muted-foreground"> / person</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/tours/${tour.id}`} className="w-full">
                    <Button className="w-full">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/tours">
            <Button variant="outline" size="lg">
              View All Tours
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Guides</h3>
              <p className="text-muted-foreground">
                Local experts who know every corner of Rajasthan
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Small Groups</h3>
              <p className="text-muted-foreground">
                Intimate experiences with limited group sizes
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Booking</h3>
              <p className="text-muted-foreground">
                Easy booking process with flexible dates
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
