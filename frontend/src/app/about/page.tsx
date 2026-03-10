'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Award, Users, Heart, MapPin, Phone, Mail, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-100 via-pink-100 to-orange-200 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Ghumo Firo India</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Your trusted partner for exploring the magnificent heritage and culture of Rajasthan
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-muted-foreground text-center mb-8">
                Founded in 2010, Ghumo Firo India has been dedicated to showcasing the rich cultural heritage, 
                magnificent forts, vibrant traditions, and warm hospitality of Rajasthan. With over 14 years of 
                experience, we've helped thousands of travelers create unforgettable memories in the Land of Kings.
              </p>
              <p className="text-muted-foreground text-center">
                Our team of local experts and passionate travel enthusiasts work tirelessly to curate authentic 
                experiences that go beyond typical tourist attractions. We believe in sustainable tourism that 
                benefits local communities while providing our guests with genuine cultural immersion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                  <Shield className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Safe & Secure</h3>
                <p className="text-sm text-muted-foreground">
                  Licensed, insured, and committed to your safety throughout your journey
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Award className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Expert Guides</h3>
                <p className="text-sm text-muted-foreground">
                  Local experts with deep knowledge of Rajasthan's history and culture
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                  <Users className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Small Groups</h3>
                <p className="text-sm text-muted-foreground">
                  Intimate group sizes for personalized attention and better experiences
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center">
                  <Heart className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Best Value</h3>
                <p className="text-sm text-muted-foreground">
                  Competitive pricing with no hidden fees and transparent policies
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-3">Authenticity</h3>
              <p className="text-muted-foreground">
                We provide genuine cultural experiences that respect local traditions and communities
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-3">Sustainability</h3>
              <p className="text-muted-foreground">
                We're committed to responsible tourism that preserves Rajasthan's heritage for future generations
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-3">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for excellence in every aspect of our service, from planning to execution
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <p className="text-4xl font-bold mb-2">14+</p>
              <p className="text-white/90">Years Experience</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">5000+</p>
              <p className="text-white/90">Happy Travelers</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">50+</p>
              <p className="text-white/90">Tour Packages</p>
            </div>
            <div>
              <p className="text-4xl font-bold mb-2">4.9/5</p>
              <p className="text-white/90">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <MapPin className="mx-auto mb-4 text-primary" size={32} />
                <h3 className="font-bold mb-2">Visit Us</h3>
                <p className="text-sm text-muted-foreground">
                  Jaipur, Rajasthan<br />India
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <Phone className="mx-auto mb-4 text-primary" size={32} />
                <h3 className="font-bold mb-2">Call Us</h3>
                <a href="tel:+919876543210" className="text-sm text-primary hover:underline">
                  +91 98765 43210
                </a>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <Mail className="mx-auto mb-4 text-primary" size={32} />
                <h3 className="font-bold mb-2">Email Us</h3>
                <a href="mailto:info@ghumofiroindia.com" className="text-sm text-primary hover:underline">
                  info@ghumofiroindia.com
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore Rajasthan?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let us help you plan your perfect Rajasthan adventure. Browse our tours or contact us for a custom itinerary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                Browse Tours
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
