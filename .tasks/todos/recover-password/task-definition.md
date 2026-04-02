# Allow users to recover their password

## Overview
Add the ability for users to recover their password when they do not recall it

## Why
If a user forget his password, they have no way to login into the application

## Assumptions / Notes
- A user must have an account in the application
- An email is already stored in the database

## Acceptance Criteria
- [x] A new link is send to the user email so they can use it to recover their account
- [x] Unit tests added

## Plan

### Files to Create
1. `src/app/(auth)/recuperar-contrasena/page.tsx` - Password recovery page
2. `src/features/auth/components/RecuperarContrasenaForm.tsx` - Password recovery form component
3. `src/features/auth/services/recuperar-contrasena-service.ts` - Password recovery service
4. `src/features/auth/components/RecuperarContrasenaExitoso.tsx` - Success confirmation component
5. `src/features/auth/types.ts` - Add password recovery types

### Files to Modify
1. `src/features/auth/components/LoginForm.tsx` - Add "¿Olvidaste tu contraseña?" link
2. `src/lib/firebase/firebase-auth.ts` - Add password reset function

### Implementation Steps

#### Step 1: Add Firebase Password Reset Function
- Add `sendPasswordResetEmail` import to `firebase-auth.ts`
- Create `enviarEmailRecuperacionContrasena(email)` function
- Export the new function

#### Step 2: Create Password Recovery Types
- Add `FormularioRecuperarContrasena` type to `types.ts`
- Add related error types if needed

#### Step 3: Create Password Recovery Service
- Create `recuperar-contrasena-service.ts`
- Implement `enviarEmailRecuperacion(email)` function
- Add proper error handling and logging

#### Step 4: Create Password Recovery Form Component
- Create `RecuperarContrasenaForm.tsx`
- Email input field with validation
- Submit button with loading state
- Error display
- Link back to login

#### Step 5: Create Success Confirmation Component
- Create `RecuperarContrasenaExitoso.tsx`
- Display success message
- Instructions to check email
- Link back to login

#### Step 6: Create Password Recovery Page
- Create `recuperar-contrasena/page.tsx`
- Import and use the form component
- Set appropriate metadata

#### Step 7: Update Login Form
- Add "¿Olvidaste tu contraseña?" link below the password field
- Link to `/recuperar-contrasena` page

#### Step 8: Add Unit Tests
- Test password recovery service function
- Test form validation
- Test component rendering and interactions
- Test error scenarios

### Dependencies and Order
1. Firebase function (Step 1) → Service (Step 3) → Components (Steps 4,5) → Page (Step 6) → Update login (Step 7) → Tests (Step 8)
2. Types (Step 2) can be done anytime before Step 4

### Potential Issues and Edge Cases
1. **Email not found**: Firebase doesn't reveal if email exists for security - handle gracefully
2. **Invalid email format**: Client-side validation before sending
3. **Rate limiting**: Firebase handles this, but ensure good UX
4. **Email delivery**: Users may need to check spam folder
5. **Expired links**: Firebase links expire, inform users

### Verification Steps
1. **Firebase Function**: Test that `sendPasswordResetEmail` works with test email
2. **Service**: Verify service calls Firebase correctly and handles errors
3. **Form**: Test form submission, validation, loading states
4. **Page**: Check page renders correctly and navigation works
5. **Login Integration**: Verify link appears and navigates correctly
6. **Email Flow**: Test complete flow from request to email receipt
7. **Unit Tests**: Run `npm test` to ensure all tests pass
8. **Manual Testing**: Test in browser with real email account