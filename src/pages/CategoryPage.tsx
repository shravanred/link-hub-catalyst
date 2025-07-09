import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLinks } from '@/hooks/useLinks';
import LinkCard from '@/components/LinkCard';

const CategoryPage = () => {
  const { name } = useParams<{ name: string }>();
  const { links } = useLinks();

  const categoryLinks = links.filter(link => 
    link.category.toLowerCase() === name?.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </Button>
            </Link>
            <div className="text-right">
              <h1 className="text-3xl font-bold capitalize">{name}</h1>
              <p className="text-muted-foreground">
                {categoryLinks.length} product{categoryLinks.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Products */}
      <main className="container mx-auto px-6 py-8">
        {categoryLinks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                No products available in this category yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categoryLinks.map((link) => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;