# SCOUP Implementation Plan Gap Analysis

Updated: May 8, 2026

This document compares the current SCOUP implementation against the pasted implementation plan dated August 17, 2025. The plan describes SCOUP as more than a search tool: it is an institutional discovery, governance, collaboration, and routing platform. The current codebase has meaningful pieces of that vision, but it is still weighted toward search, faculty profiles, and basic admin management.

## Executive Summary

The current implementation is strongest in these areas:

- Public discovery across faculty, papers, patents, and projects.
- Backend search with exact, fuzzy, keyword, abstract/description, author, department, and semantic paper matching.
- Faculty dashboard structure for profile, papers, patents, projects, CV upload, analytics, network, badges, and settings.
- Admin dashboard structure for overview, faculty management, pending approvals, departments, platform analytics, strategic insights, contact page, and settings.
- Basic faculty account approval and institutional email verification.
- AI keyword generation support using the configured OpenAI key.
- Documentation landing page with search engine and CV upload reports.

The largest gaps are:

- No full governance workflow of draft -\> faculty-approved -\> admin-reviewed -\> public across every content type.
- No external inquiry workflow that routes partner questions to SCOUP/admin/OSP.
- No admin-to-faculty messaging workflow for missing information, profile problems, or follow-up.
- No faculty support ticket workflow.
- No search feedback loop for thumbs up/down, clicks, dwell time, or low-confidence tracking.
- Admin analytics are mostly dataset counts, not query intelligence or strategic foresight yet.
- Search confidence labels do not match the plan's bands exactly.
- Internal staff and student roles are not modeled as first-class application roles.
- Privacy, takedown, consent, audit trail, and quality gates are not fully implemented.

## 1. Conceptual Overview

### Plan

SCOUP should be a centralized knowledge and collaboration system that:

- Helps external stakeholders discover relevant SU faculty expertise, projects, and scholarly outputs.
- Helps internal faculty find collaborators and reduce duplicated effort.
- Provides confidence-calibrated results and interpretable rationales.
- Creates contact pathways that turn discovery into partnership.

### Current State

Implemented:

- Public search exists on the home page.
- Search returns faculty, papers, patents, and projects together.
- Results include confidence percentages and match summaries.
- Faculty and admin dashboards exist.
- There is a contact page with editable team/settings content.

Partial:

- Internal collaboration exists through a faculty network page, but the collaboration workflow is not yet a complete product loop.
- Contact pathways exist as mailto links and a contact page, but not as structured routed inquiries.
- Confidence percentages exist, but the labels and bands are not fully aligned with the plan.

Missing:

- No formal partner inquiry intake and routing process.
- No full collaboration suggestion workflow with tracked outcomes.
- No admin triage queue for external requests, support tickets, or faculty follow-up.

Assessment:

The discovery layer is real. The collaboration and routing platform is still incomplete.

## 2. Stakeholders and Roles

## External Users

### Plan

External users should:

- Search publications, applied projects, and faculty keywords.
- Use confidence percentages and "Why this result" explanations.
- Initiate collaboration through structured contact pathways.
- Reduce uncertainty in finding the right SU faculty or resource.

### Current State

Implemented:

- Public users can search without logging in.
- Search includes faculty, papers, patents, and projects.
- Results display confidence and match summaries.
- Faculty results show contact information when available.
- Paper results can link to DOI or source URLs.

Partial:

- Filters exist for Faculty, Papers, Patents, and Projects.
- The plan says the external portal should have three options: Papers, Projects, Faculty Keywords. Current filters are broader and not exactly the same.
- Result rationales exist, but they are technical match explanations rather than fully polished external-facing "Why this result" explanations.

Missing:

- No structured "Contact Faculty" or "Contact SCOUP" inquiry form attached to results.
- No routing to OSP, SCOUP Gmail, admin inbox, or liaison queue.
- No inquiry status tracking.
- No fallback path for faculty without public emails.

