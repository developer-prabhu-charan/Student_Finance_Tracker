import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Target,
  TrendingUp,
  Award,
  Calendar,
  DollarSign,
  Edit,
  Trash2
} from 'lucide-react';
import { useFinanceData } from '@/hooks/useFinanceData';

const Budgets = () => {
  const { budgets, goals, isLoading } = useFinanceData();
  const [activeTab, setActiveTab] = useState<'budgets' | 'goals'>('budgets');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Budgets & Goals</h1>
          <p className="text-muted-foreground">Manage your spending limits and savings targets</p>
        </div>
        
        <Button className="btn-hero">
          <Plus className="w-4 h-4 mr-2" />
          Create New {activeTab === 'budgets' ? 'Budget' : 'Goal'}
        </Button>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex bg-surface-elevated rounded-xl p-1">
          <button
            onClick={() => setActiveTab('budgets')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'budgets'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Budgets
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'goals'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Goals
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'budgets' ? (
          <motion.div
            key="budgets"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Budget Overview */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
                <CardDescription>Your spending limits across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                      ₹{budgets?.reduce((sum, b) => sum + b.limit, 0).toFixed(2) || '0.00'}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Budget</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">
                      ₹{budgets?.reduce((sum, b) => sum + b.spent, 0).toFixed(2) || '0.00'}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">
                      ₹{budgets?.reduce((sum, b) => sum + (b.limit - b.spent), 0).toFixed(2) || '0.00'}
                    </div>
                    <div className="text-sm text-muted-foreground">Remaining</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">
                      {budgets?.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Budgets</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Budget Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {budgets?.map((budget, index) => {
                const percentage = (budget.spent / budget.limit) * 100;
                const isOverBudget = percentage > 100;
                const daysLeft = Math.ceil((new Date(budget.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                
                return (
                  <motion.div key={budget.id} variants={cardVariants}>
                    <Card className="glass glow-hover">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: budget.color }}
                            />
                            <CardTitle className="text-lg">{budget.name}</CardTitle>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {daysLeft > 0 ? `${daysLeft} days left` : 'Period ended'}
                          </div>
                          <Badge 
                            variant={isOverBudget ? "destructive" : percentage > 80 ? "destructive" : "secondary"}
                          >
                            {percentage.toFixed(0)}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Spent</span>
                            <span className="font-medium">
                              ₹{budget.spent.toFixed(2)} / ₹{budget.limit.toFixed(2)}
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(percentage, 100)} 
                            className="h-3"
                          />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Remaining: </span>
                              <span className={`font-medium ${
                              isOverBudget ? 'text-destructive' : 'text-success'
                            }`}> 
                              {isOverBudget 
                                ? '₹' + (budget.spent - budget.limit).toFixed(2) + ' over'
                                : '₹' + (budget.limit - budget.spent).toFixed(2)
                              }
                            </span>
                          </div>
                          {percentage > 80 && (
                            <Badge variant="outline" className="text-xs">
                              {percentage > 100 ? 'Over Budget' : 'Almost Full'}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Goals Overview */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Goals Overview</CardTitle>
                <CardDescription>Your savings targets and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {goals?.length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Goals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">
                      {goals?.filter(g => g.isCompleted).length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">
                      ₹{goals?.reduce((sum, g) => sum + g.currentAmount, 0).toFixed(2) || '0.00'}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-muted-foreground">
                      {goals?.length ? Math.round(
                        goals.reduce((sum, g) => sum + (g.currentAmount / g.targetAmount), 0) / goals.length * 100
                      ) : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goal Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {goals?.map((goal, index) => {
                const percentage = (goal.currentAmount / goal.targetAmount) * 100;
                const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                
                return (
                  <motion.div key={goal.id} variants={cardVariants}>
                    <Card className={`glass glow-hover ${goal.isCompleted ? 'border-success' : ''}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Target className={`w-5 h-5 ${goal.isCompleted ? 'text-success' : 'text-primary'}`} />
                            <CardTitle className="text-lg">{goal.name}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2">
                            {goal.isCompleted && (
                              <Award className="w-5 h-5 text-success" />
                            )}
                            <Badge 
                              variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}
                            >
                              {goal.priority}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription>{goal.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">
                              ₹{goal.currentAmount.toFixed(2)} / ₹{goal.targetAmount.toFixed(2)}
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(percentage, 100)} 
                            className="h-3"
                          />
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              {goal.isCompleted ? 'Completed!' : `${percentage.toFixed(1)}% complete`}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {goal.isCompleted 
                              ? 'Goal reached'
                              : daysLeft > 0 
                                ? `${daysLeft} days left`
                                : 'Overdue'
                            }
                          </div>
                        </div>

                        {!goal.isCompleted && (
                          <div className="pt-2 border-t border-border">
                            <div className="text-xs text-muted-foreground">
                              Need ₹{(goal.targetAmount - goal.currentAmount).toFixed(2)} more
                              {daysLeft > 0 && ` (₹${((goal.targetAmount - goal.currentAmount) / daysLeft).toFixed(2)}/day)`}
                            </div>
                          </div>
                        )}

                        {goal.isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-2 text-success bg-success/10 p-2 rounded-lg"
                          >
                            <Award className="w-4 h-4" />
                            <span className="text-sm font-medium">Goal Achieved! 🎉</span>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Budgets;