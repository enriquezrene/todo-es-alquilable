# Renters need to have a user profile to rent an item

## Overview
When a person rents an article from a lister, they need to have created a user profile

## Why
Renters can not be anonymous people, we want to track who is contacting the listers
so we can later implement a rating system

## Assumptions / Notes
- Renters will be users that have created a profile
- Renters can be listers as well

## Acceptance Criteria
- [ ] Renter must have a profile including: name, email, phone, address
- [ ] When a renter wants to rent an item, they need to be logged in first
- [ ] Published articles will not have the `Contactar por WhatsApp button anymore`
- [ ] Published articles will have a `Enviar solicitud de renta` button
- [ ] When a renter sends a rental request, they need to fill out a form with the following fields: start date/time for reting the item, end date/time for returning the item, additional notes
- [ ] Once the request is sent, the lister will receive a whatsapp message with all the info provided by the user
- [ ] The lister will have the ability to change the status of an item as not available if it was previously rented
- [ ] When the lister sets an item as not available, they will need to fill out a form with the following fields: start date/time, end date/time and the renter email, when the user types the email, it will be autocompleted, it is required, can not be blank and should be selected from the suggested matches



## Plan

### Phase 1: Database Schema & Types
1. **Create rental request types** - `src/features/rentals/types.ts`
   - `SolicitudRenta` with fields: id, listingId, renterId, startDateTime, endDateTime, notes, status, createdAt
   - `FormularioSolicitud` for the rental request form
   - `EstadoSolicitud` enum (pendiente, aprobada, rechazada)

2. **Update listing schema** - Add `availabilityStatus` field to listings
   - Update Anuncio type to include `availabilityStatus: 'disponible' | 'alquilado'`

3. **Create Firestore indexes** - Update `firestore.indexes.json`
   - Composite index for rental requests by listingId and status

### Phase 2: Rental Request Service
4. **Create rental service** - `src/features/rentals/services/rental-service.ts`
   - `crearSolicitudRenta()` - Create rental request
   - `obtenerSolicitudesPorAnuncio()` - Get requests for a listing
   - `obtenerSolicitudesPorRenter()` - Get requests by renter
   - `actualizarEstadoAnuncio()` - Update listing availability
   - `enviarMensajeWhatsAppListero()` - Send WhatsApp to lister

### Phase 3: UI Components
5. **Create rental request form** - `src/features/rentals/components/RentalRequestForm.tsx`
   - Date/time pickers for start/end dates
   - Notes textarea
   - Form validation
   - Submit handler that calls service

6. **Create rental request button** - `src/features/rentals/components/RentalRequestButton.tsx`
   - Replace WhatsAppButton on listing pages
   - Show login prompt if user not authenticated
   - Open modal with rental form when clicked

7. **Create rental management for listers** - `src/features/rentals/components/RentalManagementPanel.tsx`
   - Show pending requests for lister's listings
   - Approve/reject functionality
   - Mark item as rented form

### Phase 4: Update Listing Page
8. **Modify listing detail page** - `src/app/(main)/anuncio/[id]/page.tsx`
   - Replace WhatsAppButton with RentalRequestButton
   - Add RentalManagementPanel for listing owners
   - Show availability status badge

### Phase 5: Admin Features
9. **Create rental status management** - Update listing edit form
   - Add availability status field
   - Add rental history section
   - Renters email autocomplete functionality

### Phase 6: Testing & Validation
10. **Create tests** for all new components and services
11. **Update existing tests** that reference WhatsAppButton
12. **Manual testing** of the complete rental flow

### Implementation Order & Dependencies
- **Critical Path**: Types → Service → Components → Page Updates
- **Database changes** must be deployed before UI changes
- **Backward compatibility**: Keep WhatsAppButton as fallback during transition

### Potential Issues & Solutions
- **Date validation**: Ensure end date > start date
- **Conflict prevention**: Check for overlapping rental periods
- **WhatsApp integration**: Ensure proper message formatting
- **Authentication**: Properly handle unauthenticated users
- **Performance**: Efficient Firestore queries for rental history

### Verification Steps
1. **User flow**: Unauthenticated user → Login → Complete profile → Request rental
2. **Lister flow**: Receive WhatsApp → Manage requests → Update availability
3. **Admin flow**: Edit listing status → View rental history
4. **Edge cases**: Invalid dates, conflicting rentals, missing user data
