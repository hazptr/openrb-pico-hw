# Full-board schematic-as-code — for review

The whole OpenRB rev 0.2 board recreated as [tscircuit](https://tscircuit.com) code,
built from the verified netlist in [`../RECONSTRUCTION.md`](../RECONSTRUCTION.md) with the
**exact LCSC parts** imported by part number.

## What to look at

Three sheets (a hierarchical design, joined by shared net-label names):

| Sheet | Schematic | Editable KiCad | Netlist |
|-------|-----------|----------------|---------|
| MIDI  | [`renders/midi-schematic.png`](renders/midi-schematic.png) | [`renders/midi.kicad_sch`](renders/midi.kicad_sch) | [`renders/midi.netlist.txt`](renders/midi.netlist.txt) |
| USB   | [`renders/usb-schematic.png`](renders/usb-schematic.png)   | [`renders/usb.kicad_sch`](renders/usb.kicad_sch)   | [`renders/usb.netlist.txt`](renders/usb.netlist.txt) |
| MCU   | [`renders/mcu-schematic.png`](renders/mcu-schematic.png)   | [`renders/mcu.kicad_sch`](renders/mcu.kicad_sch)   | [`renders/mcu.netlist.txt`](renders/mcu.netlist.txt) |

Each `.kicad_sch` opens in KiCad; import all three into one project and they connect by the
shared net-label names (`MCU_USBD_DP`, `MCU_USBH_DP`, `USB_HUB_RST`, `MIDI_RX`, rails).

## Correctness

An **independent verification pass** audited every generated netlist connection against
RECONSTRUCTION.md §3–§6, connection by connection:

- **§5 MIDI · §4 USB/hub · §3 RP2040 pin map · §6 clock/reset/boot/status — all PASS.**
- All 40+ BOM components present; every R/C value matches the §1 part table.
- **One error was found and fixed:** C10/C11 (100nF) were on `+3V3`; per §2 they're the
  RP2040 **core-rail (1.1V DVDD/VREG) decouplers** — now on `V1V1`. Re-verified.

So the connectivity is a faithful match to the reconstruction. ✅

## Things I need you to confirm / that are stubbed

1. **MIDI connector = DIN-5** (you flagged this — fixed here). But note **RECONSTRUCTION.md
   §5 and the §1 BOM still say "CP-2350 (Adafruit TRS MIDI jack)"** — that doc should be
   corrected to DIN-5 too. I modeled J1 as a generic 5-pin (pin4/pin5 = current loop, pin2 =
   shield); **the exact DIN-5 socket LCSC part still needs importing** to get the real symbol
   + footprint.
2. **H2** (1×2 power header) is a generic 2-pin part (VBUS/GND per §2).
3. **Schematic layout is auto-generated.** The **MIDI sheet is fully hand-wired and clean**;
   the **USB and MCU sheets** lean on net labels for dense buses/rails (idiomatic, matches
   the original), and the auto-router leaves some wide routing loops (e.g. the power/crystal
   arcs on the MCU sheet). These are **placement/aesthetic** issues, **not** connectivity —
   tunable with more `schX`/`schY`/`schPinArrangement` hints if we pursue this.

## If we take this further

- Import the real DIN-5 part; tune placement on the USB/MCU sheets.
- Add PCB (tscircuit does layout too) and export gerbers — or keep tscircuit as the
  schematic source of truth and do the board in KiCad from the exported `.kicad_sch`.

See [`README.md`](README.md) for the approach and how to regenerate everything.
