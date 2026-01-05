import { useCallback } from 'react';
import { soundManager } from '../managers/SoundManager';

export const useSound = () => {
    const playSE = useCallback((type: 'click' | 'bubble') => {
        soundManager.playSE(type);
    }, []);

    return { playSE };
};
