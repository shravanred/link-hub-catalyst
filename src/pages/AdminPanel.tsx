import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { useLinks } from '@/hooks/useLinks';
import LoginForm from '@/components/LoginForm';
import LinkForm from '@/components/LinkForm';
import CategoryManager from '@/components/CategoryManager';
import LinkCard from '@/components/LinkCard';
import { AffiliateLink } from '@/types';
import { useToast } from '@/hooks/use-toast';

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, logout } = useAuth();
  const { links, categories, addLink, updateLink, deleteLink, addCategory, deleteCategory } = useLinks();
  const [editingLink, setEditingLink] = useState<AffiliateLink | undefined>();
  const [showLinkForm, setShowLinkForm] = useState(false);
  const { toast } = useToast();

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  const handleLinkSubmit = (linkData: Omit<AffiliateLink, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
    if (editingLink) {
      updateLink(editingLink.id, linkData);
      setEditingLink(undefined);
    } else {
      addLink(linkData);
    }
    setShowLinkForm(false);
  };

  const handleLinkEdit = (link: AffiliateLink) => {
    setEditingLink(link);
    setShowLinkForm(true);
  };

  const handleLinkDelete = (id: string) => {
    const link = links.find(l => l.id === id);
    if (link && window.confirm(`Are you sure you want to delete "${link.title}"?`)) {
      deleteLink(id);
      toast({
        title: 'Link deleted',
        description: `"${link.title}" has been deleted.`,
      });
    }
  };

  const handleCancelForm = () => {
    setShowLinkForm(false);
    setEditingLink(undefined);
  };

  // Calculate link counts per category
  const linkCounts = categories.reduce((acc, category) => {
    acc[category.name] = links.filter(link => link.category === category.name).length;
    return acc;
  }, {} as Record<string, number>);

  // Group links by category
  const linksByCategory = categories.reduce((acc, category) => {
    acc[category.name] = links.filter(link => link.category === category.name);
    return acc;
  }, {} as Record<string, AffiliateLink[]>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">Manage your affiliate links and categories</p>
            </div>
            <Button 
              onClick={() => {
                logout();
                navigate('/');
              }} 
              variant="outline"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="links">Manage Links</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="add-link">Add Link</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{links.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{categories.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Most Popular Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-semibold">
                    {Object.entries(linkCounts).reduce((a, b) => linkCounts[a[0]] > linkCounts[b[0]] ? a : b, ['', 0])[0] || 'None'}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {links.slice(0, 6).map((link) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      isAdmin
                      onEdit={handleLinkEdit}
                      onDelete={handleLinkDelete}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="space-y-6">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {category.name}
                    <span className="text-sm font-normal text-muted-foreground">
                      {linksByCategory[category.name]?.length || 0} links
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {linksByCategory[category.name]?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {linksByCategory[category.name].map((link) => (
                        <LinkCard
                          key={link.id}
                          link={link}
                          isAdmin
                          onEdit={handleLinkEdit}
                          onDelete={handleLinkDelete}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No links in this category yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager
              categories={categories}
              onAddCategory={addCategory}
              onDeleteCategory={deleteCategory}
              linkCounts={linkCounts}
            />
          </TabsContent>

          <TabsContent value="add-link">
            <LinkForm
              categories={categories}
              onSubmit={handleLinkSubmit}
              onCancel={handleCancelForm}
            />
          </TabsContent>
        </Tabs>

        {/* Edit Link Modal/Form */}
        {showLinkForm && editingLink && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <LinkForm
                link={editingLink}
                categories={categories}
                onSubmit={handleLinkSubmit}
                onCancel={handleCancelForm}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;