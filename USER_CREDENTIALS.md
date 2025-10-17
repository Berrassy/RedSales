# 🔐 User Credentials

## Admin User
- **Email**: `admin@sketch.ma`
- **Password**: `Sketch7777`
- **Role**: `ADMIN`
- **Access**: Full admin panel access

## Normal User
- **Email**: `user@sketch.ma`
- **Role**: `CLIENT`
- **Access**: Standard user features (wishlist, cart, etc.)

## 🔑 How to Sign In

### For Admin User:
1. Go to `/auth/signin`
2. Use the **email/password form** (not Google OAuth)
3. Enter:
   - Email: `admin@sketch.ma`
   - Password: `Sketch7777`
4. Click "Se connecter"

### For Normal User:
1. Go to `/auth/signin`
2. Use **Google OAuth** (recommended)
3. Or create a new account with Google OAuth

## 🛡️ Protected Routes

### Admin Routes:
- `/admin` - Requires ADMIN role
- Access: Full admin panel

### Client Routes:
- `/wishlist` - Requires authentication
- `/panier` - Requires authentication
- Access: Wishlist and cart functionality

## 🚀 Testing the System

1. **Test Admin Access**:
   - Sign in with admin credentials
   - Visit `/admin` - should work
   - Visit `/wishlist` - should work
   - Visit `/panier` - should work

2. **Test Client Access**:
   - Sign in with Google OAuth
   - Visit `/admin` - should redirect to home
   - Visit `/wishlist` - should work
   - Visit `/panier` - should work

3. **Test Unauthenticated Access**:
   - Don't sign in
   - Visit `/wishlist` - should redirect to sign-in
   - Visit `/panier` - should redirect to sign-in
   - Visit `/admin` - should redirect to sign-in

## 📊 Database Status
- ✅ 2 users created
- ✅ Admin user: `admin@sketch.ma` (ADMIN role)
- ✅ Client user: `user@sketch.ma` (CLIENT role)
- ✅ 50 products synced from API
- ✅ Authentication system configured
- ✅ Protected routes implemented
