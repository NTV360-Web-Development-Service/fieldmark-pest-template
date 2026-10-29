# Fieldmark — pest control site template

A reusable Astro template for a contractor or service business, edited through
[Pages CMS](https://pagescms.org/). Content lives in `src/content/`; the layout
shapes that render it live in `src/components/`. The build validates that the two
stay in sync.

**This repo is the single source of truth for site copy.** The Valley Shield
template pulls its text from here with `npm run sync:content`, keeping its own
design and brand. Edit copy here, never there.

## Quick start

```sh
npm install
npm run dev        # local dev server at localhost:4321
```

## Commands

All commands run from the project root:

| Command                  | Action                                                      |
| :----------------------- | :---------------------------------------------------------- |
| `npm install`            | Install dependencies                                        |
| `npm run dev`            | Start the local dev server                                  |
| `npm run build`          | Build to `./dist/` — runs all checks below and fails on any |
| `npm run preview`        | Preview the production build locally                        |
| `npm run check:types`    | Type-check (`astro check`)                                  |
| `npm run check:sections` | Verify every section is registered in all three places      |
| `npm run check:pages`    | Audit heading structure across pages                        |
| `npm run check:links`    | Verify every internal link resolves                         |
| `npm run format`         | Format all files with Prettier                              |
| `npm run format:check`   | Check formatting without writing                            |

## How it's organised

- **`src/content/`** — the words & data an editor types (CMS-editable)
- **`src/components/`** — `chrome/` (Header, Footer…), `sections/` (page blocks),
  `ui/` (Button, Heading…)
- **`src/pages/`** — routes; `[...slug].astro` renders any CMS page
- **`src/lib/`** — shared logic and the section registries
- **`src/layouts/`** — page shells

A section is defined in **three places keyed by the same `type` string** —
schema (validation), component (rendering), and `.pages.yml` (editing) — and the
build fails if they drift apart.

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — full folder tour and the
  three-registry model. **Read this before adding a section or page.**
- [`docs/SECTIONS.md`](docs/SECTIONS.md) — the section catalogue and naming rule.
- [Astro docs](https://docs.astro.build) — the underlying framework.

## Image credits

The pest photos below come from Wikimedia Commons under Creative Commons
licences that require credit, so keep these lines (or an equivalent credits
page) while the photos are in use. They were resized and converted to AVIF.

- `ant.avif` — JJ Harrison, CC BY-SA 3.0, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tapinoma_sessile.jpg)
- `bark-scorpion-wall.avif` — Andrew Meeds, CC BY 4.0, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Centruroides_sculpturatus_192296090.jpg)
- `bed-bug.avif` — Gilles San Martin, CC BY-SA 2.0, via [Wikimedia Commons](<https://commons.wikimedia.org/wiki/File:Cimex_lectularius_(bed_bug)_(5975912718).jpg>)
- `black-widow.avif` — Marshal Hedin, CC BY 2.0, via [Wikimedia Commons](<https://commons.wikimedia.org/wiki/File:Latrodectus_hesperus_(F_Theridiidae).jpg>)
- `cockroach.avif` — Lmbuga, CC BY-SA 3.0, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Blattodea._Cascuda._Santiago_de_Compostela_1.jpg)
- `cricket.avif` — Aiwok, CC BY-SA 3.0, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Acheta_domesticus_1.JPG)
- `drywood-termite.avif` — Whitney Cranshaw, Colorado State University, CC BY 3.0 US, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Incisitermes_minor.jpg)
- `job-outlet-termites.avif` — Control Pest Management Brisbane, CC BY-SA 4.0, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Termite_Mudding_Power_Outlet.jpg)
- `job-rodent-exclusion.avif` — NY State IPM Program at Cornell University, CC BY 2.0, via [Wikimedia Commons](<https://commons.wikimedia.org/wiki/File:Rodent_Exclusion_(10069529336).jpg>)
- `mouse-droppings.avif` — NY State IPM Program at Cornell University, CC BY 2.0, via [Wikimedia Commons](<https://commons.wikimedia.org/wiki/File:House_Mouse_Droppings_(10069590893).jpg>)
- `roof-rat.avif` — Alex O'Neal, CC BY-SA 2.0, via [Wikimedia Commons](<https://commons.wikimedia.org/wiki/File:Long-tailed_black_rat_(Rattus_rattus).jpg>)
- `scorpion.avif` — Andrew Meeds, CC BY 4.0, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Centruroides_sculpturatus_186847118.jpg)
- `scorpion-rock.avif` — Andrew Meeds, CC BY 4.0, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Centruroides_sculpturatus_193477484.jpg)
- `scorpion-uv.avif` — Therringshaw, CC BY 4.0, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Arizona_Bark_Scorpion_under_blacklight.jpg)
- `spider.avif` — Holger Krisp, CC BY 4.0, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Gew%C3%A4chshausspinne_Parasteatoda_tepidariorum_2.jpg)
- `termite-mud-tubes.avif` — Balves85, CC BY-SA 3.0, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Termite_droppings.png)
- `termite.avif` — Judy Gallagher, CC BY 2.0, via [Wikimedia Commons](<https://commons.wikimedia.org/wiki/File:Eastern_Subterranean_Termite_-_Reticulitermes_flavipes_and_Rove_Beetle_(Aleocharinae_subfamily),_Robert_W._Duncan_Wildlife_Management_Area,_Ruther_Glen,_Virginia,_May_18,_2023_(53531674791).jpg>)
- `tick.avif` — dineshphotography7797, CC BY 4.0, via [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Rhipicephalus_sanguineus_228608115.jpg)

`mosquito.avif`, `mouse.avif`, `wasp.avif`, `wasp-face.avif`,
`slab-pretreat.avif`, `attic-insulation.avif`, `job-kitchen-cockroach.avif` and the technician photos
(`tech-*.avif`) come from [Pexels](https://www.pexels.com/) under the Pexels License
(free for commercial use, no attribution required).

`attic-rodent.avif` is a public-domain image sourced via
[Openverse](https://openverse.org/).

Swap all of these for the client's own job and crew photos before launch.
