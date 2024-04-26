import { Toggle } from "@/components/ui/toggle";
import { ToggleProps } from "@radix-ui/react-toggle";
import { BubbleMenu, BubbleMenuProps, FloatingMenu, FloatingMenuProps, useCurrentEditor } from "@tiptap/react";
import type StarterKit from "@tiptap/starter-kit";
import type Underline from "@tiptap/extension-underline";
import type TextAlign from "@tiptap/extension-text-align";
import type Subscript from "@tiptap/extension-subscript";
import type Superscript from "@tiptap/extension-superscript";
import type Link from "@tiptap/extension-link";
import type Highlight from "@tiptap/extension-highlight";
import type TaskList from "@tiptap/extension-task-list";
import type TaskItem from "@tiptap/extension-task-item";
import type Color from "@tiptap/extension-color";

import { Button, ButtonProps } from "@/components/ui/button";
import { ChangeEvent, HTMLProps, ReactNode, forwardRef, useState } from "react";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  CircleOffIcon,
  Code2Icon,
  CodeIcon,
  CornerDownLeftIcon,
  CornerDownRightIcon,
  ExternalLinkIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  HighlighterIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  LucideIcon,
  MinusIcon,
  PaletteIcon,
  PilcrowIcon,
  PipetteIcon,
  QuoteIcon,
  RedoIcon,
  RemoveFormattingIcon,
  SquareIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  UnderlineIcon,
  UndoIcon,
  UnlinkIcon,
} from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ToggleGroupItemProps } from "@radix-ui/react-toggle-group";
import { Optional, UniqueArray } from "@/types";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export type MenuProps<T> = {
  icon?: ReactNode;
} & T;

const Menu = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
  return <div ref={ref} {...props} className={cn(["flex flex-wrap rounded-sm gap-2 border-none", props.className])} />;
});

Menu.displayName = "Menu";

const Group = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>((props, ref) => {
  return (
    <div ref={ref} {...props} className={cn(["flex flex-wrap rounded-sm border [&>button]:border-none [&>button]:rounded-none [&>button]:border-r last:[&>button]:border-r-0", props.className])} />
  );
});

Group.displayName = "Group";

function Bold({ icon, ...props }: MenuProps<ToggleProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Toggle
      title="Bold"
      variant="outline"
      {...props}
      type="button"
      size="sm"
      onPressedChange={() => editor.chain().focus().toggleBold().run()}
      disabled={!editor.can().chain().focus().toggleBold().run()}
      pressed={editor.isActive("bold")}
    >
      {icon || <BoldIcon size={14} />}
    </Toggle>
  );
}

function Italic({ icon, ...props }: MenuProps<ToggleProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Toggle
      title="Italic"
      variant="outline"
      {...props}
      type="button"
      size="sm"
      onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      disabled={!editor.can().chain().focus().toggleItalic().run()}
      pressed={editor.isActive("italic")}
    >
      {icon || <ItalicIcon size={14} />}
    </Toggle>
  );
}

function Strike({ icon, ...props }: MenuProps<ToggleProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Toggle
      title="Strike"
      variant="outline"
      {...props}
      type="button"
      size="sm"
      onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      disabled={!editor.can().chain().focus().toggleStrike().run()}
      pressed={editor.isActive("strike")}
    >
      {icon || <StrikethroughIcon size={14} />}
    </Toggle>
  );
}

function UnderlineComp({ icon, ...props }: MenuProps<ToggleProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Toggle
      title="Underline"
      variant="outline"
      {...props}
      type="button"
      size="sm"
      onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      disabled={!editor.can().chain().focus().toggleUnderline().run()}
      pressed={editor.isActive("underline")}
    >
      {icon || <UnderlineIcon size={14} />}
    </Toggle>
  );
}

