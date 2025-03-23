// Define mapping of event types to default images
interface EventTypeImage {
  image: string;
  alt: string;
  // We can add more properties like background color if needed
}

export const EVENT_TYPE_IMAGES: Record<string, EventTypeImage> = {
  // Most Popular
  'birthday': {
    image: '/images/event-types/birthday.svg',
    alt: 'Birthday celebration with cake and balloons'
  },
  'congrats': {
    image: '/images/event-types/congrats.svg',
    alt: 'Congratulations celebration with confetti'
  },
  'farewell': {
    image: '/images/event-types/farewell.svg',
    alt: 'Farewell party with waving hand'
  },
  'sympathy': {
    image: '/images/event-types/sympathy.svg',
    alt: 'Sympathy card with sun and flowers'
  },
  'thank-you': {
    image: '/images/event-types/thank-you.svg',
    alt: 'Thank you note with heart'
  },
  'welcome': {
    image: '/images/event-types/welcome.svg',
    alt: 'Welcome sign with open door'
  },
  'service-anniversary': {
    image: '/images/event-types/anniversary.svg',
    alt: 'Service anniversary with trophy'
  },
  'other': {
    image: '/images/event-types/other.svg',
    alt: 'Generic celebration image'
  },
  
  // More Occasions
  'christmas': {
    image: '/images/event-types/christmas.svg',
    alt: 'Christmas tree and decorations'
  },
  'easter': {
    image: '/images/event-types/easter.svg',
    alt: 'Easter egg and bunny'
  },
  'fathers-day': {
    image: '/images/event-types/fathers-day.svg',
    alt: 'Father\'s day tie and gift'
  },
  'fourth-of-july': {
    image: '/images/event-types/fourth-of-july.svg',
    alt: 'Fourth of July fireworks and flag'
  },
  'graduation': {
    image: '/images/event-types/graduation.svg',
    alt: 'Graduation cap and diploma'
  },
  'halloween': {
    image: '/images/event-types/halloween.svg',
    alt: 'Halloween pumpkin and ghost'
  },
  'hanukkah': {
    image: '/images/event-types/hanukkah.svg',
    alt: 'Hanukkah menorah'
  },
  'love': {
    image: '/images/event-types/love.svg',
    alt: 'Love hearts and romance'
  },
  'memorial': {
    image: '/images/event-types/memorial.svg',
    alt: 'Memorial candle and flower'
  },
  'mothers-day': {
    image: '/images/event-types/mothers-day.svg',
    alt: 'Mother\'s day flowers and card'
  },
  'new-baby': {
    image: '/images/event-types/new-baby.svg',
    alt: 'New baby with rattle and toys'
  },
  'new-years': {
    image: '/images/event-types/new-years.svg',
    alt: 'New Year\'s fireworks and celebration'
  },
  'retirement': {
    image: '/images/event-types/retirement.svg',
    alt: 'Retirement beach chair and sunset'
  },
  'staff-appreciation': {
    image: '/images/event-types/appreciation.svg',
    alt: 'Staff appreciation award and clapping hands'
  },
  'thanksgiving': {
    image: '/images/event-types/thanksgiving.svg',
    alt: 'Thanksgiving turkey and harvest'
  },
  'valentines-day': {
    image: '/images/event-types/valentines.svg',
    alt: 'Valentine\'s Day hearts and roses'
  },
  'wedding': {
    image: '/images/event-types/wedding.svg',
    alt: 'Wedding rings and flowers'
  },
  'engagement': {
    image: '/images/event-types/engagement.svg',
    alt: 'Engagement ring and celebration'
  },
  'shout-out': {
    image: '/images/event-types/shout-out.svg',
    alt: 'Shout out with megaphone'
  }
};

// Default fallback image
export const DEFAULT_EVENT_IMAGE = '/images/event-types/default.svg';

/**
 * Get image for a specific event type
 * @param eventType Type of the event
 * @returns Image path and alt text
 */
export function getEventTypeImage(eventType: string): EventTypeImage {
  // Convert to lowercase and kebab-case for matching
  const normalizedType = eventType
    ?.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '') || '';
  
  return EVENT_TYPE_IMAGES[normalizedType] || {
    image: DEFAULT_EVENT_IMAGE,
    alt: 'Event celebration image'
  };
} 