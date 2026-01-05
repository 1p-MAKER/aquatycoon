class SoundManager {
    private context: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    constructor() {
        this.init();
    }

    private init() {
        if (!this.context) {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.value = 0.5; // Master volume
        }
    }

    public playSE(type: 'click' | 'bubble') {
        if (!this.context || !this.masterGain) {
            this.init();
        }

        if (this.context?.state === 'suspended') {
            this.context.resume();
        }

        const oscillator = this.context!.createOscillator();
        const gainNode = this.context!.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain!);

        const now = this.context!.currentTime;

        if (type === 'click') {
            // Short high pitch beep
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, now);
            oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
            gainNode.gain.setValueAtTime(0.5, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.1);
        } else if (type === 'bubble') {
            // Low pitch sweep typical for bubbles
            oscillator.type = 'sine';
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
