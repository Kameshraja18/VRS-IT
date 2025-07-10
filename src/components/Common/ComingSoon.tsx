import React from 'react';
import { motion } from 'framer-motion';
import { Construction, Clock, Star, Zap } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description?: string;
  features?: string[];
}

const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title, 
  description = "We're working hard to bring you this amazing feature!", 
  features = [] 
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-[60vh] flex items-center justify-center p-6"
    >
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Construction className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <Star className="w-4 h-4 text-yellow-800" />
            </div>
          </div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          {title}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-600 mb-8"
        >
          {description}
        </motion.p>

        {features.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              Upcoming Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center space-x-2 text-gray-500"
        >
          <Clock className="w-5 h-5" />
          <span>Expected completion: Soon</span>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <p className="text-blue-800 font-medium">
              💡 Have suggestions for this feature? Contact the development team!
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ComingSoon;