Recommendation:

Add an external inquiry workflow. Every result should support "Request connection" that creates a backend inquiry record and notifies the admin/SCOUP inbox.

## Faculty

### Plan

Faculty should:

- Maintain expertise profiles.
- Control visibility.
- Add self-defined keywords.
- Validate or reject AI-suggested keywords.
- Review and confirm papers/projects.
- Use SCOUP to discover collaborators.

### Current State

Implemented:

- Faculty login/signup exists.
- Faculty dashboard exists with Profile, Papers, Patents, Projects, Upload PDF, Analytics, Network, Badges, and Settings.
- Profile fields exist for bio, research interests, keywords, email, phone, office, photo, department, and related metadata.
- Papers, projects, patents, and authorship relationships exist in backend models.
- CV upload and paper confirmation endpoints exist.
- AI keyword generation endpoints/management command exist.
- Faculty profiles support `profile_visibility`.

Partial:

- Faculty can manage content, but the exact keyword stewardship flow is not fully normalized.
- There are separate fields for `faculty_keywords`, `ai_keywords`, raw `keywords`, `themes`, and `research_interests`.
- Search display merges keywords into "Research Interests", which is a frontend label rather than a clean domain model.
- Paper status exists, but the complete approval workflow is not consistent across faculty, papers, projects, patents, and profile edits.

Missing:

- No complete UI for faculty to approve/reject AI keyword suggestions as a durable workflow.
- No clear distinction in the user experience between faculty-entered keywords and AI-suggested keywords that faculty can accept/remove.
- No faculty support ticket system.
- No annual validation workflow.
- No explicit public/internal/private visibility controls per paper, project, patent, and keyword.

Recommendation:

Unify the keyword domain around one user-facing concept: "profile keywords". Store source metadata behind the scenes: faculty-entered, AI-suggested, imported, approved, rejected, hidden. Faculty should experience this as one editable keyword list with suggested terms they can approve or remove.

## Administrators

### Plan

Admins should:

- Govern public-facing accuracy and appropriateness.
- Review approvals.
- Monitor analytics such as frequent searches, low-confidence matches, and faculty adoption.
- Route external inquiries.
- Use aggregate data for strategic foresight.

### Current State

Implemented:

- Admin login exists.
- Admin dashboard exists.
- Admin dashboard sections include Overview, Faculty Management, Pending Approvals, Departments, Platform Analytics, Strategic Insights, Contact Page, and System Settings.
- Admin can approve/reject pending faculty accounts.
- Admin can manage schools/departments.
- Admin can edit contact page/team content.
- Admin can view high-level live dataset metrics.

Partial:

- Pending approvals currently focus on faculty accounts.
- Platform analytics currently show live public dataset counts, not behavior analytics.
- Strategic Insights exists as a page, but it is not yet backed by robust query analytics.

Missing:

- No admin inbox.
- No admin-to-faculty messaging.
- No external inquiry routing.
- No faculty support ticket queue.
- No query log table.
- No low-confidence search monitoring.
- No adoption dashboard by faculty profile completeness or keyword validation.
- No audit trail.
- No governance workflow across all content.
- Admin dashboard does not yet show admin name, role, or operational identity.

Recommendation:

The admin dashboard should become the operations center for SCOUP. It should show who the admin is, what needs review, what inquiries are new, which profiles are incomplete, and what search behavior is revealing.

## Internal Staff and Support Offices

### Plan

Internal support offices should:

- Help maintain clarity of project and profile content.
- Support project briefs, grant writing, student connections, and external engagement.
- Use SCOUP to facilitate connections.

### Current State

Implemented:

- No distinct internal staff role exists.

Partial:

- Admin users can manage some platform content and contact page data.

Missing:

- No OSP, center staff, marketing, career services, or support office role.
- No office-specific queues or permissions.
- No structured routing from external inquiry to the right support office.

Recommendation:

