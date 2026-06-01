/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// Renders an 8-bit stylized SVG representation of Nono (wearing sunglasses or a hoodie)
export function NonoSprite({ className = 'w-16 h-16', pose = 'stand' as 'stand' | 'walk' | 'jump' }) {
  const isWalking = pose === 'walk';
  const isJumping = pose === 'jump';

  return (
    <svg
      viewBox="0 0 16 16"
      className={`${className} ${isWalking ? 'animate-walk' : ''} ${isJumping ? 'translate-y-[-12px]' : ''} transition-transform duration-100`}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Hair (Dark Brown / Black) */}
      <rect x="4" y="1" width="8" height="3" fill="#3E2723" />
      <rect x="3" y="2" width="2" height="3" fill="#3E2723" />
      <rect x="11" y="2" width="2" height="3" fill="#3E2723" />

      {/* Face Skin (Warm Pale/Beige) */}
      <rect x="4" y="4" width="8" height="5" fill="#FFE0B2" />
      
      {/* Eyes (Cute black pixels or retro glasses) */}
      <rect x="5" y="5" width="2" height="2" fill="#212121" />
      <rect x="9" y="5" width="2" height="2" fill="#212121" />
      
      {/* Blush cheeks */}
      <rect x="4" y="7" width="1" height="1" fill="#FF8A80" />
      <rect x="11" y="7" width="1" height="1" fill="#FF8A80" />

      {/* Smile */}
      <rect x="7" y="8" width="2" height="1" fill="#E52521" />

      {/* Cool Hoodie Outfit (Mario Red or Stylish Deep Gray/Teal) */}
      <rect x="3" y="9" width="10" height="5" fill="#E52521" /> {/* Hoodie Body */}
      <rect x="5" y="9" width="6" height="2" fill="#FFEB3B" /> {/* Inner shirt yellow accent */}
      <rect x="4" y="14" width="3" height="2" fill="#212121" /> {/* Left foot */}
      <rect x="9" y="14" width="3" height="2" fill="#212121" /> {/* Right foot */}
      
      {/* Hood drawstring details */}
      <rect x="5" y="11" width="1" height="2" fill="#FFFFFF" />
      <rect x="10" y="11" width="1" height="2" fill="#FFFFFF" />
      
      {/* Left and Right Arms */}
      <rect x="2" y="10" width="2" height="3" fill="#E52521" />
      <rect x="12" y="10" width="2" height="3" fill="#E52521" />
      <rect x="2" y="13" width="2" height="1" fill="#FFE0B2" /> {/* Left hand */}
      <rect x="12" y="13" width="2" height="1" fill="#FFE0B2" /> {/* Right hand */}
    </svg>
  );
}

// Renders an 8-bit stylized SVG representation of Nana
export function NanaSprite({ className = 'w-16 h-16' }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`${className} animate-walk`}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Hair (Long Warm Brown with pink hairpin) */}
      <rect x="4" y="1" width="8" height="4" fill="#5D4037" />
      <rect x="3" y="2" width="10" height="8" fill="#5D4037" />
      <rect x="2" y="5" width="2" height="6" fill="#5D4037" />
      <rect x="12" y="5" width="2" height="6" fill="#5D4037" />
      
      {/* Hairpin pink */}
      <rect x="4" y="2" width="2" height="1" fill="#FF4081" />

      {/* Face Skin (Warm Pale/Beige) */}
      <rect x="4" y="4" width="8" height="5" fill="#FFF3E0" />
      
      {/* Cute large anime eyes */}
      <rect x="5" y="5" width="2" height="2" fill="#00ACC1" />
      <rect x="5" y="5" width="1" height="1" fill="#FFFFFF" />
      <rect x="9" y="5" width="2" height="2" fill="#00ACC1" />
      <rect x="9" y="5" width="1" height="1" fill="#FFFFFF" />

      {/* Rosy Blush */}
      <rect x="4" y="7" width="1" height="1" fill="#FF8A80" />
      <rect x="11" y="7" width="1" height="1" fill="#FF8A80" />

      {/* Sweet Happy Smile */}
      <rect x="7" y="8" width="2" height="1" fill="#D81B60" />

      {/* Cute Girly Dress (Pastel Pink & White Apron) */}
      <rect x="3" y="9" width="10" height="5" fill="#FF4081" />
      <rect x="5" y="9" width="6" height="4" fill="#FFFFFF" /> {/* Apron */}
      <rect x="7" y="10" width="2" height="2" fill="#FF4081" /> {/* Heart on apron */}
      
      {/* Shoes */}
      <rect x="4" y="14" width="3" height="2" fill="#D81B60" />
      <rect x="9" y="14" width="3" height="2" fill="#D81B60" />

      {/* Hands */}
      <rect x="2" y="10" width="1" height="2" fill="#FFF3E0" />
      <rect x="13" y="10" width="1" height="2" fill="#FFF3E0" />
    </svg>
  );
}

