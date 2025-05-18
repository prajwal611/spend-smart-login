
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { Expense, ExpenseCategory } from "@/contexts/ExpenseContext";
import { formatCurrency } from "@/lib/utils";

export function exportTransactionsAsPDF(expenses: Expense[], userName: string): void {
  // Create a new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add title
  doc.setFontSize(20);
  doc.text("Transaction History", pageWidth / 2, 15, { align: "center" });
  
  // Add metadata
  doc.setFontSize(10);
  doc.text(`User: ${userName}`, 14, 25);
  doc.text(`Generated on: ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}`, 14, 30);
  
  // Prepare table data
  const tableBody = expenses.map((expense) => [
    format(new Date(expense.date), "yyyy-MM-dd"),
    expense.description,
    expense.isIncome ? "Income" : expense.category,
    expense.isIncome ? `+${formatCurrency(expense.amount)}` : `-${formatCurrency(expense.amount)}`,
  ]);

  // Categories summary
  const categories: Record<ExpenseCategory | "income", number> = {} as Record<ExpenseCategory | "income", number>;
  
  // Calculate category totals
  expenses.forEach((expense) => {
    const category = expense.isIncome ? "income" : expense.category;
    if (!categories[category]) {
      categories[category] = 0;
    }
    categories[category] += expense.amount;
  });
  
  // Add the table
  autoTable(doc, {
    head: [["Date", "Description", "Category", "Amount"]],
    body: tableBody,
    startY: 35,
    styles: {
      fontSize: 10,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });
  
  // Add summary section
  let finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(14);
  doc.text("Summary", 14, finalY);
  finalY += 8;
  
  doc.setFontSize(10);
  
  // Calculate totals
  const totalIncome = expenses
    .filter(expense => expense.isIncome)
    .reduce((acc, expense) => acc + expense.amount, 0);
    
  const totalExpense = expenses
    .filter(expense => !expense.isIncome)
    .reduce((acc, expense) => acc + expense.amount, 0);
    
  const balance = totalIncome - totalExpense;
  
  // Add totals
  doc.text(`Total Income: ${formatCurrency(totalIncome)}`, 14, finalY);
  finalY += 5;
  doc.text(`Total Expenses: ${formatCurrency(totalExpense)}`, 14, finalY);
  finalY += 5;
  doc.text(`Balance: ${formatCurrency(balance)}`, 14, finalY);
  finalY += 10;
  
  // Add categories breakdown
  doc.setFontSize(12);
  doc.text("Categories Breakdown:", 14, finalY);
  finalY += 6;
  
  doc.setFontSize(10);
  Object.entries(categories).forEach(([category, amount]) => {
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    doc.text(`${formattedCategory}: ${formatCurrency(amount)}`, 20, finalY);
    finalY += 5;
  });
  
  // Save the PDF with filename format "transactions-YYYY-MM-DD.pdf"
  const today = format(new Date(), "yyyy-MM-dd");
  doc.save(`transactions-${today}.pdf`);
}
