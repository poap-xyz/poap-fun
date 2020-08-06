import useSound from 'use-sound';

// Assets
const startSound = require('assets/sounds/start-raffle.mp3');
const winnerSound = require('assets/sounds/winner.mp3');
const blockSound = require('assets/sounds/new-block.mp3');

export const useSounds = ({ soundEnabled = true }: { soundEnabled?: boolean } = {}) => {
  const [playBeganRaffle] = useSound(startSound, { soundEnabled });
  const [playNewWinner] = useSound(winnerSound, { soundEnabled });
  const [playBlockPassed] = useSound(blockSound, { soundEnabled });

  return { playBeganRaffle, playBlockPassed, playNewWinner };
};
