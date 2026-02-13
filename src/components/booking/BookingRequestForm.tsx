"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  size: z.string().optional(),
  placement: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BookingRequestFormProps {
  artistId: number;
  onSuccess?: (requestId: number) => void;
}

export function BookingRequestForm({
  artistId,
  onSuccess,
}: BookingRequestFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      size: "",
      placement: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      form.setError("root", { message: "File must be under 5MB" });
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      form.setError("root", { message: "File must be JPG, PNG, or WebP" });
      return;
    }
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    form.clearErrors("root");
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitLoading(true);
    try {
      let referenceImageUrl: string | undefined;
      if (file) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload/ref-image", {
          method: "POST",
          body: formData,
        });
        setUploading(false);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to upload image");
        }
        const { url } = await res.json();
        referenceImageUrl = url;
      }

      const res = await fetch("/api/booking-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistId,
          description: values.description,
          size: values.size || undefined,
          placement: values.placement || undefined,
          referenceImageUrl,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create request");
      }

      const { id } = await res.json();
      form.reset();
      setFile(null);
      setPreviewUrl(null);
      onSuccess?.(id);
      window.location.href = `/booking-request/${id}`;
    } catch (err) {
      form.setError("root", {
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your tattoo idea in detail..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 6cm x 6cm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="placement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placement (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. inner forearm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Reference image (optional)</FormLabel>
          <div className="flex flex-col gap-4">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground file:text-sm"
            />
            {previewUrl && (
              /* biome-ignore lint/performance/noImgElement: blob URL preview */
              <img
                src={previewUrl}
                alt="Preview"
                className="h-32 w-32 rounded-md border object-cover"
              />
            )}
          </div>
          <p className="text-muted-foreground text-xs">
            Max 5MB. JPG, PNG, or WebP.
          </p>
        </div>

        {form.formState.errors.root && (
          <p className="text-destructive text-sm">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button type="submit" disabled={submitLoading || uploading}>
          {uploading
            ? "Uploading..."
            : submitLoading
              ? "Submitting..."
              : "Submit request"}
        </Button>
      </form>
    </Form>
  );
}
