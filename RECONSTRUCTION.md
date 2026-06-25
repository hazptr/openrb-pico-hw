# OpenRB rev 0.2 — design reconstruction

The editable EasyEDA source for this board was lost. This document reconstructs an
authoritative **netlist + part table** from the only surviving artifacts, as the
spec for rebuilding an editable KiCad project.

## Provenance / sources (in `recovered-artifacts/`)
- `Schematic_OpenRB_2024-11-02.pdf` — schematic (title block mislabels it "REV 1.0";
  the board it describes is **rev 0.2**, matching the Gerber silkscreen "OPENRB REV 0.2").
- `openrb_rev0.2_BOM.csv` — EasyEDA BOM (exact LCSC parts + footprints). **High confidence.**
- `openrb_rev0.2_gerbers.zip` — Gerbers actually uploaded to JLC (copper = ground truth for connectivity).
- `jlc_processed_3272087A_Y2.zip` — JLC's processed package of the same order (gerber id 7143133).
- Firmware pin map: `openrb-pico/inc/pins_rp2040_orb_custom_0_1.h` (the map the CUSTOM build uses).

## Confidence legend
- ✅ **certain** — from BOM, or an explicit net label in the PDF, or firmware pin define.
- ⚠️ **verify** — inferred from PDF wire routing / adjacency; please confirm against the board.

---

## 1. Component table (✅ from BOM)

| Ref | Value / Part | Footprint | LCSC |
|---|---|---|---|
| U1 | RP2040 | LQFN-56 7x7 P0.4 EP | C2040 |
| U2 | CH334R (USB 2.0 hub) | QSOP-16 | C4154405 |
| U4 | RT9080-33GJ5 (3.3V LDO) | TSOT-23-5 | C841192 |
| U5 | W25Q16JVUXIQ (QSPI flash) | USON-8 | C2843335 |
| U6 | H11L1 (MIDI optocoupler) | DIP-6 | C78588 |
| D1 | 1N4148WS | SOD-323 | C402214 |
| D2 | USBLC6-2SC6 (USB ESD) | SOT-23-6 | C2827654 |
| USBC1 | TYPE-C-31-M-12 (USB-C recept.) | USB-C SMD | C165948 |
| USB0, USB1 | UB1112C-8FDE-4F (USB-A host) | USB-A TH | C2761534 |
| MIDI | CP-2350 (Adafruit TRS MIDI jack) | CP-2350 | — |
| X1, X2 | 12 MHz crystal | OSC-SMD 3.2x2.5 | C9002 |
| F1 | ASMD0603-020 (resettable fuse) | F0603 | C135321 |
| H2 | 1x2 header (ext power) | HDR-2.54 1x2 | C49661 |
| SWD1, UART | 1x3 header | HDR-2.54 1x3 | C146690 |
| BOOT, RESET | PTS647SM tact switch | KEY-SMD 4P | C2689502 |
| LED_AUTH, LED_3V3, LED_5V | red LED 0603 (BOM refs: AUTH,+3V3,+5V) | LED-0603 | C72044 |
| C1, C2 | 10 µF | C0402 | C77000 |
| C3,C4,C5,C6,C8,C9,C10,C11 | 100 nF | C0402 | C307331 |
| C7, C18 | 1 µF | C0402 | C107372 |
| C12,C13,C14,C17 | 100 µF | CASE-B 3528 | C16133 |
| C15, C16 | 15 pF | C0603 | C1644 |
| C19, C20 | 1 µF | C0402 | C107372 |
| R1, R3 | 5.1 kΩ (USB-C CC) | R0402 | — |
| R2 | 220 Ω | R0402 | C25091 |
| R4 | 470 Ω | R0402 | C114949 |
| R6, R8 | 470 Ω | R0402 | — |
| R7, R11, R12 | 1 kΩ | R0402 | — |
| R9, R13 | 10 kΩ | R0402 | — |
| R10 | 1 kΩ | R0402 | C105637 |
| R14, R15 | 22 Ω | R0402 | — |

---

## 2. Power tree

- `VBUS` — USB-C VBUS (USBC1 A4/B4/A9/B9) and ext-power header H2. ✅
- `VBUS → F1 → +5V` (resettable fuse). ✅
- `+5V` — feeds U4 (LDO) VIN, USB hub VBUS, USB0/USB1 port VBUS, LED_5V. ✅
- `+3V3` — U4 RT9080 VOUT; bulk C1/C2 10µF. Feeds RP2040 IOVDD rails, USB_VDD,
  ADC_AVDD, flash VCC, CH334R VDD33, MIDI opto, pull-ups, LED_3V3. ✅
- `+1.1V` — RP2040 VREG_VOUT (45) → DVDD (23, 50); local decoupling. ✅
- `GND` — common; RP2040 EP (57). ✅
- U4 EN (3) pulled to +5V via R9 10k. ⚠️

