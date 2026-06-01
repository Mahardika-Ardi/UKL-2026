# Swagger Guide - Atributo API

Dokumen ini merangkum Swagger UI backend Atributo dengan bahasa yang lebih santai dan mudah dibaca.

## Dasar

- Base path API: `/api/v1`
- Endpoint health: `/health`
- Auth utama: cookie httpOnly bernama `access_token`
- Format response sukses: `{ success, message, data, timestamp }`
- Format error: `{ success: false, code, message, timestamp, details? }`

## Enum Penting

- `Gender`: `MALE`, `FEMALE`, `PREFER_NOT_TO_SAY`
- `Role`: `USER`, `SHOP_OWNER`, `ADMIN`
- `VerificationStatus`: `PENDING`, `APPROVED`, `REJECTED`
- `OrderStatus`: `UNPAID`, `PAID`, `PROCESSING`, `DONE`, `CANCELED`
- `PaymentMethod`: `COD`, `BANK_TRANSFER`, `E_WALLET`
- `InboxType`: `ORDER_PLACED`, `ORDER_PAID`, `ORDER_PROCESSING`, `ORDER_DONE`, `ORDER_CANCELED`
- `AddressLabel`: `RUMAH`, `KOS`, `KANTOR`
- `OtpType`: `EMAIL_VERIFICATION`, `RESET_PASSWORD`

## Pola Response

