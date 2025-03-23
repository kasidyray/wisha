import { DBUser, DBEvent, DBMessage, DBActivity } from './types';

// Mock Database Tables
export const users: DBUser[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123', // In a real app, this would be hashed
    avatar: 'https://i.pravatar.cc/150?u=john',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'u2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  },
  {
    id: 'u3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?u=mike',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03')
  },
  {
    id: 'u4',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04')
  },
  {
    id: 'u5',
    name: 'Alex Chen',
    email: 'alex@example.com',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05')
  }
];

export const events: DBEvent[] = [
  {
    id: 'e1',
    title: "John's Birthday Celebration",
    description: "Join us for an amazing birthday celebration! There will be cake, games, and lots of fun. Don't forget to RSVP!",
    date: new Date('2024-04-15'),
    type: 'Birthday',
    participantCount: 12,
    itemCount: 8,
    coverImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlydGhkYXklMjBwYXJ0eXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    creatorId: 'u1',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'e2',
    title: "Summer House Party",
    description: "A fun summer gathering with friends and family! We'll have a BBQ, pool games, and more. Bring your swimsuit!",
    date: new Date('2024-07-20'),
    type: 'Party',
    participantCount: 25,
    itemCount: 15,
    coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGFydHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    creatorId: 'u1',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: 'e3',
    title: "Sarah's Wedding Shower",
    description: "Help us celebrate Sarah's upcoming wedding with a beautiful bridal shower. Gifts are appreciated but not required.",
    date: new Date('2024-05-10'),
    type: 'Wedding',
    participantCount: 30,
    itemCount: 20,
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2VkZGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    creatorId: 'u4',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20')
  },
  {
    id: 'e4',
    title: "Tech Meetup & Networking",
    description: "Join us for an evening of tech talks, networking, and refreshments. Great opportunity to meet fellow developers!",
    date: new Date('2024-03-28'),
    type: 'Networking',
    participantCount: 50,
    itemCount: 5,
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaCUyMG1lZXR1cHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    creatorId: 'u5',
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-02-25')
  },
  {
    id: 'e5',
    title: "Baby Shower for Jane",
    description: "Let's celebrate the upcoming arrival of Jane's little one! Join us for games, snacks, and lots of love.",
    date: new Date('2024-06-05'),
    type: 'Baby Shower',
    participantCount: 20,
    itemCount: 25,
    coverImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFieSUyMHNob3dlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    creatorId: 'u2',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
];

export const messages: DBMessage[] = [
  {
    id: 'm1',
    eventId: 'e1',
    content: "Can't wait to celebrate with you!",
    authorId: 'u2',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: 'm2',
    eventId: 'e1',
    content: "This is going to be amazing!",
    authorId: 'u3',
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176'
    },
    createdAt: new Date('2024-03-02'),
    updatedAt: new Date('2024-03-02')
  },
  {
    id: 'm3',
    eventId: 'e3',
    content: "I'm so excited for your wedding shower, Sarah! It's going to be beautiful.",
    authorId: 'u2',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05')
  },
  {
    id: 'm4',
    eventId: 'e3',
    content: "Thank you all for being part of this special day!",
    authorId: 'u4',
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552'
    },
    createdAt: new Date('2024-03-06'),
    updatedAt: new Date('2024-03-06')
  },
  {
    id: 'm5',
    eventId: 'e4',
    content: "Looking forward to sharing my experiences in AI development!",
    authorId: 'u5',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: 'm6',
    eventId: 'e5',
    content: "Thank you everyone for the love and support! Can't wait to meet the little one.",
    authorId: 'u2',
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba'
    },
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15')
  },
  // Additional messages for event e1 (John's Birthday - guest preview)
  {
    id: 'm7',
    eventId: 'e1',
    content: "Happy birthday, John! 🎉 Wishing you all the best on your special day!",
    authorId: 'u4',
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20')
  },
  {
    id: 'm8',
    eventId: 'e1',
    content: "Check out this awesome birthday song I found for you!",
    authorId: 'u5',
    media: {
      type: 'audio',
      url: 'https://cdn.pixabay.com/download/audio/2022/11/13/audio_c957e469e3.mp3'
    },
    createdAt: new Date('2024-03-21'),
    updatedAt: new Date('2024-03-21')
  },
  {
    id: 'm9',
    eventId: 'e1',
    content: "Remember our trip last year? Good times!",
    authorId: 'u3',
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce'
    },
    createdAt: new Date('2024-03-22'),
    updatedAt: new Date('2024-03-22')
  },
  {
    id: 'm10',
    eventId: 'e1',
    content: "I made you a birthday video!",
    authorId: 'u2',
    media: {
      type: 'video',
      url: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27949320be6c27b8e45548541198666c0b7d1f6&profile_id=164&oauth2_token_id=57447761'
    },
    createdAt: new Date('2024-03-23'),
    updatedAt: new Date('2024-03-23')
  },
  {
    id: 'm11',
    eventId: 'e1',
    content: "Found this hilarious GIF that made me think of you!",
    authorId: 'u4',
    media: {
      type: 'gif',
      url: 'https://media.giphy.com/media/j5QcmXoFWl4Q0/giphy.gif'
    },
    createdAt: new Date('2024-03-24'),
    updatedAt: new Date('2024-03-24')
  },
  {
    id: 'm12',
    eventId: 'e1',
    content: "We got you something special! Can't wait to see your reaction.",
    authorId: 'u5',
    createdAt: new Date('2024-03-25'),
    updatedAt: new Date('2024-03-25')
  },
  {
    id: 'm13',
    eventId: 'e1',
    content: "Birthday countdown: 3 weeks to go!",
    authorId: 'u3',
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1557800636-894a64c1696f'
    },
    createdAt: new Date('2024-03-26'),
    updatedAt: new Date('2024-03-26')
  },
  {
    id: 'm14',
    eventId: 'e1',
    content: "Just recorded this voice message for your birthday!",
    authorId: 'u2',
    media: {
      type: 'audio',
      url: 'https://cdn.pixabay.com/download/audio/2021/08/08/audio_3b7d3b4885.mp3'
    },
    createdAt: new Date('2024-03-27'),
    updatedAt: new Date('2024-03-27')
  },
  {
    id: 'm15',
    eventId: 'e1',
    content: "Here's a clip from your favorite movie to make your day even better!",
    authorId: 'u4',
    media: {
      type: 'video',
      url: 'https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f62606a9fe9eca888ab6abc1210e349c3b&profile_id=164&oauth2_token_id=57447761'
    },
    createdAt: new Date('2024-03-28'),
    updatedAt: new Date('2024-03-28')
  },
  {
    id: 'm16',
    eventId: 'e1',
    content: "Dance like nobody's watching! That's your birthday motto, right?",
    authorId: 'u5',
    media: {
      type: 'gif',
      url: 'https://media.giphy.com/media/blSTtZehjAZ8I/giphy.gif'
    },
    createdAt: new Date('2024-03-29'),
    updatedAt: new Date('2024-03-29')
  },
  // Additional messages for event e4 (Tech Meetup - no messages event)
  {
    id: 'm17',
    eventId: 'e4',
    content: "Excited to discuss the latest in AI technology with everyone!",
    authorId: 'u1',
    createdAt: new Date('2024-03-11'),
    updatedAt: new Date('2024-03-11')
  },
  {
    id: 'm18',
    eventId: 'e4',
    content: "I'll be bringing a demo of my latest project, check out this preview:",
    authorId: 'u3',
    media: {
      type: 'video',
      url: 'https://player.vimeo.com/external/478117956.sd.mp4?s=6c0408c354710209e7fc8513724762e773dc7a8c&profile_id=164&oauth2_token_id=57447761'
    },
    createdAt: new Date('2024-03-12'),
    updatedAt: new Date('2024-03-12')
  },
  {
    id: 'm19',
    eventId: 'e4',
    content: "Here's an interesting article on the topics we'll be discussing",
    authorId: 'u2',
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2'
    },
    createdAt: new Date('2024-03-13'),
    updatedAt: new Date('2024-03-13')
  },
  {
    id: 'm20',
    eventId: 'e4',
    content: "Just published my tech podcast episode that relates to our meetup topic",
    authorId: 'u4',
    media: {
      type: 'audio',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b1afb9039.mp3'
    },
    createdAt: new Date('2024-03-14'),
    updatedAt: new Date('2024-03-14')
  },
  {
    id: 'm21',
    eventId: 'e4',
    content: "When someone asks me to explain blockchain again...",
    authorId: 'u1',
    media: {
      type: 'gif',
      url: 'https://media.giphy.com/media/3o7btNa0RUYa5E7iiQ/giphy.gif'
    },
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15')
  },
  {
    id: 'm22',
    eventId: 'e4',
    content: "Looking forward to networking with everyone. Here's a glimpse of our venue:",
    authorId: 'u3',
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678'
    },
    createdAt: new Date('2024-03-16'),
    updatedAt: new Date('2024-03-16')
  },
  {
    id: 'm23',
    eventId: 'e4',
    content: "Made this quick explainer video about our main topic:",
    authorId: 'u5',
    media: {
      type: 'video',
      url: 'https://player.vimeo.com/external/438987524.sd.mp4?s=1e0c7b339668c04371fa9b3e41b9fdb951f2638e&profile_id=164&oauth2_token_id=57447761'
    },
    createdAt: new Date('2024-03-17'),
    updatedAt: new Date('2024-03-17')
  },
  {
    id: 'm24',
    eventId: 'e4',
    content: "I created this ambient music track to play during our networking session",
    authorId: 'u2',
    media: {
      type: 'audio',
      url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_200a31512b.mp3'
    },
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-18')
  },
  {
    id: 'm25',
    eventId: 'e4',
    content: "Me trying to debug my code before the presentation:",
    authorId: 'u4',
    media: {
      type: 'gif',
      url: 'https://media.giphy.com/media/Yl5aO3gdVfsQ0/giphy.gif'
    },
    createdAt: new Date('2024-03-19'),
    updatedAt: new Date('2024-03-19')
  },
  {
    id: 'm26',
    eventId: 'e4',
    content: "Reminder: Don't forget to bring your laptops and business cards!",
    authorId: 'u1',
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20')
  }
];

export const activities: DBActivity[] = [
  {
    id: 'a1',
    type: 'join_event',
    eventId: 'e1',
    userId: 'u2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: 'a2',
    type: 'add_item',
    eventId: 'e1',
    userId: 'u3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  },
  {
    id: 'a3',
    type: 'update_event',
    eventId: 'e2',
    userId: 'u1',
    details: 'Updated event date',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
  },
  {
    id: 'a4',
    type: 'join_event',
    eventId: 'e3',
    userId: 'u2',
    createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: 'a5',
    type: 'new_message',
    eventId: 'e3',
    userId: 'u4',
    createdAt: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
  },
  {
    id: 'a6',
    type: 'add_item',
    eventId: 'e5',
    userId: 'u5',
    createdAt: new Date(Date.now() - 1000 * 60 * 90) // 90 minutes ago
  },
  {
    id: 'a7',
    type: 'join_event',
    eventId: 'e4',
    userId: 'u1',
    createdAt: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
  }
]; 