export const registerSelect = {
  id: true,
  email: true,
  phone: true,
  role: true,
  gender: true,
  firstName: true,
  lastName: true,
  birthDate: true,
  createdAt: true,
  updatedAt: true,
  isEmailVerified: true,
  isPhoneVerified: true,
} as const;

export const loginSelect = {
  id: true,
  email: true,
  phone: true,
  password: true,
  role: true,
} as const;
