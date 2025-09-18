import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Shield, Target, Sparkles } from 'lucide-react';
import heroImage from '@/assets/hero-finance.jpg';

interface LandingProps {
  onEnterApp: () => void;
}

const Landing = ({ onEnterApp }: LandingProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "AI-powered insights to optimize your spending"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Bank-level security for your financial data"
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Achieve your financial goals with gamification"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <motion.div
        className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Left column - Content */}
        <motion.div className="text-center lg:text-left" variants={itemVariants}>
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            variants={itemVariants}
          >
            <Sparkles className="w-4 h-4" />
            Premium Student Finance Tracker
          </motion.div>

          <motion.h1
            className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
            variants={itemVariants}
          >
            Master Your
            <span className="gradient-primary bg-clip-text text-transparent"> Student </span>
            Finances
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0"
            variants={itemVariants}
          >
            Take control of your money with AI-powered insights, smart budgeting, 
            and gamified goal tracking designed specifically for students.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            variants={itemVariants}
          >
            <Button
              onClick={onEnterApp}
              size="lg"
              className="btn-hero text-lg px-8 py-4 group"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 glass"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Features grid */}
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={itemVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center lg:text-left"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-3">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right column - Hero Image */}
        <motion.div
          className="relative"
          variants={itemVariants}
        >
          <motion.div
            className="relative z-10"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img
              src={heroImage}
              alt="Student Finance Dashboard"
              className="w-full h-auto rounded-3xl shadow-2xl glow"
            />
          </motion.div>

          {/* Floating elements */}
          <motion.div
            className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-accent rounded-full glow opacity-80"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          <motion.div
            className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-secondary rounded-full glow opacity-60"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground mb-2">Ready to get started?</p>
          <div className="w-6 h-6 border-2 border-primary rounded-full mx-auto">
            <motion.div
              className="w-2 h-2 bg-primary rounded-full mx-auto mt-1"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;