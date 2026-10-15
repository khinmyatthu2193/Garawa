# Garawa --- Software Requirements Specification (SRS)

**Version:** 0.1\
**Status:** Draft\
**Product:** ဂါရဝ (Garawa)\
**Purpose:** Define initial software behavior and quality requirements
for the Garawa MVP.

## 1. Introduction

### 1.1 Purpose

This document specifies the functional and non-functional requirements
for Garawa, a mobile-first website for creating and sharing personalized
digital ကန်တော့ experiences inspired by Myanmar traditions.

### 1.2 Scope

The MVP allows a sender to create an offering, select virtual items,
write a message, preview the result, publish it, and share a unique
link. A recipient can open the link, view the offering and message, and
optionally submit a short response.

Real-money payments, physical delivery, and mandatory user accounts are
outside the MVP scope.

### 1.3 Definitions

-   **Offering:** A saved digital ကန်တော့ created by a sender.
-   **Sender:** The person creating and sharing an offering.
-   **Recipient:** The person receiving and viewing the shared offering.
-   **Virtual item:** A symbolic digital representation of a gift or
    offering.
-   **Share token:** A unique, hard-to-guess identifier used to open an
    offering.
-   **MVP:** Minimum viable product.

## 2. Overall Description

### 2.1 Product perspective

Garawa is a web application accessed through a browser. The initial
deployment may use a modern React framework and a hosted database, but
implementation choices remain subject to confirmation.

### 2.2 User classes

1.  **Sender:** Creates and shares offerings; no account is required in
    the initial flow.
2.  **Recipient:** Opens a shared link and optionally submits a
    response; no account is required.
3.  **Maintainer:** Manages the application and catalog through the
    implementation environment. A public admin interface is not required
    for the MVP.

### 2.3 Operating environment

-   Current versions of major mobile and desktop browsers.
-   Mobile-first responsive layouts.
-   Internet connection required to create and retrieve saved offerings.
-   Burmese Unicode text support is required.

### 2.4 Constraints

-   The initial product must not imply that virtual items are physical
    purchases.
-   The MVP must not collect or transfer real money.
-   Shared links may be forwarded by recipients; privacy messaging must
    explain link access.
-   The application must not expose server secrets to the client.

### 2.5 Assumptions and dependencies

-   A curated set of offering item names and images will be provided or
    created.
-   A hosting and persistence strategy will be selected before
    implementation.
-   Burmese wording and cultural presentation will be reviewed by people
    familiar with the customs represented.
-   External messaging apps may be used by the sender to share links,
    but their availability is not guaranteed by Garawa.

## 3. Functional Requirements

### FR-01: Display landing page

**Description:** The system shall introduce Garawa and provide a clear
path to create an offering.

**Acceptance criteria:** - The page displays the product name and
purpose. - The page includes a primary create action. - The page clearly
describes the experience as a digital offering. - The page is usable on
mobile and desktop.

### FR-02: Enter offering details

**Description:** The system shall allow a sender to enter the
recipient's display name, sender's display name, and message.

**Acceptance criteria:** - Required fields are clearly identified. -
Empty or invalid required fields produce helpful validation messages. -
User-entered content is displayed as text and is not executed as HTML or
script. - The sender can correct entries before publishing.

### FR-03: Select virtual items

**Description:** The system shall display a catalog of virtual offering
items and allow the sender to select items.

**Acceptance criteria:** - Each item has a visible name and visual
representation. - Selected and unselected states are distinguishable. -
The selected items are reflected in the preview and published
offering. - The interface does not claim that selected items are
physically delivered.

### FR-04: Preview offering

**Description:** The system shall let the sender review the offering
before publication.

**Acceptance criteria:** - The preview includes recipient name, sender
name, selected items, and message. - The sender can return to editing
without restarting the process. - Published content matches the
confirmed preview, except for recipient-side animation or presentation.

### FR-05: Publish offering

**Description:** The system shall save a valid offering and create a
unique share token.

