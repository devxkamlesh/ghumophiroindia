import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Award, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Ghumo Firo India</h1>
          <p className="text-lg text-muted-foreground">
            Your trusted partner for exploring the royal heritage of Rajasthan
          </p>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-muted-foreground">
            Welcome to Ghumo Firo India, your gateway to experiencing the magnificent state of Rajasthan. 
            We are passionate about showcasing the rich cultural heritage, stunning architecture, and 
            vibrant traditions that make Rajasthan one of India's most captivating destinations.
          </p>
          <p className="text-muted-foreground mt-4">
            Founded by travel enthusiasts who fell in love with Rajasthan's charm, we specialize in 
            creating memorable experiences that go beyond typical tourist attractions. Our carefully 
            curated tours blend historical exploration, cultural immersion, and authentic local experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="text-primary" size={24} />
              </div>
              <CardTitle>Local Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our team consists of local guides who have deep knowledge of Rajasthan's history, 
                culture, and hidden gems that most tourists never discover.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users className="text-primary" size={24} />
              </div>
              <CardTitle>Small Group Tours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We believe in quality over quantity. Our small group sizes ensure personalized 
                attention and a more intimate travel experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Award className="text-primary" size={24} />
              </div>
              <CardTitle>Quality Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                From comfortable accommodations to reliable transportation, we ensure every 
                aspect of your journey meets the highest standards.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Heart className="text-primary" size={24} />
              </div>
              <CardTitle>Sustainable Tourism</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We are committed to responsible tourism that benefits local communities and 
                preserves Rajasthan's cultural and natural heritage.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            To provide authentic, enriching travel experiences that create lasting memories while 
            supporting local communities and preserving the cultural heritage of Rajasthan for 
            future generations.
          </p>
        </div>
      </div>
    </div>
  );
}
