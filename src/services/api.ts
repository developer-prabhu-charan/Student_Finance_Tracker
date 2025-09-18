// Frontend API client that talks to a backend finance API (Express + MongoDB)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/finance';

// API client class preserving the previous interface
export class FinanceAPI {
  private eventListeners: Map<string, Function[]> = new Map();
  private isRealTimeEnabled = false;

  constructor() {
  // real-time simulation kept for local dev; backend can provide sockets later
  this.setupRealTimeSimulation();
  }

  // ============================================
  // MOCK DATA METHODS (Current Implementation)
  // ============================================

  async getUser() {
    const res = await fetch(`${API_BASE}/user`);
    return res.ok ? res.json() : null;
  }

  async getAccounts() {
    const res = await fetch(`${API_BASE}/accounts`);
    return res.ok ? res.json() : [];
  }

  async getTransactions(accountId?: string) {
    const url = new URL(`${API_BASE}/transactions`);
    if (accountId) url.searchParams.set('accountId', accountId);
    const res = await fetch(url.toString());
    return res.ok ? res.json() : [];
  }

  async getBudgets() {
    const res = await fetch(`${API_BASE}/budgets`);
    return res.ok ? res.json() : [];
  }

  async getGoals() {
    const res = await fetch(`${API_BASE}/goals`);
    return res.ok ? res.json() : [];
  }

  async getAlerts() {
    const res = await fetch(`${API_BASE}/alerts`);
    return res.ok ? res.json() : [];
  }

  async getInsights() {
    const res = await fetch(`${API_BASE}/insights`);
    return res.ok ? res.json() : [];
  }

  async getMonthlyStats(month: string) {
    const res = await fetch(`${API_BASE}/monthly-stats/${encodeURIComponent(month)}`);
    return res.ok ? res.json() : null;
  }

  // ============================================
  // REAL-TIME SIMULATION
  // ============================================

  startRealTime() {
    this.isRealTimeEnabled = true;
    console.log('🔴 Real-time updates enabled');
  }

  stopRealTime() {
    this.isRealTimeEnabled = false;
    console.log('⚪ Real-time updates disabled');
  }

  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  private setupRealTimeSimulation() {
    // Simulate new transactions every 15-25 seconds
    setInterval(() => {
      if (!this.isRealTimeEnabled) return;

      const newTransaction = this.generateRandomTransaction();
      this.emit('transaction:new', newTransaction);
    }, Math.random() * 10000 + 15000);

    // Simulate budget alerts every 30-45 seconds
    setInterval(() => {
      if (!this.isRealTimeEnabled) return;

      const alert = this.generateRandomAlert();
      this.emit('alert:new', alert);
    }, Math.random() * 15000 + 30000);

    // Simulate goal progress updates every 20-30 seconds
    setInterval(() => {
      if (!this.isRealTimeEnabled) return;

      const goalUpdate = this.generateGoalUpdate();
      this.emit('goal:progress', goalUpdate);
    }, Math.random() * 10000 + 20000);
  }

  // ============================================
  // SUPABASE INTEGRATION STUBS
  // (Replace these with actual Supabase calls when ready)
  // ============================================

  // TODO: Replace with actual Supabase authentication
  async authenticateWithSupabase(email: string, password: string) {
    /*
    import { createClient } from '@supabase/supabase-js';
    
    const supabaseUrl = 'YOUR_SUPABASE_URL';
    const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
    */
    
    // Mock authentication for now - backend auth not implemented
    await this.delay(1000);
    return {
      data: null,
      error: 'Auth not implemented'
    };
  }

  // TODO: Replace with actual Supabase database operations
  async saveTransactionToSupabase(transaction: any) {
    /*
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction]);
    
    return { data, error };
    */
    
    // Mock save for now
    // If server has an endpoint to create transactions, we can post to it.
    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      });
      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: String(err) };
    }
  }

  // TODO: Replace with actual Supabase real-time subscriptions
  subscribeToSupabaseChanges() {
    /*
    const subscription = supabase
      .channel('finance_updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'transactions' },
        (payload) => this.emit('transaction:new', payload.new)
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'budgets' },
        (payload) => this.emit('budget:updated', payload.new)
      )
      .subscribe();
    
    return subscription;
    */
    
    console.log('🔄 Mock: Supabase real-time subscription setup');
    return null;
  }

  // ============================================
  // EXPORT UTILITIES
  // ============================================

  async exportTransactionsCSV(transactions: any[]) {
    // If caller passed an empty array, fetch transactions from the API so export isn't empty
    let txs = transactions;
    try {
      if (!txs || !txs.length) {
        txs = await this.getTransactions();
      }
    } catch (err) {
      console.warn('Failed to fetch transactions for CSV export:', err);
      txs = transactions || [];
    }

    const headers = ['Date', 'Description', 'Category', 'Amount', 'Account'];

    const escape = (value: any) => {
      if (value === null || value === undefined) return '';
      const s = String(value);
      // Escape double quotes by doubling them
      const escaped = s.replace(/"/g, '""');
      // Wrap in quotes if it contains comma, newline or double-quote
      if (/[",\n\r]/.test(s)) return `"${escaped}"`;
      return escaped;
    };

    const csvRows = [
      headers.join(','),
      ...(txs || []).map(tx => [
        escape(new Date(tx.date).toLocaleDateString()),
        escape(tx.description),
        escape(tx.category),
        escape(tx.amount),
        escape(tx.accountId)
      ].join(','))
    ];

    // Add UTF-8 BOM so Excel recognizes UTF-8 and preserves special characters
    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    window.URL.revokeObjectURL(url);
  }

  async exportDataJSON() {
    const allData = {
      user: await this.getUser(),
      accounts: await this.getAccounts(),
      transactions: await this.getTransactions(),
      budgets: await this.getBudgets(),
      goals: await this.getGoals(),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], { 
      type: 'application/json' 
    });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    window.URL.revokeObjectURL(url);
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateRandomTransaction() {
    const merchants = ['Campus Cafe', 'BookMart', 'Gas Station', 'Online Store', 'Restaurant'];
    const categories = ['Food & Dining', 'Education', 'Transportation', 'Entertainment', 'Groceries'];
    
    return {
      id: `tx_${Date.now()}`,
      accountId: 'acc1',
      amount: -(Math.random() * 50 + 5),
      description: merchants[Math.floor(Math.random() * merchants.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      date: new Date().toISOString(),
      merchant: merchants[Math.floor(Math.random() * merchants.length)],
      status: 'completed'
    };
  }

  private generateRandomAlert() {
    const alerts = [
      {
        type: 'budget_warning',
        title: 'Budget Alert',
        message: 'Approaching monthly limit',
        severity: 'warning'
      },
      {
        type: 'goal_milestone',
        title: 'Goal Progress',
        message: 'You\'re making great progress!',
        severity: 'success'
      }
    ];

    const alert = alerts[Math.floor(Math.random() * alerts.length)];
    return {
      ...alert,
      id: `alert_${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
  }

  private generateGoalUpdate() {
    // Try to fetch a goal's current amount from the API; if that fails, return a small random update
    return {
      goalId: 'goal1',
      newAmount: Math.round((Math.random() * 100) + 100),
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const financeAPI = new FinanceAPI();