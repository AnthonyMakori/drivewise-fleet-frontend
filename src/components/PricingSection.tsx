import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Check, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Economy",
    price: "$50-80",
    features: [
      "Compact & fuel-efficient cars",
      "Basic insurance included",
      "24/7 roadside assistance",
      "Unlimited mileage",
    ],
  },
  {
    name: "Standard",
    price: "$80-120",
    features: [
      "Mid-size comfortable cars",
      "Comprehensive insurance",
      "24/7 premium support",
      "Unlimited mileage",
      "Free GPS navigation",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "$120+",
    features: [
      "Luxury & sports cars",
      "Full coverage insurance",
      "Dedicated concierge",
      "Unlimited mileage",
      "Free GPS & WiFi",
      "Priority booking",
    ],
  },
];

export const PricingSection = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Pricing Plans</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">Choose the perfect plan for your needs</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`glass transition-all duration-300 hover:glow-sm ${
                plan.popular ? "glow-md border-primary/40 scale-[1.02]" : "hover:border-primary/20"
              }`}
            >
              <CardHeader>
                {plan.popular && (
                  <div className="text-center mb-2">
                    <span className="inline-flex items-center gap-1.5 bg-primary/20 text-primary text-sm px-4 py-1.5 rounded-full border border-primary/30">
                      <Crown className="h-3.5 w-3.5" />
                      Most Popular
                    </span>
                  </div>
                )}
                <CardTitle className="text-2xl text-center">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-center gradient-text mt-4">
                  {plan.price}
                  <span className="text-sm text-muted-foreground font-normal">/day</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${plan.popular ? "glow-sm" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link to="/cars">View Cars</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
