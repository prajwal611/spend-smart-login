
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpenses, ExpenseCategory } from "@/contexts/ExpenseContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CategoryIcon from "@/components/CategoryIcon";

const CATEGORIES: {label: string; value: ExpenseCategory}[] = [
  { label: "Food", value: "food" },
  { label: "Transportation", value: "transportation" },
  { label: "Housing", value: "housing" },
  { label: "Utilities", value: "utilities" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Education", value: "education" },
  { label: "Shopping", value: "shopping" },
  { label: "Personal", value: "personal" },
  { label: "Other", value: "other" },
];

const AddExpense: React.FC = () => {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  
  const { addExpense } = useExpenses();
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !date || (type === "expense" && !category)) {
      return;
    }
    
    addExpense({
      amount: parseFloat(amount),
      description,
      category,
      date: new Date(date).toISOString(),
      isIncome: type === "income"
    });
    
    navigate("/");
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Transaction</h1>
      
      <Card>
        <CardHeader>
          <Tabs defaultValue="expense" onValueChange={(v) => setType(v as "expense" | "income")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expense">Expense</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder={type === "expense" ? "What did you spend on?" : "Source of income"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            {type === "expense" && (
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as ExpenseCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value} className="flex items-center">
                        <div className="flex items-center">
                          <CategoryIcon category={cat.value} className="mr-2" />
                          {cat.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full gap-4">
              <Button variant="outline" onClick={() => navigate(-1)} className="w-full">
                Cancel
              </Button>
              <Button type="submit" className="w-full">
                Save
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddExpense;