// Renders an 8-bit Mystery block
export function MysteryBlockSprite({ className = 'w-12 h-12', isPunched = false }) {
  if (isPunched) {
    return (
      <svg viewBox="0 0 16 16" className={`${className}`} style={{ imageRendering: 'pixelated' }}>
        {/* Pressed solid block (Brownish/Gray) */}
        <rect x="0" y="0" width="16" height="16" fill="#000000" />
        <rect x="1" y="1" width="14" height="14" fill="#8D6E63" />
        {/* Shadow border */}
        <rect x="1" y="14" width="14" height="1" fill="#4E342E" />
        <rect x="14" y="1" width="1" height="13" fill="#4E342E" />
        {/* Light highlight */}
        <rect x="1" y="1" width="13" height="1" fill="#BCAAA4" />
        <rect x="1" y="2" width="1" height="12" fill="#BCAAA4" />
        {/* Small corner rivets */}
        <rect x="2" y="2" width="2" height="2" fill="#4E342E" />
        <rect x="12" y="2" width="2" height="2" fill="#4E342E" />
        <rect x="2" y="12" width="2" height="2" fill="#4E342E" />
        <rect x="12" y="12" width="2" height="2" fill="#4E342E" />
      </svg>
    );
  }

  // Active yellow flashing mystery block with question mark
  return (
    <svg viewBox="0 0 16 16" className={`${className}`} style={{ imageRendering: 'pixelated' }}>
      <rect x="0" y="0" width="16" height="16" fill="#000000" />
      <rect x="1" y="1" width="14" height="14" fill="#FFB300" /> {/* Yellow base */}
      {/* Block pattern highlight */}
      <rect x="1" y="1" width="14" height="1" fill="#FFE082" />
      <rect x="1" y="1" width="1" height="14" fill="#FFE082" />
      <rect x="1" y="14" width="14" height="1" fill="#FF6F00" />
      <rect x="14" y="1" width="1" height="14" fill="#FF6F00" />
      
      {/* Corner dots */}
      <rect x="2" y="2" width="1" height="1" fill="#FF6F00" />
      <rect x="13" y="2" width="1" height="1" fill="#FF6F00" />
      <rect x="2" y="13" width="1" height="1" fill="#FF6F00" />
      <rect x="13" y="13" width="1" height="1" fill="#FF6F00" />

      {/* Stylized pixel Question Mark "?" */}
      <rect x="6" y="4" width="4" height="2" fill="#000000" />
      <rect x="5" y="5" width="2" height="3" fill="#000000" />
      <rect x="9" y="5" width="2" height="3" fill="#000000" />
      <rect x="7" y="8" width="2" height="2" fill="#000000" />
      <rect x="7" y="11" width="2" height="2" fill="#000000" />
    </svg>
  );
}

// Renders an 8-bit Gold Coin
export function RetroCoinSprite({ className = 'w-10 h-10', spinning = true }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`${className} ${spinning ? 'animate-coin-spin' : ''}`}
      style={{ imageRendering: 'pixelated' }}
    >
      <rect x="5" y="1" width="6" height="14" fill="#000000" />
      <rect x="3" y="2" width="10" height="12" fill="#000000" />
      <rect x="2" y="3" width="12" height="10" fill="#000000" />
      <rect x="1" y="5" width="14" height="6" fill="#000000" />
      
      {/* Yellow core */}
      <rect x="5" y="2" width="6" height="12" fill="#FFD84D" />
      <rect x="3" y="3" width="10" height="10" fill="#FFD84D" />
      <rect x="2" y="5" width="12" height="6" fill="#FFD84D" />

      {/* Shiny highlight */}
      <rect x="4" y="4" width="2" height="8" fill="#FFFFFF" />
      <rect x="6" y="3" width="2" height="2" fill="#FFFFFF" />
      
      {/* Outer shadow inside coin */}
      <rect x="10" y="4" width="2" height="8" fill="#FF9100" />
      <rect x="8" y="11" width="2" height="2" fill="#FF9100" />

      {/* Coin center detail (vertical line) */}
      <rect x="7" y="5" width="2" height="6" fill="#000000" />
    </svg>
  );
}

