"use client";

import * as React from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import { MarkButton } from "../mark-button";

// --- Styles ---
import "./bubble-menu.scss";

interface BubbleMenuProps {
  editor: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function BubbleMenuComponent({ editor }: BubbleMenuProps) {
  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      options={{
        placement: "top",
        offset: 8,
        strategy: "absolute",
      }}
    >
      <div className="bubble-menu">
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="underline" />
        <MarkButton type="code" />
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </div>
    </BubbleMenu>
  );
}
