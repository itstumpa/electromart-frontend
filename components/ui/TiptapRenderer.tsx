"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";

interface TiptapRendererProps {
  /** Tiptap JSON content to render */
  content: Record<string, unknown> | string | null | undefined;
  /** Optional className for the wrapper */
  className?: string;
}

/**
 * Read-only Tiptap JSON renderer.
 * Renders Tiptap JSON content as styled HTML using ProseMirror.
 * 
 * Note: Underline, Bold, Italic, Strike, Code etc. are included in StarterKit (Tiptap v3).
 */
export default function TiptapRenderer({
  content,
  className = "",
}: TiptapRendererProps) {
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
    ],
    content: content ?? "",
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-700 prose-p:leading-relaxed prose-ul:list-disc prose-ol:list-decimal prose-li:text-slate-700 prose-strong:text-slate-900 prose-a:text-amber-600 prose-code:text-amber-700 prose-code:bg-amber-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-img:rounded-xl",
      },
    },
  });

  // Sync content if it changes externally
  useEffect(() => {
    if (editor && content) {
      const current = editor.getJSON();
      const incoming =
        typeof content === "string" ? { type: "doc", content: [] } : content;
      if (JSON.stringify(current) !== JSON.stringify(incoming)) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className={className}>
      <EditorContent editor={editor} />
    </div>
  );
}
