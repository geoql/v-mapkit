# v-mapkit

> Vue 3 components for Apple MapKit JS - Monorepo for v-mapkit and mapkit-cn

[![npm version](https://badge.fury.io/js/@geoql%2Fv-mapkit.svg)](https://www.npmjs.com/package/@geoql/v-mapkit)
[![JSR](https://jsr.io/badges/@geoql/v-mapkit)](https://jsr.io/@geoql/v-mapkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[Live examples](https://mapkit-cn.geoql.in/?utm_source=github&utm_medium=readme&utm_campaign=v-mapkit)** · [Docs](https://v-mapkit.geoql.in/?utm_source=github&utm_medium=readme&utm_campaign=v-mapkit) · [npm](https://www.npmjs.com/package/@geoql/v-mapkit) · [JSR](https://jsr.io/@geoql/v-mapkit)

## Packages

| Package                         | Description                          |
| ------------------------------- | ------------------------------------ |
| [v-mapkit](./packages/v-mapkit) | Vue 3 components for Apple MapKit JS |

## Apps

| App                           | Description                                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| [mapkit-cn](./apps/mapkit-cn) | Showcase site with 23 live examples (Nuxt 4), [mapkit-cn.geoql.in](https://mapkit-cn.geoql.in) |
| [docs](./apps/docs)           | Documentation site (Nuxt 4 + `@nuxt/content`), [v-mapkit.geoql.in](https://v-mapkit.geoql.in)  |

## Quick Start

### Install the library

```bash
pnpm add @geoql/v-mapkit
```

```vue
<script setup lang="ts">
import { VMap, VMarkerAnnotation } from "@geoql/v-mapkit";
import "@geoql/v-mapkit/style.css";

const token = "YOUR_MAPKIT_TOKEN";

// Coordinates aren't props — MapKit owns the live map, so set the
// initial region once the instance is ready via the @map event.
function onMap(map: mapkit.Map) {
  map.setRegionAnimated(
    new mapkit.CoordinateRegion(
      new mapkit.Coordinate(37.7749, -122.4194),
      new mapkit.CoordinateSpan(0.1, 0.1),
    ),
  );
}
</script>

<template>
  <VMap :access-token="token" @map="onMap">
    <VMarkerAnnotation :coordinates="[37.7749, -122.4194]" />
  </VMap>
</template>
```

### Use mapkit-cn (shadcn-vue style)

```bash
npx shadcn-vue@latest add https://mapkit-cn.geoql.in/r/v-map
```

## Development

This monorepo uses [pnpm v12](https://pnpm.io) workspaces.

```bash
# Install all dependencies
pnpm install

# Development
pnpm run dev:lib      # Watch mode for library
pnpm run dev:app      # Showcase site

# Build
pnpm run build        # Build all packages
pnpm run build:app    # Build showcase site

# Test
pnpm run test

# Lint & Format
pnpm run lint
pnpm run format
```

## Monorepo Structure

```
v-mapkit/
├── packages/
│   └── v-mapkit/            # Core library (npm + jsr: @geoql/v-mapkit)
├── apps/
│   ├── mapkit-cn/           # Nuxt 4 showcase site (23 live examples + registry)
│   └── docs/                # Nuxt 4 documentation site (@nuxt/content)
├── package.json             # pnpm workspaces root
├── pnpm-workspace.yaml      # Workspace config
└── pnpm-lock.yaml
```

## More from the author

- [v-maplibre](https://v-maplibre.geoql.in/?utm_source=github&utm_medium=readme&utm_campaign=v-mapkit) — 50+ Vue 3 components for MapLibre GL
- [mapcn-vue](https://mapcn-vue.geoql.in/?utm_source=github&utm_medium=readme&utm_campaign=v-mapkit) — shadcn-vue map components you copy into your app
- [maplibre-gl-compare](https://maplibre-gl-compare.geoql.in/?utm_source=github&utm_medium=readme&utm_campaign=v-mapkit) — swipe-style map comparison control for MapLibre
- [maplibre-gl-wind](https://maplibre-gl-wind.geoql.in/?utm_source=github&utm_medium=readme&utm_campaign=v-mapkit) — wind particle animation layer for MapLibre
- [nxui](https://nxui.geoql.in/?utm_source=github&utm_medium=readme&utm_campaign=v-mapkit) — animated copy-paste UI components for Vue 3 and Nuxt
- [shadscan-vue](https://shadscan-vue.geoql.in/?utm_source=github&utm_medium=readme&utm_campaign=v-mapkit) — UI audits for shadcn-vue and shadcn-nuxt apps

See every project at [vinayakkulkarni.dev/projects](https://vinayakkulkarni.dev/projects?utm_source=github&utm_medium=readme&utm_campaign=v-mapkit) and [geoql.in](https://geoql.in/?utm_source=github&utm_medium=readme&utm_campaign=v-mapkit).

## License

MIT License - see [LICENSE](./packages/v-mapkit/LICENSE) for details

---

Made with ❤️ by [GeoQL](https://github.com/geoql)
