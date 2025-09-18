import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Target,
  Coffee,
  BookOpen,
  Car,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useFinanceData } from '@/hooks/useFinanceData';

const Insights = () => {
  const { insights, monthlyStats, budgets, goals, isLoading } = useFinanceData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const categoryIcons = {
    'Food & Dining': Coffee,
    'Education': BookOpen,
    'Transportation': Car,
    'Groceries': ShoppingCart,
    'Entertainment': Target,
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'spending_trend': return TrendingUp;
      case 'goal_prediction': return Target;
      case 'budget_optimization': return Lightbulb;
      default: return Info;
    }
  };

  const getInsightColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      default: return 'text-primary';
    }
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Financial Insights</h1>
        <p className="text-muted-foreground">AI-powered recommendations to improve your financial health</p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={cardVariants}>
          <Card className="glass glow-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Savings Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-success">
                  {monthlyStats ? ((monthlyStats.savings / monthlyStats.income) * 100).toFixed(1) : '0'}%
                </div>
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Above average for students</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="glass glow-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Budget Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-primary">
                  {budgets ? Math.round(budgets.filter(b => (b.spent / b.limit) < 0.8).length / budgets.length * 100) : 0}%
                </div>
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Budgets on track</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="glass glow-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Goal Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-accent">
                  {goals ? Math.round(goals.reduce((sum, g) => sum + (g.currentAmount / g.targetAmount), 0) / goals.length * 100) : 0}%
                </div>
                <Target className="w-5 h-5 text-accent" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Average completion</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Smart Recommendations
            </CardTitle>
            <CardDescription>Personalized insights based on your spending patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights?.map((insight, index) => {
              const Icon = getInsightIcon(insight.type);
              const colorClass = getInsightColor(insight.impact);
              
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-surface-elevated rounded-xl"
                >
                  <div className={`w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{insight.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {insight.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                    {insight.potentialSavings && (
                      <div className="text-xs text-success font-medium">
                        Potential savings: ₹{insight.potentialSavings}/month
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    Apply
                  </Button>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Spending Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle>Spending Analysis</CardTitle>
            <CardDescription>Where your money goes each month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyStats?.categories && Object.entries(monthlyStats.categories).map(([category, amount], index) => {
                const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || ShoppingCart;
                const percentage = (Math.abs(amount as number) / monthlyStats.expenses * 100);
                
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{category}</span>
                        <span className="text-sm font-semibold">₹{Math.abs(amount as number).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={percentage} className="flex-1 h-2" />
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Financial Health Score */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle>Financial Health Score</CardTitle>
            <CardDescription>Overall assessment of your financial well-being</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score Circle */}
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted opacity-20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.78)}`}
                      className="text-success transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-success">78</div>
                      <div className="text-xs text-muted-foreground">Good</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Emergency Fund</span>
                  <div className="flex items-center gap-2">
                    <Progress value={65} className="w-20 h-2" />
                    <span className="text-sm font-medium">65%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Budget Adherence</span>
                  <div className="flex items-center gap-2">
                    <Progress value={82} className="w-20 h-2" />
                    <span className="text-sm font-medium">82%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Savings Rate</span>
                  <div className="flex items-center gap-2">
                    <Progress value={90} className="w-20 h-2" />
                    <span className="text-sm font-medium">90%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Goal Progress</span>
                  <div className="flex items-center gap-2">
                    <Progress value={75} className="w-20 h-2" />
                    <span className="text-sm font-medium">75%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-success/10 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-semibold text-success">Great job!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your financial health is above average. Keep up the good work with your savings goals 
                and consider increasing your emergency fund to improve your score further.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Insights;