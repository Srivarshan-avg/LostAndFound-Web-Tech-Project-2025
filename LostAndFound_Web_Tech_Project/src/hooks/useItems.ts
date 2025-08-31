import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export interface Item {
  id: string;
  type: string;
  name: string;
  description: string;
  contact: string;
  place: string;
  date: string;
  image_url?: string;
  resolved?: boolean;
  resolved_at?: string;
  created_at: string;

  created_by?: string | null;
}

export const useItems = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setItems(data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (
    newItem: Omit<Item, "id" | "created_at"> & { created_by: string }
  ) => {
    try {
      const { data, error } = await supabase
        .from("items")
        .insert([
          {
            type: newItem.type,
            name: newItem.name,
            description: newItem.description,
            contact: newItem.contact,
            place: newItem.place,
            date: newItem.date,
            image_url: newItem.image_url,
            created_by: newItem.created_by,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setItems((prev) => [data, ...prev]);
      toast.success("Item posted successfully!");
      return { success: true, data };
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to post item");
      return { success: false, error };
    }
  };

  const markAsFound = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("items")
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
        })
        .eq("id", itemId);

      if (error) throw error;

      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? { ...item, resolved: true, resolved_at: new Date().toISOString() }
            : item
        )
      );
      toast.success("Item marked as found!");
    } catch (error) {
      console.error("Error marking item as found:", error);
      toast.error("Failed to mark item as found");
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("item-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("item-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    addItem,
    markAsFound,
    uploadImage,
    refetch: fetchItems,
  };
};
