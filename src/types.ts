/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Memory {
  id: number;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
}

export interface CoinReason {
  id: number;
  quality: string;
  description: string;
  isCollected: boolean;
}

export interface InsideJoke {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  imageUrl: string;
}

export interface Boss {
  id: string;
  name: string;
  description: string;
  hp: number;
  maxHp: number;
  icon: string;
  defeatMsg: string;
}

export interface GameConfig {
  nonoAge: number;
  welcomeMsg: string;
  storyIntroLines: string[];
  world1FirstEncounter: {
    title: string;
    description: string;
    imageUrl: string;
    date: string;
  };
  memories: Memory[];
  coins: CoinReason[];
  insideJokes: InsideJoke[];
  finalCastleMsg: {
    heading: string;
    para1: string;
    para2: string;
    para3: string;
    signOff: string;
  };
}
