
import { Car, Bike, Clock, Shield, CreditCard, MapPin, Star} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { Link } from "react-router"
import Navbar from "@/components/Navbar"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Navigation */}
    <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-red-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Premium Rentals
              <br />
              <span className="text-red-700">Redefined</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Experience the freedom of the road with our premium fleet of cars and bikes. Book instantly, drive
              confidently, return effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to={"/signup"}>
                <Button className="w-full sm:w-auto bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-red-900/25 transition-all duration-200 transform hover:scale-[1.02]">
                  Start Your Journey
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-gray-800/30 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 px-8 py-4 text-lg"
              >
                View Fleet
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose RYDIO?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We've revolutionized the rental experience with cutting-edge technology and premium service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-700/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Car className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Premium Cars</h3>
                <p className="text-gray-400">
                  From luxury sedans to powerful SUVs, our fleet offers the perfect vehicle for every occasion.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-700/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bike className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Sport Bikes</h3>
                <p className="text-gray-400">
                  Experience the thrill with our collection of high-performance motorcycles and scooters.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-700/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">24/7 Availability</h3>
                <p className="text-gray-400">
                  Book anytime, anywhere. Our platform is available round the clock for your convenience.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-700/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Full Insurance</h3>
                <p className="text-gray-400">
                  Drive with confidence knowing you're fully covered with our comprehensive insurance plans.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-700/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Easy Payment</h3>
                <p className="text-gray-400">
                  Secure and flexible payment options including digital wallets and contactless payments.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-700/50 hover:bg-gray-800/50 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-700/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Multiple Locations</h3>
                <p className="text-gray-400">
                  Pick up and drop off at any of our convenient locations across the city.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Get on the road in just three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-800 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Choose Your Ride</h3>
              <p className="text-gray-400">Browse our premium fleet and select the perfect vehicle for your needs.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-800 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Book Instantly</h3>
              <p className="text-gray-400">Complete your booking in seconds with our streamlined reservation system.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-800 to-red-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Hit the Road</h3>
              <p className="text-gray-400">Pick up your vehicle and enjoy the freedom of the open road.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust RYDIO for their rental needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">
                  "RYDIO made my business trip so much easier. The booking process was seamless and the car was
                  immaculate."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-700/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-red-400 font-semibold">JS</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">John Smith</p>
                    <p className="text-gray-400 text-sm">Business Executive</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">
                  "Amazing experience! The bike was in perfect condition and the customer service was outstanding."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-700/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-red-400 font-semibold">MJ</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Maria Johnson</p>
                    <p className="text-gray-400 text-sm">Adventure Enthusiast</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">
                  "Best rental service I've used. Transparent pricing, no hidden fees, and excellent vehicle quality."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-700/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-red-400 font-semibold">DW</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">David Wilson</p>
                    <p className="text-gray-400 text-sm">Frequent Traveler</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-red-900/20 to-red-800/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-300 mb-8">Join RYDIO today and experience the future of vehicle rentals</p>
          <Link to={"/signup"}>
            <Button className="bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white font-semibold px-12 py-4 text-lg shadow-lg hover:shadow-red-900/25 transition-all duration-200 transform hover:scale-[1.02]">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900/80 border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white tracking-wider mb-4">
                RY<span className="text-red-700">DIO</span>
              </h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Premium car and bike rentals redefined. Experience the freedom of the road with our cutting-edge
                platform and exceptional service.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                  <span className="text-white text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                  <span className="text-white text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                  <span className="text-white text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="#features" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="#pricing" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to={"/login"} className="text-gray-400 hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">© 2024 RYDIO. All rights reserved. Built with passion for the road.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
