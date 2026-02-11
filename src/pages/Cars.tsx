import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CarCard } from "@/components/CarCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import type { Car as CarType } from "@/lib/mockData";

const Cars = () => {
  const [searchParams] = useSearchParams();
  const [filteredCars, setFilteredCars] = useState<CarType[]>([]);
  const [brand, setBrand] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [allCars, setAllCars] = useState<CarType[]>([]);
  const brands = Array.from(new Set(allCars.map(car => car.brand)));

  useEffect(() => {
    const load = async () => {
      try { setAllCars(await api.getCars()); } catch { setAllCars([]); }
    };
    load();
  }, []);

  useEffect(() => {
    let filtered = [...allCars];
    if (brand && brand !== "all") filtered = filtered.filter(car => car.brand === brand);
    if (transmission && transmission !== "all") filtered = filtered.filter(car => car.transmission === transmission);
    if (fuelType && fuelType !== "all") filtered = filtered.filter(car => car.fuelType === fuelType);
    filtered = filtered.filter(car => car.dailyRate >= priceRange[0] && car.dailyRate <= priceRange[1]);
    const typeParam = searchParams.get("type");
    const priceParam = searchParams.get("price");
    if (typeParam) filtered = filtered.filter(car => car.fuelType.toLowerCase().includes(typeParam.toLowerCase()) || car.transmission.toLowerCase().includes(typeParam.toLowerCase()));
    if (priceParam) { const [min, max] = priceParam.split("-").map(Number); if (!isNaN(min) && !isNaN(max)) filtered = filtered.filter(car => car.dailyRate >= min && car.dailyRate <= max); }
    setFilteredCars(filtered);
  }, [brand, transmission, fuelType, priceRange, searchParams, allCars]);

  const selectClass = "bg-secondary/50 border-border/50 focus:border-primary/50";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 gradient-text">Browse Our Fleet</h1>
        <p className="text-muted-foreground mb-8">Find the perfect car for your journey</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-xl sticky top-24 glow-sm">
              <h2 className="text-xl font-bold mb-6">Filters</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Select value={brand} onValueChange={setBrand}>
                    <SelectTrigger className={selectClass}><SelectValue placeholder="All Brands" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Transmission</Label>
                  <Select value={transmission} onValueChange={setTransmission}>
                    <SelectTrigger className={selectClass}><SelectValue placeholder="All Types" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fuel Type</Label>
                  <Select value={fuelType} onValueChange={setFuelType}>
                    <SelectTrigger className={selectClass}><SelectValue placeholder="All Fuels" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fuels</SelectItem>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Price: ${priceRange[0]} - ${priceRange[1]}/day</Label>
                  <Slider min={0} max={200} step={10} value={priceRange} onValueChange={setPriceRange} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-4 text-muted-foreground">
              Showing {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'}
            </div>
            {filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map(car => <CarCard key={car.id} car={car} />)}
              </div>
            ) : (
              <div className="text-center py-12 glass rounded-xl">
                <p className="text-muted-foreground text-lg">No cars found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cars;
