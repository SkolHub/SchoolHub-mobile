import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';
import { Post } from '@/api/post';
import MaterialCard from '@/components/material-card';
import { router } from 'expo-router';
import AssignmentCard from '@/components/assignment-card';
import AnnouncementCard from '@/components/announcement-card';
import TestCard from '@/components/test-card';
import React from 'react';

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

export function formatShortDate(date: string) {
  return `${new Date(date).getDate().toString().padStart(2, '0')}.${(
    new Date(date).getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}.${new Date(date).getFullYear()}`;
}

export function formatTime(date: string) {
  return `${new Date(date).getHours().toString().padStart(2, '0')}:${new Date(
    date
  )
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

export const androidRipple = {
  color: 'rgb(0, 0, 0, 0.1)',
  borderless: false,
  radius: 1000
};
