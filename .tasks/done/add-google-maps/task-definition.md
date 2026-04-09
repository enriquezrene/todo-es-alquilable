# Allow listers to set their items location

## Overview
Add the ability for users to set the location when they are creating their profile.
Later, we will use this location to show renters where the lister articles are

## Why
Renters might want to know where the items are located to be rented

## Assumptions / Notes
- Listers will need to set their location in their profile
- We will use Google Maps to set the location

## Acceptance Criteria
- [ ] When users are creating their profile, they can set their location using google maps
- [ ] User can update their location in their profile
- [ ] The location set in the lister profile will be shown in the renters articles
- [ ] All renter articles will show the location when renter are seing the items 

## Plan

### Files to Create
1. `src/shared/components/maps/GoogleMap.tsx` - Reusable Google Maps component
2. `src/shared/components/maps/LocationPicker.tsx` - Location picker with map integration
3. `src/features/profile/components/LocationSelector.tsx` - Profile location selector component
4. `src/shared/services/geocoding-service.ts` - Google Maps geocoding service
5. `src/shared/types/location.ts` - Location-related types
6. `src/lib/maps/google-maps-config.ts` - Google Maps configuration and initialization

### Files to Modify
1. `src/features/profile/components/ProfileForm.tsx` - Add location field to profile creation/editing
2. `src/features/profile/services/profile-service.ts` - Add location CRUD operations
3. `src/shared/types/anuncio.ts` - Add location field to Anuncio type
4. `src/features/listings/components/ListingCard.tsx` - Display location on listing cards
5. `src/app/(main)/anuncio/[id]/page.tsx` - Show location on listing detail page
6. `src/features/listings/services/listing-service.ts` - Include location in listing data
7. `.env.local.example` - Add Google Maps API key example
8. `package.json` - Add Google Maps dependencies

### Implementation Steps

#### Step 1: Setup Google Maps Integration
- Add Google Maps API key to environment variables
- Install Google Maps dependencies (`@googlemaps/react-wrapper`, `@googlemaps/js-api-loader`)
- Create Google Maps configuration file
- Set up API loading and initialization

#### Step 2: Create Location Types and Interfaces
- Define `Location`, `Coordinates`, and `Address` types
- Add location field to user profile and listing types
- Create geocoding response types

#### Step 3: Build Geocoding Service
- Create service for forward geocoding (address → coordinates)
- Create service for reverse geocoding (coordinates → address)
- Add error handling and rate limiting
- Implement caching for better performance

#### Step 4: Create Map Components
- Build reusable GoogleMap component with basic functionality
- Create LocationPicker component with search and selection
- Add marker placement and interaction
- Implement address autocomplete integration

#### Step 5: Integrate Location into Profile
- Add LocationSelector to profile creation form
- Add location editing capability to existing profiles
- Update profile service to handle location data
- Add validation for location requirements

#### Step 6: Update Listing Display
- Show location on listing cards (city/province)
- Display full address on listing detail pages
- Add location-based filtering to search functionality
- Show map preview on listing details

#### Step 7: Backend Integration
- Update Firestore user documents to include location
- Update listing documents to inherit/show lister location
- Add location indexing for search queries
- Implement location-based queries in listing service

#### Step 8: Testing and Optimization
- Add unit tests for geocoding service
- Test map components with mock data
- Test profile location CRUD operations
- Test location display on listings
- Performance optimization for map loading

### Dependencies and Order
1. Setup (Step 1) → Types (Step 2) → Services (Step 3) → Components (Step 4) → Profile Integration (Step 5) → Listing Display (Step 6) → Backend (Step 7) → Testing (Step 8)

### Potential Issues and Edge Cases
1. **API Key Security**: Ensure Google Maps API key is properly secured and restricted
2. **Rate Limiting**: Google Maps API has usage limits - implement caching and error handling
3. **Location Accuracy**: Handle cases where GPS coordinates are imprecise
4. **Privacy Concerns**: Allow users to control location visibility granularity
5. **Network Issues**: Handle slow or failed map loading gracefully
6. **Browser Compatibility**: Ensure maps work across different browsers and devices
7. **Cost Management**: Monitor API usage to avoid unexpected costs
8. **User Experience**: Provide fallback when user denies location access

### Verification Steps
1. **API Integration**: Test Google Maps API key and basic map rendering
2. **Location Picker**: Test address search and marker placement
3. **Profile Creation**: Verify location can be set during profile creation
4. **Profile Editing**: Test location updates on existing profiles
5. **Listing Display**: Confirm location appears on listing cards and details
6. **Geocoding Service**: Test address-to-coordinates and reverse conversions
7. **Error Handling**: Test behavior with network failures and API errors
8. **Performance**: Verify map loading speed and responsiveness
9. **Mobile Testing**: Test location picker on mobile devices
10. **Privacy**: Test location visibility controls and data handling
