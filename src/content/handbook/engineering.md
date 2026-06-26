---
title: Engineering
description: The principles that guide our engineering.
order: 20
authors:
  - bryanhoulton
---

### Responsibility of an Engineer

- Own the understanding of their code
  - LLMs are great at writing code faster, but you _cannot outsource your understanding_.
  - The best way to prevent this is to design tight, constrained systems before ever using AI. Design, then have the AI build the system that you already understand deeply.
  - Do not trust AI. You need design strict constraints into your systems. AI might understand your intent now, but will it in 5 sessions? 10? It will not.
    - Precommits and lint rules are great for this. Want this module to be completely isolated? Write a lint rule preventing anything from importing it.
    - Where you can, default to configurability over composability. Type systems and strict configs are great constraints to impose on AI.
- An engineer is responsible for understand what's happening in their systems. It's ok if you don't know how exactly the loop is written, but it's not OK if you don't understand your system at a conceptual level. You should be able to describe how the logic and data is flowing, why certain design choices were made, etc. You should be able to quickly and confidently bring another engineer up to speed on the system you've built, even if AI wrote the code.
- Look at the data! With your own eyes! Don't trust AI!
