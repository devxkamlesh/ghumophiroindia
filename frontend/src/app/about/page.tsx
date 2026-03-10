import { Award, Users, Globe, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="pt-20">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="font-display text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Crafting unforgettable journeys through Rajasthan since 2010
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="prose prose-lg">
              <p className="text-gray-700 mb-4">
                Founded in 2010 by passionate travel enthusiasts, Rajasthan Tours has grown from a small local operator to one of the most trusted names in Rajasthan tourism. Our journey began with a simple mission: to share the magic of Rajasthan with travelers from around the world.
              </p>
              <p className="text-gray-700 mb-4">
                Over the years, we&apos;ve helped thousands of travelers discover the royal heritage, vibrant culture, and breathtaking landscapes of Rajasthan. From the pink palaces of Jaipur to the golden dunes of Jaisalmer, we create experiences that go beyond typical tourism.
              </p>
              <p className="text-gray-700">
                Today, we&apos;re proud to be a team of local experts, professional guides, and travel specialists dedicated to creating personalized journeys that exceed expectations.
              </p>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">14+ Years Experience</h3>
                <p className="text-gray-600">Over a decade of expertise in Rajasthan tourism</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">2,500+ Happy Travelers</h3>
                <p className="text-gray-600">Thousands of satisfied customers worldwide</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">50+ Countries Served</h3>
                <p className="text-gray-600">Welcoming guests from around the globe</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">98% Satisfaction Rate</h3>
                <p className="text-gray-600">Consistently high ratings and reviews</p>
              </div>
            </div>
          </section>

          <section className="bg-primary-50 rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Values</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2">Authenticity</h3>
                <p className="text-gray-700">We showcase the real Rajasthan, connecting you with local culture and traditions.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Personalization</h3>
                <p className="text-gray-700">Every traveler is unique. We customize experiences to match your interests and pace.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Sustainability</h3>
                <p className="text-gray-700">We&apos;re committed to responsible tourism that benefits local communities.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Excellence</h3>
                <p className="text-gray-700">From planning to execution, we maintain the highest standards of service.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
