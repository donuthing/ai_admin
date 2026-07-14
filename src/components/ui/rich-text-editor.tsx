"use client"

import { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import { getMarkRange } from '@tiptap/core'
import { TextSelection } from '@tiptap/pm/state'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import { Bold, Highlighter, Link as LinkIcon } from 'lucide-react'
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LandingLink, LandingLinkType } from "@/components/ui/landing-link"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

interface LinkDraft {
    landingType: LandingLinkType
    url: string
    params: string
}

const EMPTY_DRAFT: LinkDraft = { landingType: 'url', url: '', params: '' }

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const [isLinkFormOpen, setIsLinkFormOpen] = useState(false)
    const [linkDraft, setLinkDraft] = useState<LinkDraft>(EMPTY_DRAFT)
    // 링크 폼을 연 시점의 선택 영역. 선택이 이 범위를 벗어나면 폼을 닫고 입력값을 버린다.
    const linkRangeRef = useRef<{ from: number; to: number } | null>(null)

    const closeLinkForm = () => {
        setIsLinkFormOpen(false)
        setLinkDraft(EMPTY_DRAFT)
        linkRangeRef.current = null
    }

    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
            LandingLink,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'min-h-[100px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            },
            // 링크된 텍스트를 클릭하면 링크 전체를 선택해 버블 메뉴와 링크 입력 폼을 띄운다.
            handleClick: (view, pos) => {
                const markType = view.state.schema.marks.landingLink
                if (!markType) return false

                const resolved = view.state.doc.resolve(pos)
                const range = getMarkRange(resolved, markType)
                if (!range) return false

                const mark = resolved.marks().find((m) => m.type === markType)
                setLinkDraft({
                    landingType: (mark?.attrs.landingType as LandingLinkType) || 'url',
                    url: mark?.attrs.url || '',
                    params: mark?.attrs.params || '',
                })
                linkRangeRef.current = { from: range.from, to: range.to }
                setIsLinkFormOpen(true)

                view.dispatch(
                    view.state.tr.setSelection(TextSelection.create(view.state.doc, range.from, range.to))
                )
                view.focus()
                return true
            },
        },
    })

    // 선택 영역이 폼을 연 범위를 벗어나면 입력 중이던 값을 저장하지 않고 폼을 닫는다.
    useEffect(() => {
        if (!editor) return

        const handleSelectionUpdate = () => {
            const range = linkRangeRef.current
            if (!range) return

            const { from, to } = editor.state.selection
            if (range.from !== from || range.to !== to) {
                closeLinkForm()
            }
        }

        editor.on('selectionUpdate', handleSelectionUpdate)
        return () => {
            editor.off('selectionUpdate', handleSelectionUpdate)
        }
    }, [editor])

    // 폼이 열고 닫히며 메뉴 높이가 바뀌지만 tippy(popper)는 그 사실을 모른다.
    // placement가 'top'이라 메뉴가 위로 자라며 잘리므로, 렌더 후 resize를 알려 위치를 다시 계산하게 한다.
    useEffect(() => {
        const raf = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
        return () => cancelAnimationFrame(raf)
    }, [isLinkFormOpen, linkDraft.landingType])

    if (!editor) {
        return null
    }

    const isLinkActive = editor.isActive('landingLink')

    // 링크 아이콘 토글: 열 때는 현재 선택 영역의 링크 정보를 불러와 채우고,
    // 닫을 때는 적용하지 않은 입력값을 버린다.
    const toggleLinkForm = () => {
        if (isLinkFormOpen) {
            closeLinkForm()
            return
        }
        const attrs = editor.getAttributes('landingLink')
        setLinkDraft({
            landingType: (attrs.landingType as LandingLinkType) || 'url',
            url: attrs.url || '',
            params: attrs.params || '',
        })
        const { from, to } = editor.state.selection
        linkRangeRef.current = { from, to }
        setIsLinkFormOpen(true)
    }

    const applyLink = () => {
        const url = linkDraft.url.trim()
        if (!url) return
        editor
            .chain()
            .focus()
            .setLandingLink({
                landingType: linkDraft.landingType,
                url,
                params: linkDraft.landingType === 'screenId' ? linkDraft.params.trim() : '',
            })
            .run()
        closeLinkForm()
    }

    const removeLink = () => {
        editor.chain().focus().unsetLandingLink().run()
        closeLinkForm()
    }

    return (
        <div className="relative">
            {editor && (
                <BubbleMenu
                    className="flex flex-col gap-1 rounded-md border bg-popover p-1 shadow-md"
                    tippyOptions={{ duration: 100 }}
                    editor={editor}
                >
                    <div className="flex gap-1">
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
                        <Toggle
                            size="sm"
                            pressed={isLinkActive || isLinkFormOpen}
                            onPressedChange={toggleLinkForm}
                            aria-label="Toggle link"
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Toggle>
                    </div>

                    {isLinkFormOpen && (
                        <div className="flex w-[260px] flex-col gap-2 border-t p-2 pt-2">
                            <div className="flex gap-2">
                                <select
                                    value={linkDraft.landingType}
                                    onChange={(e) =>
                                        setLinkDraft({
                                            landingType: e.target.value as LandingLinkType,
                                            url: '',
                                            params: '',
                                        })
                                    }
                                    className="flex h-9 w-[90px] shrink-0 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="screenId">화면ID</option>
                                    <option value="url">URL</option>
                                </select>
                                <Input
                                    value={linkDraft.url}
                                    onChange={(e) => setLinkDraft({ ...linkDraft, url: e.target.value })}
                                    placeholder={
                                        linkDraft.landingType === 'screenId'
                                            ? '화면 ID를 입력하세요'
                                            : 'https://example.com'
                                    }
                                    className="h-9 min-w-0 flex-1"
                                    onKeyDown={(e) => {
                                        if (e.nativeEvent.isComposing) return
                                        if (e.key === 'Enter') applyLink()
                                    }}
                                />
                            </div>
                            {linkDraft.landingType === 'screenId' && (
                                <Input
                                    value={linkDraft.params}
                                    onChange={(e) => setLinkDraft({ ...linkDraft, params: e.target.value })}
                                    placeholder="파라미터 (문자열)"
                                    className="h-9 w-full"
                                    onKeyDown={(e) => {
                                        if (e.nativeEvent.isComposing) return
                                        if (e.key === 'Enter') applyLink()
                                    }}
                                />
                            )}
                            <div className="flex justify-end gap-2">
                                {isLinkActive && (
                                    <Button variant="ghost" size="sm" className="h-8" onClick={removeLink}>
                                        링크 해제
                                    </Button>
                                )}
                                <Button size="sm" className="h-8" onClick={applyLink} disabled={!linkDraft.url.trim()}>
                                    적용
                                </Button>
                            </div>
                        </div>
                    )}
                </BubbleMenu>
            )}
            <EditorContent editor={editor} />
        </div>
    )
}
