# Garawa --- Product Requirements Document (PRD)

**Status:** Draft / discovery\
**Product name:** ဂါရဝ (Garawa)\
**Product type:** Mobile-first, shareable digital offering website\
**Primary occasion:** Thadingyut; potentially usable for other
respectful occasions\
**Document note:** This PRD captures the current concept. Items marked
"decision needed" should be confirmed before implementation.

## 1. Product Summary

Garawa helps people express respect, gratitude, and affection to
parents, grandparents, teachers, elders, and loved ones when they cannot
visit in person. A sender creates a personalized digital ကန်တော့, chooses
virtual offerings, writes a message, and shares a unique link. The
recipient opens the link to experience a warm, guided reveal of the
offerings and message, then may respond with a thank-you or blessing.

Garawa should feel distinctly Myanmar, warm, cute, thoughtful, and easy
to use---not like a generic greeting-card generator.

## 2. Problem

People living or studying away from family and respected elders may be
unable to visit and pay respects in person during Thadingyut or other
occasions. A plain text message may not communicate the care and
ceremony they want to express. Garawa gives them a simple, personal,
shareable way to create a small digital ceremony.

## 3. Goals

1.  Make creating a digital offering simple enough to complete in a few
    minutes.
2.  Make opening the recipient link feel personal, welcoming, and
    celebratory.
3.  Reflect Myanmar traditions through visual design and language.
4.  Make the experience work well on mobile devices and common messaging
    apps.
5.  Make the privacy and limitations of a digital offering clear.
6.  Keep playful features, including မုန့်ဖိုး, optional and pressure-free.

## 4. Non-Goals for the Initial MVP

-   Purchasing or delivering physical goods.
-   Processing real-money payments or transferring actual မုန့်ဖိုး.
-   Public social feeds or a searchable directory of offerings.
-   User accounts, follower systems, or a complex sender dashboard
    unless required.
-   AI-generated messages or images.
-   A full e-commerce system.

## 5. Target Users

### Primary sender

A student, young adult, or family member who lives far away and wants to
pay respect to an elder.

**Needs:** easy creation, meaningful personalization, attractive
presentation, simple sharing.

### Primary recipient

A parent, grandparent, teacher, or elder who receives the link,
potentially on a phone and potentially with limited technical
confidence.

**Needs:** clear instructions, readable text, large tap targets, minimal
setup, a warm and understandable experience.

### Secondary sender

Someone creating a digital ကန်တော့ for multiple people or occasions.

**Needs:** ability to create separate personalized links; bulk creation
can be considered later.

## 6. Core User Journey

1.  Sender visits Garawa.
2.  Sender selects **Create a ကန်တော့**.
3.  Sender enters the recipient's name and their own display name.
4.  Sender chooses virtual offering items from a curated catalog.
5.  Sender writes a personal message and optional wishes.
6.  Sender previews the recipient experience.
7.  Sender creates the offering and receives a unique link.
8.  Sender shares the link through Messenger, Telegram, Viber, or
    another app.
9.  Recipient opens the link and sees a personalized welcome.
10. Recipient reveals the offering, views the selected items, and reads
    the sender's message.
11. Recipient optionally sends a thank-you or blessing response.

## 7. MVP Features and Requirements

### F-01: Landing page

-   Explain Garawa in simple Burmese-first language.
-   Provide a prominent create action.
-   Introduce the cultural purpose and clarify that offerings are
    digital.
-   Present a responsive layout and an inviting Thadingyut-inspired
    visual theme.

### F-02: Offering creation

-   Collect recipient display name and sender display name.
-   Allow selection of one or more virtual offering items.
-   Allow the sender to write a personal message.
-   Support optional blessings or wishes.
-   Validate required fields and show helpful error messages.
-   Preserve entered values while moving between creation steps.

### F-03: Offering catalog

-   Show a curated catalog of illustrated virtual items, such as
    flowers, fruit, traditional snacks, or symbolic gifts.
-   Display each item's name and optional short description.
-   Make selection state visually clear.
-   Do not imply that an item is physically purchased or delivered.

### F-04: Preview

-   Let the sender review names, items, and message before publishing.
-   Allow the sender to return to editing.
-   Ensure the preview closely matches the recipient page.

### F-05: Unique shareable link

-   Create a unique, hard-to-guess identifier for each offering.
-   Show the link with a clear copy action and share action where
    supported.
-   Show a success state only after the offering has actually been
    saved.
