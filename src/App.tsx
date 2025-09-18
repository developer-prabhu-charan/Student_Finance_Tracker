import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Pages
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Layout Components
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

// Hooks
import { useTheme } from "./hooks/useFinanceData";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const { theme } = useTheme();

  // Auto-authenticate after landing (for demo purposes)
  useEffect(() => {
    if (!showLanding) {
      const timer = setTimeout(() => {
        setIsAuthenticated(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showLanding]);

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    duration: 0.5
  };

  // Landing page
  if (showLanding) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen gradient-animated">
            <Toaster />
            <Sonner />
            <AnimatePresence mode="wait">
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Landing onEnterApp={() => setShowLanding(false)} />
              </motion.div>
            </AnimatePresence>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Main app with dashboard
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Toaster />
          <Sonner />
          
          <BrowserRouter>
            {isAuthenticated ? (
              <div className="flex min-h-screen w-full">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <main className="flex-1 overflow-auto">
                    <AnimatePresence mode="wait">
                      <Routes>
                        <Route 
                          path="/" 
                          element={
                            <motion.div
                              initial="initial"
                              animate="in"
                              exit="out"
                              variants={pageVariants}
                              transition={pageTransition}
                            >
                              <Dashboard />
                            </motion.div>
                          } 
                        />
                        <Route 
                          path="/transactions" 
                          element={
                            <motion.div
                              initial="initial"
                              animate="in"
                              exit="out"
                              variants={pageVariants}
                              transition={pageTransition}
                            >
                              <Transactions />
                            </motion.div>
                          } 
                        />
                        <Route 
                          path="/budgets" 
                          element={
                            <motion.div
                              initial="initial"
                              animate="in"
                              exit="out"
                              variants={pageVariants}
                              transition={pageTransition}
                            >
                              <Budgets />
                            </motion.div>
                          } 
                        />
                        <Route 
                          path="/insights" 
                          element={
                            <motion.div
                              initial="initial"
                              animate="in"
                              exit="out"
                              variants={pageVariants}
                              transition={pageTransition}
                            >
                              <Insights />
                            </motion.div>
                          } 
                        />
                        <Route 
                          path="/profile" 
                          element={
                            <motion.div
                              initial="initial"
                              animate="in"
                              exit="out"
                              variants={pageVariants}
                              transition={pageTransition}
                            >
                              <Profile />
                            </motion.div>
                          } 
                        />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AnimatePresence>
                  </main>
                </div>
              </div>
            ) : (
              <div className="flex min-h-screen items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
                  <h2 className="text-2xl font-semibold mb-2">Setting up your dashboard...</h2>
                  <p className="text-muted-foreground">This will just take a moment</p>
                </motion.div>
              </div>
            )}
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;