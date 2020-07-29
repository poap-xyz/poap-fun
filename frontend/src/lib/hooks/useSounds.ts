import useSound from 'use-sound';

// Assets
const casinoTone = require('assets/sounds/casino-tone.mp3');
const casinoWheels = require('assets/sounds/casino-wheels.mp3');
const casinoToneTwo = require('assets/sounds/casino-tone-2.mp3');

export const useSounds = ({ soundEnabled = true }: { soundEnabled?: boolean } = {}) => {
  const [playBeganRaffle] = useSound(casinoTone, { soundEnabled });
  const [playNewWinner] = useSound(casinoWheels, { soundEnabled });
  const [playBlockPassed] = useSound(casinoToneTwo, { soundEnabled });

  return { playBeganRaffle, playBlockPassed, playNewWinner };
};
