import { Direction } from "@core/cells/direction";


/**
 * Play a sound effect.
 * @param {string} url The URL of the sound file.
 * @param {number} [volume] The volume of the sound effect. Defaults to 0.5.
 */
export const playSound = (url: string, volume?: number) => {
    const audio = new Audio(url);
    if (volume !== undefined) {
        audio.volume = 0.5; // Set volume to 50%
      } else {
        audio.volume = volume; // Set volume to the arg
    }
    audio.play().catch((error) => {
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
  