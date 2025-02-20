import { Direction } from "@core/cells/direction";



/**
 * Plays the given audio blob.
 * @param {Blob} audio The audio blob to play.
 * @param {number} [volume=0.5] The volume to play the audio at, from 0 to 1.
 */
export const playSound = (audio: Blob, volume: number = 0.5) => {
    const audioelement = new Audio(URL.createObjectURL(audio));
    audioelement.volume = volume;
    audioelement.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  };  

/**
 * Returns a random direction.
 * @returns A random direction.
 */
export function getRandomDirection(): Direction {
    const directions = Object.values(Direction) as Direction[];
    const randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];
  }
  