Decoupling (each cap between named rail and GND): 100nF C3/C4/C5/C6/C8/C9 on IOVDD
rails; C10/C11 + C7(1µF) on DVDD/VREG; C18(1µF) on +3V3; C1/C2(10µF) bulk +3V3;
C12/C13/C14/C17(100µF) bulk +5V; C19/C20(1µF) on CH334R supplies. ⚠️ (rail-correct; exact cap↔pin grouping to confirm)

---

## 3. RP2040 (U1) GPIO / function map
(GPIOn ↔ QFN pin; function from firmware `pins_rp2040_orb_custom_0_1.h` + PDF net labels)

| GPIO | Pin | Net / function | Conf |
|---|---|---|---|
| USB_DP (47) | 47 | `MCU_USBD_DP` → D2 USBLC6 → USB-C DP1/DP2 | ✅ |
| USB_DM (46) | 46 | `MCU_USBD_DM` → D2 USBLC6 → USB-C DN1/DN2 | ✅ |
| GPIO16 | 27 | `MCU_USBH_DP` → (R15 22Ω?) → CH334R DPU(11) | ⚠️ |
| GPIO17 | 28 | `MCU_USBH_DM` → (R14 22Ω?) → CH334R DMU(10) | ⚠️ |
| GPIO18 | 29 | `USB_HUB_RST`/5V-EN → CH334R RESET#(9), R13 10k | ⚠️ |
| GPIO1 | 3 | `MIDI_RX` ← U6 H11L1 output (uart0 RX) | ✅ |
| GPIO0 | 2 | uart0 TX (MIDI_TX) — likely unused on board | ⚠️ |
| GPIO24 | 36 | `DEBUG_TX` → UART header (uart1) | ✅ |
| GPIO25 | 37 | `DEBUG_RX` → UART header (uart1) | ✅ |
| GPIO23 | 35 | `LED1` → R6 470 → LED_AUTH (PIN_LED) | ✅ |
| SWCLK (24) | 24 | SWD1 header SWCLK | ✅ |
| SWD (25) | 25 | SWD1 header SWDIO | ✅ |
| RUN (26) | 26 | RESET button + R-pullup | ✅ |
| QSPI_* (51-56) | 51-56 | W25Q16 flash (SS/SCLK/SD0-3); BOOT btn on QSPI_SS | ✅ |
| XIN/XOUT (20/21) | 20/21 | X1 12MHz + C15/C16 15pF | ✅ |
| GPIO8/14/15/13 | — | SPI0 (firmware) — expansion, may be unrouted | ⚠️ |
| GPIO2/3 | 4/5 | I2C1 SDA/SCL (firmware) — expansion, may be unrouted | ⚠️ |

---

## 4. USB / hub sheet
- USB-C `CC1`(A5)→R1 5.1k→GND; `CC2`(B5)→R3 5.1k→GND (UFP). ✅
- USB-C `DP1`/`DP2` tied, `DN1`/`DN2` tied → D2 USBLC6 IO pins → `D_USB_P`/`D_USB_N`
  → R15/R14 22Ω → RP2040 USB_DP/DM. ⚠️ (series-R placement to confirm)
- CH334R (U2): upstream DPU/DMU ← RP2040 PIO host; X2 12MHz + caps; VDD33←+3V3, V5←+5V.
  Downstream `HUB_DP1/DM1`→USB0, `HUB_DP2/DM2`→USB0(2nd?), `HUB_DP3/DM3`+`HUB_DP4/DM4`→USB1. ⚠️
- USB0/USB1 (UB1112C): each has two USB-A ports (8-pin dual). VBUS←+5V, GND, D±←HUB_*. ⚠️
- Bulk 100µF C12/C13/C14/C17 on +5V near ports. ✅

---

## 5. MIDI sheet (serial-MIDI input)
- TRS MIDI jack `MIDI` → R2 220Ω → U6 H11L1 anode(1); D1 1N4148 clamp across input. ✅
- U6 H11L1: VCC(6)←+3V3, GND(5)←GND, VO(4)→`MIDI_RX` + R4 470Ω pull-up to +3V3. ✅

---

## 6. Status LEDs
- LED_AUTH ← R6 470 ← `LED1` (RP2040 GPIO23). ✅
- LED_3V3 ← R8 470 ← +3V3. ✅
- LED_5V ← R7 1k ← +5V. ✅

---

## Open items for you to confirm (you know the board)
1. R14/R15 22Ω — on the **device** USB lines (RP2040↔USB-C) or the **host** lines (RP2040↔hub)?
2. GPIO18 — is it CH334R `RESET#`, a 5V load-switch enable, or both?
3. CH334R downstream port → USB0/USB1 jack mapping (which HUB_Dx pair goes to which physical port).
4. Whether SPI0 / I2C1 / GPIO0 are routed to anything (headers/test points) or left as MCU-only.
