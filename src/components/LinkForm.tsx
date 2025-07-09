import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AffiliateLink, Category } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface LinkFormProps {
  link?: AffiliateLink;
  categories: Category[];
  onSubmit: (linkData: Omit<AffiliateLink, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
  onCancel: () => void;
}

const LinkForm = ({ link, categories, onSubmit, onCancel }: LinkFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category: '',
    imageUrl: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Auto-extract data from any affiliate URL
  const extractFromAffiliateUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      // Find product slug between domain and /p or /buy
      const match = pathname.match(/\/([^\/]+)(?:\/p|\/buy|$)/);
      
      if (match && match[1]) {
        const productSlug = match[1];
        
        // Convert hyphens to spaces for description
        const description = productSlug.replace(/-/g, ' ');
        
        setFormData(prev => ({
          ...prev,
          description: description.charAt(0).toUpperCase() + description.slice(1)
        }));
      } else {
        // Fallback: try to extract from path parts
        const pathParts = pathname.split('/').filter(Boolean);
        if (pathParts.length > 0) {
          const lastPart = pathParts[pathParts.length - 1];
          const description = lastPart.replace(/-/g, ' ');
          
          setFormData(prev => ({
            ...prev,
            description: description.charAt(0).toUpperCase() + description.slice(1)
          }));
        }
      }
    } catch (error) {
      console.error('Error parsing affiliate URL:', error);
    }
  };

  useEffect(() => {
    if (link) {
      setFormData({
        title: link.title,
        url: link.url,
        category: link.category,
        imageUrl: link.imageUrl || '',
        description: link.description || '',
      });
    }
  }, [link]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      onSubmit(formData);
      toast({
        title: link ? 'Link updated' : 'Link added',
        description: `"${formData.title}" has been ${link ? 'updated' : 'added'} successfully.`,
      });
      
      if (!link) {
        setFormData({ title: '', url: '', category: '', imageUrl: '', description: '' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-extract when URL is pasted
    if (field === 'url' && value.trim()) {
      extractFromAffiliateUrl(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{link ? 'Edit Link' : 'Add New Link'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., iPhone 15 Pro"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Affiliate URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/product"
              value={formData.url}
              onChange={(e) => handleChange('url', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the product..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (link ? 'Update Link' : 'Add Link')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LinkForm;