function ClearFormat({ icon, ...props }: MenuProps<ButtonProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Button
      variant="outline"
      title="Clear Format"
      {...props}
      type="button"
      size="sm"
      onClick={() => editor.chain().focus().unsetAllMarks().run()}
      disabled={!editor.can().chain().focus().unsetAllMarks().run()}
    >
      {icon || <RemoveFormattingIcon size={14} />}
    </Button>
  );
}

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const HeadingIconMap = {
  1: Heading1Icon,
  2: Heading2Icon,
  3: Heading3Icon,
  4: Heading4Icon,
  5: Heading5Icon,
  6: Heading6Icon,
} satisfies Record<HeadingLevel, LucideIcon>;

function Heading({ level = 1, icon, ...props }: MenuProps<ToggleProps> & { level: HeadingLevel }) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  const Icon = HeadingIconMap[level];

  return (
    <Toggle
      title={`Heading ${level}`}
      size="sm"
      type="button"
      {...props}
      onPressedChange={() => editor.chain().focus().toggleHeading({ level }).run()}
      pressed={editor.isActive("heading", { level })}
      disabled={!editor.can().chain().focus().toggleHeading({ level }).run()}
    >
      {icon || <Icon size={14} />}
    </Toggle>
  );
}

type HeadingItemProps = MenuProps<ToggleGroupItemProps>;

function HeadingItem({ level = 1, icon, ...props }: HeadingItemProps & { level: HeadingLevel }) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  const Icon = HeadingIconMap[level];

  return (
    <ToggleGroupItem title={`Heading ${level}`} size="sm" type="button" {...props} disabled={!editor.can().chain().focus().toggleHeading({ level }).run()}>
      {icon || <Icon size={14} />}
    </ToggleGroupItem>
  );
}

type HeadingProps = {
  levels?: UniqueArray<HeadingLevel>[];
  h1?: HeadingItemProps;
  h2?: HeadingItemProps;
  h3?: HeadingItemProps;
  h4?: HeadingItemProps;
  h5?: HeadingItemProps;
  h6?: HeadingItemProps;
};

function HeadingGroup({ levels = [1, 2, 3, 4, 5, 6], h1, h2, h3, h4, h5, h6 }: HeadingProps) {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  const propsMap = {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
  } satisfies Record<string, MenuProps<ToggleGroupItemProps> | undefined>;

  const value = levels.find((item) => editor.isActive("heading", { level: item }));

  return (
    <ToggleGroup
      type="single"
      value={`${value || ""}`}
      onValueChange={(value) => {
        editor
          .chain()
          .focus()
          .toggleHeading({ level: +value as any })
          .run();
      }}
    >
      {levels?.map((item) => <HeadingItem key={item} {...(propsMap[`h${item}`] || {})} value={`${item}` as string} level={item} />)}
    </ToggleGroup>
  );
}

function Paragraph({ icon, ...props }: MenuProps<ToggleProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Toggle title="Paragraph" variant="outline" {...props} type="button" size="sm" onPressedChange={() => editor.chain().focus().setParagraph().run()} pressed={editor.isActive("paragraph")}>
      {icon || <PilcrowIcon size={14} />}
    </Toggle>
  );
}

function BulletList({ icon, ...props }: MenuProps<ToggleProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Toggle
      title="Bullet List"
      variant="outline"
      {...props}
      type="button"
      size="sm"
      onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      disabled={!editor.can().chain().focus().toggleBulletList().run()}
      pressed={editor.isActive("bulletList")}
    >
      {icon || <ListIcon size={14} />}
    </Toggle>
  );
}

function OrderedList({ icon, ...props }: MenuProps<ToggleProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Toggle
      title="Ordered List"
      variant="outline"
      {...props}
      type="button"
      size="sm"
      onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      disabled={!editor.can().chain().focus().toggleOrderedList().run()}
      pressed={editor.isActive("orderedList")}
    >
      {icon || <ListOrderedIcon size={14} />}
    </Toggle>
  );
}

function CodeBlock({ icon, ...props }: MenuProps<ToggleProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Toggle
      title="Code Block"
      variant="outline"
      {...props}
      type="button"
      size="sm"
      onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
      disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
      pressed={editor.isActive("codeBlock")}
    >
      {icon || <Code2Icon size={14} />}
    </Toggle>
  );
}