**Acceptance criteria:** - The system validates required data before
saving. - The system generates a unique, hard-to-guess token. - A share
link is displayed only after successful persistence. - If saving fails,
the system reports the failure and does not falsely indicate success. -
Secrets and internal database credentials are never included in the
share URL.

### FR-06: Retrieve shared offering

**Description:** The system shall retrieve and display an offering using
its share token.

**Acceptance criteria:** - A valid link displays the correct offering. -
An invalid or unavailable link displays a friendly error state. - The
recipient does not need to create an account for the MVP. - The page
does not expose unrelated offerings or internal database records.

### FR-07: Present recipient ceremony

**Description:** The system shall display the offering through a warm,
guided recipient experience.

**Acceptance criteria:** - The recipient sees a welcome message and the
relevant names. - The selected items and sender's message are
readable. - Animations do not block access to essential content. - A
skip or reduced-motion path is available. - The page remains usable if
decorative assets fail to load.

### FR-08: Share link

**Description:** The system shall make it easy for the sender to copy
and share the offering URL.

**Acceptance criteria:** - A copy-link action is available. - The
interface confirms a copy action only when the browser reports
success. - Where supported, native sharing may be offered. - The raw
link remains available for manual copying if native sharing is
unavailable.

### FR-09: Submit recipient response

**Description:** The system shall allow the recipient to optionally
submit a short thank-you or blessing.

**Acceptance criteria:** - The response is optional. - The system
validates length and treats content as plain text. - The system displays
a success message only after the response is saved. - The interface
explains whether the response can be viewed by the sender. - Rate
limiting or another basic abuse-prevention mechanism is applied if the
response endpoint is publicly accessible.

### FR-10: Handle errors and loading

**Description:** The system shall communicate loading, success, and
error states.

**Acceptance criteria:** - Save and fetch operations display appropriate
loading feedback. - Errors are described in understandable language. -
Recoverable failures provide a retry path where appropriate. - Repeated
submission does not create unintended duplicate records where avoidable.

## 4. Data Requirements

A proposed logical model is listed below. Exact database schema and
retention rules must be confirmed before implementation.

### 4.1 Offering

-   `id`: internal unique identifier.
-   `share_token`: unique, unguessable public token.
-   `recipient_name`: required display name.
-   `sender_name`: required display name.
-   `message`: required or configurable personal message.
-   `wishes`: optional text.
-   `selected_items`: references to catalog items or validated item
    identifiers.
-   `created_at`: creation timestamp.
-   `status`: active or revoked, if revocation is supported.

### 4.2 Offering catalog item

-   `id`: unique identifier.
-   `name_my`: Burmese display name.
-   `name_en`: optional English display name.
-   `description`: optional short description.
-   `image_path`: reference to an approved visual asset.
-   `is_active`: whether the item can be selected.

### 4.3 Recipient response

-   `id`: unique identifier.
-   `offering_id`: reference to the offering.
-   `message`: short response text.
-   `created_at`: timestamp.

**Data rules:** - Store only the minimum information needed for the
experience. - Do not collect recipient phone numbers or physical
addresses in the MVP. - Define message length limits and data retention
before launch. - Do not place private management credentials in
browser-visible code. - Access to responses and offering management must
follow the final privacy policy.

## 5. External Interface Requirements

### 5.1 User interface

-   Burmese-first content, with English support planned.
-   Responsive layout and touch-friendly controls.
-   Clear form labels and validation messages.
-   Consistent cultural visual language without excessive decoration.
-   Readable typography and adequate color contrast.

### 5.2 Browser and device

-   Support current major browsers on common mobile and desktop
    operating systems.
-   Core content must remain available if animation or optional audio is
    unavailable.
-   No audio autoplay; optional sound must have an explicit user
    control.

### 5.3 External services

Potential services include a hosting provider, database, and optional
native share API. Exact providers are not requirements until the stack
is selected.

## 6. Non-Functional Requirements

### NFR-01: Usability

A first-time sender should be able to complete the core creation flow
without needing a tutorial.

### NFR-02: Performance

-   Main content should appear promptly on typical mobile connections.
-   Optimize images and decorative assets.
-   Load non-essential animations and assets without blocking the core
    content.

