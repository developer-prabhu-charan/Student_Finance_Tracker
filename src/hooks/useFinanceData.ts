import { useState, useEffect, useCallback } from 'react';
import { financeAPI } from '../services/api';
import mockData from '../data/mockData.json';

// Custom hook for managing finance data with real-time updates
export const useFinanceData = () => {
  const [data, setData] = useState({
    user: null,
    accounts: [],
    transactions: [],
    budgets: [],
    goals: [],
    alerts: [],
    insights: [],
    monthlyStats: null,
    isLoading: true,
    error: null
  });

  const [realTimeEnabled, setRealTimeEnabled] = useState(false);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));

      const [
        user,
        accounts,
        transactions,
        budgets,
        goals,
        alerts,
        insights,
        monthlyStats
      ] = await Promise.all([
        financeAPI.getUser(),
        financeAPI.getAccounts(),
        financeAPI.getTransactions(),
        financeAPI.getBudgets(),
        financeAPI.getGoals(),
        financeAPI.getAlerts(),
        financeAPI.getInsights(),
        financeAPI.getMonthlyStats('2024-01')
      ]);

      setData({
        user,
        accounts,
        transactions,
        budgets,
        goals,
        alerts,
        insights,
        monthlyStats,
        isLoading: false,
        error: null
      });
    } catch (error) {
      // If API fails, fall back to bundled mock data so the UI remains usable
      console.warn('Failed to load data from API, falling back to mock data:', error);
      setData({
        user: (mockData as any).user || null,
        accounts: (mockData as any).accounts || [],
        transactions: (mockData as any).transactions || [],
        budgets: (mockData as any).budgets || [],
        goals: (mockData as any).goals || [],
        alerts: (mockData as any).alerts || [],
        insights: (mockData as any).insights || [],
        monthlyStats: ((mockData as any).monthlyStats && (mockData as any).monthlyStats['2024-01']) || null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load data'
      });
    }
  }, []);

  // Toggle real-time updates
  const toggleRealTime = useCallback(() => {
    if (realTimeEnabled) {
      financeAPI.stopRealTime();
      setRealTimeEnabled(false);
    } else {
      financeAPI.startRealTime();
      setRealTimeEnabled(true);
    }
  }, [realTimeEnabled]);

  // Real-time event handlers
  useEffect(() => {
    const handleNewTransaction = (transaction: any) => {
      setData(prev => ({
        ...prev,
        transactions: [transaction, ...prev.transactions]
      }));
    };

    const handleNewAlert = (alert: any) => {
      setData(prev => ({
        ...prev,
        alerts: [alert, ...prev.alerts]
      }));
    };

    const handleGoalProgress = (update: any) => {
      setData(prev => ({
        ...prev,
        goals: prev.goals.map(goal => 
          goal.id === update.goalId 
            ? { ...goal, currentAmount: update.newAmount }
            : goal
        )
      }));
    };

    // Subscribe to real-time events
    financeAPI.on('transaction:new', handleNewTransaction);
    financeAPI.on('alert:new', handleNewAlert);
    financeAPI.on('goal:progress', handleGoalProgress);

    // Cleanup
    return () => {
      financeAPI.off('transaction:new', handleNewTransaction);
      financeAPI.off('alert:new', handleNewAlert);
      financeAPI.off('goal:progress', handleGoalProgress);
    };
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();

    // Poll periodically so the UI updates continuously (every 15s)
    const pollMs = 15000;
    const id = setInterval(() => {
      loadData();
    }, pollMs);

    return () => clearInterval(id);
  }, [loadData]);

  return {
    ...data,
    loadData,
    realTimeEnabled,
    toggleRealTime,
    exportCSV: financeAPI.exportTransactionsCSV.bind(financeAPI),
    exportJSON: financeAPI.exportDataJSON.bind(financeAPI)
  } as const;
};

// Hook for theme management
export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    }
    return 'dark';
  });

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Apply theme to document
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Apply theme on mount
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  return { theme, toggleTheme };
};

// Hook for animations and UI state
export const useAnimations = () => {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  const toggleAnimations = useCallback(() => {
    setAnimationsEnabled(prev => !prev);
    // Apply reduced motion preference
    if (!animationsEnabled) {
      document.documentElement.style.setProperty('--transition-smooth', 'none');
      document.documentElement.style.setProperty('--transition-spring', 'none');
    } else {
      document.documentElement.style.removeProperty('--transition-smooth');
      document.documentElement.style.removeProperty('--transition-spring');
    }
  }, [animationsEnabled]);

  return { animationsEnabled, toggleAnimations };
};