'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { tourService } from '@/services/api';
import { formatCurrency } from '@/lib/utils';
import { Clock, Users, MapPin, Star, ArrowRight, Filter, Search } from 'lucide-react';
import type { Tour } from '@/types';

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    search: '',
  });

  useEffect(() => {
    fetchTours();
  }, [filters]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const data = await tourService.getAll();
      let filtered = Array.isArray(data) ? data : [];

      // Apply filters
      if (filters.category !== 'all') {
        filtered = filtered.filter(tour => tour.category === filters.category);
      }
      if (filters.difficulty !== 'all') {
        filtered = filtered.filter(tour => tour.difficulty === filters.difficulty);
      }
      if (filters.search) {
        filtered = filtered.filter(tour => 
          tour.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          tour.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setTours(filtered);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-100 via-pink-100 to-orange-200 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Our <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Tours</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover the beauty of Rajasthan with our carefully curated tour packages
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search tours..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Tours */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-muted-foreground" />
              <span className="font-semibold">Filters:</span>
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-2 rounded-lg border bg-background"
            >
              <option value="all">All Categories</option>
              <option value="city">City Tours</option>
              <option value="heritage">Heritage</option>
              <option value="desert">Desert Safari</option>
              <option value="custom">Custom</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="px-4 py-2 rounded-lg border bg-background"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
            </select>

            <Button
              variant="outline"
              onClick={() => setFilters({ category: 'all', difficulty: 'all', search: '' })}
            >
              Clear Filters
            </Button>
          </div>

          {/* Tours Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
            </div>
          ) : tours.length === 0 ? (
            <div className="text-center py-20">
              <MapPin className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="text-xl font-semibold mb-2">No Tours Found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
              <Button onClick={() => setFilters({ category: 'all', difficulty: 'all', search: '' })}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 text-muted-foreground">
                Showing {tours.length} {tours.length === 1 ? 'tour' : 'tours'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <Link key={tour.id} href={`/tours/${tour.id}`}>
                    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 h-full">
                      <div className="relative h-56 overflow-hidden">
                        {tour.images && tour.images[0] ? (
                          <Image
                            src={tour.images[0]}
                            alt={tour.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                            <MapPin className="text-white" size={48} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 capitalize">
                            {tour.category}
                          </Badge>
                        </div>
                        {tour.featured && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-yellow-500 text-white">
                              <Star size={12} className="mr-1 fill-white" />
                              Featured
                            </Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-5">
                        <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {tour.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {tour.shortDescription || tour.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{tour.duration}D</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span>Max {tour.maxGroupSize}</span>
                          </div>
                          <Badge variant="outline" className="capitalize text-xs">
                            {tour.difficulty}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground">Starting from</p>
                            <p className="text-xl font-bold text-primary">
                              {formatCurrency(tour.price)}
                            </p>
                          </div>
                          <Button size="sm" className="rounded-full">
                            View Details
                            <ArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" size={14} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
