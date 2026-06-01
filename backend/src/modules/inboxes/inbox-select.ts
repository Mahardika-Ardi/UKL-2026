export const inboxSelect = {
  id: true,
  userId: true,
  orderId: true,
  type: true,
  title: true,
  body: true,
  isRead: true,
  createdAt: true,
  order: {
    select: {
      id: true,
      status: true,
      totalAmount: true,
      createdAt: true,
    },
  },
} as const;
