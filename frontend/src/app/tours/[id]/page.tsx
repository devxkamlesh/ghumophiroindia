'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { tourService } from '@/services/api';
import { formatCurrency } from '@/lib/utils';
import { 
  Clock, Users, MapPin, Star, Check, X, Calendar, 
  ArrowLeft, Share2, Heart, ChevronRight 
} from 'lucide-react';
import type { Tour } from '@/types';

export default function TourDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchTour(params.id as string);
    }
  }, [params.id]);

  const fetchTour = async (id: string) => {
    try {
      const data = await tourService.getById(id);
      setTour(data);
    } catch (error) {
      console.error('Failed to fetch tour:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MapPin className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h2 className="text-2xl font-bold mb-2">Tour Not Found</h2>
          <p className="text-muted-foreground mb-4">The tour you're looking for doesn't exist</p>
          <Button onClick={() => router.push('/tours')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Tours
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
      </div>

      {/* Image Gallery */}
      <section className="container mx-auto px-4 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
            {tour.images && tour.images[selectedImage] ? (
              <Image
                src={tour.images[selectedImage]}
                alt={tour.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                <MapPin className="text-white" size={64} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {tour.images && tour.images.slice(0, 4).map((image, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative h-44 lg:h-60 rounded-xl overflow-hidden cursor-pointer transition-all ${
                  selectedImage === idx ? 'ring-4 ring-primary' : 'hover:opacity-80'
                }`}
              >
                <Image src={image} alt={`${tour.title} ${idx + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge className="capitalize">{tour.category}</Badge>
                <Badge variant="outline" className="capitalize">{tour.difficulty}</Badge>
                {tour.featured && (
                  <Badge className="bg-yellow-500">
                    <Star size={12} className="mr-1 fill-white" />
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{tour.title}</h1>
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{tour.duration} Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>Max {tour.maxGroupSize} People</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{tour.destination}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About This Tour</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{tour.description}</p>
              </CardContent>
            </Card>

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Tour Highlights</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tour.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="text-green-500 flex-shrink-0 mt-1" size={18} />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Included/Excluded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tour.included && tour.included.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-green-600">What's Included</h3>
                    <ul className="space-y-2">
                      {tour.included.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="text-green-500 flex-shrink-0 mt-1" size={16} />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {tour.excluded && tour.excluded.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4 text-red-600">What's Excluded</h3>
                    <ul className="space-y-2">
                      {tour.excluded.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <X className="text-red-500 flex-shrink-0 mt-1" size={16} />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Tour Itinerary</h2>
                  <div className="space-y-6">
                    {tour.itinerary.map((day, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {day.day}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold mb-2">{day.title}</h4>
                          <p className="text-muted-foreground mb-3">{day.description}</p>
                          {day.activities && day.activities.length > 0 && (
                            <ul className="space-y-1">
                              {day.activities.map((activity, actIdx) => (
                                <li key={actIdx} className="flex items-center gap-2 text-sm">
                                  <ChevronRight size={14} className="text-primary" />
                                  <span>{activity}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-2">
              <CardContent className="p-6">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Price per person</p>
                  <p className="text-3xl font-bold text-primary">{formatCurrency(tour.price)}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="font-semibold">{tour.duration} Days</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm text-muted-foreground">Group Size</span>
                    <span className="font-semibold">Max {tour.maxGroupSize}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm text-muted-foreground">Difficulty</span>
                    <Badge variant="outline" className="capitalize">{tour.difficulty}</Badge>
                  </div>
                </div>

                <Button className="w-full mb-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  <Calendar size={18} className="mr-2" />
                  Book Now
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Heart size={18} />
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 size={18} />
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-center text-muted-foreground">
                    Need help? Contact us at
                    <br />
                    <a href="tel:+919876543210" className="text-primary font-semibold">
                      +91 98765 43210
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
