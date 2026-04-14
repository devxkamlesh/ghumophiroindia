'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPanelLayout } from '@/components/user-panel/UserPanelLayout';
import { bookingService } from '@/services/api';
import { formatCurrency } from '@/lib/utils';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

interface Booking {
  id: number;
  tourId: number;
  userId: number;
  numberOfPeople: number;
  totalPrice: string;
  bookingDate: string;
  status: string;
  paymentStatus: string;
  specialRequests?: string;
  createdAt: string;
  tour?: {
    id: number;
    title: string;
    destination: string;
    duration: number;
  };
}

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const data = await bookingService.getMyBookings();
        setBookings(data);
      } catch (err: any) {
        console.error('Failed to fetch bookings:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <UserPanelLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
        </div>
      </UserPanelLayout>
    );
  }

  return (
    <UserPanelLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">My Bookings</h1>
          <p className="text-sm text-muted-foreground">View and manage your tour bookings</p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="mx-auto mb-3 text-muted-foreground" size={40} />
              <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You haven't made any tour bookings yet. Explore our tours!
              </p>
              <Link href="/tours">
                <Button size="sm">Browse Tours</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold truncate">
                        {booking.tour?.title || 'Tour Details'}
                      </h3>
                      <p className="text-xs text-muted-foreground">Booking #{booking.id}</p>
                    </div>
                    <div className="flex gap-1.5 ml-2">
                      <Badge className={`${getStatusColor(booking.status)} text-xs px-2 py-0.5`}>
                        {booking.status}
                      </Badge>
                      <Badge className={`${getPaymentStatusColor(booking.paymentStatus)} text-xs px-2 py-0.5`}>
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    <div className="flex items-center gap-1.5 text-xs">
                      <MapPin size={14} className="text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{booking.tour?.destination || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Clock size={14} className="text-muted-foreground flex-shrink-0" />
                      <span>{booking.tour?.duration || 0}D</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Users size={14} className="text-muted-foreground flex-shrink-0" />
                      <span>{booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'person' : 'people'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Calendar size={14} className="text-muted-foreground flex-shrink-0" />
                      <span className="truncate">
                        {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="p-2 bg-muted/50 rounded-lg mb-3">
                      <p className="text-xs font-medium mb-0.5">Special Requests:</p>
                      <p className="text-xs text-muted-foreground">{booking.specialRequests}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Amount</p>
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(parseFloat(booking.totalPrice))}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {booking.tour && (
                        <Link href={`/tours/${booking.tourId}`}>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            View Tour
                          </Button>
                        </Link>
                      )}
                      {booking.status.toLowerCase() === 'pending' && (
                        <Button size="sm" variant="destructive" className="h-8 text-xs">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </UserPanelLayout>
  );
}
