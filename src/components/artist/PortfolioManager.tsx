"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PortfolioItem {
  id: number;
  artistId: number;
  images: string[];
  title: string | null;
  description: string | null;
  createdAt: string;
}

interface PortfolioManagerProps {
  artistId: number;
}

export function PortfolioManager({ artistId }: PortfolioManagerProps) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/artist/${artistId}/portfolio`);
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [artistId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected?.length) return;
    const arr = Array.from(selected);
    const valid = arr.filter(
      (f) =>
        f.size <= 5 * 1024 * 1024 &&
        ["image/jpeg", "image/png", "image/webp"].includes(f.type),
    );
    setFiles((prev) => [...prev, ...valid]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (files.length === 0) {
      setError("Please select at least one image");
      return;
    }

    setSubmitting(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("artistId", String(artistId));

        const res = await fetch("/api/upload/portfolio-image", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to upload image");
        }

        const { url } = await res.json();
        urls.push(url);
      }

      const createRes = await fetch(`/api/artist/${artistId}/portfolio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || undefined,
          description: description || undefined,
          images: urls,
        }),
      });

      if (!createRes.ok) {
        const data = await createRes.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create portfolio item");
      }

      setTitle("");
      setDescription("");
      setFiles([]);
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId: number) => {
    setDeletingId(itemId);
    try {
      const res = await fetch(
        `/api/artist/${artistId}/portfolio/${itemId}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        fetchItems();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Failed to delete");
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Loading portfolio...</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Portfolio</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add portfolio item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="files">Images</Label>
              <input
                id="files"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground file:text-sm"
              />
              <p className="text-muted-foreground text-xs">
                Max 5MB each. JPG, PNG, or WebP.
              </p>
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1 rounded border px-2 py-1 text-sm"
                    >
                      <span className="truncate max-w-24">{f.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-destructive hover:underline"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title (optional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Tribal sleeve"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                className="min-h-[80px]"
              />
            </div>
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            <Button type="submit" disabled={submitting || files.length === 0}>
              {submitting ? "Uploading..." : "Add to portfolio"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
              {item.images?.[0] ? (
                /* biome-ignore lint/performance/noImgElement: external portfolio URL */
                <img
                  src={item.images[0]}
                  alt={item.title ?? "Portfolio"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {item.title || "Untitled"}
              </CardTitle>
              {item.description && (
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {item.description}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <Button
                size="sm"
                variant="destructive"
                disabled={deletingId !== null}
                onClick={() => handleDelete(item.id)}
              >
                {deletingId === item.id ? "Deleting..." : "Delete"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && !loading && (
        <p className="text-muted-foreground">No portfolio items yet.</p>
      )}
    </div>
  );
}
