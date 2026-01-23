"use client"

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import { Bold, Highlighter } from 'lucide-react'
import { Toggle } from "@/components/ui/toggle"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            },
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div className="relative">
            {editor && (
                <BubbleMenu className="flex gap-1 rounded-md border bg-popover p-1 shadow-md" tippyOptions={{ duration: 100 }} editor={editor}>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('bold')}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        aria-label="Toggle bold"
                    >
                        <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor.isActive('highlight')}
                        onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
                        aria-label="Toggle highlight"
                    >
                        <Highlighter className="h-4 w-4" />
                    </Toggle>
                </BubbleMenu>
            )}
            <EditorContent editor={editor} />
        </div>
    )
}
