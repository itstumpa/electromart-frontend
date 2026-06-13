"use client";

import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Redo,
  Undo,
  Underline as UnderlineIcon,
} from "lucide-react";

/* ─── Toolbar button ─────────────────────────────────────── */
function ToolBtn({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-lg transition-colors ${
        active
          ? "bg-amber-100 text-amber-700 shadow-sm"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

/* ─── Separator ──────────────────────────────────────────── */
function Sep() {
  return <div className="w-px h-5 bg-slate-200 shrink-0" />;
}

/* ─── Toolbar ────────────────────────────────────────────── */
function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-slate-200 bg-slate-50 rounded-t-xl sticky top-0 z-10">
      {/* Undo / Redo */}
      <ToolBtn
        onClick={() => editor.chain().focus().undo().run()}
        title="Undo"
      >
        <Undo size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().redo().run()}
        title="Redo"
      >
        <Redo size={16} />
      </ToolBtn>

      <Sep />

      {/* Headings */}
      <ToolBtn
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        active={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        <Heading1 size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <Heading2 size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <Heading3 size={16} />
      </ToolBtn>

      <Sep />

      {/* Inline formatting */}
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <Bold size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <Italic size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        title="Underline"
      >
        <UnderlineIcon size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        active={editor.isActive("highlight")}
        title="Highlight"
      >
        <Highlighter size={16} />
      </ToolBtn>

      <Sep />

      {/* Lists */}
      <ToolBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Ordered List"
      >
        <ListOrdered size={16} />
      </ToolBtn>

      <Sep />

      {/* Alignment */}
      <ToolBtn
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
        title="Align Left"
      >
        <AlignLeft size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
        title="Align Center"
      >
        <AlignCenter size={16} />
      </ToolBtn>
      <ToolBtn
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
        title="Align Right"
      >
        <AlignRight size={16} />
      </ToolBtn>
    </div>
  );
}

/* ─── Editor props ────────────────────────────────────────── */
export interface RichTextEditorProps {
  /** Initial JSON content (from Tiptap getJSON()) */
  content?: Record<string, unknown> | null;
  /** Called whenever content changes — receives the full JSON doc */
  onChange?: (json: Record<string, unknown>) => void;
  /** Placeholder text shown when empty */
  placeholder?: string;
  /** Minimum editor height */
  minHeight?: number;
  /** Optional className for the wrapper */
  className?: string;
}

/* ─── RichTextEditor ──────────────────────────────────────── */
export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start typing…",
  minHeight = 200,
  className = "",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content ?? "",
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none focus:outline-none px-4 py-3 text-sm leading-relaxed",
        style: `min-height: ${minHeight}px`,
      },
    },
    onUpdate: ({ editor: ed }) => {
      const json = ed.getJSON();
      onChange?.(json as Record<string, unknown>);
    },
  });

  if (!editor) return null;

  return (
    <div
      className={`border border-slate-200 rounded-xl bg-white overflow-hidden focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-transparent transition ${className}`}
    >
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
