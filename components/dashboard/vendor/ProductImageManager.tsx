"use client";

import {
  deleteProductImage,
  getProductImages,
  reorderImages,
  setPrimaryImage,
  uploadProductImages,
  type ProductImageResponse,
} from "@/api/product.api";
import { getApiErrorMessage } from "@/utils/api-error";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Award,
  GripVertical,
  ImageIcon,
  Loader2,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Sortable Image Card ─────────────────────────────────
function SortableImage({
  image,
  isPrimary,
  onSetPrimary,
  onDelete,
  isDeleting,
}: {
  image: ProductImageResponse;
  isPrimary: boolean;
  onSetPrimary: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-2xl overflow-hidden border-2 bg-slate-50 aspect-square transition-all ${
        isPrimary
          ? "border-amber-500 ring-2 ring-amber-200"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="absolute top-1.5 left-1.5 z-10 w-7 h-7 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        title="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>

      {/* Primary badge */}
      {isPrimary && (
        <div className="absolute top-1.5 right-1.5 z-10 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
          <Star size={10} className="fill-white" />
          Primary
        </div>
      )}

      {/* Image */}
      <Image
        src={image.url}
        alt="Product"
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, 25vw"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

      {/* Actions */}
      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {!isPrimary && (
          <button
            onClick={onSetPrimary}
            className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-amber-700 hover:bg-amber-50 transition-colors shadow-sm"
            title="Set as primary image"
          >
            <Award size={11} />
            Set Primary
          </button>
        )}
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="w-8 h-7 flex items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm text-red-500 hover:bg-red-50 transition-colors shadow-sm disabled:opacity-50"
          title="Delete image"
        >
          {isDeleting ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Trash2 size={12} />
          )}
        </button>
      </div>

      {/* Order indicator */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-medium text-white/60 bg-black/30 px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        {image.order !== undefined ? `#${image.order + 1}` : ""}
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────
interface ProductImageManagerProps {
  productId?: string; // undefined when creating a new product
  initialImages?: ProductImageResponse[];
  newFiles: File[];
  onNewFilesChange: (files: File[]) => void;
  existingImages: ProductImageResponse[];
  onExistingImagesChange: (images: ProductImageResponse[]) => void;
  primaryImageId: string | null;
  onPrimaryImageIdChange: (id: string | null) => void;
  error?: string;
}

export default function ProductImageManager({
  productId,
  initialImages,
  newFiles,
  onNewFilesChange,
  existingImages,
  onExistingImagesChange,
  primaryImageId,
  onPrimaryImageIdChange,
  error,
}: ProductImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_FILES = 10;

  // Load existing images when editing
  useEffect(() => {
    if (initialImages && initialImages.length > 0 && existingImages.length === 0) {
      onExistingImagesChange(initialImages);
      // Set primary if not already set
      const primary = initialImages.find((img) => img.isPrimary);
      if (primary && !primaryImageId) {
        onPrimaryImageIdChange(primary.id);
      }
    }
  }, [initialImages]);

  // ─── File validation ─────────────────────────────────
  const validateFiles = useCallback(
    (files: FileList | File[]): File[] => {
      const valid: File[] = [];
      const totalCount = existingImages.length + newFiles.length;

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`"${file.name}" is not a valid image file`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`"${file.name}" exceeds the 5 MB limit`);
          continue;
        }
        if (totalCount + valid.length >= MAX_FILES) {
          toast.error(`Maximum ${MAX_FILES} images allowed`);
          break;
        }
        valid.push(file);
      }
      return valid;
    },
    [existingImages.length, newFiles.length],
  );

  // ─── File picker ─────────────────────────────────────
  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const valid = validateFiles(files);
    if (valid.length > 0) {
      onNewFilesChange([...newFiles, ...valid]);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  // ─── Drag & Drop ─────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    const valid = validateFiles(files);
    if (valid.length > 0) {
      onNewFilesChange([...newFiles, ...valid]);
    }
  };

  // ─── Remove a new file (before upload) ───────────────
  const handleRemoveNewFile = (index: number) => {
    const updated = newFiles.filter((_, i) => i !== index);
    onNewFilesChange(updated);
  };

  // ─── Delete existing image ──────────────────────────
  const handleDeleteExisting = async (image: ProductImageResponse) => {
    if (!productId) return;
    setDeletingIds((prev) => new Set(prev).add(image.id));
    try {
      await deleteProductImage(productId, image.id);
      const updated = existingImages.filter((img) => img.id !== image.id);
      onExistingImagesChange(updated);

      // If primary was deleted, auto-assign first available
      if (image.id === primaryImageId && updated.length > 0) {
        const newPrimary = updated[0].id;
        onPrimaryImageIdChange(newPrimary);
        toast.success("Primary image changed automatically");
      } else if (updated.length === 0) {
        onPrimaryImageIdChange(null);
      }

      toast.success("Image deleted");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete image"));
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(image.id);
        return next;
      });
    }
  };

  // ─── Set primary image (existing) ────────────────────
  const handleSetPrimaryExisting = async (image: ProductImageResponse) => {
    if (!productId) return;
    try {
      const res = await setPrimaryImage(productId, image.id);
      const updated = res.data.data ?? [];
      onExistingImagesChange(updated);
      onPrimaryImageIdChange(image.id);
      toast.success("Primary image updated");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to set primary image"));
    }
  };

  // ─── Set primary image (new file — not yet uploaded) ─
  const handleSetPrimaryNewFile = (index: number) => {
    // Mark this new file as primary visually — actual DB update happens on save
    onPrimaryImageIdChange(`__new__${index}`);
  };

  // ─── Reorder via drag & drop ─────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = existingImages.findIndex((img) => img.id === active.id);
    const newIndex = existingImages.findIndex((img) => img.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(existingImages, oldIndex, newIndex);
    onExistingImagesChange(reordered);

    // Persist to backend
    if (productId) {
      try {
        await reorderImages(
          productId,
          reordered.map((img) => img.id),
        );
      } catch {
        // Revert on failure
        onExistingImagesChange(existingImages);
        toast.error("Failed to reorder images");
      }
    }
  };

  // ─── Render ─────────────────────────────────────────
  const allExistingImages = existingImages;

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
        Product Images
      </label>
      <p className="text-xs text-slate-400 mb-2">
        Upload up to {MAX_FILES} images. Drag to reorder. Set one as primary.
      </p>

      {/* Error */}
      {error && (
        <p className="text-xs font-medium text-red-500 mb-2">{error}</p>
      )}

      {/* Existing images grid */}
      {allExistingImages.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={allExistingImages.map((img) => img.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {allExistingImages.map((image) => (
                <SortableImage
                  key={image.id}
                  image={image}
                  isPrimary={image.id === primaryImageId}
                  onSetPrimary={() => handleSetPrimaryExisting(image)}
                  onDelete={() => handleDeleteExisting(image)}
                  isDeleting={deletingIds.has(image.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* New files preview */}
      {newFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500">
            New images ({newFiles.length})
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {newFiles.map((file, idx) => {
              const isPrimary = primaryImageId === `__new__${idx}`;
              return (
                <div
                  key={`new-${idx}`}
                  className={`relative rounded-2xl overflow-hidden border-2 bg-slate-50 aspect-square ${
                    isPrimary
                      ? "border-amber-500 ring-2 ring-amber-200"
                      : "border-slate-200"
                  }`}
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`New image ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />

                  {/* Primary badge */}
                  {isPrimary && (
                    <div className="absolute top-1.5 right-1.5 z-10 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                      <Star size={10} className="fill-white" />
                      Primary
                    </div>
                  )}

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex gap-1 opacity-0 hover:opacity-100 transition-opacity z-10">
                    {!isPrimary && (
                      <button
                        onClick={() => handleSetPrimaryNewFile(idx)}
                        className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-amber-700 hover:bg-amber-50 transition-colors shadow-sm"
                      >
                        <Award size={11} />
                        Set Primary
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveNewFile(idx)}
                      className="w-8 h-7 flex items-center justify-center rounded-lg bg-white/90 backdrop-blur-sm text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isDragOver
            ? "border-amber-400 bg-amber-50"
            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
        } ${
          existingImages.length + newFiles.length >= MAX_FILES
            ? "opacity-50 pointer-events-none"
            : ""
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="sr-only"
          onChange={handleFilePick}
        />
        <Upload
          size={24}
          className={`mx-auto mb-2 ${
            isDragOver ? "text-amber-500" : "text-slate-400"
          }`}
        />
        <p className="text-sm font-semibold text-slate-600">
          {isDragOver
            ? "Drop images here"
            : "Drag & drop images or click to browse"}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          PNG, JPG, WebP up to 5 MB each
        </p>
        <p className="text-xs text-slate-400">
          {existingImages.length + newFiles.length} / {MAX_FILES} images
        </p>
      </div>

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-amber-600 font-medium">
          <Loader2 size={16} className="animate-spin" />
          Uploading images...
        </div>
      )}
    </div>
  );
}
