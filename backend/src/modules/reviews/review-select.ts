export const reviewSelect = {
  id: true,
  userId: true,
  productId: true,
  orderId: true,
  rating: true,
  comment: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
    },
  },
  product: {
    select: {
      id: true,
      name: true,
      imageUrl: true,
      store: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
} as const;
