import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
let script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, 'application script is present');
script = script.replace(
  'window.IWSpatialEditor={parseYaml,dumpYaml,validateProject,projectPayload,version:EDITOR_VERSION};',
  'window.IWSpatialEditor={parseYaml,dumpYaml,validateProject,projectPayload,version:EDITOR_VERSION,_test:{getState:()=>state,normalizeEditor,classificationFields,setSelection,setSelections,selectionItems,marqueeHits,buildMovePlan,applyMovePlan,applyClassificationChange,updateVertexDrag,worldToScreen,roundCoord,zoomSliderValue,scaleFromZoomSlider,CLASSIFICATIONS,MIN_KM_PER_PIXEL,MAX_KM_PER_PIXEL}};'
);

class ClassList {
  constructor() { this.values = new Set(); }
  toggle(key, on) { on ? this.values.add(key) : this.values.delete(key); }
  add(key) { this.values.add(key); }
  remove(key) { this.values.delete(key); }
}

class ElementStub {
  constructor(id = '') {
    this.id = id;
    this.value = '';
    this.checked = true;
    this.innerHTML = '';
    this.textContent = '';
    this.className = '';
    this.dataset = {};
    this.style = {};
    this.classList = new ClassList();
    this.listeners = {};
    this.clientWidth = id === 'mapCanvas' ? 1000 : 0;
    this.clientHeight = id === 'mapCanvas' ? 700 : 0;
    this.disabled = false;
  }
  addEventListener(name, fn) { (this.listeners[name] ??= []).push(fn); }
  getBoundingClientRect() { return { left: 0, top: 0, width: this.id === 'mapWrap' ? 1000 : this.clientWidth || 1000, height: this.id === 'mapWrap' ? 700 : this.clientHeight || 700 }; }
  setPointerCapture() {}
  closest() { return null; }
  showModal() {}
  close() {}
}

const ids = ['mapCanvas', 'mapWrap', 'dirtyDot', 'statusText', 'toast', 'zoomSlider', 'zoomLabel', 'snapGrid', 'countText', 'selectionText', 'coordinates', 'drawHint', 'finishDraw', 'objectFilter', 'objectTree', 'inspector', 'inspectorTitle', 'inspectorSubtitle', 'fitAll', 'projectInput', 'yamlInput', 'backgroundInput', 'issues', 'issuesDialog', 'importSummary', 'importDialog', 'helpDialog'];
const elements = Object.fromEntries(ids.map(id => [id, new ElementStub(id)]));
elements.mapCanvas.getContext = () => ({
  setTransform() {}, clearRect() {}, fillRect() {}, strokeRect() {}, drawImage() {}, beginPath() {}, moveTo() {}, lineTo() {}, closePath() {}, fill() {}, stroke() {}, arc() {}, fillText() {}, save() {}, restore() {}, setLineDash() {},
  measureText(text) { return { width: String(text).length * 6 }; },
  set fillStyle(_) {}, set strokeStyle(_) {}, set lineWidth(_) {}, set font(_) {}, set textAlign(_) {}, set globalAlpha(_) {}, set lineCap(_) {}, set lineJoin(_) {}
});

const document = {
  querySelector(selector) { return selector.startsWith('#') ? elements[selector.slice(1)] ?? new ElementStub() : null; },
  querySelectorAll() { return []; },
  createElement() { return new ElementStub(); },
  documentElement: { outerHTML: '' },
  body: { append() {} }
};
const window = { addEventListener() {}, IWSpatialEditor: null };
const sandbox = {
  console, document, window, structuredClone,
  ResizeObserver: class { constructor(callback) { this.callback = callback; } observe() { this.callback(); } },
  Image: class {}, devicePixelRatio: 1, setTimeout, clearTimeout, Blob: class {},
  URL: { createObjectURL() { return ''; }, revokeObjectURL() {} },
  confirm() { return true; }, prompt() { return ''; }, alert() {}, FileReader: class {}
};

vm.createContext(sandbox);
vm.runInContext(script, sandbox, { filename: 'dist/index.html' });
const api = window.IWSpatialEditor;
const test = api._test;
const state = test.getState();

