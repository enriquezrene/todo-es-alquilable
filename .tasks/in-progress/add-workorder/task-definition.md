# Allow users to download a PDF so renters and listers can sign on it

## Overview
Add the ability for listers to download a PDF so renters and listers can sign on it when a new item is being rented

## Why
A lister needs to have a formal guarantee on the terms of the rental

## Assumptions / Notes
- A renter and lister have talk by whatsapp and agreed on the terms of the rental

## Acceptance Criteria
- [] A new link is added to the system with the PDF `orden-de-trabajo.pdf` available in the current directory of this task definition
- [] Lister and renters can download the PDF
- [] Add a new page in the system accessible by the link "Como funciona?"
- [] The new page "Como funciona?" needs to mention that is all safe and secure, we guarantee all transactions are covered by signing the PDF attached, add a nice and fancy text for it in Spanish
- [] Unit tests added

## Plan

### Files to Create
1. `src/app/(main)/orden-de-trabajo/page.tsx` - Work order PDF download page
2. `src/app/(main)/como-funciona/page.tsx` - "How it works" page with security information
3. `src/features/listings/components/OrdenDeTrabajoButton.tsx` - Download button component
4. `src/features/listings/services/orden-de-trabajo-service.ts` - Service to handle PDF downloads
5. `src/features/listings/types.ts` - Add work order related types

### Files to Modify
1. `src/app/(main)/anuncio/[id]/page.tsx` - Add download button to listing detail page
2. `src/shared/components/layout/Navbar.tsx` - Add "Cómo funciona" link to navigation
3. `public/` - Copy `orden-de-trabajo.pdf` to public directory

### Implementation Steps

#### Step 1: Move PDF to Public Directory
- Copy `orden-de-trabajo.pdf` from `.tasks/todos/add-workorder/` to `public/`
- Ensure PDF is accessible via `/orden-de-trabajo.pdf`

#### Step 2: Add Work Order Types
- Add `OrdenDeTrabajo` type to `types.ts`
- Add related interfaces for download functionality

#### Step 3: Create Work Order Service
- Create `orden-de-trabajo-service.ts`
- Implement `descargarOrdenDeTrabajo()` function
- Handle PDF file serving from public directory
- Add proper error handling and logging

#### Step 4: Create Download Button Component
- Create `OrdenDeTrabajoButton.tsx`
- Add download icon and appropriate styling
- Handle click events and loading states
- Show success/error feedback

#### Step 5: Create Work Order Download Page
- Create `orden-de-trabajo/page.tsx`
- Display PDF information and download instructions
- Provide direct download link
- Add back navigation to listing
- Include security and usage information

#### Step 6: Create "Cómo Funciona" Page
- Create `como-funciona/page.tsx`
- Write compelling Spanish copy about security and guarantees
- Explain the PDF signing process
- Emphasize safety and transaction protection
- Add link to download work order

#### Step 7: Update Navigation
- Add "Cómo funciona" link to main navigation
- Ensure it's visible to all users (authenticated and public)

#### Step 8: Update Listing Detail Page
- Add download button to listing detail page
- Position appropriately near contact information
- Ensure only visible for approved listings

#### Step 9: Add Unit Tests
- Test download service function
- Test button component rendering and interactions
- Test both pages functionality
- Test error scenarios

### Dependencies and Order
1. PDF to public (Step 1) → Types (Step 2) → Service (Step 3) → Button Component (Step 4) → Pages (Steps 5,6) → Navigation (Step 7) → Update listing (Step 8) → Tests (Step 9)

### Potential Issues and Edge Cases
1. **PDF file not found**: Handle missing file gracefully with fallback
2. **Download permissions**: Ensure only authenticated users can download from listings
3. **File size**: PDF is ~90KB, should be fine for direct download
4. **Mobile compatibility**: Ensure download works on mobile devices
5. **Browser compatibility**: Test across different browsers
6. **Caching**: Handle browser caching for repeated downloads
7. **Spanish copy**: Ensure professional and trustworthy messaging in Spanish

### Verification Steps
1. **PDF Access**: Verify PDF is accessible via `/orden-de-trabajo.pdf`
2. **Service**: Verify service handles PDF download correctly
3. **Button Component**: Test button click triggers download
4. **Download Page**: Check page renders and provides download functionality
5. **Cómo Funciona Page**: Verify page displays security information correctly
6. **Navigation**: Test "Cómo funciona" link appears and navigates correctly
7. **Listing Integration**: Verify button appears on listing detail pages
8. **Download Flow**: Test complete download from button click to file save
9. **Unit Tests**: Run `npm test` to ensure all tests pass
10. **Manual Testing**: Test download on different devices and browsers
11. **Security**: Verify proper access controls are in place
