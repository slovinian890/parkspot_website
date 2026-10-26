# ParkSpot — marketing site

Pre-launch landing page for **ParkSpot**, a peer-to-peer parking marketplace.
The site's single job is to convert visitors into waitlist signups before the
app ships.

Repo: `github.com/slovinian890/parkspot_website`

---

## The product this page promotes

ParkSpot is a mobile app (iOS and Android, not yet released) that lets people
rent private parking space by the hour, the way Airbnb rents rooms.

It is a two-sided marketplace:

**For drivers** — book a specific private driveway, garage or courtyard lot
near where you're going, before you set off. The bay is reserved in your name,
so there's no circling and no gambling on a full garage. Prices are per hour and
shown up front.

**For hosts** — list space that sits empty (a driveway while you're at work, a
second garage bay) and earn from it. You set the hours, approve or auto-accept
requests, and get paid weekly.

### What the app actually does

| Capability | What it solves |
|---|---|
| Map search with filters | Finds private spaces you can't see from the street. Filter by covered, EV charging, CCTV, vehicle size. |
| Instant booking | Hourly to weekly. Confirmed bookings hold the bay in your name. |
| Contactless access | A QR code or gate code arrives with the booking. No key handoffs. |
| Photo check-in / check-out | Timestamped photos from both sides, so disputes have evidence. |
| Live session + Smart Extend | Countdown, walking directions back, one tap to add time. |
| In-app messaging | Gate codes, arrival times, which bay is yours. |
| Cost splitting | One link splits a long stay between passengers. |
| Host dashboard | Earnings, demand forecasting, request approval, calendar sync. |
| ID verification | Both sides verified before a first booking. |

### Launch market

Ljubljana, Slovenia. The pitch leans on the fact that a historic city centre
was built for walking, so the parking that exists is mostly behind private
gates. ParkSpot opens those gates.

---

## What the landing page has to accomplish

1. Explain, in the first five seconds, that this is "book a private parking
   space in advance."
2. Make the problem feel expensive (time lost circling).
3. Serve two different audiences without confusing either — handled with a
   tabbed How-it-works and a dedicated host section.
4. Answer the objections that stop a signup: is my car safe, what if the space
   isn't there, what does it really cost.
5. Capture an email, tagged driver or host.

---

## Page structure

Sections in document order. Nav links to `#how-it-works`, `#features`,
`#hosts`, `#faq`.

| Section | id | Purpose |
|---|---|---|
| Hero | — | Positioning line, both CTAs, waitlist proof, app screenshot with floating UI chips |
| Problem + stats | `#why` | Frames circling as a cost. Three stat cards. |
| How it works | `#how-it-works` | Tabbed: "I need parking" / "I have a space", three steps each |
| Features | `#features` | Two full-width banners with screenshots + four short cards. Each card names an annoyance it removes. |
| Inside the app | `#screens` | Four screenshots in the app's own bottom-nav order: Bookings, Host, Messages, Profile |
| Earn as a host | `#hosts` | Host pitch plus an illustrative earnings dashboard |
| FAQ | `#faq` | Seven objection-handling answers, one-open-at-a-time accordion |
| Waitlist | `#waitlist` | Driver/host toggle, email capture |
| Footer | — | Navigation and contact |

---

## Design

Light, card-based, deliberately restrained. Content sits in white cards on warm
off-white paper.

**Type** — Plus Jakarta Sans only (400–800), loaded from Google Fonts. Tight
negative tracking on headings, weight carries hierarchy. No display serif and no
gradient-filled text, both of which made the earlier dark version read as
template-generated.

**Colour**

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F6F5F2` | Page background |
| `--card` | `#FFFFFF` | Card surfaces |
| `--ink` | `#15181F` | Primary text |
| `--ink-2` | `#565C6B` | Body text |
| `--ink-3` | `#868C9B` | Captions |
| `--brand` | `#B3573A` | Terracotta. CTAs, accents, stat figures. |
| `--sage` | `#5F7D52` | Secondary accent, confirmation states |
| `--mesh-1/2/3` | sage → cream | Hero and CTA gradient fields |

**Elevation** — three layered shadow tokens (`--sh-sm/md/lg`). Light themes need
soft, close shadows; heavy halos read as fake.

**Motion** — scroll reveals, count-up figures, bar growth, tab and accordion
transitions. Everything animates `transform`/`opacity` only, and the whole lot is
disabled under `prefers-reduced-motion`.

---

## Tech

Static HTML, CSS and JavaScript. No framework, no build step, no dependencies.

```
index.html     markup and all copy
styles.css     design tokens + every rule
script.js      nav, mobile menu, scroll reveal, tabs, FAQ,
               counters, role toggle, phone tilt, form validation
assets/        app screenshots
```

### Running it

```bash
python3 -m http.server 8000
# http://127.0.0.1:8000
```

Any static server works. There is nothing to compile.

### Accessibility

Skip link, real `role="tablist"` tabs with arrow-key navigation, `aria-expanded`
on the accordion and burger menu, labelled icon buttons, visible focus rings,
and a full reduced-motion path.

---

## Before this goes live

**Every number on the page is a placeholder.** They were written to make the
layout concrete, and they currently read as fact:

- `2,400+` on the waitlist (hero)
- `21 min` lost per trip, `<30 sec` to book, `€180/mo` host earnings (stats)
- `€1.20–€2.50` per hour (hero and FAQ)
- The cancellation and refund terms in the FAQ are invented, including the
  "refunded in full plus we cover the difference" promise

**The waitlist form does nothing.** `script.js` validates the email and swaps in
a success message. Nothing is stored or sent. Wire it to a backend or a form
service.

**The map screenshot is Dubrovnik, not Ljubljana.** `screen-explore.png` shows
Dubrovnik Old Town, the Adriatic and Ploče, while the copy says the launch
market is Ljubljana. Either reshoot it or change the copy.

**`assets/phone.glb` is unused** and is 5.2 MB of the 7.3 MB assets folder. It
was used by an earlier 3D version of the hero. Delete it unless it's coming back.

**No testimonials section exists.** It was left out rather than filled with
invented quotes. It drops in after the FAQ once there are real ones. Same reason
there is no partner-logo strip.

**Legal pages are not written.** Privacy policy and terms were removed from the
footer rather than left as dead `#` links.
