'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Mail, Phone, MapPin, Calendar, Users, Clock, DollarSign } from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow, format } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://187.127.151.137/api/v1';

interface CustomRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  numberOfTravelers: number;
  duration: number;
  budget: string;
  destinations: string[];
  interests: string[] | null;
  startDate: string | null;
  additionalInfo: string | null;
  status: 'pending' | 'processing' | 'quoted' | 'confirmed' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  quoted: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function CustomRequestsPage() {
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/custom-tours`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(data.data.requests || []);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/custom-tours/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Custom Tour Requests</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage custom tour requests from customers</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'pending', 'processing', 'quoted', 'confirmed', 'rejected'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status}
              {status === 'all' && ` (${requests.length})`}
              {status !== 'all' && ` (${requests.filter(r => r.status === status).length})`}
            </Button>
          ))}
        </div>

        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold mb-2">No Requests Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'all' ? 'No custom tour requests yet' : `No ${filter} requests`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{request.name}</h3>
                        <Badge className={statusColors[request.status]}>
                          {request.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Mail size={14} />
                          <span>{request.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone size={14} />
                          <span>{request.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{request.country}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <Users size={14} />
                        <span>Travelers</span>
                      </div>
                      <p className="font-semibold">{request.numberOfTravelers}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <Clock size={14} />
                        <span>Duration</span>
                      </div>
                      <p className="font-semibold">{request.duration} days</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <DollarSign size={14} />
                        <span>Budget</span>
                      </div>
                      <p className="font-semibold">{request.budget}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <Calendar size={14} />
                        <span>Start Date</span>
                      </div>
                      <p className="font-semibold">
                        {request.startDate ? format(new Date(request.startDate), 'MMM dd, yyyy') : 'Flexible'}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Destinations:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {request.destinations.map((dest, idx) => (
                        <Badge key={idx} variant="outline">{dest}</Badge>
                      ))}
                    </div>
                  </div>

                  {request.interests && request.interests.length > 0 && (
                    <div className="mb-3">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Interests:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {request.interests.map((interest, idx) => (
                          <Badge key={idx} variant="outline" className="bg-orange-50 dark:bg-orange-900/20">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {request.additionalInfo && (
                    <div className="mb-4">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Additional Info:</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">
                        {request.additionalInfo}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(request.id, 'processing')}
                      disabled={request.status === 'processing'}
                    >
                      Start Processing
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(request.id, 'quoted')}
                      disabled={request.status === 'quoted'}
                    >
                      Send Quote
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(request.id, 'confirmed')}
                      disabled={request.status === 'confirmed'}
                      className="text-green-600"
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(request.id, 'rejected')}
                      disabled={request.status === 'rejected'}
                      className="text-red-600"
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
