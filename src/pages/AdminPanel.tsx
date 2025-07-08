import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Admin Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Welcome to the admin panel. Here you can manage all your affiliate links and categories.
            </p>
            <div className="mt-6 space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <div>• Add new links</div>
                  <div>• Manage categories</div>
                  <div>• Edit existing links</div>
                  <div>• View analytics</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;