### NFR-03: Reliability

-   Saved offerings must be retrievable from their valid share links.
-   Save failures must not be presented as success.
-   Invalid links must not crash the application.

### NFR-04: Security

-   Validate and sanitize input appropriately; render user messages as
    text.
-   Use unguessable share tokens.
-   Keep database service credentials and other secrets server-side.
-   Apply access controls to any private operations.
-   Apply abuse prevention to public submission endpoints.
-   Do not introduce payment handling into the MVP.

### NFR-05: Privacy

-   Explain that anyone with the link may be able to view the offering.
-   Collect minimal data.
-   Define retention, deletion, and link revocation behavior before
    production.
-   Avoid unnecessary third-party tracking.

### NFR-06: Accessibility

-   Provide keyboard-operable controls and visible focus states.
-   Use meaningful labels and alternative text.
-   Support reduced motion.
-   Keep text readable and tap targets comfortable.
-   Ensure essential information is not communicated through color or
    animation alone.

### NFR-07: Maintainability

-   Keep offering catalog data separate from presentation where
    practical.
-   Use reusable components for forms, item selection, and recipient
    presentation.
-   Document required environment variables and setup steps.
-   Keep configuration and secrets out of source control.

### NFR-08: Localization

-   Burmese Unicode must render correctly.
-   Layouts must accommodate Burmese text wrapping.
-   User-facing strings should be organized to make English localization
    possible.

## 7. Business Rules

-   BR-01: An offering must include a recipient name, sender name, and
    message before publication, unless product decisions later make the
    message optional.
-   BR-02: Only approved catalog items may be selected.
-   BR-03: A share token must identify one offering only.
-   BR-04: The initial version represents items digitally; no physical
    delivery is implied.
-   BR-05: Any response or future မုန့်ဖိုး interaction must be optional and
    must not pressure recipients or senders.
-   BR-06: A valid shared link may be forwarded; the UI must communicate
    this limitation unless access control is implemented.
-   BR-07: The product must not claim a save, copy, or submission
    succeeded until the relevant operation reports success.

## 8. Error Conditions

-   Missing required form values.
-   Message exceeds the allowed length.
-   No catalog items selected, if selection is required.
-   Network failure during save or retrieval.
-   Invalid, revoked, or expired share token.
-   Catalog item is no longer available.
-   Clipboard or native share feature is unavailable.
-   Recipient response submission fails.
-   Decorative image or animation asset fails to load.

Each condition must produce a safe, understandable state and must not
expose stack traces, secrets, or private records to the user.

## 9. Verification and Test Plan

-   Unit tests for form validation, token handling, and item selection.
-   Integration tests for saving and retrieving an offering.
-   End-to-end test for create → preview → publish → open link → submit
    response.
-   Negative tests for invalid tokens, missing fields, excessive message
    length, and network errors.
-   Responsive checks on common mobile and desktop widths.
-   Accessibility checks for keyboard navigation, focus, contrast, and
    reduced motion.
-   Burmese text rendering checks across supported browsers.
-   Security review of public endpoints, token generation, and input
    handling.

## 10. MVP Completion Criteria

The MVP is acceptable for a limited release when: 1. All critical
functional requirements are implemented. 2. A sender can publish and
share an offering successfully. 3. A recipient can open the link and
view the correct content. 4. Optional response behavior is clearly
explained and works reliably. 5. Core flows work on mobile and desktop.
6. Error, loading, and invalid-link states are implemented. 7. Basic
privacy, accessibility, and security checks pass. 8. The interface does
not imply real-world purchases, delivery, or payment.

## 11. Decisions Required Before Implementation

-   Final framework, database, and hosting choices.
-   Whether offering creation requires persistence in the first
    prototype.
-   Message and wishes length limits.
-   Link expiry, revocation, and deletion behavior.
-   How sender identity is verified if recipients can reply.
-   Whether recipient responses are shown to senders and how.
-   Final Burmese/English language strategy.
-   Final visual identity, fonts, illustrations, and audio policy.
-   Whether a future real-money မုန့်ဖိုး feature is ever in scope.
