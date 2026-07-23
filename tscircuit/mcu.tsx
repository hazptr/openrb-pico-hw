// OpenRB — MCU sheet, as config-as-code (tscircuit).
// Netlist per hardware/RECONSTRUCTION.md §3 (RP2040 pin map) + §6 (clock/reset/boot/status).
// Rails: V3V3 (LDO out), V5V (+5V, post-fuse), VBUS (USB-C in, pre-fuse), V1V1 (core 1.1V), GND.
// Inter-sheet nets (match usb.tsx / midi.tsx): MCU_USBD_DP/DM, MCU_USBH_DP/DM, USB_HUB_RST, MIDI_RX.
import { RP2040 } from "./imports/RP2040"
import { W25Q16JVUXIQ } from "./imports/W25Q16JVUXIQ"
import { RT9080_33GJ5 } from "./imports/RT9080_33GJ5"
import { ASMD0603_020 } from "./imports/ASMD0603_020"
import { B_2200S03P_A120 } from "./imports/B_2200S03P_A120"
import { X322512MSB4SI } from "./imports/X322512MSB4SI"

export default () => (
  <board width="220mm" height="160mm">
    {/* ================= RP2040 ================= */}
    <RP2040
      name="U1"
      schX={0}
      schY={0}
      connections={{
        // power
        IOVDD1: "net.V3V3", IOVDD2: "net.V3V3", IOVDD3: "net.V3V3",
        IOVDD4: "net.V3V3", IOVDD5: "net.V3V3", IOVDD6: "net.V3V3",
        USB_VDD: "net.V3V3", ADC_AVDD: "net.V3V3", VREG_IN: "net.V3V3",
        VREG_VOUT: "net.V1V1", DVDD1: "net.V1V1", DVDD2: "net.V1V1",
        GND: "net.GND", TESTEN: "net.GND",
        // native USB (device)
        USB_DP: "net.MCU_USBD_DP", USB_DM: "net.MCU_USBD_DM",
        // PIO USB host
        GPIO16: "net.MCU_USBH_DP", GPIO17: "net.MCU_USBH_DM", GPIO18: "net.USB_HUB_RST",
        // serial MIDI in
        GPIO1: "net.MIDI_RX",
        // status LED + debug UART
        GPIO23: "net.LED1", GPIO24: "net.DEBUG_TX", GPIO25: "net.DEBUG_RX",
        // crystal
        XIN: "net.XIN", XOUT: "net.XOUT",
        // SWD
        SWCLK: "net.SWCLK", SWD: "net.SWDIO",
        // reset
        RUN: "net.RUN",
        // QSPI flash
        QSPI_SS: "net.QSPI_SS", QSPI_SCLK: "net.QSPI_SCLK",
        QSPI_SD0: "net.QSPI_SD0", QSPI_SD1: "net.QSPI_SD1",
        QSPI_SD2: "net.QSPI_SD2", QSPI_SD3: "net.QSPI_SD3",
      }}
    />

    {/* ================= QSPI flash (W25Q16) ================= */}
    <W25Q16JVUXIQ
      name="U5"
      schX={-10}
      schY={-4}
      connections={{
        CS: "net.QSPI_SS",
        pin5: "net.QSPI_SD0", // DI/IO0
        pin2: "net.QSPI_SD1", // DO/IO1
        pin3: "net.QSPI_SD2", // WP/IO2
        pin7: "net.QSPI_SD3", // HOLD/IO3
        CLK: "net.QSPI_SCLK",
        VCC: "net.V3V3",
        GND: "net.GND",
        EP: "net.GND",
      }}
    />
    {/* BOOT: QSPI_SS <- R10 1k -> BOOT button -> GND */}
    <resistor name="R10" resistance="1k" footprint="0402" schX={-8} schY={-6}
      connections={{ pin1: "net.QSPI_SS", pin2: "net.BOOT_SW" }} />
    <pushbutton name="BOOT" footprint="pushbutton" schX={-6} schY={-7}
      connections={{ pin1: "net.BOOT_SW", pin2: "net.GND" }} />

    {/* ================= 12 MHz crystal ================= */}
    {/* XIN(20)<->X1.1; XOUT(21)->R12 1k->X1.3; C16 15pF on XIN; C15 15pF on X1.3; case->GND */}
    <X322512MSB4SI name="X1" schX={-10} schY={4}
      connections={{ OSC1: "net.XIN", OSC2: "net.X1_XOUT", GND1: "net.GND", GND2: "net.GND" }} />
    <resistor name="R12" resistance="1k" footprint="0402" schX={-7} schY={4}
      connections={{ pin1: "net.XOUT", pin2: "net.X1_XOUT" }} />
    <capacitor name="C16" capacitance="15pF" footprint="0402" schX={-12} schY={5}
      connections={{ pin1: "net.XIN", pin2: "net.GND" }} />
    <capacitor name="C15" capacitance="15pF" footprint="0402" schX={-12} schY={3}
      connections={{ pin1: "net.X1_XOUT", pin2: "net.GND" }} />

    {/* ================= reset ================= */}
    {/* RUN <- R13 10k -> V3V3 ; RUN <- R11 1k -> RESET button -> GND */}
    <resistor name="R13" resistance="10k" footprint="0402" schX={8} schY={6}
      connections={{ pin1: "net.RUN", pin2: "net.V3V3" }} />
    <resistor name="R11" resistance="1k" footprint="0402" schX={8} schY={4}
      connections={{ pin1: "net.RUN", pin2: "net.RESET_SW" }} />
    <pushbutton name="RESET" footprint="pushbutton" schX={10} schY={4}
      connections={{ pin1: "net.RESET_SW", pin2: "net.GND" }} />

    {/* ================= power: VBUS -> F1 -> +5V -> LDO -> +3V3 ================= */}
    <ASMD0603_020 name="F1" schX={-6} schY={8}
      connections={{ pin1: "net.VBUS", pin2: "net.V5V" }} />
    {/* H2: 1x2 power header (VBUS / GND) */}
    <chip name="H2" footprint="pinrow2" pinLabels={{ pin1: "P1", pin2: "P2" }} schX={-9} schY={8}
      connections={{ P1: "net.VBUS", P2: "net.GND" }} />
    <RT9080_33GJ5 name="U4" schX={-3} schY={8}
      connections={{ VIN: "net.V5V", GND: "net.GND", EN: "net.EN", VOUT: "net.V3V3" }} />
    <resistor name="R9" resistance="10k" footprint="0402" schX={-5} schY={9}
      connections={{ pin1: "net.EN", pin2: "net.V5V" }} />
    <capacitor name="C1" capacitance="10uF" footprint="0805" schX={-1} schY={9}
      connections={{ pin1: "net.V3V3", pin2: "net.GND" }} />
    <capacitor name="C2" capacitance="10uF" footprint="0805" schX={0} schY={9}
      connections={{ pin1: "net.V3V3", pin2: "net.GND" }} />

    {/* ================= SWD / UART headers ================= */}
    {/* SWD1: 1=SWCLK, 2=GND, 3=SWDIO ; UART: 1=GND, 2=DEBUG_TX, 3=DEBUG_RX */}
    <B_2200S03P_A120 name="SWD1" schX={9} schY={-2}
      connections={{ pin1: "net.SWCLK", pin2: "net.GND", pin3: "net.SWDIO" }} />
    <B_2200S03P_A120 name="UART" schX={9} schY={-5}
      connections={{ pin1: "net.GND", pin2: "net.DEBUG_TX", pin3: "net.DEBUG_RX" }} />

    {/* ================= status LEDs ================= */}
    {/* LED_AUTH <- R6 470 <- LED1(GPIO23); LED_3V3 <- R8 470 <- +3V3; LED_5V <- R7 1k <- +5V */}
    <resistor name="R6" resistance="470" footprint="0402" schX={4} schY={-6}
      connections={{ pin1: "net.LED1", pin2: "net.LED_AUTH_A" }} />
    <led name="LED_AUTH" footprint="0603" schX={6} schY={-6}
      connections={{ anode: "net.LED_AUTH_A", cathode: "net.GND" }} />
    <resistor name="R8" resistance="470" footprint="0402" schX={4} schY={-7}
      connections={{ pin1: "net.V3V3", pin2: "net.LED_3V3_A" }} />
    <led name="LED_3V3" footprint="0603" schX={6} schY={-7}
      connections={{ anode: "net.LED_3V3_A", cathode: "net.GND" }} />
    <resistor name="R7" resistance="1k" footprint="0402" schX={4} schY={-8}
      connections={{ pin1: "net.V5V", pin2: "net.LED_5V_A" }} />
    <led name="LED_5V" footprint="0603" schX={6} schY={-8}
      connections={{ anode: "net.LED_5V_A", cathode: "net.GND" }} />

    {/* ================= decoupling ================= */}
    <capacitor name="C3" capacitance="100nF" footprint="0402" schX={-2} schY={-8} connections={{ pin1: "net.V3V3", pin2: "net.GND" }} />
    <capacitor name="C4" capacitance="100nF" footprint="0402" schX={-1} schY={-8} connections={{ pin1: "net.V3V3", pin2: "net.GND" }} />
    <capacitor name="C5" capacitance="100nF" footprint="0402" schX={0} schY={-8} connections={{ pin1: "net.V3V3", pin2: "net.GND" }} />
    <capacitor name="C6" capacitance="100nF" footprint="0402" schX={1} schY={-8} connections={{ pin1: "net.V3V3", pin2: "net.GND" }} />
    <capacitor name="C8" capacitance="100nF" footprint="0402" schX={-2} schY={-9} connections={{ pin1: "net.V3V3", pin2: "net.GND" }} />
    <capacitor name="C9" capacitance="100nF" footprint="0402" schX={-1} schY={-9} connections={{ pin1: "net.V3V3", pin2: "net.GND" }} />
    {/* C10/C11 are the RP2040 core-rail (1.1V DVDD/VREG) decouplers, per RECONSTRUCTION §2 */}
    <capacitor name="C10" capacitance="100nF" footprint="0402" schX={0} schY={-9} connections={{ pin1: "net.V1V1", pin2: "net.GND" }} />
    <capacitor name="C11" capacitance="100nF" footprint="0402" schX={1} schY={-9} connections={{ pin1: "net.V1V1", pin2: "net.GND" }} />
    <capacitor name="C7" capacitance="1uF" footprint="0402" schX={3} schY={2} connections={{ pin1: "net.V1V1", pin2: "net.GND" }} />
    <capacitor name="C18" capacitance="1uF" footprint="0402" schX={3} schY={1} connections={{ pin1: "net.V3V3", pin2: "net.GND" }} />
  </board>
)
