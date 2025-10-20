# Admin Access Control for CreateRecipe

## Overview

The CreateRecipe page is now restricted to admin users only. Regular users cannot access this page or see the "Create Recipe" navigation link.

## Admin Route Protection

- **Component**: `AdminRoute.tsx` - Custom route guard for admin-only pages
- **Features**:
  - Checks if user is authenticated
  - Verifies user has admin role
  - Shows loading state during authentication check
  - Displays access denied message for non-admin users
  - Redirects to sign-in for unauthenticated users

## Implementation Details

### 1. AdminRoute Component

```tsx
// src/components/AdminRoute.tsx
- Wraps admin-only pages
- Checks user.role === 'admin'
- Shows professional access denied UI for non-admin users
```

### 2. Updated App.tsx Routing

```tsx
<Route
  path="/create-recipe"
  element={
    <AdminRoute>
      <CreateRecipe />
    </AdminRoute>
  }
/>
```

### 3. Navigation Updates

```tsx
// src/components/Navbar.tsx
// Create Recipe link only shows for admin users
...(user?.role === "admin" ? [{ to: "/create-recipe", label: "Create Recipe" }] : [])
```

## Testing Admin Functionality

### Mock Authentication (Development)

To test admin functionality during development:

1. **Admin Login**: Use any email containing "admin"

   - `admin@jollofai.com`
   - `admin@example.com`
   - `test.admin@domain.com`

2. **Regular User Login**: Use any other email
   - `user@jollofai.com`
   - `test@example.com`

### Mock API Server

The mock API server (`mock-api-server.cjs`) supports:

- Default admin user: `admin@jollofai.com`
- Automatic admin role assignment for emails containing "admin"
- Dynamic user creation based on email pattern

### Production Authentication

In production, user roles should be:

- Assigned by backend during user creation
- Validated on backend API endpoints
- Managed through admin dashboard

## Access Control Flow

1. **User visits /create-recipe**
2. **AdminRoute checks authentication**

   - Not logged in → Redirect to /signin
   - Logged in but not admin → Show access denied
   - Admin user → Show CreateRecipe page

3. **Navigation visibility**
   - Admin users: See "Create Recipe" in More menu
   - Regular users: Link is hidden

## Security Notes

- Frontend route protection is for UX only
- Backend API endpoints must also validate admin permissions
- Never rely solely on frontend for security
- Always validate user roles on server-side

## Future Enhancements

1. **Role-based permissions system**
2. **Moderator access levels**
3. **Admin user management interface**
4. **Audit logging for admin actions**
