// OpenRB — serial-MIDI input sheet, as config-as-code (tscircuit POC).
// Netlist per hardware/RECONSTRUCTION.md §5 (VERIFIED):
//   TRS MIDI jack -> R2 220 -> H11L1 anode(1); D1 1N4148 reverse clamp across opto input
//   (cathode->1, anode->2); U6 H11L1: VCC(6)=+3V3, GND(5)=GND, VO(4)=MIDI_RX + R4 470 pull-up
//   to +3V3, NC(3).
// Style: local pins wired with <trace> (drawn wires); only rails/outputs use net labels.

import { sel } from "tscircuit"
import { H11L1 } from "./imports/H11L1"

export default () => (
  <board width="60mm" height="40mm">
    {/* Adafruit CP-2350 TRS MIDI jack: tip/ring = current-loop lines, sleeve = shield */}
    <chip
      name="J1"
      footprint="pinrow3"
      pinLabels={{ pin1: "TIP", pin2: "RING", pin3: "SLEEVE" }}
      schX={-5}
      schY={0}
      schPinArrangement={{
        rightSide: { direction: "top-to-bottom", pins: ["TIP", "RING", "SLEEVE"] },
      }}
    />

    <resistor name="R2" resistance="220" footprint="0402" schX={-2} schY={1} />
    <diode name="D1" footprint="sod323" schX={-0.5} schY={-1.2} schRotation={90} />

    {/* H11L1 MIDI optocoupler — the real LCSC part C78588, imported via `tsci import C78588`
        (brings the correct symbol pins + EasyEDA DIP-6 footprint). */}
    <H11L1
      name="U6"
      schX={2}
      schY={0}
      schPinArrangement={{
        leftSide: { direction: "top-to-bottom", pins: ["AN", "CAT", "NC"] },
        rightSide: { direction: "top-to-bottom", pins: ["VCC", "GND", "VO"] },
      }}
    />

    <resistor name="R4" resistance="470" footprint="0402" schX={4.5} schY={1.5} schRotation={90} />

    {/* local wiring — drawn as wires, not labels */}
    <trace from={sel.J1.TIP} to={sel.R2.pin1} />
    <trace from={sel.R2.pin2} to={sel.U6.AN} />
    <trace from={sel.J1.RING} to={sel.U6.CAT} />
    <trace from={sel.D1.cathode} to={sel.U6.AN} />
    <trace from={sel.D1.anode} to={sel.U6.CAT} />
    <trace from={sel.U6.VO} to={sel.R4.pin1} />

    {/* rails + output — net labels */}
    <trace from={sel.U6.VCC} to="net.V3V3" />
    <trace from={sel.R4.pin2} to="net.V3V3" />
    <trace from={sel.U6.GND} to="net.GND" />
    <trace from={sel.J1.SLEEVE} to="net.GND" />
    <trace from={sel.U6.VO} to="net.MIDI_RX" />
  </board>
)
