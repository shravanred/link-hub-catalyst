import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="bg-card border-b px-6 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Link Hub
        </Link>
        
        <div className="flex gap-4">
          <Button 
            variant={!isAdmin ? "default" : "outline"} 
            asChild
          >
            <Link to="/">Public View</Link>
          </Button>
          <Button 
            variant={isAdmin ? "default" : "outline"} 
            asChild
          >
            <Link to="/admin">Admin Panel</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;