assert.equal(api.version, '0.4.0');
assert.equal(state.editor.viewport.kilometersPerPixel, .1);
assert.equal(state.editor.snap.enabled, true);
assert.equal(state.editor.snap.stepKm, .01);
assert.ok(!('pixelsPerMile' in state.editor.viewport));
assert.equal(test.normalizeEditor({ viewport: { pixelsPerMile: 16.09344 } }).viewport.kilometersPerPixel, .1);
assert.equal(test.normalizeEditor({ viewport: { kilometersPerPixel: .0001 } }).viewport.kilometersPerPixel, .001);
assert.equal(test.normalizeEditor({ viewport: { kilometersPerPixel: 4 } }).viewport.kilometersPerPixel, 1);
assert.equal(test.scaleFromZoomSlider(0), .001);
assert.equal(test.scaleFromZoomSlider(100), 1);
assert.equal(test.zoomSliderValue(.001), 0);
assert.equal(test.zoomSliderValue(1), 100);
assert.equal(test.roundCoord(.014), .01);
assert.equal(test.roundCoord(.016), .02);
assert.deepEqual(Object.keys(test.CLASSIFICATIONS), ['landmass', 'geography', 'biome', 'surface_water', 'political', 'travel', 'settlement', 'point_of_interest', 'other']);
assert.match(test.classificationFields('area', 'political', 'duchy'), /Duchy/);
assert.match(test.classificationFields('area', 'custom realm', 'custom place'), /Custom type/);

test.setSelections([{ kind: 'location', id: 'bramble_gate' }, { kind: 'polygon', id: 'blackpine_forest_extent' }], 'replace');
assert.equal(test.selectionItems().length, 2);
test.setSelection({ kind: 'path', id: 'kings_road' }, 'add');
assert.equal(test.selectionItems().length, 3);
test.setSelection({ kind: 'polygon', id: 'blackpine_forest_extent' }, 'remove');
assert.equal(test.selectionItems().length, 2);

const locationBefore = { ...state.geography.location_points.bramble_gate };
const linkedBefore = { ...state.geography.paths.kings_road.nav_points[1] };
const plan = test.buildMovePlan([{ kind: 'location', id: 'bramble_gate' }]);
test.applyMovePlan(plan, 2, -3);
assert.equal(state.geography.location_points.bramble_gate.x_km, locationBefore.x_km + 2);
assert.equal(state.geography.paths.kings_road.nav_points[1].x_km, linkedBefore.x_km + 2);
assert.equal(state.geography.paths.kings_road.nav_points[1].y_km, linkedBefore.y_km - 3);

const southwatchBefore = state.geography.location_points.southwatch_post.x_km;
test.applyMovePlan(test.buildMovePlan([{ kind: 'location', id: 'southwatch_post' }]), .006, 0);
assert.equal(state.geography.location_points.southwatch_post.x_km, southwatchBefore + .01);

const untouchedRiverPoints = state.geography.paths.river_vey.nav_points.slice(1).map(p => [p.x_km, p.y_km]);
state.pointer = { mode: 'vertex', selection: { kind: 'path', id: 'river_vey', vertexIndex: 0 }, moved: true };
test.updateVertexDrag({ x: 60, y: 40 });
assert.deepEqual([state.geography.paths.river_vey.nav_points[0].x_km, state.geography.paths.river_vey.nav_points[0].y_km], [60, 40]);
assert.deepEqual(state.geography.paths.river_vey.nav_points.slice(1).map(p => [p.x_km, p.y_km]), untouchedRiverPoints);
state.pointer = null;

const bramble = test.worldToScreen(state.geography.location_points.bramble_gate.x_km, state.geography.location_points.bramble_gate.y_km);
const hits = test.marqueeHits({ x: bramble.x - 3, y: bramble.y - 3 }, { x: bramble.x + 3, y: bramble.y + 3 });
assert.ok(hits.some(item => item.kind === 'location' && item.id === 'bramble_gate'));

const custom = { layer: 'other', kind: 'other' };
test.applyClassificationChange(custom, 'kind', 'loc.layer_custom', 'dreamscape');
test.applyClassificationChange(custom, 'kind', 'loc.subtype_custom', 'memory well');
assert.deepEqual(custom, { layer: 'dreamscape', kind: 'memory well' });

const geography = api.parseYaml(api.dumpYaml(state.geography));
assert.equal(geography.coordinate_system.x_unit, 'kilometer');
assert.equal(api.validateProject().filter(issue => issue.level === 'error').length, 0);

console.log('IW Spatial Editor smoke checks passed.');
