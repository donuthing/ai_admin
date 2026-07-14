import { Mark, mergeAttributes } from '@tiptap/core'

export type LandingLinkType = 'screenId' | 'url'

export interface LandingLinkAttributes {
    landingType: LandingLinkType
    url: string
    params?: string
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        landingLink: {
            setLandingLink: (attributes: LandingLinkAttributes) => ReturnType
            unsetLandingLink: () => ReturnType
        }
    }
}

/**
 * 본문 텍스트 링크 마크.
 * 플로팅 버튼(LandingButton)과 동일한 랜딩 모델(화면ID/URL + 파라미터)을 data-* 속성에 담아 두고,
 * 실제 com.goNext 호출 코드는 HTML 생성 시점(html-generator)에 붙인다.
 */
export const LandingLink = Mark.create({
    name: 'landingLink',
    priority: 1000,
    inclusive: false,
    excludes: '_',

    addAttributes() {
        return {
            landingType: {
                default: 'url' as LandingLinkType,
                parseHTML: (element) => element.getAttribute('data-landing-type') || 'url',
                renderHTML: (attributes) => ({ 'data-landing-type': attributes.landingType }),
            },
            url: {
                default: '',
                parseHTML: (element) => element.getAttribute('data-url') || '',
                renderHTML: (attributes) => ({ 'data-url': attributes.url }),
            },
            params: {
                default: '',
                parseHTML: (element) => element.getAttribute('data-params') || '',
                renderHTML: (attributes) => ({ 'data-params': attributes.params || '' }),
            },
        }
    },

    parseHTML() {
        return [{ tag: 'a[data-landing-type]' }]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'a',
            mergeAttributes({ href: 'javascript:void(0)', class: 'text-link' }, HTMLAttributes),
            0,
        ]
    },

    addCommands() {
        return {
            setLandingLink:
                (attributes) =>
                    ({ chain }) =>
                        chain().setMark(this.name, attributes).run(),
            unsetLandingLink:
                () =>
                    ({ chain }) =>
                        chain().unsetMark(this.name, { extendEmptyMarkRange: true }).run(),
        }
    },
})
