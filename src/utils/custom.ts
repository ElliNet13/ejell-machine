import { Direction } from "@core/cells/direction";

/**
 * Plays the sound at the given URL. If an error occurs, the error
 * is logged to the console.
 * @param url The URL of the sound to play.
 */
export const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.volume = 0.5; // Set volume to 50%
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
  