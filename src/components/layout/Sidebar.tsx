import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  TrendingUp,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wallet
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Transactions',
      href: '/transactions',
      icon: CreditCard,
    },
    {
      name: 'Budgets & Goals',
      href: '/budgets',
      icon: PiggyBank,
    },
    {
      name: 'Insights',
      href: '/insights',
      icon: TrendingUp,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
    },
  ];

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 }
  };

  const textVariants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -10 }
  };

  return (
    <motion.div
      className="bg-surface-elevated border-r border-border h-screen flex flex-col"
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={textVariants}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg">FinanceTracker</h1>
                <p className="text-xs text-muted-foreground">Student Edition</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink key={item.name} to={item.href}>
              <motion.div
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl transition-colors relative
                  ${isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-surface text-muted-foreground hover:text-foreground'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={textVariants}
                      className="font-medium text-sm"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute right-2 w-2 h-2 bg-primary-foreground rounded-full"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-border">
        <motion.div
          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface transition-colors cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={textVariants}
                className="font-medium text-sm text-muted-foreground"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;