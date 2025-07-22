export const cssNamesParsed = {
  // Display and Layout
  d: "display",
  pos: "position",
  t: "top",
  bot: "bottom",
  b: "bottom",
  start: "left",
  s: "left",
  end: "right",
  e: "right",
  z: "z-index",
  zi: "z-index",
    // Flexbox
  fb: "flex-basis",
  fd: "flex-direction",
  fwr: "flex-wrap",
  fg: "flex-grow",
  fsh: "flex-shrink",
  flex: "flex",
  jc: "justify-content",
  ai: "align-items",
  as: "align-self",
  ac: "align-content",
  
  // Grid
  gtc: "grid-template-columns",
  gtr: "grid-template-rows",
  gta: "grid-template-areas",
  gt: "grid-template",
  gg: "grid-gap",
  gc: "grid-column",
  gr: "grid-row",
  gcs: "grid-column-start",
  gce: "grid-column-end",
  grs: "grid-row-start",
  gre: "grid-row-end",
  ga: "grid-area",
  gac: "grid-auto-columns",
  gar: "grid-auto-rows",
  gaf: "grid-auto-flow",
  
  // Dimensions
  w: "width",
  h: "height",
  wmn: "min-width",
  hmn: "min-height",
  wmx: "max-width",
  hmx: "max-height",
  minw: "min-width",
  minh: "min-height",
  maxw: "max-width",
  maxh: "max-height",
  
  // Box Model
  p: "padding",
  pt: "padding-top",
  pb: "padding-bottom",
  ps: "padding-left",
  pe: "padding-right",
  py: ["padding-top", "padding-bottom"],
  px: ["padding-left", "padding-right"],
  m: "margin",
  mt: "margin-top",
  mb: "margin-bottom",
  ms: "margin-left",
  me: "margin-right",
  my: ["margin-top", "margin-bottom"],
  mx: ["margin-left", "margin-right"],

    // Border
  bw: "border-width",
  bwt: "border-top-width",
  bwb: "border-bottom-width",
  bws: "border-left-width",
  bwe: "border-right-width",
  bwy: ["border-top-width", "border-bottom-width"],
  bwx: ["border-left-width", "border-right-width"],
  bst: "border-style",
  bstt: "border-top-style",
  bstb: "border-bottom-style",
  bsts: "border-left-style",
  bste: "border-right-style",
  bsty: ["border-top-style", "border-bottom-style"],
  bstx: ["border-left-style", "border-right-style"],
  borderStylet: "border-top-style",
  borderStyleb: "border-bottom-style",
  borderStyles: "border-left-style",
  borderStylee: "border-right-style",
  borderStyley: ["border-top-style", "border-bottom-style"],
  borderStylex: ["border-left-style", "border-right-style"],
  bco: "border-color",
  bcot: "border-top-color",
  bcob: "border-bottom-color",
  bcos: "border-left-color",
  bcoe: "border-right-color",
  bcoy: ["border-top-color", "border-bottom-color"],
  bcox: ["border-left-color", "border-right-color"],
  borderColort: "border-top-color",
  borderColorb: "border-bottom-color",
  borderColors: "border-left-color",
  borderColore: "border-right-color",
  borderColory: ["border-top-color", "border-bottom-color"],
  borderColorx: ["border-left-color", "border-right-color"],
  bo: "border",
  bort: "border-top",
  borb: "border-bottom",
  bors: "border-left",
  bore: "border-right",
  
  // Border Radius
  rounded: "border-radius",
  r: "border-radius",
  rs: ["border-top-left-radius", "border-bottom-left-radius"],
  re: ["border-top-right-radius", "border-bottom-right-radius"],
  rt: ["border-top-left-radius", "border-top-right-radius"],
  rb: ["border-bottom-left-radius", "border-bottom-right-radius"],
  rst: "border-top-left-radius",
  ret: "border-top-right-radius",
  rsb: "border-bottom-left-radius",
  reb: "border-bottom-right-radius",

    // Typography
  fs: "font-size",
  fwg: "font-weight",
  ff: "font-family",
  fst: "font-style",
  fv: "font-variant",
  f: "font",
  lh: "line-height",
  lst: "letter-spacing",
  ws: "word-spacing",
  ta: "text-align",
  tde: "text-decoration",
  tt: "text-transform",
  ti: "text-indent",
  tsh: "text-shadow",
  to: "text-overflow",
  ww: "word-wrap",
  wb: "word-break",
  whs: "white-space",
  
  // Colors
  text: "color",
  c: "color",
  bg: "background-color",
  bgc: "background-color",
  
  // Background
  BG: "background",
  bgi: "background-image",
  bgr: "background-repeat",
  bga: "background-attachment",
  bgp: "background-position",
  bgs: "background-size",
  bgo: "background-origin",
  bgcl: "background-clip",
  
  // Visibility and Opacity
  v: "visibility",
  o: "opacity",
  
  // Overflow
  ov: "overflow",
  ovx: "overflow-x",
  ovy: "overflow-y",
  
  // Cursor
  cur: "cursor",
  
  // Transform
  tr: "transform",
  tro: "transform-origin",
  trs: "transform-style",
  
  // Transition
  transition: "transition",
  td: "transition-duration",
  tf: "transition-timing-function",
  tp: "transition-property",
  tdy: "transition-delay",
  
  // Animation
  an: "animation",
  and: "animation-duration",
  anf: "animation-fill-mode",
  andc: "animation-direction",
  anic: "animation-iteration-count",
  ann: "animation-name",
  anps: "animation-play-state",
  antf: "animation-timing-function",
  andy: "animation-delay",
  
  // Shadow
  bsh: "box-shadow",
  
  // Outline
  ol: "outline",
  olc: "outline-color",
  ols: "outline-style",
  olw: "outline-width",
  olo: "outline-offset",
    // List
  lsty: "list-style-type",
  lsp: "list-style-position",
  lsi: "list-style-image",
  lsst: "list-style",
  
  // Table
  tl: "table-layout",
  bc: "border-collapse",
  bs: "border-spacing",
  cs: "caption-side",
  ec: "empty-cells",
  
  // Content
  cnt: "content",
  q: "quotes",
  
  // Counter
  cr: "counter-reset",
  ci: "counter-increment",
    // Page
  pbb: "page-break-before",
  pba: "page-break-after",
  pbi: "page-break-inside",
    // Column
  coc: "column-count",
  cog: "column-gap",
  cow: "column-width",
  cor: "column-rule",
  corc: "column-rule-color",
  cors: "column-rule-style",
  corw: "column-rule-width",
  cosp: "column-span",
  cof: "column-fill",
  
  // Filter
  ft: "filter",
  
  // Resize
  rz: "resize",
  
  // User Select
  us: "user-select",
    // Pointer Events
  pev: "pointer-events",
  
  // Box Sizing
  bxs: "box-sizing",
  
  // Vertical Align
  va: "vertical-align",
  
  // Float
  fl: "float",
  cl: "clear",
    // Gap
  g: "gap",
  rg: "row-gap",
  cg: "column-gap",
  
  // Clip
  clip: "clip",
  cp: "clip-path",
  
  // Text Decoration
  tdl: "text-decoration-line",
  tdc: "text-decoration-color",
  tds: "text-decoration-style",
  tdt: "text-decoration-thickness",
  
  // Object
  of: "object-fit",
  op: "object-position",
  
  // Scroll
  sb: "scroll-behavior",
  ss: "scroll-snap-type",
  ssa: "scroll-snap-align",
    // Writing Mode
  wm: "writing-mode",
  tdir: "text-direction",
  
  // Mix Blend Mode
  mbm: "mix-blend-mode",
  
  // Isolation
  iso: "isolation",
  
  // Mask
  mk: "mask",
  mki: "mask-image",
  mkp: "mask-position",
  mks: "mask-size",
  mkr: "mask-repeat",
  mko: "mask-origin",
  mkc: "mask-clip",
  mkm: "mask-mode",
  
  // Aspect Ratio
  ar: "aspect-ratio",
  
  // Contain
  con: "contain",
  
  // Will Change
  wc: "will-change",
    // Touch Action
  tac: "touch-action",
  
  // Appearance
  app: "appearance",
  
  // Orphans and Widows
  or: "orphans",
  wd: "widows",
  
  // Hyphens
  hy: "hyphens",
  
  // Tab Size
  ts: "tab-size",
  
  // Scroll Margin
  sm: "scroll-margin",
  smt: "scroll-margin-top",
  smr: "scroll-margin-right",
  smb: "scroll-margin-bottom",
  sml: "scroll-margin-left",
  
  // Scroll Padding
  sp: "scroll-padding",
  spt: "scroll-padding-top",
  spr: "scroll-padding-right",
  spb: "scroll-padding-bottom",
  spl: "scroll-padding-left",
  
  // Place Items
  pli: "place-items",
  plc: "place-content",
  pls: "place-self",
  
  // Overscroll Behavior
  osb: "overscroll-behavior",
  osbx: "overscroll-behavior-x",
  osby: "overscroll-behavior-y",
  
  // Text Emphasis
  te: "text-emphasis",
  tec: "text-emphasis-color",
  tes: "text-emphasis-style",
  tep: "text-emphasis-position",
  
  // Text Combine
  tcu: "text-combine-upright",
  
  // Text Orientation
  tor: "text-orientation",
  
  // Text Underline
  tup: "text-underline-position",
  tuo: "text-underline-offset",
  
  // Text Justify
  tj: "text-justify",
  
  // Text Align Last
  tal: "text-align-last",
  
  // Text Size Adjust
  tsa: "text-size-adjust",
  
  // Image Rendering
  ir: "image-rendering",
  
  // Image Orientation
  io: "image-orientation",
  
  // Backdrop Filter
  bdf: "backdrop-filter",
  
  // Caret Color
  cc: "caret-color",
  
  // Accent Color
  acc: "accent-color",

  // CSS Logical Properties
  bis: "block-size",
  is: "inline-size",
  mbs: "margin-block-start",
  mbe: "margin-block-end",
  mis: "margin-inline-start",
  mie: "margin-inline-end",
  pbs: "padding-block-start",
  pbe: "padding-block-end",
  pis: "padding-inline-start",
  pie: "padding-inline-end",

  // Container Queries
  ct: "container-type",
  cn: "container-name",
  
  // Subgrid
  sg: "subgrid",
  
  // Scroll Timeline
  st: "scroll-timeline",
  stn: "scroll-timeline-name",
  sta: "scroll-timeline-axis",
  
  // View Timeline
  vt: "view-timeline",
  vtn: "view-timeline-name",
  vta: "view-timeline-axis",
  vts: "view-timeline-inset",
  
  // Animation Timeline
  at: "animation-timeline",
};
