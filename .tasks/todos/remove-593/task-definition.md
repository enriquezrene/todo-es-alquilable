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
### Current State Review
- `src/shared/components/layout/Navbar.tsx` already links to `/como-funciona`.
- `src/features/listings/components/OrdenDeTrabajoButton.tsx` already exists and is rendered from `src/app/(main)/anuncio/[id]/page.tsx`.
- The acceptance criteria are only partially complete until the PDF asset, download flow, `/como-funciona` page content, and tests are confirmed end to end.
- The task path says `remove-593`, but the acceptance criteria are about the work-order PDF; implementation should follow the acceptance criteria, not the folder name.

### Files to Create
1. `src/app/(main)/como-funciona/page.tsx` if the route does not already exist.
2. `src/features/listings/services/orden-de-trabajo-service.ts` if the current button import points to a missing file.
3. `src/features/listings/services/orden-de-trabajo-service.test.ts` for the download helper.
4. `src/features/listings/components/OrdenDeTrabajoButton.test.tsx` for the button behavior.
5. `src/app/(main)/como-funciona/page.test.tsx` only if the page is implemented as a testable component or route-level tests already exist in this repo.

### Files to Modify
1. `public/orden-de-trabajo.pdf` by copying the source PDF from the task directory into the public assets folder.
2. `src/features/listings/components/OrdenDeTrabajoButton.tsx` to align behavior, copy, and error handling with the final service implementation.
3. `src/app/(main)/anuncio/[id]/page.tsx` to verify button placement and visibility rules match the acceptance criteria.
4. `src/shared/components/layout/Navbar.tsx` only if the existing `¿Cómo funciona?` link needs label or placement changes.
5. `src/app/(main)/como-funciona/page.tsx` to add the final Spanish trust/safety copy and the PDF call to action.

### Recommended Order
1. Verify the source asset and route/service gaps.
   Check whether `.tasks/in-progress/add-workorder/orden-de-trabajo.pdf` is the intended source file, whether `src/app/(main)/como-funciona/page.tsx` already exists, and whether `src/features/listings/services/orden-de-trabajo-service.ts` exists and works. This avoids duplicating code that may already be present.
   Verification: open the relevant files and confirm the current imports resolve.

2. Publish the PDF as a static asset.
   Copy `orden-de-trabajo.pdf` into `public/` so it is reachable at `/orden-de-trabajo.pdf`. This is the base dependency for every other step.
   Verification: run the app and confirm `/orden-de-trabajo.pdf` responds successfully in the browser.

3. Finalize the download service.
   Implement or adjust `descargarOrdenDeTrabajo()` so it downloads or opens `/orden-de-trabajo.pdf` reliably, uses Spanish error messages, and logs failures with `registrarError`.
   Verification: add a unit test for the helper and manually click the download control in the browser.

4. Finalize the reusable download button.
   Ensure `OrdenDeTrabajoButton` uses the shared service, supports loading/error states cleanly, and works in the listing-detail context for both renters and listers.
   Verification: add component tests for rendering, click behavior, loading state, and error display.

5. Complete the `/como-funciona` page.
   Create or update the route with polished Spanish copy describing the marketplace flow, emphasizing that rentals are protected by signing the PDF, and include a clear download link/button for the work order.
   Verification: navigate to `/como-funciona` and confirm the copy, link, and route metadata render correctly.

6. Validate navigation and listing entry points.
   Confirm the navbar link is visible and routes correctly, and confirm the listing detail page exposes the work-order download action in the intended spot for approved listings.
   Verification: manually test from navbar to `/como-funciona`, then from an approved listing detail page to the download action.

7. Add or update tests for the accepted behavior.
   Focus on the download service, the button component, and the `/como-funciona` page content. If route-level tests are heavy for this repo, extract content into a small component and test that instead.
   Verification: run targeted tests first, then run the broader related suite.

### Potential Issues and Edge Cases
1. The task references the PDF as being in the current task directory, but the actual source file appears to be under `.tasks/in-progress/add-workorder/`; confirm the correct source before copying.
2. The folder name `remove-593` does not match the described feature, so there is a risk of implementing the wrong task if someone follows the folder name instead of the acceptance criteria.
3. The navbar link already exists, so the real gap may be a missing route, which would currently produce a broken navigation path.
4. The button component already exists, so a missing or incomplete `orden-de-trabajo-service.ts` would break the download flow even though the UI appears present.
5. Browser download behavior differs between desktop and mobile; opening the PDF in a new tab may be more reliable than forcing a download in some mobile browsers.
6. If the PDF is missing from `public/`, the button and `/como-funciona` page could both look correct while failing only at click time.
7. If the listing-detail button is restricted too narrowly, renters may not see it even though the acceptance criteria say both renters and listers can download the PDF.

### Verification Checklist
1. Asset: confirm `public/orden-de-trabajo.pdf` exists and is reachable at `/orden-de-trabajo.pdf`.
2. Service: verify `descargarOrdenDeTrabajo()` handles success and failure paths.
3. Button: verify the button renders, starts a download/open action, and shows an error message if the asset is unavailable.
4. Detail page: verify the button is visible on an approved listing and works for a non-owner viewer as well as the owner.
5. Navigation: verify `¿Cómo funciona?` in the navbar routes correctly.
6. Content page: verify `/como-funciona` includes the Spanish trust/safety copy and a clear PDF download entry point.
7. Tests: run targeted Vitest coverage for the new/updated service and components, then run lint on all touched files.
