"use client";

import React from "react";
import { motion } from "framer-motion";
import { Laptop, Smartphone, ArrowRight } from "lucide-react";

function MobileResponsiveMessage() {
  return (
    <div className="lg:hidden flex items-center justify-center p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="relative">          
          {/* Main content card */}
          <div className="relative bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 shadow-2xl">
            {/* Icon animation container */}
            <motion.div 
              className="mb-8 flex justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <div className="relative">
                <Smartphone className="w-12 h-12 text-gray-400" />
                <motion.div
                  animate={{ x: [0, 20], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-1/2 -translate-y-1/2 left-full ml-2"
                >
                  <ArrowRight className="w-6 h-6 text-blue-400" />
                </motion.div>
                <Laptop className="w-16 h-16 text-blue-400 absolute left-full ml-8 top-1/2 -translate-y-1/2" />
              </div>
            </motion.div>

            {/* Text content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center space-y-6"
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Desktop Experience Awaits!
              </h2>
              
              <p className="text-gray-300 leading-relaxed">
                For the optimal experience of our advanced features, please switch to a desktop or laptop device.
              </p>

              {/* Feature badges */}
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                {["Advanced Signal Analytics", "Real-time Data"].map((feature, index) => (
                  <motion.span
                    key={feature}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="px-3 py-1 rounded-full text-sm bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  >
                    {feature}
                  </motion.span>
                ))}
              </div>

              {/* Bottom message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-gray-400 text-sm mt-6"
              >
                Thank you for your understanding!
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default MobileResponsiveMessage;