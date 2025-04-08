
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ExpenseCategory, useExpenses } from "@/contexts/ExpenseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 border border-border rounded-md shadow-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-expense">{formatCurrency(payload[0].value)}</p>
        <p>{((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

const ExpensePieChart: React.FC = () => {
  const { getExpensesByCategory, getTotalExpenses } = useExpenses();
  const expensesByCategory = getExpensesByCategory();
  const totalExpenses = getTotalExpenses();
  
  const data = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: CATEGORY_LABELS[category as ExpenseCategory],
    value: amount,
    total: totalExpenses,
  })).filter(item => item.value > 0);
  
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[300px]">
          <p className="text-muted-foreground">No expense data to display</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3 h-3 mr-2 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="text-xs">
                <p className="font-medium">{entry.name}</p>
                <p className="text-muted-foreground">{formatCurrency(entry.value)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensePieChart;
