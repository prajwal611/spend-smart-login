
import React from "react";
import { 
  Coffee, 
  Car, 
  Home, 
  Lightbulb, 
  Film, 
  Stethoscope, 
  GraduationCap, 
  ShoppingBag, 
  User, 
  FileQuestion,
  DollarSign
} from "lucide-react";
import { ExpenseCategory } from "@/contexts/ExpenseContext";
import { cn } from "@/lib/utils";

interface CategoryIconProps {
  category: ExpenseCategory | 'income';
  className?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className }) => {
  let Icon;

  switch (category) {
    case 'food':
      Icon = Coffee;
      break;
    case 'transportation':
      Icon = Car;
      break;
    case 'housing':
      Icon = Home;
      break;
    case 'utilities':
      Icon = Lightbulb;
      break;
    case 'entertainment':
      Icon = Film;
      break;
    case 'healthcare':
      Icon = Stethoscope;
      break;
    case 'education':
      Icon = GraduationCap;
      break;
    case 'shopping':
      Icon = ShoppingBag;
      break;
    case 'personal':
      Icon = User;
      break;
    case 'income':
      Icon = DollarSign;
      break;
    default:
      Icon = FileQuestion;
  }

  return <Icon className={cn("h-4 w-4", className)} />;
};

export default CategoryIcon;
