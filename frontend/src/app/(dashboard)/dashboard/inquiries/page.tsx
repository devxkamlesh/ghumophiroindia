'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://187.127.151.137/api/v1';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string | null;
  tourInterest: string | null;
  message: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  createdAt: string;
}

const statusColors = {
  new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  converted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/inquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInquiries(data.data.inquiries || []);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/inquiries/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInquiries();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const filteredInquiries = filter === 'all' 
    ? inquiries 
    : inquiries.filter(i => i.status === filter);

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
          <h1 className="text-3xl font-bold mb-2">Inquiries Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer inquiries and questions</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'new', 'contacted', 'converted', 'closed'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status}
              {status === 'all' && ` (${inquiries.length})`}
              {status !== 'all' && ` (${inquiries.filter(i => i.status === status).length})`}
            </Button>
          ))}
        </div>

        {filteredInquiries.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold mb-2">No Inquiries Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'all' ? 'No inquiries yet' : `No ${filter} inquiries`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => (
              <Card key={inquiry.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{inquiry.name}</h3>
                        <Badge className={statusColors[inquiry.status]}>
                          {inquiry.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Mail size={14} />
                          <span>{inquiry.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone size={14} />
                          <span>{inquiry.phone}</span>
                        </div>
                        {inquiry.country && (
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{inquiry.country}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {inquiry.tourInterest && (
                    <div className="mb-3">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Interested in:
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                        {inquiry.tourInterest}
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {inquiry.message}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(inquiry.id, 'contacted')}
                      disabled={inquiry.status === 'contacted'}
                    >
                      Mark Contacted
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(inquiry.id, 'converted')}
                      disabled={inquiry.status === 'converted'}
                    >
                      Mark Converted
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(inquiry.id, 'closed')}
                      disabled={inquiry.status === 'closed'}
                    >
                      Close
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
