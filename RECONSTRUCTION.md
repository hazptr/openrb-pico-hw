# OpenRB rev 0.2 — design reconstruction (VERIFIED)

The editable EasyEDA source for this board was lost. This document reconstructs an
authoritative **netlist + part table** from the surviving artifacts, as the spec for
rebuilding an editable KiCad project. Connectivity below was verified against the
high-resolution schematic PDF render + the board owner's confirmations.

## Provenance (in `recovered-artifacts/`)
- `Schematic_OpenRB_2024-11-02.pdf` — schematic (title block says "REV 1.0"; it is **rev 0.2**, per Gerber silk "OPENRB REV 0.2").
- `openrb_rev0.2_BOM.csv` — EasyEDA BOM (exact LCSC parts + footprints).
- `openrb_rev0.2_gerbers.zip` / `jlc_processed_3272087A_Y2.zip` — Gerbers + JLC package (gerber id 7143133).

---

## 1. Component table (from BOM)

| Ref | Value / Part | Footprint | LCSC |
|---|---|---|---|
| U1 | RP2040 | LQFN-56 7x7 P0.4 EP | C2040 |
| U2 | CH334R (USB 2.0 hub) | QSOP-16 | C4154405 |
| U4 | RT9080-33GJ5 (3.3V LDO) | TSOT-23-5 | C841192 |
| U5 | W25Q16JVUXIQ (QSPI flash) | USON-8 | C2843335 |
| U6 | H11L1 (MIDI optocoupler) | DIP-6 | C78588 |
| D1 | 1N4148WS | SOD-323 | C402214 |
| D2 | USBLC6-2SC6 (USB ESD) | SOT-23-6 | C2827654 |
| USBC1 | TYPE-C-31-M-12 | USB-C SMD | C165948 |
| USB0, USB1 | UB1112C-8FDE-4F (dual USB-A host) | USB-A TH | C2761534 |
| MIDI | CP-2350 (Adafruit TRS MIDI jack) | CP-2350 | — |
| X1, X2 | 12 MHz crystal (4-pad SMD) | OSC-SMD 3.2x2.5 | C9002 |
| F1 | ASMD0603-020 (resettable fuse) | F0603 | C135321 |
| H2 | 1x2 header (ext power) | HDR-2.54 1x2 | C49661 |
| SWD1, UART | 1x3 header | HDR-2.54 1x3 | C146690 |
| BOOT, RESET | PTS647SM tact switch | KEY-SMD 4P | C2689502 |
| LED_AUTH, LED_3V3, LED_5V | red LED 0603 (BOM refs AUTH/+3V3/+5V) | LED-0603 | C72044 |
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
| R7 | 1 kΩ | R0402 | — |
| R9, R13 | 10 kΩ | R0402 | — |
| R10, R11, R12 | 1 kΩ | R0402 | C105637 |
| R14, R15 | 22 Ω | R0402 | — |

---

## 2. Power tree
- USB-C VBUS (USBC1 A4/B4/A9/B9) + ext header H2.1 → `VBUS`; H2.2 → GND.
- `VBUS → F1 (fuse) → +5V`. No 5 V load switch (always on).
- `+5V` → U4 VIN(1); U4 EN(3) ← R9 10k → +5V; U4 GND(2)→GND; U4 NC(4) = NC; U4 VOUT(5) → `+3V3`.
- `+3V3` → bulk C1/C2 10µF; RP2040 IOVDD(1,10,22,33,42,49)/ADC_AVDD(43)/USB_VDD(48);
  W25Q16 VCC; CH334R VDD33(13); MIDI opto; pull-ups; LED_3V3.
- `+1.1V` = RP2040 VREG_VOUT(45) → DVDD(23,50).
- `+5V` bulk: C12/C13/C14/C17 100µF; CH334R V5(12)←+5V; USB0/USB1 VCC←+5V.
- `GND` common (RP2040 EP pin57).

Decoupling (cap ↔ rail ↔ GND): 100nF C3/C4/C5/C6/C8/C9 on IOVDD; C10/C11 + C7 1µF on DVDD/VREG;
C18 1µF on +3V3; C19/C20 1µF on CH334R supplies.

---

