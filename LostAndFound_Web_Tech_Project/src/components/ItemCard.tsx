import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { Item } from "@/hooks/useItems";

interface ItemCardProps {
  item: Item;
  onMarkAsFound?: (itemId: string) => void;
  currentUserId?: string | null;
}

export const ItemCard = ({
  item,
  onMarkAsFound,
  currentUserId,
}: ItemCardProps) => {
  const [showContact, setShowContact] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const getTimeSince = (timestamp: string) => {
    const now = new Date();
    const posted = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - posted.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just posted";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Card
      className={`overflow-hidden hover:shadow-card transition-all duration-200 bg-gradient-card ${
        item.resolved ? "opacity-75 ring-2 ring-secondary/50" : ""
      }`}
    >
      <div className="aspect-video bg-muted relative overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className={`w-full h-full object-cover ${
              item.resolved ? "grayscale-[0.3]" : ""
            }`}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50">
            <div className="text-center">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-sm text-muted-foreground">No image</p>
            </div>
          </div>
        )}

        {item.resolved && (
          <div className="absolute inset-0 bg-secondary/10 flex items-center justify-center">
            <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full font-semibold text-sm shadow-lg">
              ✅ Resolved
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <Badge
            variant={
              item.resolved
                ? "outline"
                : item.type === "lost"
                ? "destructive"
                : "secondary"
            }
            className="font-semibold"
          >
            {item.type === "lost" ? "🔍 Lost" : "✨ Found"}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge
            variant="outline"
            className="bg-background/80 backdrop-blur-sm"
          >
            {getTimeSince(item.created_at)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-card-foreground truncate">
            {item.name}
          </h3>

          <p className="text-muted-foreground text-sm line-clamp-2">
            {item.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{item.place}</span>
            </div>
            {item.date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(item.date)}</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t space-y-2">
            {item.resolved && (
              <div className="text-xs text-muted-foreground text-center py-1">
                Marked as resolved{" "}
                {item.resolved_at
                  ? new Date(item.resolved_at).toLocaleDateString()
                  : ""}
              </div>
            )}

            {!showContact ? (
              <Button
                variant="campus"
                size="sm"
                onClick={() => setShowContact(true)}
                className="w-full"
                disabled={item.resolved}
              >
                Show Contact Info
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                {item.contact.includes("@") ? (
                  <Mail className="h-4 w-4 text-primary" />
                ) : (
                  <Phone className="h-4 w-4 text-primary" />
                )}
                <span className="font-medium text-primary">{item.contact}</span>
              </div>
            )}

            {!item.resolved &&
              onMarkAsFound &&
              showContact &&
              item.created_by === currentUserId && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onMarkAsFound(item.id)}
                  className="w-full"
                >
                  ✅ Mark as Found
                </Button>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
