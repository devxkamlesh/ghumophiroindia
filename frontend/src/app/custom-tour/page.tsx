'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Users, Calendar, DollarSign, MapPin, Heart } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://187.127.151.137/api/v1';

const destinations = ['Jaipur', 'Udaipur', 'Jaisalmer', 'Jodhpur', 'Pushkar', 'Mount Abu', 'Bikaner', 'Ajmer'];
const interests = ['Heritage Sites', 'Desert Safari', 'Wildlife', 'Photography', 'Adventure', 'Luxury', 'Cultural', 'Food Tours'];

export default function CustomTourPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    numberOfTravelers: 2,
    duration: 5,
    budget: '',
    destinations: [] as string[],
    interests: [] as string[],
    startDate: '',
    additionalInfo: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/custom-tours`, {
        ...formData,
        startDate: formData.startDate || undefined,
      });
      
      alert('Custom tour request submitted successfully! We will contact you soon.');
      router.push('/');
    } catch (error: any) {
      console.error('Failed to submit request:', error);
      alert(error.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDestination = (dest: string) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.includes(dest)
        ? prev.destinations.filter(d => d !== dest)
        : [...prev.destinations, dest]
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-100 via-pink-100 to-orange-200 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-lg mb-6">
              <Sparkles className="text-orange-500" size={20} />
              <span className="text-sm font-semibold">Personalized Just For You</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Create Your <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Dream Tour</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Tell us your preferences and we'll craft a perfect Rajasthan experience tailored to your interests, budget, and schedule
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border bg-background"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border bg-background"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border bg-background"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Country *</label>
                      <input
                        type="text"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border bg-background"
                        placeholder="India"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trip Details */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Trip Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        <Users size={16} className="inline mr-2" />
                        Number of Travelers *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="50"
                        value={formData.numberOfTravelers}
                        onChange={(e) => setFormData({ ...formData, numberOfTravelers: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 rounded-lg border bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        <Calendar size={16} className="inline mr-2" />
                        Duration (Days) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="30"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 rounded-lg border bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        <DollarSign size={16} className="inline mr-2" />
                        Budget Range *
                      </label>
                      <select
                        required
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border bg-background"
                      >
                        <option value="">Select budget</option>
                        <option value="₹50,000 - ₹100,000">₹50,000 - ₹100,000</option>
                        <option value="₹100,000 - ₹200,000">₹100,000 - ₹200,000</option>
                        <option value="₹200,000 - ₹300,000">₹200,000 - ₹300,000</option>
                        <option value="₹300,000+">₹300,000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        <Calendar size={16} className="inline mr-2" />
                        Preferred Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border bg-background"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Destinations */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-2">
                    <MapPin size={24} className="inline mr-2" />
                    Select Destinations *
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">Choose one or more destinations you'd like to visit</p>
                  <div className="flex flex-wrap gap-3">
                    {destinations.map((dest) => (
                      <Badge
                        key={dest}
                        variant={formData.destinations.includes(dest) ? 'default' : 'outline'}
                        className="cursor-pointer px-4 py-2 text-sm"
                        onClick={() => toggleDestination(dest)}
                      >
                        {dest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Interests */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-2">
                    <Heart size={24} className="inline mr-2" />
                    Your Interests
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">Select activities and experiences you're interested in</p>
                  <div className="flex flex-wrap gap-3">
                    {interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant={formData.interests.includes(interest) ? 'default' : 'outline'}
                        className="cursor-pointer px-4 py-2 text-sm"
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border bg-background"
                    placeholder="Tell us more about your preferences, special requirements, or any specific requests..."
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading || formData.destinations.length === 0}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 px-12"
                >
                  {loading ? 'Submitting...' : 'Submit Request'}
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  We'll review your request and get back to you within 24 hours
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
