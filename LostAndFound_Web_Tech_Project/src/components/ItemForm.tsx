import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useItems } from "@/hooks/useItems";

interface ItemFormProps {
  onSubmit: (item: any) => void;
}

export const ItemForm = ({ onSubmit }: ItemFormProps) => {
  const { uploadImage } = useItems();
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!type || !name || !contact || !place) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    let imageUrl = undefined;
    
    // Upload image if selected
    if (imagePreview) {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = fileInput?.files?.[0];
      if (file) {
        imageUrl = await uploadImage(file);
      }
    }

    const newItem = {
      type,
      name,
      description,
      contact,
      place,
      date,
      image_url: imageUrl,
    };

    await onSubmit(newItem);
    
    // Reset form
    setType("");
    setName("");
    setDescription("");
    setContact("");
    setPlace("");
    setDate("");
    setImagePreview(null);
    setSubmitting(false);
  };

  return (
    <Card className="shadow-form bg-gradient-card">
      <CardHeader>
        <CardTitle className="text-2xl bg-gradient-hero bg-clip-text text-transparent">
          Post an Item
        </CardTitle>
        <p className="text-muted-foreground">Help your fellow students by posting lost or found items</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Item Type *</Label>
            <RadioGroup value={type} onValueChange={setType} className="flex gap-8">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lost" id="lost" />
                <Label htmlFor="lost" className="cursor-pointer">🔍 Lost Item</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="found" id="found" />
                <Label htmlFor="found" className="cursor-pointer">✨ Found Item</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                placeholder="e.g., iPhone, Blue Backpack, Keys"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact">Contact *</Label>
              <Input
                id="contact"
                placeholder="Email or phone"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide details about the item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="place">Location *</Label>
              <Input
                id="place"
                placeholder="Where was it lost/found?"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Item Photo</Label>
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-2"
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-xs mx-auto rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Posting..." : "Post Item"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};