-   Avoid exposing private database identifiers or administrative
    credentials.
-   Define link expiration, deletion, and access rules before launch
    (decision needed).

### F-06: Recipient experience

-   Load the offering from the unique link.
-   Show the recipient's name, sender's name, and a warm introduction.
-   Reveal the offering items and personal message in a clear sequence.
-   Provide a reduced-motion or skip-animation path.
-   Handle invalid, unavailable, or expired links gracefully.

### F-07: Recipient response

-   Allow a simple optional thank-you or blessing response.
-   Explain whether the response is stored and whether the sender can
    see it.
-   Prevent duplicate submissions where practical.
-   Do not require a recipient account for the MVP unless later
    requirements change.

### F-08: Responsive and accessible design

-   Support common mobile, tablet, and desktop widths.
-   Use readable Burmese fonts and line spacing.
-   Use accessible labels, keyboard navigation, focus states, sufficient
    contrast, and large touch targets.
-   Respect reduced-motion preferences.
-   Do not autoplay audio; if audio is added later, provide clear
    controls.

### F-09: Basic error and loading states

-   Show loading feedback while saving or retrieving an offering.
-   Explain network errors in plain language and provide a retry action
    when safe.
-   Do not lose form input unnecessarily after a recoverable error.

## 8. UX and Visual Direction

**Personality:** heartfelt, respectful, cute, festive, warm, lightly
playful.

**Visual ingredients:** glowing lanterns, lotus flowers, subtle Myanmar
patterns, offering trays, traditional snack and fruit illustrations,
cream backgrounds, golden accents, lacquer red, and leafy green.

**Guidelines:** - Keep content uncluttered and actions obvious. - Use
animations to enhance the ceremony, not slow it down. - Keep the
cultural meaning of ကန်တော့ central. - Use humor gently; never pressure
recipients to send money. - Design for a recipient who may not be
familiar with modern web apps.

## 9. Success Metrics

For an early MVP, track privacy-conscious aggregate measures where
feasible: - Offering creation completion rate. - Percentage of created
offerings that are successfully opened. - Recipient page load success
rate. - Share-link copy/share action rate. - Recipient response rate. -
Mobile usability issues and user-reported confusion.

Do not add invasive tracking or collect unnecessary personal data merely
to measure success.

## 10. Privacy, Safety, and Trust

-   Collect only the data needed to create and display an offering.
-   Do not ask for recipient phone numbers, addresses, or account
    credentials in the MVP.
-   Explain that anyone with the share link may be able to view the
    offering unless access controls are added.
-   Use unguessable link identifiers and server-side authorization for
    any private management actions.
-   Protect against script injection by treating user messages as text,
    not executable HTML.
-   Add rate limiting or abuse prevention if public endpoints are
    introduced.
-   Define retention and deletion behavior before launch.
-   Never store payment credentials. Real-money payments are out of
    scope for the MVP.
-   Do not describe virtual gifts as physical purchases or real
    transfers.

## 11. Proposed MVP Scope

**Include:** landing page, creator flow, virtual item catalog, message
entry, preview, persistent offering, unique link, recipient reveal page,
optional response, responsive design.

**Exclude initially:** accounts, payment processing, physical delivery,
real-money မုန့်ဖိုး, multi-recipient campaign tools, public gallery.

## 12. Open Product Decisions

1.  Is the MVP for Thadingyut only, or should it support birthdays,
    teacher appreciation, and other occasions from the start?
2.  Should offerings be stored in a database, or is a simpler prototype
    sufficient initially?
3.  Should the sender be able to edit or delete an offering after
    sharing?
4.  Should links expire, remain available indefinitely, or be
    configurable?
5.  Should recipients' responses be visible to the sender, and how
    should the sender retrieve them?
6.  Is "မုန့်ဖိုး" only a playful symbolic interaction in the MVP, or is a
    real payment feature a future product goal?
7.  Which Burmese font and illustration style should define the brand?
8.  Should the experience be Burmese-first with English support, or
    fully bilingual from the first release?

## 13. Release Acceptance Criteria

The MVP is ready for a small user test when: - A sender can create an
offering with valid required information. - The sender can select items,
write a message, preview, and publish. - A unique link opens the correct
offering on another device. - The recipient can understand the page
without instructions from the sender. - Invalid links and network errors
show helpful states. - The experience works on mobile and desktop. -
Burmese text renders correctly. - No real payment is requested or
implied. - Basic accessibility, privacy, and input-safety checks pass.
