"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Quote, 
  Code, 
  List, 
  ListOrdered, 
  Undo, 
  Redo 
} from "lucide-react";

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TipTapEditor({ value, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm font-ui focus:outline-none min-h-[160px] p-4 text-xs text-primary-navy/80 leading-relaxed font-normal"
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  // Keep content in sync with external values (e.g. form presets)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border border-border-custom bg-white rounded-input overflow-hidden focus-within:border-accent-gold/40 transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-background/50 border-b border-border-custom px-3 py-2 select-none">
        {/* Paragraph type / headings */}
        <button
          type="button"
          onClick={() => editor.commands.toggleHeading({ level: 1 })}
          className={`p-1.5 rounded-lg hover:bg-primary-navy/5 text-primary-navy/70 ${
            editor.isActive("heading", { level: 1 }) ? "bg-primary-navy/10 text-primary-navy font-semibold" : ""
          }`}
          title="Heading 1"
        >
          <Heading1 size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.commands.toggleHeading({ level: 2 })}
          className={`p-1.5 rounded-lg hover:bg-primary-navy/5 text-primary-navy/70 ${
            editor.isActive("heading", { level: 2 }) ? "bg-primary-navy/10 text-primary-navy font-semibold" : ""
          }`}
          title="Heading 2"
        >
          <Heading2 size={14} />
        </button>

        <div className="w-[1px] h-4 bg-border-custom mx-1" />

        {/* Text styling */}
        <button
          type="button"
          onClick={() => editor.commands.toggleBold()}
          className={`p-1.5 rounded-lg hover:bg-primary-navy/5 text-primary-navy/70 ${
            editor.isActive("bold") ? "bg-primary-navy/10 text-primary-navy font-semibold" : ""
          }`}
          title="Bold"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.commands.toggleItalic()}
          className={`p-1.5 rounded-lg hover:bg-primary-navy/5 text-primary-navy/70 ${
            editor.isActive("italic") ? "bg-primary-navy/10 text-primary-navy font-semibold" : ""
          }`}
          title="Italic"
        >
          <Italic size={14} />
        </button>

        <div className="w-[1px] h-4 bg-border-custom mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.commands.toggleBulletList()}
          className={`p-1.5 rounded-lg hover:bg-primary-navy/5 text-primary-navy/70 ${
            editor.isActive("bulletList") ? "bg-primary-navy/10 text-primary-navy font-semibold" : ""
          }`}
          title="Bullet List"
        >
          <List size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.commands.toggleOrderedList()}
          className={`p-1.5 rounded-lg hover:bg-primary-navy/5 text-primary-navy/70 ${
            editor.isActive("orderedList") ? "bg-primary-navy/10 text-primary-navy font-semibold" : ""
          }`}
          title="Numbered List"
        >
          <ListOrdered size={14} />
        </button>

        <div className="w-[1px] h-4 bg-border-custom mx-1" />

        {/* Quotes & code */}
        <button
          type="button"
          onClick={() => editor.commands.toggleBlockquote()}
          className={`p-1.5 rounded-lg hover:bg-primary-navy/5 text-primary-navy/70 ${
            editor.isActive("blockquote") ? "bg-primary-navy/10 text-primary-navy font-semibold" : ""
          }`}
          title="Blockquote"
        >
          <Quote size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.commands.toggleCodeBlock()}
          className={`p-1.5 rounded-lg hover:bg-primary-navy/5 text-primary-navy/70 ${
            editor.isActive("codeBlock") ? "bg-primary-navy/10 text-primary-navy font-semibold" : ""
          }`}
          title="Code Block"
        >
          <Code size={14} />
        </button>

        <div className="w-[1px] h-4 bg-border-custom mx-1 flex-grow" />

        {/* History */}
        <button
          type="button"
          onClick={() => editor.commands.undo()}
          className="p-1.5 rounded-lg hover:bg-primary-navy/5 text-primary-navy/50 hover:text-primary-navy"
          title="Undo"
        >
          <Undo size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.commands.redo()}
          className="p-1.5 rounded-lg hover:bg-primary-navy/5 text-primary-navy/50 hover:text-primary-navy"
          title="Redo"
        >
          <Redo size={14} />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
