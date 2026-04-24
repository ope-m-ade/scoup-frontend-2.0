# Recent Fixes

This file is a short log of recent bugs/regressions that were fixed during cleanup work.

## 1. Faculty Search Results Disappeared

### Symptom
- Paper search still worked.
- Faculty/user name search stopped returning faculty results.

### Cause
- The frontend normalization layer was still filtering faculty using an old import-era assumption.
- After the public dataset payload was cleaned, faculty records no longer carried the raw affiliation text that the old filter expected.
- Valid faculty were dropped before the search dataset was built.

### Fix
- Updated the faculty filter in `src/utils/datasetNormalization.ts`.
- Faculty are now kept in the searchable dataset when they have valid department or school affiliations.

## 2. Import-Era Category Noise Was Leaking Into the Live App

### Symptom
- `top_level_categories`, `mid_level_categories`, `low_level_categories`, source metadata, and similar import-only fields were still influencing search/matching and API payloads.

### Cause
- The imported Academic Metrics structure was still partially wired into frontend normalization and backend serializers/views.

### Fix
- Removed category hierarchy from active frontend keyword generation and fallback matching.
- Stopped exposing those noisy fields through the normal live product API path.
- Search now relies on real product fields such as:
  - faculty name
  - department
  - school
  - title
  - bio
  - research interests
  - AI keywords
  - paper title
  - abstract
  - journal
  - authors

## 3. Department Records Were Polluted by Raw Affiliation Strings

### Symptom
- The department table contained full addresses, external institutions, job titles, and other affiliation noise instead of clean Salisbury department names.

### Cause
- Raw affiliation strings were being promoted into department records without enough validation.

### Fix
- Added shared Salisbury affiliation-cleaning logic in the backend.
- Updated import/repair handling so only valid Salisbury department/school data is promoted.

## Notes

- Academic Metrics import data is treated as temporary/demo population data, not product truth.
- Product truth should come from:
  - signed-up users
  - admin-managed schools/departments
  - user-added papers, PDFs, patents, and projects
- Long-term goal: keep the live product independent from import-era scaffolding.