## 3. RP2040 (U1) — VERIFIED from PDF (✗ = no-connect)
| GPIO/pin | Pin# | Net |
|---|---|---|
| USB_DP | 47 | `MCU_USBD_DP` |
| USB_DM | 46 | `MCU_USBD_DM` |
| GPIO1 | 3 | `MIDI_RX` |
| GPIO16 | 27 | `MCU_USBH_DP` |
| GPIO17 | 28 | `MCU_USBH_DM` |
| **GPIO18** | 29 | **`USB_HUB_RST`** (→ CH334R RESET#) — connected on rev 0.2 |
| GPIO23 | 35 | `LED1` (→ R6 → LED_AUTH) |
| GPIO24 | 36 | `DEBUG_TX` |
| GPIO25 | 37 | `DEBUG_RX` |
| XIN/XOUT | 20/21 | crystal X1 (see §6) |
| SWCLK/SWD | 24/25 | SWD1 header |
| RUN | 26 | RESET network (see §6) |
| QSPI_SS/SCLK/SD0..3 | 56/52/53/55/54/51 | W25Q16 flash + BOOT btn |
| GPIO0, GPIO2–15, GPIO19–22, GPIO26–29 | — | **✗ no-connect** (SPI0/I2C1/GPIO0 unrouted) |

---

## 4. USB / hub — VERIFIED
- USB-C `CC1`(A5)→R1 5.1k→GND; `CC2`(B5)→R3 5.1k→GND (UFP, no source).
- Device USB w/ ESD: RP2040 `MCU_USBD_DP`→**R15 22Ω**→D2(USBLC6) IO1; `MCU_USBD_DM`→**R14 22Ω**→D2 IO2;
  D2 connector side → `D_USB_P`/`D_USB_N` → USB-C DP1/DP2 (tied) / DN1/DN2 (tied); D2 VBUS(5)→VBUS, GND(2)→GND.
- Host (PIO) USB: RP2040 GPIO16/17 → `MCU_USBH_DP`/`MCU_USBH_DM` → CH334R DPU(11)/DMU(10). **No series R on host lines.**
- CH334R (U2): pin1 DM4=`HUB_DM4`, 2 DP4=`HUB_DP4`, 3 DM3=`HUB_DM3`, 4 DP3=`HUB_DP3`,
  5 DM2=`HUB_DM2`, 6 DP2=`HUB_DP2`, 7 DM1=`HUB_DM1`, 8 DP1=`HUB_DP1`,
  9 RESET#/CDP=`USB_HUB_RST`, 10 DMU=`MCU_USBH_DM`, 11 DPU=`MCU_USBH_DP`,
  12 V5=+5V, 13 VDD33=+3V3, 14 GND, 15 XO / 16 XI = crystal X2 (15pF loads), case→GND.
- USB0 (UB1112C): U-port pin2=`HUB_DM1`,pin3=`HUB_DP1`; D-port pin6=`HUB_DM2`,pin7=`HUB_DP2`;
  VCC(1,5)=+5V; GND(4,8)+SHELL(9-12)=GND.
- USB1 (UB1112C): U-port pin2=`HUB_DM4`,pin3=`HUB_DP4`; D-port pin6=`HUB_DM3`,pin7=`HUB_DP3`;
  VCC(1,5)=+5V; GND(4,8)+SHELL(9-12)=GND.

---

## 5. MIDI (serial-MIDI input) — VERIFIED
- TRS MIDI jack → R2 220Ω → U6 H11L1 anode(1); D1 1N4148 reverse clamp across opto input (cathode→1, anode→2).
- U6 H11L1: VCC(6)=+3V3, GND(5)=GND, VO(4)=`MIDI_RX` + R4 470Ω pull-up to +3V3, NC(3).

---

## 6. Clock / reset / boot / status — VERIFIED
- X1 12MHz: XIN(20)↔X1.1, C16 15pF→GND; XOUT(21)→**R12 1k**→X1.3, C15 15pF→GND; X1 case pins→GND.
- RESET: RP2040 RUN(26) ← **R13 10k** → +3V3 (pull-up); RUN ← **R11 1k** → RESET button → GND.
- BOOT: QSPI_SS ← **R10 1k** → BOOT button → GND.
- SWD1 header: 1=SWCLK, 2=SWDIO(SWD), 3=GND. UART header: 1=DEBUG_TX, 2=DEBUG_RX, 3=GND.
- Status LEDs: LED_AUTH ← R6 470 ← `LED1`(GPIO23); LED_3V3 ← R8 470 ← +3V3; LED_5V ← R7 1k ← +5V (all cathodes → GND).

---

## Notes / residual minor items
- USBLC6 IO pin order (pin1 vs 6, pin3 vs 4) is symmetric/bidirectional — functionally irrelevant; KiCad symbol pinout used as-is.
- Exact decoupling cap ↔ pin grouping is layout detail; all are rail↔GND and electrically equivalent.
- Firmware naming quirk: `pins_rp2040_orb_custom_0_1.h` is used for the rev 0.2 build (no 0_2 header); `PIN_5V_EN`/GPIO18 is the hub-reset line here, not a 5 V switch.
