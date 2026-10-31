# IW Spatial Editor

A dependency-free visual editor for the Infinite Worlds Spatial Context package. It targets Spatial Context `1.0.RC3` / schema `1.2` and runs entirely in the browser.

## Start

Open `dist/index.html` in a modern browser. No installation, server, or network connection is required. The hosted build also offers an **Offline editor** download.

The editor starts with a small Eldren demonstration world. Use **New** for an empty project or **Import YAML** to load existing data.

## Authoring workflow

1. Optionally load a background image and calibrate its X/Y bounds in the Project inspector.
2. Draw locations, paths, and polygonal area geometries. Drag points or vertices to reposition them.
3. Classify locations, paths, and polygons with the shared Type and Subtype controls. Built-in values provide consistent map colors; **Other / custom** preserves author-defined values in YAML.
4. Drag across empty map space to select every intersecting object. Shift adds to the selection; Ctrl or Alt removes. Drag any selected object to move the entire selection without changing relative positions.
5. Double-click a path segment or polygon boundary to insert a new vertex at that position. You can also select the segment and use **Insert midpoint** in the inspector. Select one object, then drag a vertex to move only that vertex. **Flip direction** reverses ordered paths such as rivers.
6. Save the complete project as `.iwspatial`. This is the primary authoring format and embeds the reference image, data, layer visibility, viewport, metric zoom, and selection.
7. Run **Validate**, then export `world-geography.yaml` and `world-spatial.yaml` for the IW project.

## Controls

- Mouse wheel: logarithmic zoom from 0.001 to 1 kilometer per pixel.
- **Snap points to 10 m grid**: enabled by default; applies the data format’s `0.01 km` horizontal resolution.
- Left-drag empty map space: marquee-select intersecting locations, paths, and polygons.
- Shift-click or Shift-marquee: add to selection.
- Ctrl/Alt-click or Ctrl/Alt-marquee: remove from selection.
- Drag any selected object: move the complete selection as a group.
- Space-drag, Pan tool, middle-drag, or right-drag: pan.
- Enter, double-click, or Finish: complete a path or polygon.
- Backspace while drawing: remove the last draft point.
- Double-click a path segment or polygon boundary: insert a vertex.
- Delete: remove the selected object or vertex.
- Ctrl/Cmd+Z and Ctrl/Cmd+Shift+Z: undo and redo.
- Ctrl/Cmd+S: save the `.iwspatial` project.

## Data behavior

- X/Y coordinates are kilometers. Elevation (`z_m`) is meters.
- View scale is stored as `kilometersPerPixel` and uses a fully metric `0.001–1` range. Projects saved by earlier editors are migrated and clamped safely.
- The zoom slider is logarithmic, so each power-of-ten scale receives equal control space.
- Grid snapping is stored in the project as `snap.enabled` and `snap.stepKm`; the default step is `0.01 km` (10 m).
- At maximum zoom (`0.001 km/px`), the 10 m snap interval is 10 screen pixels wide. Minor snap-grid lines appear when spacing reaches six pixels.
- Disabling snapping allows imported or intentionally authored 1 m coordinates to remain editable; normal IW authoring should leave snapping enabled.
- Shared classifications use `layer` as Type. Location and area Subtype is stored in `kind`; path Subtype remains `type` for schema compatibility.
- Built-in map colors follow the classification palette. Biome subtypes use related temperature/fertility tints.
- Path order is meaningful. Water paths should run from source to mouth.
- Path cumulative distances are recalculated after geometry edits.
- Moving a location or a path point linked by `location_id` keeps every linked X/Y intersection aligned while preserving each record's own elevation.
- Background images remain editor-only and are never written to YAML.
- Existing data fields that the editor does not expose are retained during a project session and re-exported.
- YAML import supports the structures used by the Spatial Context schemas: mappings, sequences, flow coordinate arrays/maps, comments, quoted scalars, and literal/folded block text. YAML anchors, aliases, tags, and multi-document streams are intentionally unsupported.

## Files

- `dist/index.html` — the complete application, including all CSS and JavaScript.
- `.openai/hosting.json` — static hosting configuration.
- `CHANGELOG.md` — editor release notes.

## Privacy and portability

The app has no analytics, API calls, or runtime dependencies. File import and export happen locally in the browser. A project can therefore be edited offline and moved between computers as one `.iwspatial` JSON file.

