import { Howl } from 'howler';

// Define expected asset paths
const ASSETS = {
    bgm_day: '/assets/audio/bgm_day.mp3',
    bgm_night: '/assets/audio/bgm_night.mp3',
    se_bubble: '/assets/audio/se_bubble.mp3',
    se_click: '/assets/audio/se_click.mp3',
};

class SoundManager {
    private bgm: Record<string, Howl> = {};
    private se: Record<string, Howl> = {};
    private currentBgm: Howl | null = null;
    private context: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    constructor() {
        // Initialize synthetic audio as fallback
        this.initSynthetic();
    }

    private initSynthetic() {
        try {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.value = 0.5;
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }
    }

    // Try to load file assets
    public loadAssets() {
        // We use Howler for easier management of files
        // Note: In a real app, you might want to preload these or lazy load
        this.bgm['day'] = new Howl({ src: [ASSETS.bgm_day], loop: true, volume: 0.5 });
        this.bgm['night'] = new Howl({ src: [ASSETS.bgm_night], loop: true, volume: 0.5 });

        this.se['bubble'] = new Howl({ src: [ASSETS.se_bubble], volume: 0.8 });
        this.se['click'] = new Howl({ src: [ASSETS.se_click], volume: 0.8 });

        console.log('Audio assets initialized (waiting for files to exist)');
    }

    public playBGM(mode: 'day' | 'night') {
        const nextBgm = this.bgm[mode];

        if (this.currentBgm === nextBgm) return;

        // Fade out current
        if (this.currentBgm) {
            this.currentBgm.fade(0.5, 0, 1000);
            setTimeout(() => {
                this.currentBgm?.stop();
            }, 1000);
        }

        // Play next
        if (nextBgm) {
            // Check if loaded (Howler handles this, but we can prevent error logs if files miss)
            nextBgm.stop();
            nextBgm.volume(0);
            nextBgm.play();
            nextBgm.fade(0, 0.5, 1000);
            this.currentBgm = nextBgm;
        }
    }

    public playSE(type: 'click' | 'bubble') {
        // 1. Try file asset first
        if (this.se[type] && this.se[type].state() === 'loaded') {
            this.se[type].play();
            return;
        }

        // 2. Fallback to synthetic sound
        this.playSyntheticSE(type);
    }

    private playSyntheticSE(type: 'click' | 'bubble') {
        if (!this.context || !this.masterGain) return;
        if (this.context.state === 'suspended') this.context.resume();

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        const now = this.context.currentTime;

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        if (type === 'click') {
            oscillator.frequency.setValueAtTime(800, now);
            oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
            gainNode.gain.setValueAtTime(0.5, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
        } else if (type === 'bubble') {
            oscillator.frequency.setValueAtTime(200, now);
            oscillator.frequency.linearRampToValueAtTime(400, now + 0.15);
            gainNode.gain.setValueAtTime(0.5, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            oscillator.start(now);
            oscillator.stop(now + 0.2);
        }
    }
}

export const soundManager = new SoundManager();
// Start loading immediately
soundManager.loadAssets();
