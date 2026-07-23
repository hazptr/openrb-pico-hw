# OpenRB — config-as-code (tscircuit) — proof of concept

An experiment in describing the OpenRB board as **code** ([tscircuit](https://tscircuit.com))
instead of a GUI schematic: the source is diff-able and regenerable, it renders a real
schematic, and it exports a native **KiCad** `.kicad_sch`.

This is why: the editable EasyEDA source for the board was lost, and the
[`../kicad/`](../kicad) reconstruction is a netlist connected purely by labels (no drawn
wires), which is hard to read. A code source is version-controllable and produces a clean
drawn schematic.

## Status

- ✅ **MIDI input sheet** ([`midi.tsx`](midi.tsx)) — the H11L1 opto-isolator input, wired
  from the verified netlist in [`../RECONSTRUCTION.md`](../RECONSTRUCTION.md) §5. Uses the
  **real LCSC part** (H11L1 = `C78588`, imported with its EasyEDA footprint).
- ⏳ Next: the **USB** (RP2040 native + CH334R hub + dual USB-A) and **MCU** sheets, then
  assemble the whole board.

## Rendered schematic

![MIDI input schematic](renders/midi-schematic.png)

Generated `.kicad_sch` (opens in KiCad): [`renders/midi.kicad_sch`](renders/midi.kicad_sch).

## The recipe for a *readable* schematic from code

The trick that makes the output look hand-drawn rather than label-soup:

- **Wire local pins with `<trace>`** (drawn wires) — don't connect everything by net name.
- **Use net labels only for rails / global nets** (`V3V3`, `GND`, `MIDI_RX`).
- **Give placement hints** (`schX` / `schY` / `schPinArrangement`) for signal-flow layout.
- **Import the exact part**: `tsci import C78588` pulls the real symbol + footprint, so the
  design reproduces the actual BOM rather than generic equivalents.

## Working with it

Requires Node + [Bun](https://bun.sh) (the `tsci` CLI runs on Bun).

```sh
npm install          # deps
npm i -g bun         # tsci runtime
npm run render       # -> renders/midi-schematic.svg
npm run kicad        # -> renders/midi.kicad_sch (open in KiCad)
npm run netlist      # -> readable netlist, to diff against RECONSTRUCTION.md
npm run dev          # interactive browser preview (schematic + PCB + 3D)
```

Firmware that runs on this board: [openrb-pico](https://github.com/delabrcd/openrb-pico).