Do not build separate staff roles immediately unless needed. Start by adding admin inbox categories and assignees. Later, split admin permissions into support-office roles.

## Students

### Plan

Students are both developers and indirect users. They may discover projects, faculty mentors, or research assistantship opportunities.

### Current State

Implemented:

- No student role is modeled.

Partial:

- Public search could be used by students.

Missing:

- No student-facing project discovery mode.
- No student inquiry or join-project workflow.

Recommendation:

Keep student features out of the first governance pass. They can be added after external inquiry and faculty support workflows are stable.

## 3. System Architecture

## Front End

### External Portal

Plan:

- Single clean search bar.
- Three options: Papers, Projects, Faculty Keywords.
- Results with titles, descriptions, faculty affiliations, confidence, and contact pathways.

Current:

- Single search bar exists.
- Suggestions exist.
- Results page exists.
- Filters exist for Faculty, Papers, Patents, and Projects.
- Results display titles, descriptions/abstracts, faculty names, confidence, and match summaries.

Gaps:

- The filter model is not the same as the plan's Papers/Projects/Faculty Keywords modes.
- Faculty Keywords is not a distinct search mode.
- Contact pathway is mostly mailto, not a structured workflow.
- Result detail pages are limited or absent.

Recommendation:

Keep the four result types, because patents are useful. Add a visible search mode control:

- All
- Faculty Expertise
- Papers
- Projects
- Patents

"Faculty Expertise" should search faculty profile keywords, AI keywords, imported categories, departments, bio, and name.

### Faculty Portal

Plan:

- Secure login.
- Profile management.
- Add and validate keywords.
- Review and confirm papers/projects.
- Decide public vs internal-only.

Current:

- Secure login exists.
- Dashboard and profile management exist.
- Paper, patent, project, CV upload, analytics, network, badge, and settings sections exist.
- Paper confirmation and CV ingestion features exist.
- Visibility exists at least at the profile level.

Gaps:

- Keyword validation workflow is not yet clean enough.
- Public/internal-only controls are not complete across all content.
- Projects are present but not governed like the plan describes.
- AI keyword suggestions exist technically, but need to be productized in the faculty dashboard.

Recommendation:

Make the next faculty portal pass about governance and keyword stewardship, not more dashboard pages.

### Admin Dashboard

Plan:

- Governance.
- Visibility approvals.
- Analytics.
- Common searches.
- Low-confidence matches.
- Faculty adoption.

Current:

- Admin dashboard has relevant sections.
- Pending faculty approval exists.
- Dataset counts exist.
- Contact page editing exists.

Gaps:

- No workflow inbox.
- No message center.
- No search analytics.
- No low-confidence monitoring.
- No adoption quality scoring.
- No content quality gates.

Recommendation:

Add an admin home page centered on work queues:

- Pending faculty approvals.
- Pending profile/content reviews.
- New external inquiries.
- Faculty support tickets.
- Profiles missing keywords.
- Papers/projects missing summaries.
- Low-confidence search queries.
- AI keywords needing review.

## Middle Layer: Intelligent Search Engine

### Query Understanding

Plan:

- Interpret user intent.
- Recognize papers vs projects vs keywords.
- Expand synonyms and related terms.

Current:

- Query is normalized into phrase plus meaningful words.
- Stopwords are removed.
- Suggestions are generated on the frontend using public dataset terms.
- Search handles exact phrase, all terms, fuzzy name/title, author, keywords, context, department, and semantic paper embeddings.

Gaps:

- No true synonym expansion.
- No query intent classifier.
- Search mode is controlled by frontend filters after results are returned, not by a backend query intent parameter.

Recommendation:

Do not add a complex intent classifier yet. Add an optional backend `type` parameter first, then add synonyms for common academic/business terms later.

### Hybrid Matching

Plan:

- Keyword matching plus semantic matching.

Current:

