import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Car, User, LogOut, Menu, X } from "lucide-react";
import { getAuthState, logout, isAdmin } from "@/lib/auth";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(getAuthState());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => setAuthState(getAuthState());
    window.addEventListener("storage", checkAuth);
    window.addEventListener("auth-change", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setAuthState({ user: null, isAuthenticated: false });
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl group">
          <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Car className="h-5 w-5 text-primary" />
          </div>
          <span className="gradient-text">DriveWise</span>
        </Link>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-3">
          {authState.isAuthenticated ? (
            <>
              {isAdmin(authState.user) ? (
                <Button variant="ghost" asChild className="hover:bg-primary/10 hover:text-primary">
                  <Link to="/admin">Admin Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild className="hover:bg-primary/10 hover:text-primary">
                    <Link to="/cars">Browse Cars</Link>
                  </Button>
                  <Button variant="ghost" asChild className="hover:bg-primary/10 hover:text-primary">
                    <Link to="/bookings">My Bookings</Link>
                  </Button>
                </>
              )}
              <Button variant="ghost" asChild className="hover:bg-primary/10 hover:text-primary">
                <Link to="/profile">
                  <User className="h-4 w-4 mr-2" />
                  {authState.user?.name}
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout} className="border-primary/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hover:bg-primary/10 hover:text-primary">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="glow-sm">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl p-4 space-y-2 animate-fade-in">
          {authState.isAuthenticated ? (
            <>
              {isAdmin(authState.user) ? (
                <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMobileOpen(false)}>
                  <Link to="/admin">Admin Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMobileOpen(false)}>
                    <Link to="/cars">Browse Cars</Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMobileOpen(false)}>
                    <Link to="/bookings">My Bookings</Link>
                  </Button>
                </>
              )}
              <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMobileOpen(false)}>
                <Link to="/profile">Profile</Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setMobileOpen(false)}>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="w-full" asChild onClick={() => setMobileOpen(false)}>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
