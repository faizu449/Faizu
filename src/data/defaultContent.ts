import { PublicContentResponse } from '../types.js';

export const DEFAULT_PUBLIC_CONTENT: PublicContentResponse = {
  settings: {
    title: 'Birthday & Memories',
    subtitle: 'A little world of wishes, memories, and love.',
    recipientName: 'Special Someone',
    cakeHeading: 'Happy Birthday! 🎂',
    cakeSubtitle: 'Make your sweetest wish before blowing out each candle...',
    questionText: 'Are you ready to see your special surprise? 💗',
    memoriesIntroHeading: 'Our Beautiful Memories 📸',
    memoriesIntroText: "Every picture holds a moment, every moment tells a story, and every memory is a little treasure. Now let's revisit the beautiful moments we've shared.",
    finalWishesHeading: 'Wishes Just for You 💖',
    finalWishesMessage: 'May your life always be filled with happiness, beautiful memories, and endless reasons to smile. 💗',
    footerTagline: 'Made with Love ♡',
    bgmStyle: 'romantic_lullaby',
    customAudioUrl: '',
    confettiSound: 'sparkle',
    musicEnabled: true,
    soundFxEnabled: true
  },
  giftWishes: [
    {
      id: 'wish-1',
      type: 'gift',
      title: 'To My Favorite Person ✨',
      message: 'On this special day, I hope you are reminded of how deeply cherished and adored you are. Thank you for bringing so much warmth, laughter, and light into every single day.',
      sender: 'Forever with love',
      emoji: '🌸',
      order: 1,
      isPublished: true
    },
    {
      id: 'wish-2',
      type: 'gift',
      title: 'A Year of Wonder & Dreams 🌟',
      message: 'May this new year around the sun bring exciting adventures, quiet moments of peace, and all the happiness your kind heart deserves. Keep shining brightly!',
      sender: 'With warmest hugs',
      emoji: '🎁',
      order: 2,
      isPublished: true
    }
  ],
  finalWishes: [
    {
      id: 'wish-3',
      type: 'final',
      title: 'Unconditional Joy',
      message: 'May you always have reasons to dance, laugh until your tummy hurts, and feel surrounded by genuine warmth.',
      sender: 'Your Biggest Fan',
      date: 'Forever',
      accentColor: '#F47BA7',
      order: 1,
      isPublished: true
    },
    {
      id: 'wish-4',
      type: 'final',
      title: 'Countless New Adventures',
      message: 'Here is to more road trips, late-night talks, spontaneous ice cream runs, and memories we will treasure forever.',
      sender: 'Always Here For You',
      date: 'Always',
      accentColor: '#DCCBFF',
      order: 2,
      isPublished: true
    },
    {
      id: 'wish-5',
      type: 'final',
      title: 'Peace, Health & Sunshine',
      message: 'May every morning greet you with clarity and every evening bring you restful peace and gratitude.',
      sender: 'With Deep Affection',
      date: 'Every Day',
      accentColor: '#F7C96B',
      order: 3,
      isPublished: true
    }
  ],
  memories: [
    {
      id: 'mem-1',
      title: 'Under the Fairy Lights',
      caption: 'That unforgettable cozy evening with warm cocoa, acoustic tunes, and laughter under the stars.',
      date: 'October 14',
      category: 'Celebration',
      imageUrl: '/src/assets/images/memory_stargazing_picnic_1792484692955.jpg',
      order: 1,
      isPublished: true
    },
    {
      id: 'mem-2',
      title: 'Golden Sunset Stroll',
      caption: 'Walking barefoot by the shore as the pastel sky reflected all our favorite conversations.',
      date: 'August 22',
      category: 'Travel',
      imageUrl: '/src/assets/images/memory_sunset_beach_walk_1792484692216.jpg',
      order: 2,
      isPublished: true
    },
    {
      id: 'mem-3',
      title: 'Cozy Morning Cafe',
      caption: 'Sneaking away for strawberry shortcake and latte art before the world woke up.',
      date: 'June 08',
      category: 'Little Things',
      imageUrl: '/src/assets/images/memory_cozy_cafe_birthday_1792484693270.jpg',
      order: 3,
      isPublished: true
    },
    {
      id: 'mem-4',
      title: 'Peonies & Soft Ribbons',
      caption: 'A fresh pastel bouquet to remind you how much color you bring into life every day.',
      date: 'May 03',
      category: 'Surprise',
      imageUrl: '/src/assets/images/memory_flower_bouquet_gift_1792484692842.jpg',
      order: 4,
      isPublished: true
    }
  ]
};
