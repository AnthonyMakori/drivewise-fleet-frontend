import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SearchBar } from "@/components/SearchBar";
import { CarCard } from "@/components/CarCard";
import { Testimonials } from "@/components/Testimonials";
import { ContactSection } from "@/components/ContactSection";
import { PricingSection } from "@/components/PricingSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import api from "@/lib/api";
import type { Car as CarType } from "@/lib/mockData";
import { useEffect, useState } from "react";

const Landing = () => {
  const [featuredCars, setFeaturedCars] = useState<CarType[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const cars = await api.getCars();
        setFeaturedCars(cars.slice(0, 3));
      } catch (e) {
        setFeaturedCars([]);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <SearchBar />
      
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Featured Cars</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">Handpicked premium vehicles for you</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>
      
      <Testimonials />
      <PricingSection />
      <ContactSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Landing;
