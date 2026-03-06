# Add Task Filtering & Search

## Overview
Add the ability to filter tasks by status and search by title/description
in the TaskBoard component. Users with 50+ tasks need this to stay productive.

## Why
Currently there's no way to find specific tasks without scrolling through
the entire list. Users need to quickly locate tasks by status or keyword.

## Assumptions / Notes
- Filter should persist across page reloads (URL params via next/navigation)
- Search should be client-side for instant feedback (useState + useMemo)
- Need to work with existing TaskBoard columns (TODO, IN_PROGRESS, DONE)
- Mobile responsive using existing Tailwind breakpoints

## Acceptance Criteria
- [ ] Status filter dropdown (All, Todo, In Progress, Done)
- [ ] Search input with debounced typing (300ms)
- [ ] URL updates with filter params (?status=todo&q=search)
- [ ] Clear filters button
- [ ] Empty state when no results match
- [ ] Unit tests for filter logic

## Technical Notes
- Modify: components/task-board.tsx
- Create: components/ui/task-filter.tsx
- Uses: Prisma Task type, shadcn/ui Select component

## Plan
<!-- Claude will fill this in during the Plan phase -->