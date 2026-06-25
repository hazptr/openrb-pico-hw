# OpenRB rev 0.2 — reconstructed KiCad project

Editable KiCad source rebuilt from the recovered artifacts (the original EasyEDA
project was lost). See `../RECONSTRUCTION.md` for the verified netlist this was
built from.

## Layout
- `lib/openrb.kicad_sym`, `lib/openrb.pretty/`, `lib/openrb.3dshapes/` — the exact
  LCSC parts (symbol + footprint + 3D model) pulled by part number via `easyeda2kicad`.
- `openrb/openrb.kicad_sch` — the schematic (open this in KiCad).
- `openrb/openrb_schematic.pdf`, `openrb/openrb.net` — exported view + netlist.
- `gen_sch.py` — regenerates the schematic from the netlist baked into the script.

## How it was built
`gen_sch.py` places every component and drops a **net label on each pin** to wire
the design (a flat, label-driven schematic). Connectivity was verified by exporting
the netlist with `kicad-cli` and confirming every net matches `RECONSTRUCTION.md`.

To regenerate: `python3 gen_sch.py && kicad-cli sch upgrade openrb/openrb.kicad_sch`

## Notes
- Style is functional, not pretty: parts sit on a grid, connected by labels rather
  than drawn wires. Rearrange / draw wires in Eeschema as you like — nets are correct.
- ERC shows warnings (`pin_to_pin`, `pin_not_driven`) that come from the LCSC symbols'
  pin-type metadata (e.g. power pins typed "bidirectional"); they don't affect the
  netlist. PWR_FLAGs are placed on the power rails.
- The MIDI jack (CP-2350, no LCSC id) uses a small custom 3-pin TRS symbol with a
  placeholder footprint — assign a real footprint before fabricating.
- Firmware/board rev naming is inconsistent (silk "REV 0.2" / PDF "REV 1.0" /
  firmware `CUSTOM_REV_0_1`); this project is the **rev 0.2** board.