function Code({ icon, ...props }: MenuProps<ToggleProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Toggle
      title="Code"
      variant="outline"
      {...props}
      type="button"
      size="sm"
      onPressedChange={() => editor.chain().focus().toggleCode().run()}
      disabled={!editor.can().chain().focus().toggleCode().run()}
      pressed={editor.isActive("code")}
    >
      {icon || <CodeIcon size={14} />}
    </Toggle>
  );
}

function Blockquote({ icon, ...props }: MenuProps<ToggleProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Toggle
      title="Blockquote"
      variant="outline"
      {...props}
      type="button"
      size="sm"
      onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      disabled={!editor.can().chain().focus().toggleBlockquote().run()}
      pressed={editor.isActive("blockquote")}
    >
      {icon || <QuoteIcon size={14} />}
    </Toggle>
  );
}

function HorizontalRule({ icon, ...props }: MenuProps<ButtonProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Button
      variant="outline"
      title="Horizontal Rule"
      {...props}
      type="button"
      size="sm"
      onClick={() => editor.chain().focus().setHorizontalRule().run()}
      disabled={!editor.can().chain().focus().setHorizontalRule().run()}
    >
      {icon || <MinusIcon size={14} />}
    </Button>
  );
}

function Undo({ icon, ...props }: MenuProps<ButtonProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Button variant="outline" title="Undo" {...props} type="button" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}>
      {icon || <UndoIcon size={14} />}
    </Button>
  );
}

function Redo({ icon, ...props }: MenuProps<ButtonProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Button variant="outline" title="Redo" {...props} type="button" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}>
      {icon || <RedoIcon size={14} />}
    </Button>
  );
}

type AlignType = "left" | "center" | "right" | "justify";

const AlignIconMap = {
  left: AlignLeftIcon,
  center: AlignCenterIcon,
  right: AlignRightIcon,
  justify: AlignJustifyIcon,
} satisfies Record<AlignType, LucideIcon>;

function Align({ alignType, icon, ...props }: MenuProps<Omit<ToggleGroupItemProps, "value">> & { alignType: AlignType }) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  const Icon = AlignIconMap[alignType];
  return (
    <ToggleGroupItem title={`Align ${alignType}`} {...props} value={alignType} type="button" size="sm" disabled={!editor.can().chain().focus().setTextAlign(alignType).run()}>
      {icon || <Icon size={14} />}
    </ToggleGroupItem>
  );
}

type AlignProps = {
  align?: UniqueArray<AlignType>[];
  left?: MenuProps<ButtonProps>;
  center?: MenuProps<ButtonProps>;
  right?: MenuProps<ButtonProps>;
  justify?: MenuProps<ButtonProps>;
};

function AlignGroup({ align = ["left", "center", "right", "justify"], left, right, center, justify }: AlignProps) {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  const propsMap = {
    left,
    right,
    center,
    justify,
  } satisfies Record<AlignType, MenuProps<ButtonProps> | undefined>;

  const value = align.find((item) =>
    editor.isActive({
      textAlign: item,
    }),
  );

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(value) => {
        editor.chain().focus().setTextAlign(value).run();
      }}
    >
      {align?.map((item) => <Align key={item} {...(propsMap[item] || {})} alignType={item} />)}
    </ToggleGroup>
  );
}

function SubscriptComp({ icon, ...props }: MenuProps<ToggleProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Toggle
      title="Subscript"
      variant="outline"
      {...props}
      type="button"
      size="sm"
      onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
      disabled={!editor.can().chain().focus().toggleSubscript().run()}
      pressed={editor.isActive("subscript")}
    >
      {icon || <SubscriptIcon size={14} />}
    </Toggle>
  );
}

