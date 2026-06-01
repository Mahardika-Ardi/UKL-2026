export const orderItemSelect = {
  id: true,
  productId: true,
  productName: true,
  productPrice: true,
  quantity: true,
  unit: true,
  subtotal: true,
} as const;

export const orderListSelect = {
  id: true,
  userId: true,
  status: true,
  paymentMethod: true,
  shippingFee: true,
  totalAmount: true,
  createdAt: true,
  updatedAt: true,
  store: {
    select: {
      id: true,
      name: true,
      logoUrl: true,
      ownerId: true,
    },
  },
  address: {
    select: {
      id: true,
      label: true,
      recipientName: true,
      phone: true,
      city: true,
      province: true,
      postalCode: true,
    },
  },
  items: {
    select: orderItemSelect,
  },
} as const;

export const orderDetailSelect = {
  ...orderListSelect,
  user: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
    },
  },
} as const;
