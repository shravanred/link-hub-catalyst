import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLinks } from '@/hooks/useLinks';
import LinkCard from '@/components/LinkCard';

const PublicLinks = () => {
  const { links, categories } = useLinks();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter links based on category and search
  const filteredLinks = links.filter(link => {
    const matchesCategory = selectedCategory === 'all' || link.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group filtered links by category
  const linksByCategory = categories.reduce((acc, category) => {
    const categoryLinks = filteredLinks.filter(link => link.category === category.name);
    if (categoryLinks.length > 0 || selectedCategory === category.name) {
      acc[category.name] = categoryLinks;
    }
    return acc;
  }, {} as Record<string, typeof links>);

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

      {/* Filters */}
      <section className="bg-muted/30 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-auto md:min-w-[300px]">
              <Input
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                size="sm"
              >
                All Categories
              </Button>
              {categories.map((category) => {
                const count = links.filter(link => link.category === category.name).length;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.name)}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {category.name}
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {filteredLinks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No links found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? `No links match your search "${searchQuery}"`
                  : selectedCategory !== 'all' 
                    ? `No links found in "${selectedCategory}" category`
                    : 'No links available yet'
                }
              </p>
            </CardContent>
          </Card>
        ) : selectedCategory === 'all' ? (
          // Show all categories
          <div className="space-y-8">
            {Object.entries(linksByCategory).map(([categoryName, categoryLinks]) => (
              <Card key={categoryName}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {categoryName}
                    <Badge variant="secondary">
                      {categoryLinks.length} link{categoryLinks.length !== 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categoryLinks.map((link) => (
                      <LinkCard key={link.id} link={link} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Show single category
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {selectedCategory}
                <Badge variant="secondary">
                  {filteredLinks.length} link{filteredLinks.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredLinks.map((link) => (
                  <LinkCard key={link.id} link={link} />
                ))}
              </div>
            </CardContent>
          </Card>
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