import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      
      {/* ===== Background Base ===== */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/40 to-background" />

      {/* ===== Glow Effects ===== */}
      <div className="absolute top-[-120px] left-[-100px] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[160px]" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[180px]" />

      {/* ===== Grid Overlay ===== */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(139,92,246,1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,1)_1px,transparent_1px)] bg-[size:70px_70px]" />

      {/* ===== Content Container ===== */}
      <div className="container mx-auto px-6 lg:px-12 py-24 relative z-10">
        
        <div className="max-w-4xl mx-auto text-center">

          {/* ===== Badge ===== */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-primary/20 shadow-sm mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground tracking-wide">
              Premium Car Rental Experience
            </span>
          </div>

          {/* ===== Heading ===== */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-8">
            <span className="gradient-text">Drive Your Dream</span>
            <br />
            <span className="text-foreground">Without Limits</span>
          </h1>

          {/* ===== Description ===== */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Experience luxury, comfort, and performance with our premium fleet.
            Book your perfect car effortlessly with transparent pricing and
            world-class service.
          </p>

          {/* ===== CTA Buttons ===== */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
            
            <Button
              size="lg"
              asChild
              className="text-lg px-8 py-6 shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              <Link to="/cars">
                Browse Cars
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-6 border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all"
            >
              <Link to="#search">Search Availability</Link>
            </Button>

          </div>

          {/* ===== Stats Section ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">

            {[
              { value: "120+", label: "Luxury Vehicles" },
              { value: "6K+", label: "Satisfied Clients" },
              { value: "24/7", label: "Customer Support" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="group glass rounded-2xl border border-white/5 p-8 transition-all hover:scale-[1.03] hover:border-primary/30 hover:shadow-lg"
              >
                <h3 className="text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </h3>

                <p className="text-muted-foreground text-sm tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}

          </div>

        </div>
      </div>
    </section>
  );
};
