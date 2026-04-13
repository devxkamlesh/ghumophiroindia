'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { tourService } from '@/services/api';
import { formatCurrency } from '@/lib/utils';
import { Clock, Users, MapPin, Filter } from 'lucide-react';
import type { Tour } from '@/types';

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [durationFilter, setDurationFilter] = useState<string>('all');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await tourService.getAll();
        const toursArray = Array.isArray(data) ? data : [];
        setTours(toursArray);
        setFilteredTours(toursArray);
      } catch (error) {
        console.error('Failed to fetch tours:', error);
        setTours([]);
        setFilteredTours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  useEffect(() => {
    let filtered = [...tours];

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(tour => tour.category.toLowerCase() === categoryFilter);
    }

    if (priceFilter !== 'all') {
      if (priceFilter === 'low') {
        filtered = filtered.filter(tour => tour.price < 15000);
      } else if (priceFilter === 'medium') {
        filtered = filtered.filter(tour => tour.price >= 15000 && tour.price < 30000);
      } else if (priceFilter === 'high') {
        filtered = filtered.filter(tour => tour.price >= 30000);
      }
    }

    if (durationFilter !== 'all') {
      if (durationFilter === 'short') {
        filtered = filtered.filter(tour => tour.duration <= 3);
      } else if (durationFilter === 'medium') {
        filtered = filtered.filter(tour => tour.duration > 3 && tour.duration <= 7);
      } else if (durationFilter === 'long') {
        filtered = filtered.filter(tour => tour.duration > 7);
      }
    }

    setFilteredTours(filtered);
  }, [categoryFilter, priceFilter, durationFilter, tours]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-muted-foreground">Loading tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Explore Our Tours</h1>
        <p className="text-muted-foreground text-lg">
          Discover amazing destinations across Rajasthan
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 p-6 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="all">All Categories</option>
              <option value="heritage">Heritage</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
              <option value="wildlife">Wildlife</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price Range</label>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="all">All Prices</option>
              <option value="low">Under ₹15,000</option>
              <option value="medium">₹15,000 - ₹30,000</option>
              <option value="high">Above ₹30,000</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duration</label>
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="all">All Durations</option>
              <option value="short">1-3 days</option>
              <option value="medium">4-7 days</option>
              <option value="long">8+ days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      {filteredTours.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tours found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
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
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {tour.category}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{tour.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {tour.shortDescription || tour.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{tour.duration} days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span>Max {tour.maxGroupSize}</span>
                  </div>
                </div>
                <div>
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
    </div>
  );
}
