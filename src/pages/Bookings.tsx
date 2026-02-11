import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAuthState } from "@/lib/auth";
import api from "@/lib/api";
import type { Booking } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar, DollarSign } from "lucide-react";

const Bookings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const authState = getAuthState();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!authState.isAuthenticated) { navigate("/login"); return; }
    const load = async () => { try { setBookings(await api.getBookings()); } catch { setBookings([]); } };
    load();
  }, [authState, navigate]);

  const handleCancel = (bookingId: string) => {
    (async () => {
      try {
        const res = await api.cancelBooking(bookingId);
        setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: res.status } : b));
        toast({ title: "Booking cancelled", description: "Your booking has been cancelled." });
      } catch { toast({ variant: "destructive", title: "Cancel failed", description: "Could not cancel booking" }); }
    })();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-warning/20 text-warning border-warning/30";
      case "approved": return "bg-success/20 text-success border-success/30";
      case "out": return "bg-primary/20 text-primary border-primary/30";
      case "returned": return "bg-muted text-muted-foreground border-border";
      case "declined": return "bg-destructive/20 text-destructive border-destructive/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 gradient-text">My Bookings</h1>
        <p className="text-muted-foreground mb-8">Track all your car reservations</p>
        
        {bookings.length === 0 ? (
          <Card className="glass">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">You don't have any bookings yet.</p>
              <Button onClick={() => navigate("/cars")} className="glow-sm">Browse Cars</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => {
              const car = booking.car;
              if (!car) return null;
              return (
                <Card key={booking.id} className="glass hover:glow-sm transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <img src={car.images[0]} alt={car.name} className="w-24 h-24 object-cover rounded-lg ring-1 ring-border/50" />
                        <div>
                          <CardTitle className="text-xl mb-2">{car.name}</CardTitle>
                          <Badge className={getStatusColor(booking.status)}>{booking.status.toUpperCase()}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { icon: Calendar, label: "Start Date", value: format(new Date(booking.startDate), "MMM dd, yyyy") },
                        { icon: Calendar, label: "End Date", value: format(new Date(booking.endDate), "MMM dd, yyyy") },
                        { icon: DollarSign, label: "Total Cost", value: `$${booking.totalCost}`, highlight: true },
                      ].map(({ icon: Icon, label, value, highlight }) => (
                        <div key={label} className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary/60" />
                          <div>
                            <div className="text-sm text-muted-foreground">{label}</div>
                            <div className={`font-medium ${highlight ? "gradient-text" : ""}`}>{value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {booking.status === "pending" && (
                      <div className="mt-4">
                        <Button variant="destructive" size="sm" onClick={() => handleCancel(booking.id)}>Cancel Booking</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Bookings;
