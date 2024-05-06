import { EditorMenu } from "@/components/editor/builder";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle, { TextStyleOptions } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorProvider, EditorProviderProps } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMemo, useState } from "react";

type TBaseEditorProps = Omit<EditorProviderProps, "children">;

function BaseEditor(props: TBaseEditorProps) {
  const [content, setContent] = useState<string>("");

  const extensions = useMemo(() => {
    return [
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Subscript,
      Superscript,
      Link,
      Highlight,
      ListItem,
      TaskList,
      Color,
      TaskItem.configure({
        nested: true,
      }),
      TextStyle.configure({ types: [ListItem.name] } as Partial<TextStyleOptions>),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ];
  }, []);
  return (
    <EditorProvider
      slotBefore={
        <EditorMenu.Root>
          <EditorMenu.Group>
            <EditorMenu.Bold />
            <EditorMenu.Italic />
            <EditorMenu.Strike />
            <EditorMenu.Underline />
            <EditorMenu.HighLight />
            <EditorMenu.ClearFormat />
          </EditorMenu.Group>

          <EditorMenu.Group>
            <EditorMenu.HeadingGroup />
            <EditorMenu.Paragraph />
          </EditorMenu.Group>

          <EditorMenu.Group>
            <EditorMenu.Code />
            <EditorMenu.CodeBlock />
            <EditorMenu.BulletList />
            <EditorMenu.OrderedList />
          </EditorMenu.Group>

          <EditorMenu.Group>
            <EditorMenu.Blockquote />
            <EditorMenu.HorizontalRule />
          </EditorMenu.Group>

          <EditorMenu.Group>
            <EditorMenu.AlignGroup />
          </EditorMenu.Group>

          <EditorMenu.Group>
            <EditorMenu.Subscript />
            <EditorMenu.Superscript />
          </EditorMenu.Group>

          <EditorMenu.Group>
            <EditorMenu.Link />
            <EditorMenu.Unlink />
            <EditorMenu.Color />
            <EditorMenu.UnsetColor />
          </EditorMenu.Group>

          <EditorMenu.Group>
            <EditorMenu.TaskList />
            <EditorMenu.TaskListSink />
            <EditorMenu.TaskListLift />
          </EditorMenu.Group>

          <EditorMenu.Group>
            <EditorMenu.Undo />
            <EditorMenu.Redo />
          </EditorMenu.Group>
        </EditorMenu.Root>
      }
      {...props}
      extensions={extensions}
      content={content}
      onUpdate={({ editor }) => {
        if (!editor) return;
        const value = editor.isEmpty ? "" : editor.getHTML();
        setContent(value);
      }}
    >
      <EditorMenu.BubbleMenu />
      <EditorMenu.FloatingMenu />
    </EditorProvider>
  );
}

export default BaseEditor;
