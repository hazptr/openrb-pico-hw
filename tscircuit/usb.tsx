// OpenRB — USB sheet, as config-as-code (tscircuit).
// Netlist per hardware/RECONSTRUCTION.md §4 (VERIFIED). Real LCSC parts imported via
// `tsci import`. Bus nets (HUB_DM/DP*, MCU_USB*, rails) are net labels — as the original
// USB HOST sheet drew them. VBUS (USB-C input) and V5V (+5V, post-fuse) are distinct nets,
// bridged by F1 on the MCU sheet.
import { TYPE_C_31_M_12 } from "./imports/TYPE_C_31_M_12"
import { USBLC6_2SC6 } from "./imports/USBLC6_2SC6"
import { CH334R } from "./imports/CH334R"
import { UB1112C_8FDE_4F } from "./imports/UB1112C_8FDE_4F"
import { X322512MSB4SI } from "./imports/X322512MSB4SI"

export default () => (
  <board width="150mm" height="100mm">
    {/* ---- USB-C device connector (UFP): VBUS/GND/shield, CC pulldowns, D+/D- tied pairs ---- */}
    <TYPE_C_31_M_12
      name="USBC1"
      schX={-16}
      schY={0}
      connections={{
        pin15: "net.VBUS", pin16: "net.VBUS", // VBUS (B4A9 / A4B9)
        pin13: "net.GND", pin14: "net.GND", // GND (A1B12 / B1A12)
        pin1: "net.GND", pin2: "net.GND", pin3: "net.GND", pin4: "net.GND", // shield EH1-4
        pin6: "net.CC1", // A5 = CC1
        pin12: "net.CC2", // B5 = CC2
        pin8: "net.D_USB_P", pin10: "net.D_USB_P", // A6/B6 = DP1/DP2 (tied)
        pin9: "net.D_USB_N", pin7: "net.D_USB_N", // A7/B7 = DN1/DN2 (tied)
      }}
    />
    <resistor name="R1" resistance="5.1k" footprint="0402" schX={-13} schY={-2}
      connections={{ pin1: "net.CC1", pin2: "net.GND" }} />
    <resistor name="R3" resistance="5.1k" footprint="0402" schX={-13} schY={-3}
      connections={{ pin1: "net.CC2", pin2: "net.GND" }} />

    {/* ---- device-side ESD + 22R series into the RP2040 native USB ---- */}
    <resistor name="R15" resistance="22" footprint="0402" schX={-12} schY={2}
      connections={{ pin1: "net.MCU_USBD_DP", pin2: "net.USBD_DP_E" }} />
    <resistor name="R14" resistance="22" footprint="0402" schX={-12} schY={1}
      connections={{ pin1: "net.MCU_USBD_DM", pin2: "net.USBD_DM_E" }} />
    <USBLC6_2SC6 name="D2" schX={-9} schY={1.5}
      connections={{
        IO12: "net.USBD_DP_E", IO11: "net.D_USB_P", // I/O1 line: MCU side / connector side
        IO22: "net.USBD_DM_E", IO21: "net.D_USB_N", // I/O2 line
        VBUS: "net.VBUS", GND: "net.GND",
      }} />

    {/* ---- CH334R USB 2.0 hub: upstream to RP2040 PIO host, 4 downstream ports, XTAL ---- */}
    <CH334R name="U2" schX={0} schY={0}
      connections={{
        DPU: "net.MCU_USBH_DP", DMU: "net.MCU_USBH_DM",
        pin9: "net.USB_HUB_RST", // RESET#/CDP <- RP2040 GPIO18
        V5: "net.V5V", VDD33: "net.V3V3", GND: "net.GND",
        XO: "net.X2_XO", XI: "net.X2_XI",
        DM1: "net.HUB_DM1", DP1: "net.HUB_DP1",
        DM2: "net.HUB_DM2", DP2: "net.HUB_DP2",
        DM3: "net.HUB_DM3", DP3: "net.HUB_DP3",
        DM4: "net.HUB_DM4", DP4: "net.HUB_DP4",
      }} />
    <X322512MSB4SI name="X2" schX={3} schY={-4}
      connections={{ OSC2: "net.X2_XO", OSC1: "net.X2_XI", GND1: "net.GND", GND2: "net.GND" }} />

    {/* ---- downstream dual USB-A ports (UB1112C = 2 stacked A-ports each) ---- */}
    <UB1112C_8FDE_4F name="USB0" schX={12} schY={4}
      connections={{
        pin2: "net.HUB_DM1", pin3: "net.HUB_DP1", // upper port -> hub port 1
        pin6: "net.HUB_DM2", pin7: "net.HUB_DP2", // lower port -> hub port 2
        pin1: "net.V5V", pin5: "net.V5V",
        pin4: "net.GND", pin8: "net.GND",
        pin9: "net.GND", pin10: "net.GND", pin11: "net.GND", pin12: "net.GND",
      }} />
    <UB1112C_8FDE_4F name="USB1" schX={12} schY={-4}
      connections={{
        pin2: "net.HUB_DM4", pin3: "net.HUB_DP4", // upper port -> hub port 4
        pin6: "net.HUB_DM3", pin7: "net.HUB_DP3", // lower port -> hub port 3
        pin1: "net.V5V", pin5: "net.V5V",
        pin4: "net.GND", pin8: "net.GND",
        pin9: "net.GND", pin10: "net.GND", pin11: "net.GND", pin12: "net.GND",
      }} />

    {/* ---- +5V bulk + CH334R decoupling ---- */}
    <capacitor name="C12" capacitance="100uF" footprint="0805" schX={5} schY={5} connections={{ pin1: "net.V5V", pin2: "net.GND" }} />
    <capacitor name="C13" capacitance="100uF" footprint="0805" schX={6} schY={5} connections={{ pin1: "net.V5V", pin2: "net.GND" }} />
    <capacitor name="C14" capacitance="100uF" footprint="0805" schX={7} schY={5} connections={{ pin1: "net.V5V", pin2: "net.GND" }} />
    <capacitor name="C17" capacitance="100uF" footprint="0805" schX={8} schY={5} connections={{ pin1: "net.V5V", pin2: "net.GND" }} />
    <capacitor name="C19" capacitance="1uF" footprint="0402" schX={2} schY={3} connections={{ pin1: "net.V5V", pin2: "net.GND" }} />
    <capacitor name="C20" capacitance="1uF" footprint="0402" schX={3} schY={3} connections={{ pin1: "net.V3V3", pin2: "net.GND" }} />
  </board>
)
