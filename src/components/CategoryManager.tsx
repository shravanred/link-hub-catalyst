import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (categoryName: string) => void;
  linkCounts: Record<string, number>;
}

const CategoryManager = ({ categories, onAddCategory, onDeleteCategory, linkCounts }: CategoryManagerProps) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const exists = categories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase());
    if (exists) {
      toast({
        title: 'Category exists',
        description: 'A category with this name already exists.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
      toast({
        title: 'Category added',
        description: `"${newCategoryName}" category has been created.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (categoryName: string) => {
    const linkCount = linkCounts[categoryName] || 0;
    const confirmMessage = linkCount > 0 
      ? `This will delete the category and ${linkCount} link(s). Are you sure?`
      : 'Are you sure you want to delete this category?';
    
    if (window.confirm(confirmMessage)) {
      onDeleteCategory(categoryName);
      toast({
        title: 'Category deleted',
        description: `"${categoryName}" category has been deleted.`,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="categoryName" className="sr-only">Category Name</Label>
            <Input
              id="categoryName"
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isLoading || !newCategoryName.trim()}>
            {isLoading ? 'Adding...' : 'Add Category'}
          </Button>
        </form>

        <div className="space-y-2">
          <Label>Existing Categories</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{category.name}</span>
                  <Badge variant="secondary">
                    {linkCounts[category.name] || 0}
                  </Badge>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(category.name)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;