// Green interactive Sewer Pipe
export function GreenPipeSprite({ className = 'w-16 h-16' }) {
  return (
    <svg viewBox="0 0 32 32" className={`${className}`} style={{ imageRendering: 'pixelated' }}>
      {/* Black outline */}
      <rect x="2" y="0" width="28" height="32" fill="#000000" />
      
      {/* Inner Pipe body */}
      <rect x="4" y="2" width="24" height="8" fill="#43B047" /> {/* Rim */}
      <rect x="6" y="10" width="20" height="20" fill="#43B047" /> {/* Neck */}

      {/* Shiny Highlight Left */}
      <rect x="5" y="3" width="4" height="6" fill="#A5D6A7" />
      <rect x="7" y="10" width="3" height="20" fill="#A5D6A7" />

      {/* Strong Dark Shadow Right */}
      <rect x="22" y="3" width="5" height="6" fill="#1B5E20" />
      <rect x="21" y="10" width="4" height="20" fill="#1B5E20" />
      
      {/* Rim Bottom Line */}
      <rect x="3" y="9" width="26" height="1" fill="#000000" />
    </svg>
  );
}

// 8-bit Heart Life Indicator
export function HeartSprite({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 16 16" className={`${className} active:scale-110 transition-transform`} style={{ imageRendering: 'pixelated' }}>
      <path d="M2.5 1 C1 1 0 2.5 0 4.5 C0 8 4 11 8 15 C12 11 16 8 16 4.5 C16 2.5 15 1 13.5 1 C11.5 1 10 3 8 3 C6 3 4.5 1 2.5 1 Z" fill="#000000" />
      <path d="M3 2 C2 2 1 3 1 4.5 C1 7.5 4.5 10 8 14 C11.5 10 15 7.5 15 4.5 C15 3 14 2 13 2 C11 2 9.5 4 8 4 C6.5 4 5 2 3 2 Z" fill="#E52521" />
      <rect x="3" y="3" width="2" height="2" fill="#FF8A80" /> {/* Highlight */}
    </svg>
  );
}

// 8-bit mini castle
export function CastleSprite({ className = 'w-32 h-32' }) {
  return (
    <svg viewBox="0 0 64 64" className={`${className}`} style={{ imageRendering: 'pixelated' }}>
      {/* Black base outlines */}
      <rect x="4" y="16" width="56" height="48" fill="#000000" />
      
      {/* Brick Red background */}
      <rect x="6" y="18" width="52" height="44" fill="#8D6E63" />

      {/* Battlements (castle peaks) */}
      <rect x="6" y="12" width="10" height="6" fill="#000000" />
      <rect x="8" y="14" width="6" height="4" fill="#8D6E63" />
      
      <rect x="22" y="12" width="10" height="6" fill="#000000" />
      <rect x="24" y="14" width="6" height="4" fill="#8D6E63" />

      <rect x="38" y="12" width="10" height="6" fill="#000000" />
      <rect x="40" y="14" width="6" height="4" fill="#8D6E63" />

      <rect x="52" y="12" width="10" height="6" fill="#000000" />
      <rect x="54" y="14" width="6" height="4" fill="#8D6E63" />

      {/* Cute Flagpole and Yellow Birthday Star flag */}
      <rect x="31" y="0" width="2" height="12" fill="#757575" />
      <rect x="21" y="2" width="10" height="6" fill="#FFD84D" /> {/* Flag */}
      <circle cx="26" cy="5" r="1.5" fill="#E52521" /> {/* Love dot in flag */}

      {/* Main Castle Doorway (Dark black slot) */}
      <rect x="24" y="40" width="16" height="24" fill="#000000" />
      <rect x="26" y="42" width="12" height="22" fill="#3E2723" />
      
      {/* Windows */}
      <rect x="14" y="26" width="6" height="10" fill="#000000" />
      <rect x="44" y="26" width="6" height="10" fill="#000000" />
      
      {/* Sump / Bricks lines details */}
      <rect x="10" y="22" width="6" height="2" fill="#5D4037" />
      <rect x="28" y="20" width="8" height="2" fill="#5D4037" />
      <rect x="48" y="22" width="6" height="2" fill="#5D4037" />
      <rect x="22" y="32" width="8" height="2" fill="#5D4037" />
      <rect x="38" y="32" width="6" height="2" fill="#5D4037" />
    </svg>
  );
}

