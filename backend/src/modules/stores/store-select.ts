export const storePublicSelect = {
  id: true,
  name: true,
  description: true,
  logoUrl: true,
  openTime: true,
  closeTime: true,
  lastOnlineAt: true,
  foundedAt: true,
  rating: true,
  ratingCount: true,
  totalSold: true,
  verificationStatus: true,
  verifiedAt: true,
  rejectedReason: true,
  createdAt: true,
  updatedAt: true,
  owner: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
    },
  },
} as const;

export const storeOwnerSelect = {
  ...storePublicSelect,
  verificationDocUrl: true,
  verificationDocPublicId: true,
  ownerId: true,
} as const;
