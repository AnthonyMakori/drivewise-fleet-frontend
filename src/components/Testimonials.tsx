import { Card, CardContent } from "./ui/card";
import { testimonials } from "@/lib/mockData";
import { Star, Quote } from "lucide-react";

export const Testimonials = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-4 gradient-text">What Our Customers Say</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">Real experiences from real drivers</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="glass hover:glow-sm transition-all duration-300 animate-fade-in">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-muted-foreground mb-6 leading-relaxed">{testimonial.comment}</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                      ))}
                    </div>
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
