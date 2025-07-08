import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Users, BookOpen, Award, MapPin, Phone, Mail, Facebook, Twitter, Youtube, Instagram, Star, CheckCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: Users,
      title: "Expert Faculty",
      description: "Learn from industry experts and experienced professors"
    },
    {
      icon: BookOpen,
      title: "Modern Curriculum",
      description: "Updated syllabus aligned with industry requirements"
    },
    {
      icon: Award,
      title: "100% Placement",
      description: "Excellent placement record with top companies"
    },
    {
      icon: TrendingUp,
      title: "Research Excellence",
      description: "State-of-the-art research facilities and opportunities"
    }
  ];

  const stats = [
    { number: "1000+", label: "Students" },
    { number: "50+", label: "Faculty" },
    { number: "95%", label: "Placement Rate" },
    { number: "25+", label: "Years of Excellence" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-blue-800 to-blue-900 p-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-800" />
            </div>
            <span className="text-white text-xl font-bold">VRS-IT</span>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-white text-blue-800 rounded-lg hover:bg-blue-50 transition duration-300 transform hover:scale-105 font-semibold"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/student-signup')}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition duration-300 transform hover:scale-105 font-semibold"
            >
              Student Signup
            </button>
            <button
              onClick={() => navigate('/staff-signup')}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition duration-300 transform hover:scale-105 font-semibold"
            >
              Staff Signup
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white min-h-[80vh] flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="inline-block px-4 py-2 bg-yellow-400 text-black rounded-full text-sm font-semibold">
                🏆 GOLD INSTITUTE - AICTE-CII Survey 2016
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Welcome to
                <span className="block text-yellow-400">VRS College of</span>
                <span className="block text-teal-400">Engineering & Technology</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Shaping Future Engineers with Excellence in Education, Innovation, and Industry-Ready Skills
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => navigate('/student-signup')}
                  className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
                >
                  Apply Now - Student
                </button>
                <button
                  onClick={() => navigate('/staff-signup')}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
                >
                  Join Faculty
                </button>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="text-center">
                  <GraduationCap className="w-32 h-32 text-white mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white">Excellence in Education</h3>
                  <p className="text-blue-100 mt-2">Approved by AICTE • Affiliated to Anna University</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        className="py-16 bg-gray-50"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-blue-800 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose VRS-IT?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience world-class education with state-of-the-art facilities and industry-aligned curriculum
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        className="py-20 bg-gradient-to-br from-blue-50 to-purple-50"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl shadow-xl flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="w-24 h-24 text-teal-600 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Modern Campus Facilities</p>
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">About VRS College</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Established in 1994, VRS College of Engineering and Technology has been a beacon of excellence 
                in technical education. With the trust of the Government of Tamil Nadu and approval from AICTE, 
                we are affiliated with Anna University, Chennai.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">NAAC Reaccredited Institution</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">ISO 9001:2008 Recertified</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700">Industry-Linked Technical Institute</span>
                </div>
              </div>
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Learn More About Us
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Courses Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-6">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Courses</h2>
            <p className="text-xl text-gray-600">Choose from our industry-aligned engineering programs</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Computer Science Engineering</h3>
              <p className="text-gray-700 mb-6">Comprehensive program covering programming, algorithms, AI, and software engineering with industry exposure.</p>
              <ul className="space-y-2 text-gray-600">
                <li>• 8 Semesters Program</li>
                <li>• Industry-Aligned Curriculum</li>
                <li>• Hands-on Projects</li>
                <li>• 100% Placement Support</li>
              </ul>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Information Technology</h3>
              <p className="text-gray-700 mb-6">Focused on modern IT solutions, web development, database management, and emerging technologies.</p>
              <ul className="space-y-2 text-gray-600">
                <li>• 8 Semesters Program</li>
                <li>• Latest Technology Stack</li>
                <li>• Industry Internships</li>
                <li>• Startup Incubation</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        className="py-20 bg-gray-900 text-white"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-semibold text-teal-400 mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-teal-400" />
                  <span>Arasur-607 107, Villupuram District</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-teal-400" />
                  <span>+91-4146-123456</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-teal-400" />
                  <span>info@vrsit.edu.in</span>
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-semibold text-teal-400 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-teal-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Admissions</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Academics</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Placements</a></li>
              </ul>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-semibold text-teal-400 mb-4">Departments</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Computer Science</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Information Technology</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Science & Humanities</a></li>
              </ul>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-semibold text-teal-400 mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <Facebook className="w-6 h-6 text-white hover:text-teal-400 transition-colors cursor-pointer" />
                <Twitter className="w-6 h-6 text-white hover:text-teal-400 transition-colors cursor-pointer" />
                <Youtube className="w-6 h-6 text-white hover:text-teal-400 transition-colors cursor-pointer" />
                <Instagram className="w-6 h-6 text-white hover:text-teal-400 transition-colors cursor-pointer" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-6">
        <div className="container mx-auto px-6">
          <p className="text-lg">
            © 2025 VRS College of Engineering & Technology. All rights reserved. |{' '}
            <span className="text-teal-400">Counselling Code: 1421</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;