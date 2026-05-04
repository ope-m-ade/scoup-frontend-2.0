# SCOUP Handoff Notes

Created: 2026-04-22

## Topic

Backend maintainability and admin customization.

## Current Direction

Academic Metrics should be treated as an external import source, not a core web application concept. The frontend and backend should think in terms of SCOUP product concepts, not the origin of imported data.

Core application concepts should be:

- Faculty
- School
- Department
- Paper
- Project
- Patent
- User
- Profile
- Approval

## Main Concern

The app currently feels too developer-dependent for long-term handoff. Routine customization should not require editing models, serializers, endpoints, frontend components, imports, and migrations every time.

Admins should eventually be able to:

- Create and edit schools.
- Create and edit departments.
- Assign faculty to schools and departments.
- Review and clean faculty records.
- Manage imported data without exposing the import source as part of the product identity.

## Recommended Path

Do not migrate away from Django immediately. First, make the current backend more handoff-friendly.

1. Remove product-facing Academic Metrics references.
2. Add first-class `School` and `Department` records in the backend.
3. Expose school and department management to admins.
4. Add simple admin dashboard screens for faculty, school, and department cleanup.
5. Write a handoff guide covering how to run, seed, deploy, add users, add departments, and clean data.

## Low/No-Code Options To Revisit Later

These may be worth evaluating after the current Django backend is made easier to maintain:

- Directus: strong fit for admin-managed collections, fields, roles, permissions, and content.
- Supabase: strong fit for managed Postgres, auth, table editing, and Row Level Security.
- Django Admin: already available and good for trusted internal management, but not a full replacement for custom workflows.

## Decision For Now

Keep Django for now. Improve admin customization and handoff documentation first. Revisit Directus or Supabase only if the cleaned-up Django workflow still feels too technical for the people who will maintain SCOUP.

## Cleanup Implementation Added

The backend now has a durable cleanup layer for school, department, and faculty review data.

New backend concepts:

- `School`: first-class school/college records.
- `Department`: first-class department records that can belong to a school.
- `Faculty.primary_school` and `Faculty.primary_department`: the clean primary affiliation.
- `Faculty.schools` and `Faculty.departments`: additional clean affiliations.
- `Faculty.review_status`: one of `pending`, `confirmed_su`, `external`, `archived`, or `rejected`.
- `Faculty.confirmed_su_faculty`: boolean flag for confirmed Salisbury faculty.
- `Faculty.cleanup_notes`: admin notes for manual review.

The old text/JSON fields are still present for compatibility:

- `school`
- `department`
- `school_affiliations`
- `department_affiliations`

The long-term goal is to use the clean relational fields for application behavior and keep the old text/JSON fields as imported evidence or legacy compatibility.

## Admin Cleanup Workflow

Admins should use Django Admin to:

1. Confirm the six standard SU schools.
2. Create or correct departments under the proper school.
3. Review faculty marked as `pending` or `external`.
4. Mark true Salisbury faculty as `confirmed_su`.
5. Assign each confirmed faculty member a primary school and primary department when known.
6. Archive or reject records that should not appear in faculty/network experiences.

The Network page now prefers the backend `/api/network/discovery/` endpoint. That endpoint returns capped, ranked, Salisbury-filtered collaboration results. If the endpoint is unavailable because the backend has not been migrated yet, the frontend falls back to its normalized public dataset behavior.

## Required Backend Step

Before relying on the cleanup workflow in a real environment, run backend migrations:

```bash
cd /Users/opeade/codeStuff/SCOUP_FINAL/scoupdb
./venv/bin/python manage.py migrate
```

The migration seeds the standard SU schools and backfills clean faculty review fields from existing school, department, email, user, and approval evidence.
