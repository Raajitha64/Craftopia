export const mockConversations = [
  {
    id: 'conv-1',
    participantIds: ['1', '3'],
    participantNames: ['Alex Johnson', 'Michael Scott'],
    participantAvatars: [
      'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
    ],
    lastMessage: 'I\'d like to discuss the details of the logo design',
    lastMessageDate: '2024-03-18T14:30:00Z',
    unreadCount: 2,
    serviceId: 'service-1',
    serviceTitle: 'Professional logo design with unlimited revisions'
  },
  {
    id: 'conv-2',
    participantIds: ['1', '4'],
    participantNames: ['Alex Johnson', 'Emily Wilson'],
    participantAvatars: [
      'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150'
    ],
    lastMessage: 'The ceramic vase looks amazing! Can you customize the color?',
    lastMessageDate: '2024-03-17T09:15:00Z',
    unreadCount: 0,
    serviceId: 'service-2',
    serviceTitle: 'Custom handmade pottery and ceramic art pieces'
  },
  {
    id: 'conv-3',
    participantIds: ['1', '5'],
    participantNames: ['Alex Johnson', 'Daniel Brown'],
    participantAvatars: [
      'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    ],
    lastMessage: 'Looking forward to our photography session next week!',
    lastMessageDate: '2024-03-15T16:45:00Z',
    unreadCount: 1,
    serviceId: 'service-3',
    serviceTitle: 'Professional portrait photography session'
  }
];

export const mockMessages = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: '1',
    receiverId: '3',
    content: 'Hi, I\'m interested in your logo design service. Can you tell me more about the process?',
    isRead: true,
    createdAt: '2024-03-18T13:30:00Z'
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: '3',
    receiverId: '1',
    content: 'Hello! Thanks for reaching out. My process involves an initial consultation to understand your brand, followed by concept sketches, revisions, and final delivery in multiple formats.',
    isRead: true,
    createdAt: '2024-03-18T13:45:00Z'
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: '1',
    receiverId: '3',
    content: 'That sounds great. How many initial concepts do you provide?',
    isRead: true,
    createdAt: '2024-03-18T14:00:00Z'
  },
  {
    id: 'msg-4',
    conversationId: 'conv-1',
    senderId: '3',
    receiverId: '1',
    content: 'I typically provide 3-5 initial concepts, and then we can refine the one you prefer. Would that work for you?',
    isRead: true,
    createdAt: '2024-03-18T14:10:00Z'
  },
  {
    id: 'msg-5',
    conversationId: 'conv-1',
    senderId: '1',
    receiverId: '3',
    content: 'I\'d like to discuss the details of the logo design. Can we schedule a quick call?',
    isRead: false,
    createdAt: '2024-03-18T14:30:00Z'
  },
  {
    id: 'msg-6',
    conversationId: 'conv-2',
    senderId: '1',
    receiverId: '4',
    content: 'Hi Emily, I love your ceramic pieces! I\'m interested in purchasing a custom vase for my living room.',
    isRead: true,
    createdAt: '2024-03-17T08:30:00Z'
  },
  {
    id: 'msg-7',
    conversationId: 'conv-2',
    senderId: '4',
    receiverId: '1',
    content: 'Thank you, Alex! I\'d be happy to create a custom vase for you. Do you have any specific size, shape, or color in mind?',
    isRead: true,
    createdAt: '2024-03-17T08:45:00Z'
  },
  {
    id: 'msg-8',
    conversationId: 'conv-2',
    senderId: '1',
    receiverId: '4',
    content: 'The ceramic vase looks amazing! Can you customize the color? I\'m looking for something in earth tones that would match my decor.',
    isRead: true,
    createdAt: '2024-03-17T09:15:00Z'
  },
  {
    id: 'msg-9',
    conversationId: 'conv-3',
    senderId: '5',
    receiverId: '1',
    content: 'Hi Alex, I\'ve confirmed our photography session for next Wednesday at 2 PM. Please bring any outfits you\'d like to wear.',
    isRead: true,
    createdAt: '2024-03-15T15:30:00Z'
  },
  {
    id: 'msg-10',
    conversationId: 'conv-3',
    senderId: '1',
    receiverId: '5',
    content: 'Looking forward to our photography session next week! Should I bring multiple outfit changes?',
    isRead: false,
    createdAt: '2024-03-15T16:45:00Z'
  }
];