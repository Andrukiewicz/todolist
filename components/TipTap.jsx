import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Toolbar from "./Toolbar"
import Heading from "@tiptap/extension-heading"

export default function TipTap({ description, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-decimal pl-4",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "text-sm",
          },
        },
      }),
      Heading.configure({
        HTMLAttributes: {
          levels: [1, 2, 3, 4],
        },
      }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class:
          "rounded-md border min-h-[10rem] max-h-[25rem] overflow-auto border-input overflow-auto bg-background px-3 py-2 my-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
    onUpdate({ editor }) {
      // const clean = sanitize(editor.getHTML());
      onChange(editor.getHTML())
    },
  })

  return (
    <div className='flex flex-col justify-stretch min-h-[10rem] max-h-fit'>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
