import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Car as CarType } from "@/lib/mockData";
import { Users, Gauge, Fuel, Car } from "lucide-react";
import { Link } from "react-router-dom";

interface CarCardProps {
  car: CarType;
}

// 🔥 Change this to your backend base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Helper to build full image path
const getImageUrl = (path?: string) => {
  if (!path) return "/placeholder-car.jpg";

  // If already full URL
  if (path.startsWith("http")) return path;

  return `${BASE_URL}/${path}`;
};

export const CarCard = ({ car }: CarCardProps) => {
  return (
    <Card className="overflow-hidden glass group hover:glow-sm transition-all duration-300 hover:border-primary/30">
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(car.images?.[0])}
          alt={car.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        <Badge
          className={`absolute top-3 right-3 ${
            car.status === "available"
              ? "bg-success/90 text-success-foreground"
              : "bg-destructive/90 text-destructive-foreground"
          }`}
        >
          {car.status === "available" ? "Available" : "Unavailable"}
        </Badge>
      </div>

      <CardContent className="p-5">
        <h3 className="text-xl font-bold mb-1">{car.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">
          {car.year} • {car.brand}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { icon: Users, label: `${car.seats} Seats` },
            { icon: Gauge, label: car.transmission },
            { icon: Fuel, label: car.fuelType },
            { icon: Car, label: car.model },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-muted-foreground">
              <Icon className="h-4 w-4 text-primary/60" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold gradient-text">
            ${car.dailyRate}
          </div>
          <div className="text-xs text-muted-foreground">per day</div>
        </div>

        <Button asChild disabled={car.status !== "available"} className="glow-sm">
          <Link to={`/cars/${car.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
