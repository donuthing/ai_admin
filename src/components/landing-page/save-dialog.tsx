"use client"

import { useEffect } from "react"

interface SaveDialogProps {
    open: boolean
    onClose: () => void
    // 임시 파일: editor-data 포함(업로드로 이어서 편집 가능)
    onSaveDraft: () => void
    // 최종 파일: editor-data 제거(페이북 관리자 업로드용)
    onSaveFinal: () => void
}

export function SaveDialog({ open, onClose, onSaveDraft, onSaveFinal }: SaveDialogProps) {
    useEffect(() => {
        if (!open) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [open, onClose])

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="save-dialog-title"
                className="flex w-[492px] max-w-full flex-col gap-[30px] rounded-[24px] bg-white px-[20px] pb-[20px] pt-[30px]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full px-[4px]">
                    <h2
                        id="save-dialog-title"
                        className="text-[24px] font-bold leading-[32px] text-[#22252A] [word-break:break-word]"
                    >
                        파일을 다운로드 합니다.
                    </h2>
                </div>

                <div className="w-full px-[4px]">
                    <p className="text-[17px] font-normal leading-[26px] text-[#22252A] [word-break:break-word]">
                        HTML 업로드를 통한 수정은 임시 파일만 가능합니다.
                        <br />
                        페이북 관리자는 최종 파일로 업로드해 주세요.
                    </p>
                </div>

                <div className="flex w-full gap-[8px]">
                    <button
                        type="button"
                        onClick={onSaveDraft}
                        className="flex min-w-px flex-1 items-center justify-center rounded-[12px] bg-[rgba(204,213,235,0.4)] px-[16px] py-[11px] text-[17px] font-bold leading-[26px] text-[#30558E] transition-opacity hover:opacity-90"
                    >
                        임시 파일
                    </button>
                    <button
                        type="button"
                        onClick={onSaveFinal}
                        className="flex min-w-px flex-1 items-center justify-center rounded-[12px] bg-[#1A3A6D] px-[16px] py-[11px] text-[17px] font-bold leading-[26px] text-white transition-opacity hover:opacity-90"
                    >
                        최종 파일
                    </button>
                </div>
            </div>
        </div>
    )
}
