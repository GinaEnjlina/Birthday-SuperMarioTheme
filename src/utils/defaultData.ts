/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameConfig } from '../types';

export const INITIAL_GAME_CONFIG: GameConfig = {
  nonoAge: 20,
  welcomeMsg: 'Welcome, Nono! A special quest has been prepared just for you.',
  storyIntroLines: [
    'Once upon a time...',
    'There was a boy named Nono.',
    'He faced many levels,',
    'defeated countless challenges,',
    'and kept moving forward.',
    'Today,',
    'he unlocked a brand new level!'
  ],
  world1FirstEncounter: {
    title: '🏰 The Beginning',
    date: 'Our First Encounter',
    description: 'Momen awal kenalan kita yang sangat manis dan berkesan. Berawal dari sapaan sederhana yang membuka lembar cerita menakjubkan bagi kita berdua. Terima kasih sudah mengizinkan aku menjadi bagian dari awal petualangan hebatmu!',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600'
  },
  memories: [
    {
      id: 1,
      title: '🟨 Memory Block #1: First Trip together',
      date: 'Sweet Moments',
      description: 'Momen jalan-jalan pertama kita yang tak terlupakan! Setiap tawa, canda, dan tatapan mata terasa begitu hangat, seolah dunia hanya milik kita berdua. Di level ini, aku tahu kamu adalah sosok yang spesial bagi hidupku.',
      imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 2,
      title: '🟨 Memory Block #2: Coffee & Deep Talks',
      date: 'Sharing Our Dream',
      description: 'Duduk berdua membahas hal-hal konyol hingga mimpi besar kita di masa depan. Kesabaranmu mendengarkan ceritaku yang random membuatku selalu merasa nyaman. Kamu selalu menjadi tempat pulang terbaikku.',
      imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 3,
      title: '🟨 Memory Block #3: Everyday Small Wins',
      date: 'Always Sideways',
      description: 'Terima kasih telah menemani hari-hariku, merayakan kemenangan kecil bersamaku, dan selalu mendukung segala hal positif yang aku lakukan. Di setiap level hidup yang rumit, genggaman tanganmu menguatkanku.',
      imageUrl: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?auto=format&fit=crop&q=80&w=600'
    }
  ],
  coins: [
    { id: 1, quality: 'His Sweet Smile', description: 'Senyum manis Nono yang selalu mencerahkan hari-hari Nana sesuram apa pun suasana hatinya. Obat lelah tercanggih di dunia!', isCollected: false },
    { id: 2, quality: 'His Pure Kindness', description: 'Ketulusan dan kebaikan hati Nono yang luar biasa kepada semua orang. Membuat Nana bangga memilikimu.', isCollected: false },
    { id: 3, quality: 'His Infinite Patience', description: 'Kesabaran tiada batas Nono menghadapi segala kelakuan gemas, cerewet, dan manjanya Nana. Nono adalah juaranya!', isCollected: false },
    { id: 4, quality: 'His Cute Humor', description: 'Candaan serta tingkah lucu Nono yang gak pernah gagal memecahkan keheningan dan bikin Nana ketawa bahagia.', isCollected: false },
    { id: 5, quality: 'His Endless Support', description: 'Dukungan, doa, dan motivasi dari Nono yang tiada henti untuk membantu Nana meraih cita-cita. My number one cheerleader!', isCollected: false }
  ],
  insideJokes: [
    {
      id: 1,
      title: 'The Inside Joke Zone 🤫',
      subtitle: 'Secret Panggilan Gemes',
      content: 'Ingat gak pas awal kita punya panggilan sayang unik yang cuma kita berdua yang paham? Setiap kali dipanggil begitu di depan umum langsung bikin salah tingkah plus cubit-cubit gemes!',
      imageUrl: 'https://images.unsplash.com/photo-1516624683217-bf02fc6b6b7c?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 2,
      title: 'Overwhelming Cute Attachment',
      subtitle: 'Si Hobi Ngantuk tapi Pengen Temenin',
      content: 'Momen klasik saat Nono udah ngantuk berat matanya tinggal 5 watt, tapi tetep keukeuh bilang "belum ngantuk kok sayang, masih mau temenin kamu". Akhirnya malah ketiduran sambil nelpon, bikin Nana ketawa gemes sendirian mendengarkan nafas teraturmu.',
      imageUrl: 'https://images.unsplash.com/photo-1541364983171-a8ba01d95cfc?auto=format&fit=crop&q=80&w=600'
    }
  ],
  finalCastleMsg: {
    heading: 'Happy Birthday, Nono ❤️',
    para1: 'Terima kasih banyak ya sudah hadir dan mewarnai hidupku selama ini.',
    para2: 'Terima kasih untuk semua tawa hangat, cerita seru, kesabaran, rasa perhatian, dan waktu berharga yang sudah kita lewati bersama dari hari ke hari. Kamu adalah game partner terhebat sepanjang masa!',
    para3: 'Semoga di level baru yang menakjubkan ini (Level 20 Unlocked!), semua hal baik datang menghampirimu, kedamaian selalu menyertaimu, kesehatan berlimpah, dan semua mimpi indah yang sedang kamu kejar bisa diraih satu per satu.',
    signOff: 'Dan semoga aku bisa terus berada di sampingmu, menggenggam tanganmu di setiap petualangan seru dan level baru berikutnya. I love you to the retro moon and back!'
  }
};
