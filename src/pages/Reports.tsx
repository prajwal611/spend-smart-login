
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useExpenses, ExpenseCategory } from "@/contexts/ExpenseContext";
import { format, subDays, startOfMonth, endOfMonth, isSameMonth } from "date-fns";
import { formatCurrency } from "@/lib/utils";

const COLORS = [
  '#FF6384', // red
  '#36A2EB', // blue
  '#FFCE56', // yellow
  '#4BC0C0', // teal
  '#9966FF', // purple
  '#FF9F40', // orange
  '#7BC8A4', // green
  '#E7E9ED', // gray
  '#C9CBCF', // light gray
  '#6C757D', // dark gray
];

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: "Food",
  transportation: "Transportation",
  housing: "Housing",
  utilities: "Utilities",
  entertainment: "Entertainment",
  healthcare: "Healthcare",
  education: "Education",
  shopping: "Shopping",
  personal: "Personal",
  other: "Other",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 border border-border rounded-md shadow-sm">
        <p className="font-medium">{payload[0].payload.name || label}</p>
        <p className="text-expense">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const Reports: React.FC = () => {
  const { expenses } = useExpenses();
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('month');
  
  // Filter expenses based on time filter
  const getFilteredExpenses = () => {
    const today = new Date();
    let startDate: Date;
    
    switch (timeFilter) {
      case 'week':
        startDate = subDays(today, 7);
        break;
      case 'month':
        startDate = startOfMonth(today);
        break;
      default:
        startDate = new Date(0); // Beginning of time
    }
    
    return expenses.filter(expense => !expense.isIncome && new Date(expense.date) >= startDate);
  };
  
  const filteredExpenses = getFilteredExpenses();
  
  // Generate category data for pie chart
  const categoryData = Object.entries(CATEGORY_LABELS).map(([category, label]) => {
    const totalAmount = filteredExpenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
    
    return {
      name: label,
      value: totalAmount,
      category,
    };
  }).filter(item => item.value > 0);
  
  // Generate daily data for bar chart (last 7 days)
  const getDailyData = () => {
    const today = new Date();
    const result = [];
    
    // Generate data for last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dayExpenses = filteredExpenses.filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate.getDate() === date.getDate() && 
               expenseDate.getMonth() === date.getMonth() &&
               expenseDate.getFullYear() === date.getFullYear();
      });
      
      const totalAmount = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      result.push({
        name: format(date, 'EEE'),
        value: totalAmount,
        date: format(date, 'MMM dd'),
      });
    }
    
    return result;
  };
  
  const dailyData = getDailyData();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Expense Reports</h1>
      
      <Tabs defaultValue="category" className="space-y-4">
        <TabsList>
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="daily">Daily Spending</TabsTrigger>
        </TabsList>
        
        <div className="flex justify-end">
          <TabsList className="mb-4">
            <TabsTrigger value="week" onClick={() => setTimeFilter('week')}>
              Week
            </TabsTrigger>
            <TabsTrigger value="month" onClick={() => setTimeFilter('month')}>
              Month
            </TabsTrigger>
            <TabsTrigger value="all" onClick={() => setTimeFilter('all')}>
              All Time
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="category" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>
                {timeFilter === 'week' ? 'Last 7 days' : 
                 timeFilter === 'month' ? 'Current month' : 'All time'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No data available for the selected period</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Spending</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                {dailyData.some(day => day.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill="hsl(var(--primary))" barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No spending data available for the last 7 days</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
