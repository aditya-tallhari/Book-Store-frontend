// src/pages/About.jsx
import {
  BookOpen,
  Users,
  Award,
  ShoppingBag,
  Heart,
  TrendingUp,
  Shield,
  Headphones,
  Clock,
  Package,
  RefreshCw,
  Star,
  Target,
  Lightbulb,
  Globe,
  Truck,
  } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const stats = [
    {
      label: "Books Available",
      value: "10,000+",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Happy Customers",
      value: "50,000+",
      icon: Users,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Years of Service",
      value: "15+",
      icon: Award,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      label: "Daily Orders",
      value: "500+",
      icon: ShoppingBag,
      color: "from-violet-500 to-violet-600",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Reading",
      description:
        "We believe in the transformative power of books and are dedicated to fostering a love for reading in our community. Every book is a journey waiting to be discovered.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description:
        "Every book in our collection is carefully selected and verified to ensure the highest quality content, authentic publications, and excellent physical condition.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: TrendingUp,
      title: "Competitive Pricing",
      description:
        "We offer unbeatable prices without compromising on quality, making reading accessible to everyone. Regular deals and exclusive member discounts.",
      color: "from-orange-500 to-amber-500",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description:
        "Our dedicated customer support team is always ready to assist you with any queries, recommendations, or concerns through multiple channels.",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  const features = [
    {
      text: "Extensive collection of books across all genres and categories",
      icon: BookOpen,
    },
    { text: "New releases and bestsellers updated weekly", icon: Star },
    {
      text: "Secure payment gateway with multiple payment options",
      icon: Shield,
    },
    { text: "Fast and reliable delivery with real-time tracking", icon: Truck },
    { text: "Easy 30-day returns and exchange policy", icon: RefreshCw },
    { text: "AI-powered personalized recommendations", icon: Lightbulb },
    { text: "Exclusive discounts and loyalty rewards program", icon: Award },
    { text: "Professional gift wrapping and greeting cards", icon: Package },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Book Enthusiast",
      content:
        "BookStore has been my go-to for years. Their collection is vast, prices are great, and delivery is always on time!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Student",
      content:
        "As a student, I appreciate their affordable prices and amazing selection of academic books. Customer service is top-notch!",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Fiction Lover",
      content:
        "The personalized recommendations are spot-on! I have discovered so many amazing authors through BookStore.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-full">
                Trusted by 50,000+ Readers
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                BookStore
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Your trusted companion in the world of literature, connecting
              readers with stories that inspire, educate, and entertain since
              2009
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-all transform hover:-translate-y-1">
                Explore Our Collection
              </button>
              <Link to="/contact" className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-full border-2 border-indigo-600 hover:bg-indigo-50 transition-all">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl mb-4 shadow-lg group-hover:shadow-2xl transition-all transform group-hover:-translate-y-2`}
                >
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                Our Journey
              </span>
              <h2 className="text-5xl font-bold text-gray-900 mb-6 mt-2">
                The Story Behind{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  BookStore
                </span>
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                <p>
                  Founded in 2009 by a group of passionate book lovers,
                  BookStore began as a cozy neighborhood bookshop with just 500
                  carefully selected titles. Our founder, inspired by the lack
                  of accessible quality literature in the community, set out to
                  create a space where readers could discover their next great
                  adventure.
                </p>
                <p>
                  What started as a humble store has transformed into a
                  comprehensive online platform serving readers nationwide. We
                  have grown our collection to over 10,000 titles, introduced
                  innovative features like AI-powered recommendations, and built
                  a community of over 50,000 passionate readers.
                </p>
                <p>
                  Despite our growth, our mission remains unchanged: to make
                  quality literature accessible to everyone. Every book we add,
                  every feature we build, and every interaction we have is
                  guided by our love for reading and commitment to our
                  customers.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Quality First
                    </div>
                    <div className="text-sm text-gray-600">
                      Curated Collection
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Nationwide
                    </div>
                    <div className="text-sm text-gray-600">Fast Delivery</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-200 rounded-3xl overflow-hidden shadow-2xl transform rotate-3">
                <div className="w-full h-full flex items-center justify-center transform -rotate-3">
                  <img
                    src="/Bookshop-bro.svg"
                    alt="Bookshop illustration"
                    className="w-full h-auto max-w-sm mx-auto"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      15+ Years
                    </div>
                    <div className="text-gray-600">Of Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              Core Values
            </span>
            <h2 className="text-5xl font-bold text-gray-900 mb-4 mt-2">
              What We Stand For
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our values guide every decision we make and shape the experience
              we deliver
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform group-hover:-translate-y-2">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${value.color} rounded-xl mb-6 shadow-lg`}
                  >
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="text-5xl font-bold text-gray-900 mb-4 mt-2">
              The BookStore Advantage
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              More than just books - a complete reading ecosystem designed for
              you
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-800 font-medium leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="text-5xl font-bold text-gray-900 mb-4 mt-2">
              What Our Readers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our community
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-bold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to Start Your Reading Journey?
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto">
            Join our community of 50,000+ happy readers and discover your next
            favorite book today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-5 bg-white text-indigo-600 font-bold rounded-full hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-2xl text-lg">
              Browse 10,000+ Books
            </button>
            <button className="px-10 py-5 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-indigo-600 transition-all text-lg">
              Get in Touch
            </button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
