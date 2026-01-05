import { useUIStore } from '../../store/uiStore';

export const SettingsModal = () => {
    const isOpen = useUIStore((state) => state.isSettingsOpen);
    const closeSettings = useUIStore((state) => state.toggleSettings);

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100, // Higher than other UIs
        }}>
            <div style={{
                background: 'rgba(25, 25, 40, 0.95)',
                padding: '24px',
                borderRadius: '16px',
                boxShadow: '0 0 20px rgba(0, 200, 255, 0.3)',
                minWidth: '300px',
                maxWidth: '90%',
                color: 'white',
                border: '1px solid rgba(0, 200, 255, 0.2)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <h2 style={{ margin: 0, color: '#00ffff' }}>Settings</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); alert('リンク先（Notionなど）を設定してください'); }}
                        style={linkStyle}
                    >
                        📘 説明書
                    </a>

                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); alert('リンク先（Notionなど）を設定してください'); }}
                        style={linkStyle}
                    >
                        ⚖️ プライバシーポリシー / 利用規約 / お問い合わせ
                    </a>

                    <a
                        href="https://scented-zinc-a47.notion.site/2d2768aba03f8041bb12dc5e71a7ceb8"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={linkStyle}
                    >
                        📱 その他のアプリ
                    </a>
                </div>

                <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                    <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#aaa' }}>Version 1.0.0</p>
                    <p style={{ margin: '4px 0', fontSize: '0.9rem', color: '#aaa' }}>Developer: DevCat 🐱</p>
                </div>

                <button onClick={closeSettings} style={{
                    background: '#646cff',
                    color: 'white',
                    border: 'none',
                    padding: '8px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    marginTop: '10px'
                }}>
                    Close
                </button>
            </div>
        </div>
    );
};

const linkStyle: React.CSSProperties = {
    display: 'block',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background 0.2s',
};
