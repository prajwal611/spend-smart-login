
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, PieChart, Shield, LineChart } from "lucide-react";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Track Your Expenses, <span className="text-primary">Master Your Money</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                ExpenseWise helps you monitor your spending, track your budget, and make smarter financial decisions with intuitive analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link to="/login">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <img 
                src="/placeholder.svg" 
                alt="ExpenseWise Dashboard" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features That Make Money Management Easy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border border-border hover:border-primary/40 transition-all">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Expense Tracking</h3>
              <p className="text-muted-foreground">
                Easily log and categorize your expenses to get a clear view of your spending habits.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border hover:border-primary/40 transition-all">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Visual Reports</h3>
              <p className="text-muted-foreground">
                Get detailed reports and visualizations to understand where your money is going.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border hover:border-primary/40 transition-all">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your financial data is encrypted and securely stored with bank-level security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Take Control of Your Finances?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their money better with ExpenseWise.
          </p>
          <Button asChild size="lg">
            <Link to="/login">
              Get Started For Free
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