// 8-bit bosses representation as animated blobs
export function BossSprite({ type = 'overthinking', className = 'w-20 h-20' }) {
  // Overthinking (Dark crazy psychic brain ghost)
  if (type === 'overthinking') {
    return (
      <svg viewBox="0 0 16 16" className={`${className} animate-bounce`} style={{ imageRendering: 'pixelated' }}>
        <rect x="2" y="2" width="12" height="12" fill="#000000" />
        <rect x="3" y="3" width="10" height="10" fill="#AB47BC" /> {/* Purple body */}
        <rect x="3" y="3" width="8" height="2" fill="#E1BEE7" />
        {/* Crazy white and red glowing eyes */}
        <rect x="4" y="6" width="3" height="3" fill="#FFFFFF" />
        <rect x="9" y="6" width="3" height="3" fill="#FFFFFF" />
        <rect x="5" y="7" width="1" height="1" fill="#E52521" />
        <rect x="10" y="7" width="1" height="1" fill="#E52521" />
        {/* Angry eyebrow */}
        <rect x="3" y="5" width="4" height="1" fill="#000000" />
        <rect x="9" y="5" width="4" height="1" fill="#000000" />
        {/* Mouth */}
        <rect x="6" y="10" width="4" height="1" fill="#000000" />
      </svg>
    );
  }

  // Bad Days (Grumpy rain cloud storm)
  if (type === 'baddays') {
    return (
      <svg viewBox="0 0 16 16" className={`${className} animate-pulse`} style={{ imageRendering: 'pixelated' }}>
        <rect x="1" y="4" width="14" height="9" fill="#000" />
        <rect x="2" y="5" width="12" height="7" fill="#78909C" /> {/* Blue grey storm cloud */}
        <rect x="4" y="3" width="8" height="2" fill="#CFD8DC" />
        {/* Grumpy eyes */}
        <text x="3" y="9" fill="#000" fontSize="5" fontWeight="bold" fontFamily="monospace">ò_ó</text>
        {/* Rain drop sparks */}
        <rect x="5" y="13" width="1" height="2" fill="#29B6F6" />
        <rect x="10" y="13" width="1" height="2" fill="#29B6F6" />
      </svg>
    );
  }

  // Stress (Angry red pixel fire spark)
  return (
    <svg viewBox="0 0 16 16" className={`${className} animate-bounce`} style={{ imageRendering: 'pixelated' }}>
      <polygon points="8,0 13,5 15,10 11,15 5,15 1,10 3,5" fill="#000" />
      <polygon points="8,2 11,5 13,9 10,13 6,13 3,9 5,5" fill="#FF7043" /> {/* Red orange core */}
      <rect x="6" y="4" width="4" height="4" fill="#FFEB3B" /> {/* Flame center */}
      {/* Angry eyes */}
      <rect x="5" y="7" width="2" height="2" fill="#000" />
      <rect x="9" y="7" width="2" height="2" fill="#000" />
      {/* Grimace mouth */}
      <rect x="6" y="10" width="4" height="1" fill="#000" />
    </svg>
  );
}

// A beautiful 8-bit stylized SVG representation of a background cloud
export function RetroCloud({ className = 'w-16 h-8' }) {
  return (
    <svg
      viewBox="0 0 32 16"
      className={className}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Outline (Black) */}
      <path
        d="M 8,14 H 24 V 16 H 8 Z M 6,12 H 26 V 14 H 6 Z M 4,10 H 28 V 12 H 4 Z M 3,8 H 29 V 10 H 3 Z M 2,6 H 30 V 8 H 2 Z M 3,4 H 29 V 6 H 3 Z M 5,2 H 27 V 4 H 5 Z M 10,0 H 22 V 2 H 10 Z"
        fill="#000000"
      />
      {/* Body highlights & fill (White) */}
      <path
        d="M 9,13 H 23 V 15 H 9 Z M 7,11 H 25 V 13 H 7 Z M 5,9 H 27 V 11 H 5 Z M 4,7 H 28 V 9 H 4 Z M 3,5 H 29 V 7 H 3 Z M 4,3 H 28 V 5 H 4 Z M 6,2 H 26 V 3 H 6 Z M 11,1 H 21 V 2 H 11 Z"
        fill="#FFFFFF"
      />
      {/* Light blue/cyan retro pixelated highlights & shadow shading inside the cloud */}
      <rect x="12" y="3" width="8" height="2" fill="#E0F7FA" />
      <rect x="6" y="6" width="20" height="2" fill="#E0F7FA" />
    </svg>
  );
}
