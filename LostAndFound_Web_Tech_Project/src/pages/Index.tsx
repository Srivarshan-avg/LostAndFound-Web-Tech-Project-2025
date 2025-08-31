import { useState } from "react";
import { ItemForm } from "@/components/ItemForm";
import { ItemGrid } from "@/components/ItemGrid";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import MagnetLinesBackground from "@/components/MagnetLinesBackground";
import { useItems } from "@/hooks/useItems";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  const { items, loading, addItem, markAsFound } = useItems();
  const [showForm, setShowForm] = useState(false);
  const [showResolved, setShowResolved] = useState(true);

  const handleAddItem = async (newItem) => {
    if (user) {
      newItem.created_by = user.id; // attach logged-in user's ID as creator
    }
    const result = await addItem(newItem);
    if (result.success) setShowForm(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-200 overflow-hidden font-sans">
      {/* Animated Background */}
      <MagnetLinesBackground color="#4f46e5" speed={0.2} intensity={0.7} />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-gray-900/80 border-b border-gray-700 shadow-lg transition-colors">
        <div className="container mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl select-none">🎓</div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-wide text-indigo-400 drop-shadow-md">
                Campus Lost & Found
              </h1>
              <p className="text-xs text-indigo-300 opacity-80">
                Help students reconnect with their items
              </p>
            </div>
          </div>
          <Button
            variant="hero"
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 transform transition-transform duration-200 shadow-lg"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus className="h-5 w-5" />
            Post Item
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col justify-center items-center text-center text-indigo-300 select-none mb-20 pt-20 px-6">
        <div className="max-w-4xl space-y-8">
          <h2 className="text-5xl font-bold tracking-tight drop-shadow-lg leading-tight">
            Lost Something? Found Something?
          </h2>
          <p className="text-xl max-w-3xl mx-auto opacity-75">
            Connect with your campus community to reunite lost items with their
            owners
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-6">
            <Button
              variant="secondary"
              size="lg"
              className="gap-2 bg-indigo-700 hover:bg-indigo-800 shadow-lg transition-colors duration-300"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-5 w-5" />
              Post Lost Item
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-indigo-600 hover:border-indigo-400 text-indigo-400 hover:text-indigo-200 transition-colors duration-300"
              onClick={() =>
                document
                  .getElementById("items-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Search className="h-5 w-5" />
              Browse Items
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto max-w-5xl px-6 pb-16 space-y-16">
        {/* Form Section */}
        {showForm && (
          <section className="bg-gray-800 rounded-xl shadow-lg p-8 transition-all duration-400 border border-indigo-700">
            <ItemForm onSubmit={handleAddItem} />
          </section>
        )}

        {/* Items Section */}
        <section id="items-section">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-semibold tracking-wide text-indigo-400">
              Browse Items
            </h2>
            <Button
              variant="outline"
              className="gap-2 border-indigo-600 hover:border-indigo-400 text-indigo-400 hover:text-indigo-200 transition-colors duration-300"
              onClick={() => setShowResolved((v) => !v)}
            >
              {showResolved ? "👁️ Hide Resolved" : "👁️ Show Resolved"}
            </Button>
          </div>
          <ItemGrid
            items={items}
            loading={loading}
            onMarkAsFound={markAsFound}
            showResolved={showResolved}
            currentUserId={user?.id ?? null} // Pass logged-in user ID for ownership checks
          />
        </section>

        {/* Stats Section */}
        <section className="bg-gray-800 rounded-2xl p-10 shadow-md border border-indigo-700">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-indigo-400 mb-2 tracking-wide">
              Community Impact
            </h3>
            <p className="text-indigo-300 opacity-70">
              Help make our campus a better place
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-extrabold text-indigo-500">
                {items.length}
              </div>
              <div className="text-sm text-indigo-300 mt-1">
                Total Items Posted
              </div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-green-500">
                {items.filter((item) => item.type === "found").length}
              </div>
              <div className="text-sm text-indigo-300 mt-1">Items Found</div>
            </div>
            <div>
              <div className="text-5xl font-extrabold text-orange-500">
                {items.filter((item) => item.resolved).length}
              </div>
              <div className="text-sm text-indigo-300 mt-1">Items Resolved</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-indigo-700 py-6 text-center text-indigo-400 select-none">
        Campus Lost & Found Portal • Connecting Students • Building Community
      </footer>
    </div>
  );
};

export default Index;
