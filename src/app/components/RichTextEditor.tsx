"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link"],
    ["clean"],
  ],
};

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  className,
  placeholder,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const skipNextUpdate = useRef(false);

  const onChangeRef = useRef(onChange);
  const placeholderRef = useRef(placeholder);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    placeholderRef.current = placeholder;
  }, [placeholder]);

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    const quill = new Quill(containerRef.current, {
      theme: "snow",
      modules: modules,
      placeholder: placeholderRef.current || "İçerik yazmaya başlayın...",
    });

    quillRef.current = quill;

    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }

    quill.on("text-change", () => {
      const html = quill.root.innerHTML;
      if (html === "<p><br></p>") {
        onChangeRef.current("");
      } else {
        skipNextUpdate.current = true;
        onChangeRef.current(html);
      }
    });

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        // Quill snow theme adds toolbar as a previous sibling
        const parent = containerRef.current.parentElement;
        if (parent) {
          const toolbars = parent.querySelectorAll(".ql-toolbar");
          toolbars.forEach((tb) => tb.remove());
        }
      }
    };
  }, []); // Run only once on mount

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      if (skipNextUpdate.current) {
        skipNextUpdate.current = false;
        return;
      }
      const selection = quillRef.current.getSelection();
      quillRef.current.root.innerHTML = value || "";
      if (selection) {
        quillRef.current.setSelection(selection);
      }
    }
  }, [value]);

  return (
    <div className={`rich-text-editor ${className || ""}`}>
      <div
        ref={(el) => {
          if (el) {
            // @ts-ignore
            containerRef.current = el;
          }
        }}
        style={{ minHeight: "200px" }}
      />
    </div>
  );
}
