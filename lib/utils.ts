import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function rgbaToHex(rgba: string): string {
  const [r, g, b, a] = rgba.match(/\d+.?\d*/g) ?? [0, 0, 0, 1];
  const alpha = Math.round((a as number) * 255)
    .toString(16)
    .padStart(2, '0');
  const red = parseInt(r as string)
    .toString(16)
    .padStart(2, '0');
  const green = parseInt(g as string)
    .toString(16)
    .padStart(2, '0');
  const blue = parseInt(b as string)
    .toString(16)
    .padStart(2, '0');
  return `#${red}${green}${blue}${alpha}`;
}
