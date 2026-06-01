export const productPublicSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  stock: true,
  imageUrl: true,
  rating: true,
  ratingCount: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  store: {
    select: {
      id: true,
      name: true,
      logoUrl: true,
      verificationStatus: true,
    },
  },
} as const;

export const productOwnerSelect = {
  ...productPublicSelect,
  imagePublicId: true,
  storeId: true,
} as const;
