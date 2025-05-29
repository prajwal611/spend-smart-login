
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, PieChart, Shield, LineChart, Target, TrendingUp, Wallet } from "lucide-react";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="px-4 py-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary font-bold text-2xl">
            <Wallet className="h-8 w-8" />
            <span>ExpenseWise</span>
          </div>
          <Button asChild variant="outline">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 flex-1">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                <Target className="w-4 h-4 mr-2" />
                New: Financial Goals Tracking
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Master Your 
                <span className="text-primary block md:inline"> Financial</span>
                <span className="block">Journey</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Track expenses, set financial goals, and make smarter money decisions with beautiful analytics and insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link to="/login">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Watch Demo
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border/40">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">₹50Cr+</div>
                  <div className="text-sm text-muted-foreground">Money Tracked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">User Satisfaction</div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl transform rotate-6"></div>
                <img 
                  src="https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=600&auto=format&fit=crop" 
                  alt="Financial Management Dashboard" 
                  className="relative w-full h-auto rounded-2xl shadow-2xl border border-border/40 transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">+25% savings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Manage Money</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you track, save, and grow your wealth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-card p-8 rounded-2xl border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PieChart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-4">Smart Expense Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Categorize expenses automatically and get insights into your spending patterns with beautiful visualizations.
              </p>
            </div>
            
            <div className="group bg-card p-8 rounded-2xl border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-accent/10 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-bold text-xl mb-4">Financial Goals</h3>
              <p className="text-muted-foreground leading-relaxed">
                Set and track multiple financial goals with progress monitoring and milestone celebrations.
              </p>
            </div>
            
            <div className="group bg-card p-8 rounded-2xl border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-green-500/10 to-green-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LineChart className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-bold text-xl mb-4">Advanced Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get detailed reports, trends, and predictions to make informed financial decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Finances?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of users who have already taken control of their financial future with ExpenseWise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/login">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
