# IW Spatial Editor changelog

## 0.4.0 — 2026-10-30

- Replaced the converted imperial-equivalent zoom limits with a fully metric `0.001–1 km/px` range.
- Made the zoom slider logarithmic across three powers of ten.
- Added default-on snapping to the Spatial Context format’s `0.01 km` (10 m) horizontal resolution.
- Applied snapping consistently to drawing, vertex insertion, single-point dragging, group movement, linked intersections, initial-position coordinates, and inspector edits.
- Added minor 10 m grid lines at zoom levels where they remain visually useful.
- Added a live `snap 10 m` indicator to the coordinate readout.
- Added project migration for the new snapping preference and advanced the `.iwspatial` project format to version 3.

## 0.3.0 — 2026-10-30

- Replaced mile-based viewport scale and calculations with 0.01609344–1.609344 kilometers per pixel, preserving the original visible zoom range exactly.
- Added automatic viewport migration for projects saved by editor 0.1 and 0.2.
- Added shared enumerable Type and Subtype controls for locations, paths, and polygonal areas.
- Added custom Type and Subtype entry for classifications outside the built-in lists.
- Added a consistent classification palette, including subtype-specific biome tints.
- Added rectangular marquee selection for locations, paths, and polygons.
- Added Shift-to-add and Ctrl/Alt-to-remove behavior for clicks and marquee selection.
- Added group dragging for multi-selected objects while preserving relative positions and linked intersections.
- Preserved single-vertex dragging for individually selected paths and polygons.
- Advanced the `.iwspatial` project format to version 2 while retaining version 1 compatibility.

## 0.2.0 — 2026-10-29

- Added polygon-boundary hit detection and vertex insertion by double-click.
- Added an inspector action for inserting a polygon vertex at a selected boundary segment's midpoint.
- Added support for inserting on the polygon's implicit closing segment, between its last and first vertices.

## 0.1.0 — 2026-10-29

- Added an offline-capable, single-file map editor for Spatial Context `1.0.RC3` / schema `1.2`.
- Added background reference images with calibrated coordinate bounds and opacity.
- Added 1–100 px/mile zoom, cursor-centered wheel zoom, panning, layer visibility, filtering, and fit-to-world.
- Added location, path, and polygon creation, selection, dragging, property editing, stable-ID renaming, and deletion.
- Added path point insertion/removal, path reversal, elevation editing, and automatic cumulative-distance recalculation.
- Added synchronized X/Y movement for locations and path points joined by `location_id`.
- Added semantic location and area editing, including `contains` relationships.
- Added `.iwspatial` project save/open with embedded reference image and editor state.
- Added two-file YAML import/export, structural validation, undo/redo, a demo world, and an in-app quick guide.

