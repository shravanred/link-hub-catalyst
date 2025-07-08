import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PublicLinks = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Link Hub</h1>
          <p className="text-muted-foreground">Discover amazing products and services</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Featured Links</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Browse through our curated collection of affiliate links organized by categories.
            </p>
            <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Mobiles</h3>
                <p className="text-sm text-muted-foreground">Latest smartphones and accessories</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Fashion</h3>
                <p className="text-sm text-muted-foreground">Trending clothing and accessories</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold">Electronics</h3>
                <p className="text-sm text-muted-foreground">Tech gadgets and devices</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PublicLinks;