function SuperscriptComp({ icon, ...props }: MenuProps<ToggleProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Toggle
      title="Superscript"
      variant="outline"
      {...props}
      type="button"
      size="sm"
      onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
      disabled={!editor.can().chain().focus().toggleSuperscript().run()}
      pressed={editor.isActive("superscript")}
    >
      {icon || <SuperscriptIcon size={14} />}
    </Toggle>
  );
}

const initialExternal = false;

function LinkComp({ icon, ...props }: MenuProps<ToggleProps>) {
  const { editor } = useCurrentEditor();

  const [url, setUrl] = useState<string>("");
  const [external, setExternal] = useState<boolean>(initialExternal);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
    const linkData = editor?.getAttributes("link");
    setUrl(linkData?.href || "");
    setExternal(linkData?.href ? linkData?.target === "_blank" : initialExternal);
  };

  const handleClose = () => {
    setOpen(false);
    setUrl("");
    setExternal(initialExternal);
  };

  const setLink = () => {
    handleClose();
    url === ""
      ? editor?.chain().focus().extendMarkRange("link").unsetLink().run()
      : editor
          ?.chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url, target: external ? "_blank" : null })
          .run();
  };

  const handleInputKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setLink();
    }
  };

  const onChangeUrl = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  if (!editor) return null;

  return (
    <Popover open={open} onOpenChange={(value) => (value ? handleOpen() : handleClose())}>
      <PopoverTrigger>
        <Toggle variant="outline" title="Unlink" {...props} className={cn(["border-none", props.className])} type="button" size="sm" pressed={editor.isActive("link")}>
          {icon || <LinkIcon size={14} />}
        </Toggle>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid grid-cols-[1fr_72px] gap-2">
          <div className="relative">
            <Input type="url" value={url} onKeyDown={handleInputKeydown} onChange={onChangeUrl} className="pe-13" />
            <Toggle title="External" className="absolute p-2 right-2 h-7 w-7 top-1/2 -translate-y-1/2 cursor-pointer" pressed={external} onPressedChange={() => setExternal((prev) => !prev)}>
              <ExternalLinkIcon size={14} />
            </Toggle>
          </div>
          <Button title="Save" variant="secondary" onClick={setLink}>
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Unlink({ icon, ...props }: MenuProps<ButtonProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Button variant="outline" title="Unlink" {...props} type="button" size="sm" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.can().chain().focus().unsetLink().run()}>
      {icon || <UnlinkIcon size={14} />}
    </Button>
  );
}

