import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import api from "@/lib/api";
import { getAuthState } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Car, Users, Gauge, Fuel, Calendar as CalendarIcon, DollarSign } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const getImageUrl = (path?: string) => {
  if (!path) return "/placeholder-car.jpg";

  if (path.startsWith("http")) return path;

  return `${BASE_URL}/${path}`;
};

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [car, setCar] = useState<any | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [totalCost, setTotalCost] = useState(0);

  const authState = getAuthState();

  useEffect(() => {
    if (startDate && endDate && car) {
      setTotalCost(
        (differenceInDays(endDate, startDate) + 1) * car.dailyRate
      );
    } else {
      setTotalCost(0);
    }
  }, [startDate, endDate, car]);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setCar(await api.getCar(id));
      } catch {
        setCar(undefined);
      }
    };

    load();
  }, [id]);

  if (!car) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Fetching car details...</h1>
          <Button onClick={() => navigate("/cars")} className="glow-sm">
            Browse Cars
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBooking = () => {
    if (!authState.isAuthenticated) {
      toast({
        variant: "destructive",
        title: "Login required",
        description: "Please login to book a car.",
      });
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Select dates",
        description: "Please select start and end dates.",
      });
      return;
    }

    (async () => {
      try {
        await api.createBooking({
          car_id: car.id,
          start_date: startDate.toISOString().slice(0, 10),
          end_date: endDate.toISOString().slice(0, 10),
        });

        toast({
          title: "Booking submitted!",
          description: "Your booking request has been sent.",
        });

        navigate("/bookings");
      } catch (e: any) {
        toast({
          variant: "destructive",
          title: "Booking failed",
          description:
            e?.response?.data?.message || "Could not create booking",
        });
      }
    })();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Image Section */}
          <div>
            <div className="rounded-xl overflow-hidden glow-sm">
              <img
                src={getImageUrl(car.images?.[0])}
                alt={car.name}
                className="w-full h-96 object-cover"
              />
            </div>
          </div>

          {/* Details Section */}
          <div>
            <h1 className="text-4xl font-bold mb-2 gradient-text">
              {car.name}
            </h1>

            <p className="text-xl text-muted-foreground mb-6">
              {car.year} • {car.brand}
            </p>

            <div className="mb-6">
              <div className="text-4xl font-bold gradient-text">
                ${car.dailyRate}
              </div>
              <div className="text-muted-foreground text-sm">per day</div>
            </div>

            {/* Specifications */}
            <Card className="mb-6 glass">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Specifications</h3>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Users, label: "Seats", value: car.seats },
                    { icon: Gauge, label: "Transmission", value: car.transmission },
                    { icon: Fuel, label: "Fuel Type", value: car.fuelType },
                    { icon: Car, label: "Model", value: car.model },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground">
                          {label}
                        </div>
                        <div className="font-medium text-sm">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Booking Section */}
            <Card className="glass">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Book This Car</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "Start Date",
                        date: startDate,
                        setDate: setStartDate,
                        disabledFn: (d: Date) => d < new Date(),
                      },
                      {
                        label: "End Date",
                        date: endDate,
                        setDate: setEndDate,
                        disabledFn: (d: Date) =>
                          !startDate || d < startDate,
                      },
                    ].map(({ label, date, setDate, disabledFn }) => (
                      <div key={label} className="space-y-2">
                        <Label>{label}</Label>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-secondary/50 border-border/50",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              disabled={disabledFn}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    ))}
                  </div>

                  {totalCost > 0 && (
                    <div className="flex items-center justify-between p-4 glass rounded-lg glow-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <span className="font-medium">Total Cost</span>
                      </div>

                      <span className="text-2xl font-bold gradient-text">
                        ${totalCost}
                      </span>
                    </div>
                  )}

                  <Button
                    className="w-full glow-sm"
                    size="lg"
                    onClick={handleBooking}
                    disabled={car.status !== "available"}
                  >
                    {car.status === "available"
                      ? "Book Now"
                      : "Unavailable"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {car.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CarDetails;
