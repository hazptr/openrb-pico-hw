# Rev 0.2 layout reference (recovered Gerbers)

The original PCB layout for OpenRB rev 0.2, recovered from the Gerbers that were
uploaded to JLCPCB. Use this as a **tracing/placement reference** while you
re-lay the board in KiCad — it is the real copper + silk + drill of the
manufactured board.

## Contents
- `gerbers/` — the recovered production set (2-layer): top copper/silk/mask/paste,
  bottom copper/mask, board outline (`.GKO`), document layer, and 3 Excellon drills
  (NPTH, PTH, PTH-via).
- `render/openrb_rev0.2_top.{png,svg}` and `..._bottom.{png,svg}` — headless
  renders (gerbonara) for quick visual reference. Top view shows the silk refs and
  "OPENRB REV 0.2".

## Getting a live `.kicad_pcb` overlay (one GUI step)
KiCad's Gerber→PCB conversion is only available in the **GerbView** GUI (there is no
`kicad-cli` for it), so this step is manual:

1. Launch **GerbView** (standalone, or KiCad main window → *GerbView*).
2. *File → Open Gerber Plot File(s)…* → select everything in `gerbers/*.G*`.
3. *File → Open Excellon Drill File(s)…* → select `gerbers/*.DRL`.
4. *File → Export → Export to Pcbnew (.kicad_pcb)…* → save as
   `reference/openrb_rev0.2_ref.kicad_pcb`.

That board has the copper/silk as **graphic polygons** (no footprints or nets) — it
is a tracing layer, not an editable netlisted board. Typical workflow:

- Open the new netlisted PCB you generate from the schematic (footprints + ratsnest),
  then either import the reference board's graphics onto a User layer, or keep the
  reference `.kicad_pcb` open side-by-side, and re-place/route to match the original.

## Regenerate the renders
```
. .venv/bin/activate
python - <<'PY'
from gerbonara import LayerStack
s = LayerStack.open_dir("kicad/reference/gerbers")
for side in ("top","bottom"):
    open(f"kicad/reference/render/openrb_rev0.2_{side}.svg","w").write(str(s.to_pretty_svg(side=side)))
PY
```
