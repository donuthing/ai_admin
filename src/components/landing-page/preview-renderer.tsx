import { Block, LandingPageMetadata } from "./types"

interface PreviewRendererProps {
    metadata: LandingPageMetadata
    blocks: Block[]
}

export function PreviewRenderer({ metadata, blocks }: PreviewRendererProps) {
    return (
        <div className={`landing-page-container${(metadata.buttons || []).some(b => b.name) ? ' has-floating-button' : ''}`}>
            <header className="header-section">
                <div className="header-image-container">
                    {metadata.imageUrl && (
                        <img src={metadata.imageUrl} className="header-image" alt="Header illustration" />
                    )}
                </div>
            </header>
            <div className="title-section">
                <h1 className="header-title-1">{metadata.title1}</h1>
                <h1 className="header-title-2">{metadata.title2}</h1>
            </div>

            <div className="content-wrapper">
                {blocks.map((block) => {
                    const content = block.content as any;
                    switch (block.type) {
                        case 'main':
                            return (
                                <div key={block.id} className="main-block" id={block.id}>
                                    <h2>{content.title}</h2>
                                    <div className="text-content" dangerouslySetInnerHTML={{ __html: content.content }} />
                                </div>
                            )
                        case 'benefit':
                            return (
                                <div key={block.id} className="benefit-block" id={block.id}>
                                    <h2>{content.title}</h2>
                                    <div className="benefit-list">
                                        {content.items.map((item: any, index: number) => (
                                            <div key={index} className="benefit-item">
                                                <div className="benefit-header">
                                                    {item.subtitle && <div className="benefit-badge">{index + 1}</div>}
                                                    <h3>{item.subtitle}</h3>
                                                </div>
                                                <div className="text-content" dangerouslySetInnerHTML={{ __html: item.content }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        case 'image':
                            return (
                                <div key={block.id} className="image-block" id={block.id}>
                                    {content.imageUrl && <img src={content.imageUrl} alt="Block image" />}
                                    {content.caption && <div className="image-caption">{content.caption}</div>}
                                </div>
                            )
                        default:
                            return null
                    }
                })}
            </div>

            {(metadata.buttons || []).some(b => b.name) && (
                <div className="floating-button-wrapper">
                    {(metadata.buttons || [])
                        .map((b, idx) => ({ b, idx }))
                        .filter((x) => x.b.name)
                        .slice()
                        .reverse()
                        .map(({ b, idx }) => (
                            <a key={idx} className={idx >= 1 ? 'secondary' : undefined} href={b.url || '#'}>{b.name}</a>
                        ))}
                </div>
            )}
        </div>
    )
}
