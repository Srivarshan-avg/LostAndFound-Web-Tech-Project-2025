import { ItemCard } from "./ItemCard";
import { Item } from "@/hooks/useItems";

interface ItemGridProps {
  items: Item[];
  loading?: boolean;
  onMarkAsFound?: (itemId: string) => void;
  showResolved?: boolean;
  currentUserId?: string | null;
}

export const ItemGrid = ({
  items,
  loading = false,
  onMarkAsFound,
  showResolved = true,
  currentUserId,
}: ItemGridProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">No items posted yet</h3>
        <p className="text-muted-foreground">
          Be the first to post a lost or found item to help your fellow
          students!
        </p>
      </div>
    );
  }

  // Filter and sort items
  const filteredItems = showResolved
    ? items
    : items.filter((item) => !item.resolved);
  const sortedItems = [...filteredItems].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          Recent Posts ({sortedItems.length})
        </h2>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            🔍{" "}
            {
              filteredItems.filter(
                (item) => item.type === "lost" && !item.resolved
              ).length
            }{" "}
            Lost
          </span>
          <span className="flex items-center gap-1">
            ✨{" "}
            {
              filteredItems.filter(
                (item) => item.type === "found" && !item.resolved
              ).length
            }{" "}
            Found
          </span>
          <span className="flex items-center gap-1">
            ✅ {items.filter((item) => item.resolved).length} Resolved
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onMarkAsFound={onMarkAsFound}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
};