- Implemented.
- Lexical evidence wins over semantic evidence.
- Semantic matching currently applies to papers with stored embeddings.

Gaps:

- Semantic matching does not appear to cover faculty, projects, or patents yet.
- Synonym expansion is missing.

Recommendation:

Keep lexical-first scoring. Extend embeddings only after confidence calibration and analytics are stable.

### Ranking and Calibration

Plan:

- Very Likely: 90-100.
- Likely: 70-89.
- Possibly Related: less than 70.

Current:

- Backend scores are evidence-based.
- Results are sorted by confidence.
- Ties prefer papers, then faculty, then patents, then projects.
- Frontend labels are:
  - High Match: 80+
  - Good Match: 60-79
  - Moderate Match: below 60

Gaps:

- UI labels do not match PRD bands.
- Some search behavior will still depend heavily on score thresholds and tie ordering.
- Exact department matches are intentionally lower than exact title/name/keyword matches, which is reasonable, but this must be documented so expectations are clear.

Recommendation:

Change frontend labels to match the PRD:

- 90-100: Very Likely
- 70-89: Likely
- 40-69: Possibly Related

Keep the backend scores evidence-based.

### Explainability and Feedback

Plan:

- One-line rationale.
- Feedback through thumbs up/down, clicks, dwell time.

Current:

- One-line match summaries exist.
- `matchEvidence` exists in backend response.

Gaps:

- No user feedback.
- No click tracking.
- No dwell tracking.
- No search analytics model.

Recommendation:

Add a `SearchEvent` model and endpoints before building advanced analytics UI. Capture query, filters, result ids, confidence, clicked result, feedback, user type, and timestamp.

## Backend Data and Governance

### Data Domains

Plan:

- Faculty profiles.
- Keywords.
- Projects.
- Publications.

Current:

- Faculty, Paper, Project, Patent models exist.
- Schools and departments exist.
- Contact team/settings exist.
- Paper authorship model exists.
- Faculty suggestion decision model exists.

Gaps:

- Keywords are not a first-class normalized model.
- Projects have simple fields and status but no full governance lifecycle.
- External inquiries, tickets, messages, audit logs, and search logs are missing.

Recommendation:

The next backend models should be operational models, not more content fields:

- ExternalInquiry.
- FacultySupportTicket.
- AdminFacultyMessage.
- SearchEvent.
- ContentReview/AuditLog.

### Governance Rules

Plan:

- Default private.
- Approval workflow: draft -\> fOkay. Thank you. So a lot was done over these past couple of sessions that we had. I'm trying to compile a summary because it's for my evaluation as opposed to have a summary of the task and progress this week. So I just want to yeah. I want that listed so that I can pick and choose which one I want to include.aculty-approved -\> admin-reviewed -\> public.
- Quality gates for title, summary, contact info.

Current:

- Faculty has `profile_visibility`, `is_approved`, `review_status`, and `confirmed_su_faculty`.
- Paper has `status` with draft, published, in-review.
- Faculty signup approval exists.

Gaps:

- Existing imported papers default to published.
- Projects and patents do not have matching approval fields.
- Faculty profile edits do not appear to enter an admin review workflow.
- No quality gate enforcement.
- No audit trail.

Recommendation:

Implement one shared review pattern across profiles, papers, projects, patents, and keywords. Avoid one-off approval logic for each content type.

### Refresh and Integration Cycles

Plan:

- Publications refreshed weekly.
- Projects updated as status changes.
- Keywords updated immediately after faculty approval.

Current:

- CV upload, external paper search, and AI generation exist.
- No evidence of scheduled weekly refresh in the inspected files.

Gaps:

- No scheduled ingestion/refresh jobs.
- No visible freshness dashboard.
- No stale profile reminders.

Recommendation:

Add management commands first, then schedule them later. Admin dashboard should show last refresh times.

### Privacy and Access

Plan:

- Role-based access.
- Consent and takedown.