function ColorComp({ icon, ...props }: MenuProps<ButtonProps>) {
  const { editor } = useCurrentEditor();

  const [color, setColor] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const currentColor = editor?.getAttributes("textStyle").color;

  const handleOpen = () => {
    setOpen(true);
    const currentColor = editor?.getAttributes("textStyle").color;
    setColor(currentColor?.href || "#000");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changeColor = (value?: string) => {
    handleClose();
    editor
      ?.chain()
      .focus()
      .setColor(value || color)
      .run();
  };

  const onChangeColor = (event: ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  if (!editor) return null;

  return (
    <Popover open={open} onOpenChange={(value) => (value ? handleOpen() : handleClose())}>
      <PopoverTrigger asChild>
        {color ? (
          <Button variant="outline" className="p-0" size="sm">
            <SquareIcon fill={currentColor} size={24} color="white" />
          </Button>
        ) : (
          <Button variant="outline" title="Change color" {...props} type="button" size="sm">
            {icon || <PaletteIcon size={14} />}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid grid-cols-[1fr_72px] gap-2">
          <div className="grid grid-cols-[1fr_36px] gap-2">
            <div className="grid grid-cols-4">
              {["#000", "#ffff00", "#ccc", "#ff0000"].map((item) => (
                <Button variant="outline" className="p-0" size="sm" key={item} onClick={() => changeColor(item)}>
                  <SquareIcon fill={item} size={24} color="white" />
                </Button>
              ))}
            </div>
            <Button asChild variant="outline" className="p-0 h-9 w-9">
              <label htmlFor="color-picker">
                <PipetteIcon size={14} />
                <Input id="color-picker" className="hidden" type="color" value={color} onChange={onChangeColor} />
              </label>
            </Button>
          </div>
          <Button title="Save" variant="secondary" onClick={() => changeColor()}>
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function UnsetColor({ icon, ...props }: MenuProps<ButtonProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Button variant="outline" title="UnsetColor" {...props} type="button" size="sm" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.can().chain().focus().unsetLink().run()}>
      {icon || <CircleOffIcon size={14} />}
    </Button>
  );
}

function HighLightComp({ icon, ...props }: MenuProps<ToggleProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Toggle
      title="Highlight"
      variant="outline"
      {...props}
      type="button"
      size="sm"
      onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
      disabled={!editor.can().chain().focus().toggleHighlight().run()}
      pressed={editor.isActive("highlight")}
    >
      {icon || <HighlighterIcon size={14} />}
    </Toggle>
  );
}

function TaskListComp({ icon, ...props }: MenuProps<ToggleProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Toggle
      title="TaskList"
      variant="outline"
      {...props}
      type="button"
      size="sm"
      onPressedChange={() => editor.chain().focus().toggleTaskList().run()}
      disabled={!editor.can().chain().focus().toggleTaskList().run()}
      pressed={editor.isActive("taskList")}
    >
      {icon || <ListTodoIcon size={14} />}
    </Toggle>
  );
}

function TaskListSinkComp({ icon, ...props }: MenuProps<ButtonProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Button
      variant="outline"
      title="Increase Task Level"
      {...props}
      type="button"
      size="sm"
      onClick={() => editor.chain().focus().liftListItem("taskItem").run()}
      disabled={!editor.can().chain().focus().liftListItem("taskItem").run()}
    >
      {icon || <CornerDownLeftIcon size={14} />}
    </Button>
  );
}

function TaskListLiftComp({ icon, ...props }: MenuProps<ButtonProps>) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <Button
      variant="outline"
      title="Decrease Task Level"
      {...props}
      type="button"
      size="sm"
      onClick={() => editor.chain().focus().sinkListItem("taskItem").run()}
      disabled={!editor.can().chain().focus().sinkListItem("taskItem").run()}
    >
      {icon || <CornerDownRightIcon size={14} />}
    </Button>
  );
}

function BubbleMenuComp({ children, ...props }: Optional<BubbleMenuProps, "children">) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <BubbleMenu tippyOptions={{ duration: 100 }} {...props} editor={editor}>
      <Group className="bg-white z-50">
        <Bold />
        <Italic />
        <Strike />
        <UnderlineComp />
        {children}
      </Group>
    </BubbleMenu>
  );
}

function FloatingMenuComp({ children, ...props }: Optional<FloatingMenuProps, "children">) {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <FloatingMenu tippyOptions={{ duration: 100 }} {...props} editor={editor}>
      <Group className="bg-white z-50">
        <Heading level={1} />
        <Heading level={2} />
        <LinkComp />
        <TaskListComp />
        {children}
      </Group>
    </FloatingMenu>
  );
}

export const EditorMenu = {
  Root: Menu,
  Underline: UnderlineComp,
  Subscript: SubscriptComp,
  Superscript: SuperscriptComp,
  Link: LinkComp,
  Color: ColorComp,
  HighLight: HighLightComp,
  TaskList: TaskListComp,
  TaskListSink: TaskListSinkComp,
  TaskListLift: TaskListLiftComp,
  BubbleMenu: BubbleMenuComp,
  FloatingMenu: FloatingMenuComp,
  Group,
  Bold,
  Italic,
  Strike,
  ClearFormat,
  HeadingGroup,
  Heading,
  Paragraph,
  BulletList,
  OrderedList,
  Code,
  CodeBlock,
  Blockquote,
  HorizontalRule,
  Undo,
  Redo,
  AlignGroup,
  Unlink,
  UnsetColor,
};
