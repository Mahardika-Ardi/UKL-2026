export const userMeSelect = {
  id: true,
  email: true,
  phone: true,
  avatarUrl: true,
  gender: true,
  firstName: true,
  lastName: true,
  birthDate: true,
  createdAt: true,
  updatedAt: true,
  isEmailVerified: true,
  isPhoneVerified: true,
} as const;

export const userAdminSelect = {
  id: true,
  email: true,
  phone: true,
  role: true,
  avatarUrl: true,
  isEmailVerified: true,
  isPhoneVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;