Current:

- Faculty/admin login exists.
- JWT/auth API exists.
- Admin-only endpoints exist.
- Profile visibility exists.

Gaps:

- No takedown request workflow.
- No consent history.
- No audit trail.
- No internal-only visibility model across content.

Recommendation:

Fold privacy into the same governance/audit work rather than treating it as a separate UI-only setting.

## 4. User Journey Comparison

## External Business Executive

Plan journey:

Searches supply chain, selects Projects, sees project lead and related keywords, submits contact request routed through OSP.

Current ability:

- Can search.
- Can filter projects.
- Can see project lead, description, status, start date, and keywords.

Missing:

- No structured contact request.
- No OSP/admin routing.
- No inquiry status.

Status: Partial.

## Internal Faculty Member

Plan journey:

Searches for related keywords, finds colleagues across departments, receives collaboration suggestion, forms team.

Current ability:

- Can search.
- Faculty network page exists.
- Faculty profiles and keywords exist.

Missing:

- No formal collaboration suggestion workflow.
- No tracked connection or team formation flow.
- No internal-only search mode.

Status: Partial.

## Administrator

Plan journey:

Admin sees common searches and low coverage, uses analytics to guide strategy.

Current ability:

- Admin sees counts of faculty, papers, patents, projects, and top departments.
- Strategic Insights page exists.

Missing:

- No query analytics.
- No low-confidence query monitoring.
- No external demand trends.
- No faculty adoption tracking.

Status: Mostly missing, with UI shell present.

## Student

Plan journey:

Student builds part of SCOUP and discovers a project through the portal.

Current ability:

- Student can use public search.

Missing:

- No student role.
- No project participation workflow.

Status: Not implemented as a formal product feature.

## 5. Implementation Timeline Comparison

## Fall 2025 Targets

Plan:

- Analyze current paper-to-keyword system.
- Design faculty/project schema.
- Implement project database pilot.
- Extend keyword generation to project descriptions.
- Draft governance workflow.
- Build faculty portal prototype.
- Design AI/self keyword merge rules.
- Pilot with faculty.

Current status:

- Faculty/project schema exists.
- Project model exists.
- Faculty portal exists beyond prototype.
- AI keyword generation exists for faculty.
- Keyword fields exist, but merge/stewardship rules need product cleanup.
- Governance workflow is partial.
- Pilot support is not fully represented in the app.

Assessment:

Content and portal work is ahead of the plan in some areas. Governance and pilot workflow are behind.

## Spring 2026 Targets

Plan:

- Refine keyword pipeline.
- Implement confidence calibration bands.
- Build search portal with percentage and rationale.
- Expand faculty portal with project linking and visibility.
- Prototype admin console approval queue.

Current status:

- Search portal exists.
- Percentages and rationale exist.
- Faculty portal exists.
- Project linking exists through faculty/project relation.
- Admin approval queue exists for faculty.
- Confidence bands exist, but not PRD-aligned in UI.
- Keyword pipeline exists but needs stewardship cleanup.

Assessment:

Spring feature surface is mostly present, but quality, calibration, and governance depth need work.

## Summer 2026 Targets

Plan:

- Prepare at least 1,000 papers and validated keywords.
- Ingest at least 100 projects.
- Train faculty.
- Pilot with 5-10 external organizations.
- Track findability, trust, and routing.

Current status:

- Dataset exists, but exact counts should be verified against production data.
- Projects exist, but volume and validation status need verification.
- No faculty training workflow.
- No external pilot workflow.
- No metrics for findability, trust, or routing.

Assessment:

The app is not yet ready for the Summer 2026 pilot as described because routing and measurement are missing.

## 6. Risk and Mitigation Comparison

## Faculty Workload

Plan mitigation:

- Automate imports.
- Require minimal manual input.

Current:

- CV upload, external paper search, AI bio/keyword generation, and profile tools help reduce workload.

Gap:

