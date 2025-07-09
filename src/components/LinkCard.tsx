import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AffiliateLink } from '@/types';

interface LinkCardProps {
  link: AffiliateLink;
  isAdmin?: boolean;
  onEdit?: (link: AffiliateLink) => void;
  onDelete?: (id: string) => void;
}

const LinkCard = ({ link, isAdmin = false, onEdit, onDelete }: LinkCardProps) => {
  const handleVisit = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Image */}
          {link.imageUrl && (
            <div 
              className="w-full h-32 rounded-lg overflow-hidden bg-muted cursor-pointer"
              onClick={handleVisit}
            >
              <img
                src={link.imageUrl}
                alt={link.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm line-clamp-2">{link.title}</h3>
              {isAdmin && (
                <Badge variant="secondary" className="text-xs shrink-0">
                  {link.category}
                </Badge>
              )}
            </div>

            {link.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {link.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {!isAdmin ? (
              <Button onClick={handleVisit} className="w-full" size="sm">
                Visit Now
              </Button>
            ) : (
              <>
                <Button onClick={handleVisit} variant="outline" size="sm" className="flex-1">
                  Visit
                </Button>
                <Button onClick={() => onEdit?.(link)} variant="outline" size="sm">
                  Edit
                </Button>
                <Button 
                  onClick={() => onDelete?.(link.id)} 
                  variant="destructive" 
                  size="sm"
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkCard;