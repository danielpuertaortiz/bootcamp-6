<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles:
	- Template Principle 1 -> I. Product Scope Fidelity
	- Template Principle 2 -> II. API-Backed Data Integrity
	- Template Principle 3 -> III. Code Quality and Maintainability
	- Template Principle 4 -> IV. Test-First Verification
	- Template Principle 5 -> V. Accessible, Themed, Consistent UX
- Added sections:
	- Architecture and Scope Constraints
	- Delivery Workflow and Quality Gates
- Removed sections: None
- Templates requiring updates:
	- ✅ updated: .specify/templates/plan-template.md
	- ✅ updated: .specify/templates/spec-template.md
	- ✅ updated: .specify/templates/tasks-template.md
	- ⚠ pending: .specify/templates/commands/*.md (directory not present)
- Follow-up TODOs:
	- None
-->

# Bootcamp 6 Constitution

## Core Principles

### I. Product Scope Fidelity
All feature work MUST map directly to documented functional requirements and
MUST preserve declared out-of-scope boundaries unless the requirements
documentation is explicitly amended first. For this project, advanced features
such as multi-user auth, reminders, bulk operations, and search MUST NOT be
implemented as incidental additions. Rationale: controlled scope keeps delivery
predictable and protects instructional goals.

### II. API-Backed Data Integrity
Frontend behavior that creates, updates, toggles, or deletes todos MUST persist
through the backend API and remain consistent after page refresh. Client-only
state that diverges from backend truth for core todo operations is prohibited.
Rationale: durability and contract consistency are baseline expectations for a
full-stack todo application.

### III. Code Quality and Maintainability
Code MUST follow documented style and structure rules: 2-space indentation,
descriptive naming, organized imports, single-responsibility modules, and
clear error handling for fallible operations. Solutions SHOULD favor KISS and
DRY patterns, and any intentional deviation MUST be justified in plan or PR
notes. Rationale: maintainability and readability are required for team
collaboration and bootcamp learning outcomes.

### IV. Test-First Verification
Behavioral changes MUST include automated tests in the relevant package
(frontend and/or backend) with unit or integration coverage appropriate to the
change. New or changed behavior MUST be represented by failing tests before or
alongside implementation, and all repository tests MUST pass before merge.
Coverage expectations target 80% or higher across packages, with critical user
flows prioritized. Rationale: tests are the primary safeguard against
regression and undocumented behavior drift.

### V. Accessible, Themed, Consistent UX
UI work MUST preserve the defined visual system: Halloween-themed Material
inspiration, light/dark mode support, clear typography hierarchy, and
responsive single-column layout constraints. Interactive controls MUST remain
keyboard accessible with visible focus states and WCAG AA contrast intent.
Rationale: usability, accessibility, and visual consistency are product-level
requirements, not optional polish.

## Architecture and Scope Constraints

- The codebase MUST remain a JavaScript monorepo using npm workspaces with
	React frontend in packages/frontend and Express backend in packages/backend.
- Core domain remains a single-user todo app with title and optional due date,
	including create, list, edit, toggle complete, and delete with confirmation.
- End-to-end testing is out of scope by default; unit and integration tests are
	the mandatory baseline unless this constitution is amended.

## Delivery Workflow and Quality Gates

- Plans MUST include a Constitution Check section and address all five
	principles before implementation begins.
- Specifications MUST define independent user scenarios, edge cases, functional
	requirements, and measurable outcomes aligned to this constitution.
- Task lists MUST map work to user stories, include explicit file paths, and
	include required verification tasks for behavioral changes.
- Pull requests MUST confirm: tests executed, no unresolved requirement-scope
	conflicts, and UX/accessibility impacts reviewed when UI is changed.

## Governance

This constitution supersedes conflicting ad hoc practices for this repository.
Amendments require: (1) a documented rationale, (2) synchronization of impacted
templates and guidance files, and (3) semantic version updates recorded here.

Versioning policy:
- MAJOR: incompatible governance changes or principle removals/redefinitions.
- MINOR: new principle or materially expanded mandatory guidance.
- PATCH: clarifications, wording improvements, and non-semantic corrections.

Compliance review is required in planning and pull request review. Any
deliberate temporary exception MUST be documented with owner, scope, and expiry
date in the relevant plan or pull request.

**Version**: 1.0.0 | **Ratified**: 2026-06-13 | **Last Amended**: 2026-06-13