- Keyword approval should be faster and clearer.

## Data Accuracy and Privacy

Plan mitigation:

- Faculty validation before public visibility.
- Admin oversight.

Current:

- Faculty approval exists.
- Profile visibility exists.
- Paper statuses exist.

Gap:

- Full validation before public visibility is not consistently enforced.

## Adoption Resistance

Plan mitigation:

- Start with early adopters and showcase wins.

Current:

- No adoption workflow or dashboard.

Gap:

- Admin dashboard should show profile completeness, faculty activation, keyword validation, and stale profiles.

## Technical Constraints

Plan mitigation:

- Scope realistically, focus core features first.

Current:

- Many features exist, but the product surface is broad.

Gap:

- Focus should now move from adding pages to completing core loops: search, governance, communication, analytics.

## External Perception

Plan mitigation:

- Confidence scores and "Why this result".

Current:

- Implemented in basic form.

Gap:

- Need feedback collection and low-confidence monitoring to improve trust.

## 7. Admin Dashboard Design Direction

The admin dashboard should show basic admin information. It does not need to be elaborate, but it should identify the logged-in admin and make their responsibilities obvious.

Recommended admin header:

- Admin name.
- Role, such as SCOUP Administrator.
- Last login or current session indicator.
- Quick actions: Review approvals, View inquiries, Message faculty, Export report.

Recommended dashboard sections:

- Work Queue: pending faculty approvals, profile review requests, paper/project review, external inquiries, faculty support tickets.
- Data Quality: missing emails, missing keywords, missing summaries, unverified institutional emails, profiles without departments.
- Search Quality: top searches, no-result searches, low-confidence searches, clicked results, feedback.
- Faculty Adoption: active faculty accounts, profiles completed, AI keywords reviewed, papers confirmed.
- Strategic Insights: emerging topics, high-demand external queries, department coverage gaps.
- Communications: external inquiries, faculty messages, support tickets, resolved history.

This would make the admin dashboard match the plan more closely than adding isolated UI widgets.

## 8. Recommended Build Order

## Phase 1: Align Search and Documentation

- Keep backend search.
- Align frontend confidence labels with PRD bands.
- Add a backend search `type` or `scope` parameter instead of filtering only after results return.
- Keep the search report updated.
- Add this implementation-plan comparison to the documentation page.

## Phase 2: Normalize Keywords

- Treat all user-facing profile terms as "keywords".
- Store source and status behind the scenes:
  - faculty-entered
  - AI-suggested
  - imported
  - approved
  - rejected
  - hidden
- Move away from confusing frontend labels where keywords are shown as "Research Interests" unless that is explicitly the desired product label.

## Phase 3: Governance Workflow

- Add consistent review status across profiles, papers, projects, patents, and keywords.
- Add quality gates.
- Add audit log.
- Make default-private behavior explicit.

## Phase 4: Communications

- Add external inquiry form and backend model.
- Add admin inbox.
- Add admin-to-faculty messages.
- Add faculty support tickets.
- Add notification emails after the records exist.

## Phase 5: Analytics and Feedback

- Add search event logging.
- Add result click tracking.
- Add thumbs up/down feedback.
- Add low-confidence and no-result query reports.
- Add faculty adoption metrics.

## Phase 6: Pilot Readiness

- Verify dataset targets.
- Verify project count and quality.
- Create pilot reporting dashboards.
- Add exportable reports.
- Prepare faculty training checklist.

## Bottom Line

The current system is a good technical foundation for SCOUP, especially around search and profile/content management. The implementation plan, however, expects SCOUP to be an operational collaboration system. The next major work should not be another search tweak or another dashboard card. It should be the missing product loops:

- Keyword stewardship.
- Governance and approval.
- External inquiry routing.
- Admin/faculty communication.
- Search feedback and analytics.

Those are the pieces that move SCOUP from "searchable database" to the platform described in the implementation plan.
