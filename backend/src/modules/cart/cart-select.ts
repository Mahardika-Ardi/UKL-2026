export const cartItemSelect = {
  id: true,
  userId: true,
  productId: true,
  quantity: true,
  createdAt: true,
  updatedAt: true,
  product: {
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      imageUrl: true,
      isActive: true,
      store: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
} as const;
