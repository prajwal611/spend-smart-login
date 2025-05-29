
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoals } from "@/contexts/GoalContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Target, Edit, Trash, PiggyBank } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const Goals: React.FC = () => {
  const { goals, deleteGoal, addToGoal } = useGoals();
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAddMoneyDialog, setShowAddMoneyDialog] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState("");

  const handleDelete = () => {
    if (selectedGoalId) {
      deleteGoal(selectedGoalId);
      setSelectedGoalId(null);
      setShowConfirmDialog(false);
    }
  };

  const confirmDelete = (id: string) => {
    setSelectedGoalId(id);
    setShowConfirmDialog(true);
  };

  const handleAddMoney = () => {
    if (selectedGoalId && addAmount) {
      addToGoal(selectedGoalId, parseFloat(addAmount));
      setSelectedGoalId(null);
      setAddAmount("");
      setShowAddMoneyDialog(false);
    }
  };

  const openAddMoneyDialog = (id: string) => {
    setSelectedGoalId(id);
    setShowAddMoneyDialog(true);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      emergency_fund: "bg-red-100 text-red-800",
      vacation: "bg-blue-100 text-blue-800",
      house: "bg-green-100 text-green-800",
      car: "bg-yellow-100 text-yellow-800",
      education: "bg-purple-100 text-purple-800",
      retirement: "bg-indigo-100 text-indigo-800",
      investment: "bg-pink-100 text-pink-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const formatCategoryName = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Financial Goals</h1>
        <Button onClick={() => navigate("/goals/add")}>
          <Plus className="h-4 w-4 mr-1" />
          Add Goal
        </Button>
      </div>

      <div className="grid gap-6">
        {goals.length > 0 ? (
          goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const isCompleted = progress >= 100;
            
            return (
              <Card key={goal.id} className={isCompleted ? "border-green-500 bg-green-50" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5" />
                      <div>
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        <CardDescription>{goal.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(goal.category)}>
                        {formatCategoryName(goal.category)}
                      </Badge>
                      {isCompleted && (
                        <Badge className="bg-green-500 text-white">Completed!</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Current Amount:</span>
                      <p className="font-medium">{formatCurrency(goal.currentAmount)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Target Amount:</span>
                      <p className="font-medium">{formatCurrency(goal.targetAmount)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Remaining:</span>
                      <p className="font-medium">
                        {formatCurrency(Math.max(0, goal.targetAmount - goal.currentAmount))}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Target Date:</span>
                      <p className="font-medium">
                        {new Date(goal.targetDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openAddMoneyDialog(goal.id)}
                    >
                      <PiggyBank className="h-4 w-4 mr-1" />
                      Add Money
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/goals/edit/${goal.id}`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => confirmDelete(goal.id)}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium text-lg mb-1">No financial goals yet</h3>
            <p className="text-muted-foreground mb-4">
              Start setting financial goals to track your progress and stay motivated.
            </p>
            <Button onClick={() => navigate("/goals/add")}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Goal
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this goal? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Money Dialog */}
      <Dialog open={showAddMoneyDialog} onOpenChange={setShowAddMoneyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Money to Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddMoneyDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMoney}>
                Add Money
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Goals;