Contoh response sukses:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {
    "id": "..."
  },
  "timestamp": "2026-06-01T00:00:00.000Z"
}
```

Contoh response error:

```json
{
  "success": false,
  "code": "BAD_REQUEST",
  "message": "The request could not be understood or was missing required parameters",
  "timestamp": "2026-06-01T00:00:00.000Z",
  "details": {
    "field": "email"
  }
}
```

## Pagination

Beberapa endpoint list memakai pola query ini:

- `page` → default `1`
- `limit` → default `10`
- `search` → pencarian teks

Response pagination umumnya berbentuk:

```json
{
  "items": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

---

## Auth

### 1) Register

- `POST /api/v1/auth/register`
- Public
- Tujuan: membuat akun baru

Body:

```json
{
  "email": "jane.doe@mail.com",
  "password": "StrongPass!123",
  "firstName": "Jane",
  "lastName": "Doe",
  "birthDate": "2000-01-01T00:00:00.000Z",
  "gender": "MALE"
}
```

Catatan:
- Password harus kuat.
- `lastName` opsional.

### 2) Login

- `POST /api/v1/auth/login`
- Public
- Tujuan: login dan set cookie `access_token`

Body:

```json
{
  "email": "jane.doe@mail.com",
  "password": "StrongPass!123"
}
```

Catatan:
- Untuk login lewat nomor HP, ikuti DTO `LogInDto` yang tersedia di Swagger.

### 3) Logout

- `POST /api/v1/auth/logout`
- Butuh cookie `access_token`
- Tujuan: logout dan blacklist token

### 4) Refresh OTP

- `POST /api/v1/auth/refresh-otp`
- Butuh cookie `access_token`
- Tujuan: kirim ulang OTP sesuai tipe

Body:

```json
{
  "type": "EMAIL_VERIFICATION"
}
```

### 5) Forgot Password

- `POST /api/v1/auth/forgot-password`
- Butuh cookie `access_token`
- Tujuan: kirim OTP reset password

### 6) Reset Password

- `POST /api/v1/auth/reset-password`
- Butuh cookie `access_token`
- Tujuan: ganti password memakai OTP valid

Body:

```json
{
  "code": "123456",
  "password": "NewStrongPass!123"
}
```

### 7) Send Verification Email

- `POST /api/v1/auth/send-verification-email`
- Butuh cookie `access_token`
- Tujuan: kirim OTP verifikasi email

### 8) Verify Email

- `POST /api/v1/auth/verify-email`
- Butuh cookie `access_token`
- Tujuan: verifikasi email memakai OTP

Body:

```json
{
  "code": "654321"
}
```

---

## Users

### 1) Get All Users

- `GET /api/v1/users/findall`
- Role: `ADMIN`
- Tujuan: ambil daftar user

Catatan:
- Implementasi project ini memakai body untuk pagination di endpoint ini.
- Isi dengan field `page`, `limit`, dan `search`.

Body:

```json
{
  "page": 1,
  "limit": 10,
  "search": "jane"
}
```

### 2) Get My Profile

- `GET /api/v1/users/me`
- Butuh cookie `access_token`

### 3) Update My Profile

- `PATCH /api/v1/users/me`
- Butuh cookie `access_token`
- `multipart/form-data`
- Field file: `avatar`

Contoh field teks:

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "phone": "+6281234567890",
  "gender": "FEMALE"
}
```

### 4) Delete My Account

- `DELETE /api/v1/users/me`
- Butuh cookie `access_token`

---

## Address

Semua endpoint address butuh cookie `access_token`.

### 1) Create Address

- `POST /api/v1/address`

Body:

```json
{
  "label": "RUMAH",
  "recipientName": "Jane Doe",
  "phone": "+6281234567890",
  "street": "Jl. Merdeka No. 10",
  "city": "Surabaya",
  "province": "Jawa Timur",
  "postalCode": "60231"
}
```

### 2) Get My Addresses

- `GET /api/v1/address`

### 3) Get Address Detail

- `GET /api/v1/address/:id`

### 4) Update Address

- `PATCH /api/v1/address/:id`

Body:

```json
{
  "label": "KANTOR",
  "city": "Sidoarjo"
}
```

### 5) Delete Address

- `DELETE /api/v1/address/:id`

---

## Stores

### 1) List Stores

- `GET /api/v1/stores`
- Public

Query:

- `page`
- `limit`
- `search`
- `verificationStatus`

Contoh:

`/api/v1/stores?page=1&limit=10&search=toko&verificationStatus=APPROVED`

### 2) Store Detail

- `GET /api/v1/stores/:id`
- Public

### 3) My Store

- `GET /api/v1/stores/me`
- Butuh cookie `access_token`
- Tujuan: ambil store milik user aktif

### 4) Create Store

- `POST /api/v1/stores`
- Butuh cookie `access_token`
- `multipart/form-data`
- File opsional: `logo`
- File wajib: `verificationDoc`

Body teks:

```json
{
  "name": "Tokoku",
  "description": "Toko perlengkapan sekolah",
  "openTime": "08:00",
  "closeTime": "22:00"
}
```

### 5) Update My Store

- `PATCH /api/v1/stores/me`
- Butuh cookie `access_token`
- `multipart/form-data`

Field sama seperti create, file `logo` dan `verificationDoc` opsional saat update.

### 6) Review Store Verification

- `PATCH /api/v1/stores/:id/review`
- Role: `ADMIN`

Body:

```json
{
  "status": "APPROVED"
}
```

Jika `status` = `REJECTED`, isi juga:

```json
{
  "status": "REJECTED",
  "rejectedReason": "Dokumen belum jelas"
}
```

---

## Products

### 1) List Products

- `GET /api/v1/products`
- Public

Query:

- `page`
- `limit`
- `search`
- `storeId`
- `isActive`

Contoh:

`/api/v1/products?page=1&limit=10&search=seragam&storeId=...&isActive=true`

### 2) Product Detail

- `GET /api/v1/products/:id`
- Public

### 3) Create Product

- `POST /api/v1/products`
- Butuh cookie `access_token`
- `multipart/form-data`
- File: `image`

Body:

```json
{
  "name": "Seragam Sekolah",
  "description": "Seragam lengkap ukuran S-XL",
  "price": 150000,
  "stock": 10,
  "isActive": true
}
```

### 4) Update Product

- `PATCH /api/v1/products/:id`
- Butuh cookie `access_token`
- `multipart/form-data`
- File: `image`

Body sama seperti create, semua field opsional.

### 5) Delete Product

- `DELETE /api/v1/products/:id`
- Butuh cookie `access_token`

---

## Cart

Semua endpoint cart butuh cookie `access_token`.

### 1) Get My Cart

- `GET /api/v1/cart`

### 2) Add Item

- `POST /api/v1/cart`

Body:

```json
{
  "productId": "product-id",
  "quantity": 2
}
```

### 3) Update Quantity

- `PATCH /api/v1/cart/:productId`

Body:

```json
{
  "quantity": 3
}
```

### 4) Remove Item

- `DELETE /api/v1/cart/:productId`

### 5) Clear Cart

- `DELETE /api/v1/cart`

---

## Orders

Semua endpoint orders butuh cookie `access_token`.

### 1) Create Order

- `POST /api/v1/orders`

Body:

```json
{
  "storeId": "store-id",
  "addressId": "address-id",
  "paymentMethod": "COD",
  "shippingFee": 10000
}
```

Catatan:
- Order dibuat dari item cart milik store tersebut.
- Stok akan berkurang saat order dibuat.

### 2) List Orders

- `GET /api/v1/orders`

Query:

- `page`
- `limit`
- `status`
- `storeId`

Catatan akses:
- `USER` hanya melihat order miliknya sendiri.
- `SHOP_OWNER` melihat order yang masuk ke store miliknya.
- `ADMIN` melihat semua order.

### 3) Order Detail

- `GET /api/v1/orders/:id`

### 4) Cancel My Order

- `PATCH /api/v1/orders/:id/cancel`

Catatan:
- Hanya order `UNPAID` yang bisa dibatalkan oleh user.

### 5) Update Order Status

- `PATCH /api/v1/orders/:id/status`

Body:

```json
{
  "status": "PROCESSING"
}
```

Catatan:
- `ADMIN` dan `SHOP_OWNER` bisa mengubah status order.

---

## Reviews

### 1) Get Reviews by Product

- `GET /api/v1/reviews/product/:productId`
- Public

Query:

- `page`
- `limit`

### 2) My Reviews

- `GET /api/v1/reviews/me`
- Butuh cookie `access_token`

Query opsional:

- `page`
- `limit`
- `productId`

### 3) Create Review

- `POST /api/v1/reviews`
- Butuh cookie `access_token`

Body:

```json
{
  "orderId": "order-id",
  "productId": "product-id",
  "rating": 5,
  "comment": "Barangnya bagus"
}
```

Catatan:
- Review hanya bisa dibuat dari order yang statusnya `DONE`.
- Satu user hanya bisa review satu product sekali.

### 4) Update Review

- `PATCH /api/v1/reviews/:id`
- Butuh cookie `access_token`

Body:

```json
{
  "rating": 4,
  "comment": "Setelah dipakai, masih bagus"
}
```

### 5) Delete Review

- `DELETE /api/v1/reviews/:id`
- Butuh cookie `access_token`

---

## Inboxes

Semua endpoint inbox butuh cookie `access_token`.

### 1) List Inbox

- `GET /api/v1/inboxes`

Query:

- `page`
- `limit`
- `isRead`

Contoh:

`/api/v1/inboxes?page=1&limit=10&isRead=false`

### 2) Inbox Detail

- `GET /api/v1/inboxes/:id`

### 3) Mark as Read

- `PATCH /api/v1/inboxes/:id/read`

### 4) Mark All as Read

- `PATCH /api/v1/inboxes/read-all`

### 5) Delete Inbox

- `DELETE /api/v1/inboxes/:id`

---

## Health

- `GET /health`
- Public
- Tanpa prefix `/api`
- Tanpa version path

## Quick Notes

- Swagger UI tersedia di `/docs` saat `NODE_ENV` bukan `production`.
- Cookie `access_token` harus dikirim dari frontend agar endpoint protected bisa diakses.
- Jika kamu pakai Postman, pastikan cookie aktif atau kirim header/cookie sesuai environment.

