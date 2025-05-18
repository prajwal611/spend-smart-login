
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Receipt, PiggyBank, Wallet } from "lucide-react";

const testimonialsData = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Small Business Owner",
    content: "ExpenseWise has completely transformed how I manage my business finances. The clear reports and easy tracking have saved me hours of work each month.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
    icon: <Receipt className="w-12 h-12 text-primary" />,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Freelance Designer",
    content: "As a freelancer, keeping track of expenses was always a headache until I found ExpenseWise. Now I can easily categorize everything and see where my money is going.",
    rating: 5,
    avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop",
    icon: <PiggyBank className="w-12 h-12 text-primary" />,
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Finance Student",
    content: "The visualization tools in ExpenseWise made it so much easier to understand my spending habits. I've already recommended it to all my classmates!",
    rating: 4,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    icon: <Wallet className="w-12 h-12 text-primary" />,
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial) => (
            <Card key={testimonial.id} className="border-border/40 hover:border-primary/40 transition-colors duration-300">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <div className="flex justify-center my-6">
                  {testimonial.icon}
                </div>
                <p className="mb-6 text-muted-foreground">{testimonial.content}</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
