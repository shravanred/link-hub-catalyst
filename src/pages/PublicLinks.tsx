import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { useLinks } from '@/hooks/useLinks';

const PublicLinks = () => {
  const { links, categories } = useLinks();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter categories based on search
  const filteredCategories = categories.filter(category => {
    const hasMatchingLinks = links.some(link => 
      link.category === category.name && (
        searchQuery === '' || 
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    return hasMatchingLinks;
  });

  // Count links per category
  const linkCounts = categories.reduce((acc, category) => {
    acc[category.name] = links.filter(link => link.category === category.name).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Link Hub</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover amazing products and services through our curated collection of affiliate links
            </p>
            <div className="flex justify-center">
              <a 
                href="/admin" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin Access
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Search */}
      <section className="bg-muted/30 py-6">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <Input
              placeholder="Search categories and products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Categories List */}
      <main className="container mx-auto px-6 py-8">
        {filteredCategories.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No categories found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `No categories match your search "${searchQuery}"`
                  : 'No categories available yet'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Link 
                key={category.id}
                to={`/category/${encodeURIComponent(category.name.toLowerCase())}`}
              >
                <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-muted-foreground mt-1">
                          {linkCounts[category.name]} product{linkCounts[category.name] !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t mt-12">
        <div className="container mx-auto px-6 py-8 text-center">
          <p className="text-muted-foreground">
            © 2024 Link Hub. Discover the best products and services.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLinks;