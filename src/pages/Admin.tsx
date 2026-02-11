import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthState, isAdmin } from "@/lib/auth";
import api from "@/lib/api";
import { Car, Users, DollarSign, Calendar } from "lucide-react";
import { CarsManagement } from "@/components/admin/CarsManagement";
import { BookingsManagement } from "@/components/admin/BookingsManagement";
import { CustomersManagement } from "@/components/admin/CustomersManagement";
import { ReportsSection } from "@/components/admin/ReportsSection";

const Admin = () => {
  const navigate = useNavigate();
  const authState = getAuthState();
  const [bookings, setBookings] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [customersCount, setCustomersCount] = useState(0);

  useEffect(() => {
    if (!authState.isAuthenticated || !isAdmin(authState.user)) { navigate("/"); }
    const load = async () => {
      try {
        const [rb, rc] = await Promise.all([api.getBookings(), api.getCars()]);
        setBookings(rb); setCars(rc);
        const map = new Map<string, any>();
        rb.forEach((b: any) => { if (b.raw?.user) map.set(String(b.raw.user.id), b.raw.user); });
        setCustomersCount(map.size);
      } catch { setBookings([]); setCars([]); setCustomersCount(0); }
    };
    load();
  }, [authState, navigate]);

  const stats = [
    { title: "Total Cars", value: cars.length, sub: `${cars.filter((c: any) => c.status === "available").length} available`, icon: Car },
    { title: "Cars Out", value: bookings.filter(b => b.status === "out").length, sub: "Currently rented", icon: Calendar },
    { title: "Customers", value: customersCount, sub: "Registered users", icon: Users },
    { title: "Revenue", value: `$${bookings.filter(b => b.status === "returned").reduce((s, b) => s + (b.totalCost || b.total_price || 0), 0)}`, sub: `${bookings.filter(b => b.status === "pending").length} pending`, icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 gradient-text">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage your fleet and operations</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map(({ title, value, sub, icon: Icon }) => (
            <Card key={title} className="glass hover:glow-sm transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList className="glass border border-border/50">
            <TabsTrigger value="bookings" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Bookings</TabsTrigger>
            <TabsTrigger value="cars" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Cars</TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Customers</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="bookings"><BookingsManagement /></TabsContent>
          <TabsContent value="cars"><CarsManagement /></TabsContent>
          <TabsContent value="customers"><CustomersManagement /></TabsContent>
          <TabsContent value="reports"><ReportsSection /></TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
