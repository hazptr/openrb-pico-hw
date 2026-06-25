#!/usr/bin/env python3
"""Generate an editable KiCad schematic for OpenRB rev 0.2 from the recovered
netlist, using the exact LCSC part symbols pulled into kicad/lib/openrb.kicad_sym.

Connectivity is established by placing a net label on each pin's connection
point. Pin coordinates come from the embedded symbol definitions (lib Y-up ->
sch Y-down flip). Validated with `kicad-cli sch erc` + netlist export.
"""
import re, sys, uuid, os

LIB = os.path.join(os.path.dirname(__file__), "lib", "openrb.kicad_sym")
OUTDIR = os.path.join(os.path.dirname(__file__), "openrb")
LIBTEXT = open(LIB, encoding="utf-8").read()

def sym_block(name):
    i = LIBTEXT.find('(symbol "%s"' % name)
    if i < 0: return None
    d = 0; j = i
    while j < len(LIBTEXT):
        c = LIBTEXT[j]
        if c == '(': d += 1
        elif c == ')':
            d -= 1
            if d == 0: return LIBTEXT[i:j+1]
        j += 1

def sym_pins(block):
    """return {number: (x,y)} connection points in library coords."""
    pins = {}
    for m in re.finditer(r'\(pin\s+\S+\s+\S+\s*\(at ([-\d.]+) ([-\d.]+) ([-\d.]+)\)(.*?)(?=\(pin |\Z)', block, re.S):
        x, y, a, rest = m.groups()
        nu = re.search(r'\(number "([^"]*)"', rest)
        if nu: pins[nu.group(1)] = (float(x), float(y))
    return pins

def uid(): return str(uuid.uuid4())
ROOT = uid()

# ---- design: ref -> (symbol, value, footprint, {pin#: net})  net None => no-connect
FP = lambda n: "openrb:" + n
NC = None
DESIGN = {
 "U1": ("RP2040", "RP2040", FP("LQFN-56_L7.0-W7.0-P0.4-EP"), {
   "1":"+3V3","10":"+3V3","22":"+3V3","33":"+3V3","42":"+3V3","49":"+3V3",
   "43":"+3V3","44":"+3V3","48":"+3V3","57":"GND","19":"GND",
   "23":"+1V1","50":"+1V1","45":"+1V1",
   "20":"XIN","21":"XOUT","24":"SWCLK","25":"SWDIO","26":"RUN",
   "3":"MIDI_RX","27":"MCU_USBH_DP","28":"MCU_USBH_DM","29":"USB_HUB_RST",
   "35":"LED1","36":"DEBUG_TX","37":"DEBUG_RX","46":"MCU_USBD_DM","47":"MCU_USBD_DP",
   "51":"QSPI_SD3","52":"QSPI_SCLK","53":"QSPI_SD0","54":"QSPI_SD2","55":"QSPI_SD1","56":"QSPI_SS",
   "2":NC,"4":NC,"5":NC,"6":NC,"7":NC,"8":NC,"9":NC,"11":NC,"12":NC,"13":NC,"14":NC,
   "15":NC,"16":NC,"17":NC,"18":NC,"30":NC,"31":NC,"32":NC,"34":NC,"38":NC,"39":NC,"40":NC,"41":NC,
 }),
 "U2": ("CH334R", "CH334R", FP("QSOP-16_L4.9-W3.9-P0.64-LS6.0-BL"), {
   "1":"HUB_DM4","2":"HUB_DP4","3":"HUB_DM3","4":"HUB_DP3","5":"HUB_DM2","6":"HUB_DP2",
   "7":"HUB_DM1","8":"HUB_DP1","9":"USB_HUB_RST","10":"MCU_USBH_DM","11":"MCU_USBH_DP",
   "12":"+5V","13":"+3V3","14":"GND","15":"X2_XO","16":"X2_XI",
 }),
 "U4": ("RT9080-33GJ5", "RT9080-33", FP("TSOT-23-5_L2.9-W1.6-P0.95-LS2.8-BL"),
   {"1":"+5V","2":"GND","3":"EN_LDO","4":NC,"5":"+3V3"}),
 "U5": ("W25Q16JVUXIQ", "W25Q16JV", FP("USON-8_L3.0-W2.0-P0.50-BL-EP"),
   {"1":"QSPI_SS","2":"QSPI_SD1","3":"QSPI_SD2","4":"GND","5":"QSPI_SD0","6":"QSPI_SCLK","7":"QSPI_SD3","8":"+3V3","9":"GND"}),
 "U6": ("H11L1", "H11L1", FP("DIP-6_L8.5-W6.4-P2.54-LS7.6-BL"),
   {"1":"MIDI_A","2":"MIDI_K","3":NC,"4":"MIDI_RX","5":"GND","6":"+3V3"}),
 "D1": ("1N4148WS_C402214", "1N4148WS", FP("SOD-323_L1.8-W1.3-LS2.5-RD"), {"1":"MIDI_A","2":"MIDI_K"}),
 "D2": ("USBLC6-2SC6_C2827654", "USBLC6-2SC6", FP("SOT-23-6_L2.9-W1.6-P0.95-LS2.8-BL"),
   {"1":"USBD_DP_R","6":"D_USB_P","4":"USBD_DM_R","3":"D_USB_N","2":"GND","5":"VBUS"}),
 "USB0": ("UB1112C-8FDE-4F", "UB1112C", FP("USB-A-TH_UB1112C-8FDE-4F"),
   {"1":"+5V","2":"HUB_DM1","3":"HUB_DP1","4":"GND","5":"+5V","6":"HUB_DM2","7":"HUB_DP2","8":"GND","9":"GND","10":"GND","11":"GND","12":"GND"}),
 "USB1": ("UB1112C-8FDE-4F", "UB1112C", FP("USB-A-TH_UB1112C-8FDE-4F"),
   {"1":"+5V","2":"HUB_DM4","3":"HUB_DP4","4":"GND","5":"+5V","6":"HUB_DM3","7":"HUB_DP3","8":"GND","9":"GND","10":"GND","11":"GND","12":"GND"}),
 "F1": ("ASMD0603-020", "ASMD0603-020", FP("F0603"), {"1":"VBUS","2":"+5V"}),
 "H2": ("Header-Female-2.54_1x2", "PWR_IN", FP("HDR-TH_2P-P2.54-V-F"), {"1":"VBUS","2":"GND"}),
 # NOTE: GND is the MIDDLE/first pin on these headers (hardware-verified via SWD probe).
 "SWD1": ("22025403P00CKMT", "SWD", FP("HDR-TH_3P-P2.54-V-F"), {"1":"SWCLK","2":"GND","3":"SWDIO"}),
 "UART": ("22025403P00CKMT", "UART", FP("HDR-TH_3P-P2.54-V-F"), {"1":"GND","2":"DEBUG_TX","3":"DEBUG_RX"}),
 "RESET": ("PTS647SM38SMTR2LFS", "RESET", FP("KEY-SMD_4P-L4.5-W4.5-P3.00-LS6.5-TL"), {"1":"RST_BTN","2":"RST_BTN","3":"GND","4":"GND"}),
 "BOOT": ("PTS647SM38SMTR2LFS", "BOOT", FP("KEY-SMD_4P-L4.5-W4.5-P3.00-LS6.5-TL"), {"1":"BOOT_BTN","2":"BOOT_BTN","3":"GND","4":"GND"}),
 "LED_AUTH": ("19-217_R6C-AL1M2VY_3T", "AUTH", FP("LED0603-RD"), {"2":"N_AUTH","1":"GND"}),
 "LED_3V3": ("19-217_R6C-AL1M2VY_3T", "3V3", FP("LED0603-RD"), {"2":"N_3V3LED","1":"GND"}),
 "LED_5V": ("19-217_R6C-AL1M2VY_3T", "5V", FP("LED0603-RD"), {"2":"N_5VLED","1":"GND"}),
 # resistors (symbol = any R0402 part; value via property)
 "R1": ("0402WGF2200TCE", "5.1k", FP("R0402"), {"1":"CC1","2":"GND"}),
 "R3": ("0402WGF2200TCE", "5.1k", FP("R0402"), {"1":"CC2","2":"GND"}),
 "R2": ("0402WGF2200TCE", "220", FP("R0402"), {"1":"MIDI_IN","2":"MIDI_A"}),
 "R4": ("0402WGF2200TCE", "470", FP("R0402"), {"1":"MIDI_RX","2":"+3V3"}),
 "R6": ("0402WGF2200TCE", "470", FP("R0402"), {"1":"LED1","2":"N_AUTH"}),
 "R8": ("0402WGF2200TCE", "470", FP("R0402"), {"1":"+3V3","2":"N_3V3LED"}),
 "R7": ("0402WGF2200TCE", "1k", FP("R0402"), {"1":"+5V","2":"N_5VLED"}),
 "R9": ("0402WGF2200TCE", "10k", FP("R0402"), {"1":"EN_LDO","2":"+5V"}),
 "R10": ("0402WGF2200TCE", "1k", FP("R0402"), {"1":"QSPI_SS","2":"BOOT_BTN"}),
 "R11": ("0402WGF2200TCE", "1k", FP("R0402"), {"1":"RUN","2":"RST_BTN"}),
 "R12": ("0402WGF2200TCE", "1k", FP("R0402"), {"1":"XOUT","2":"XOUT_R"}),
 "R13": ("0402WGF2200TCE", "10k", FP("R0402"), {"1":"RUN","2":"+3V3"}),
 "R14": ("0402WGF2200TCE", "22", FP("R0402"), {"1":"MCU_USBD_DM","2":"USBD_DM_R"}),
 "R15": ("0402WGF2200TCE", "22", FP("R0402"), {"1":"MCU_USBD_DP","2":"USBD_DP_R"}),
 # caps (symbol = matching-value cap part)
 "C1": ("GRM155R61A106ME44D", "10uF", FP("C0402"), {"1":"+3V3","2":"GND"}),
 "C2": ("GRM155R61A106ME44D", "10uF", FP("C0402"), {"1":"+3V3","2":"GND"}),
 "C3": ("CL05B104KB54PNC", "100nF", FP("C0402"), {"1":"+3V3","2":"GND"}),
 "C4": ("CL05B104KB54PNC", "100nF", FP("C0402"), {"1":"+3V3","2":"GND"}),
 "C5": ("CL05B104KB54PNC", "100nF", FP("C0402"), {"1":"+3V3","2":"GND"}),
 "C6": ("CL05B104KB54PNC", "100nF", FP("C0402"), {"1":"+3V3","2":"GND"}),
 "C8": ("CL05B104KB54PNC", "100nF", FP("C0402"), {"1":"+3V3","2":"GND"}),
 "C9": ("CL05B104KB54PNC", "100nF", FP("C0402"), {"1":"+3V3","2":"GND"}),
 "C10": ("CL05B104KB54PNC", "100nF", FP("C0402"), {"1":"+1V1","2":"GND"}),
 "C11": ("CL05B104KB54PNC", "100nF", FP("C0402"), {"1":"+1V1","2":"GND"}),
 "C7": ("CL05A105KQ5NNNC", "1uF", FP("C0402"), {"1":"+1V1","2":"GND"}),
 "C18": ("CL05A105KQ5NNNC", "1uF", FP("C0402"), {"1":"+3V3","2":"GND"}),
 "C19": ("CL05A105KQ5NNNC", "1uF", FP("C0402"), {"1":"+5V","2":"GND"}),
 "C20": ("CL05A105KQ5NNNC", "1uF", FP("C0402"), {"1":"+3V3","2":"GND"}),
 "C12": ("TAJB107K006RNJ", "100uF", FP("CASE-B_3528"), {"1":"+5V","2":"GND"}),
 "C13": ("TAJB107K006RNJ", "100uF", FP("CASE-B_3528"), {"1":"+5V","2":"GND"}),
 "C14": ("TAJB107K006RNJ", "100uF", FP("CASE-B_3528"), {"1":"+5V","2":"GND"}),
 "C17": ("TAJB107K006RNJ", "100uF", FP("CASE-B_3528"), {"1":"+5V","2":"GND"}),
 "C16": ("CL10C150JB8NNNC", "15pF", FP("C0603"), {"1":"XIN","2":"GND"}),
 "C15": ("CL10C150JB8NNNC", "15pF", FP("C0603"), {"1":"XOUT_R","2":"GND"}),
 "USBC1": ("TYPE-C-31-M-12", "USB-C", FP("USB-C_SMD-TYPE-C-31-M-12_1"), {
   "A1B12":"GND","B1A12":"GND","A4B9":"VBUS","B4A9":"VBUS","A5":"CC1","B5":"CC2",
   "A6":"D_USB_P","B6":"D_USB_P","A7":"D_USB_N","B7":"D_USB_N","A8":NC,"B8":NC,
   "1":"GND","2":"GND","3":"GND","4":"GND"}),
 "X1": ("X322512MSB4SI", "12MHz", FP("CRYSTAL-SMD_4P-L3.2-W2.5-BL"), {"1":"XIN","3":"XOUT_R","2":"GND","4":"GND"}),
 "X2": ("X322512MSB4SI", "12MHz", FP("CRYSTAL-SMD_4P-L3.2-W2.5-BL"), {"1":"X2_XI","3":"X2_XO","2":"GND","4":"GND"}),
 "MIDI": ("MIDI_TRS", "CP-2350", "", {"1":"MIDI_IN","2":"MIDI_K","3":"GND"}),
}

# power nets that get a PWR_FLAG so ERC sees them driven
POWER_NETS = ["+3V3", "+5V", "+1V1", "VBUS", "GND"]

# custom symbols not in the LCSC lib (MIDI TRS jack; PWR_FLAG power-net driver)
CUSTOM = {
"MIDI_TRS": '''(symbol "openrb:MIDI_TRS"
  (pin_names (offset 1.016))(exclude_from_sim no)(in_bom yes)(on_board yes)
  (property "Reference" "J" (at 0 6.35 0)(effects (font (size 1.27 1.27))))
  (property "Value" "MIDI_TRS" (at 0 -7.62 0)(effects (font (size 1.27 1.27))))
  (property "Footprint" "" (at 0 0 0)(effects (font (size 1.27 1.27))(hide yes)))
  (symbol "MIDI_TRS_0_1"
    (rectangle (start -2.54 3.81)(end 2.54 -5.08)(stroke (width 0.254)(type default))(fill (type none))))
  (symbol "MIDI_TRS_1_1"
    (pin passive line (at -7.62 2.54 0)(length 5.08)(name "TIP" (effects (font (size 1.27 1.27))))(number "1" (effects (font (size 1.27 1.27)))))
    (pin passive line (at -7.62 0 0)(length 5.08)(name "RING" (effects (font (size 1.27 1.27))))(number "2" (effects (font (size 1.27 1.27)))))
    (pin passive line (at -7.62 -2.54 0)(length 5.08)(name "SLEEVE" (effects (font (size 1.27 1.27))))(number "3" (effects (font (size 1.27 1.27))))))
)''',
"PWR_FLAG": '''(symbol "openrb:PWR_FLAG"
  (power)(pin_numbers (hide yes))(pin_names (offset 0)(hide yes))(exclude_from_sim no)(in_bom no)(on_board yes)
  (property "Reference" "#FLG" (at 0 1.905 0)(effects (font (size 1.27 1.27))(hide yes)))
  (property "Value" "PWR_FLAG" (at 0 3.81 0)(effects (font (size 1.27 1.27))))
  (property "Footprint" "" (at 0 0 0)(effects (font (size 1.27 1.27))(hide yes)))
  (symbol "PWR_FLAG_0_0"
    (pin power_out line (at 0 0 90)(length 0)(name "~" (effects (font (size 1.27 1.27))))(number "1" (effects (font (size 1.27 1.27))))))
  (symbol "PWR_FLAG_0_1"
    (polyline (pts (xy 0 0)(xy 0 1.27)(xy -1.016 1.905)(xy 0 2.54)(xy 1.016 1.905)(xy 0 1.27))(stroke (width 0)(type default))(fill (type none))))
)''',
}

# symbols pending LCSC pull (TYPE-C C165948, crystal C9002) and MIDI jack (no LCSC)
# are added once available; their nets (D_USB_P/N, VBUS, CC1/2, XIN/XOUT_R, X2_*, MIDI_IN/K)
# are already present on the parts above so they connect when those parts land.

def get_block(sym):
    """embed-ready (openrb:-named) symbol block for a part name."""
    if sym in CUSTOM:
        return CUSTOM[sym]
    b = sym_block(sym)
    if not b: print("MISSING SYMBOL:", sym); sys.exit(1)
    return b.replace('(symbol "%s"' % sym, '(symbol "openrb:%s"' % sym, 1)

def main():
    names = list({sym for _,(sym,_,_,_) in DESIGN.items()}) + ["PWR_FLAG"]
    used = {s: get_block(s) for s in names}
    libsyms = list(used.values())
    # layout: grid
    cols = 6; dx = 63.5; dy = 76.2; x0 = 50.8; y0 = 50.8
    out = []
    out.append('(kicad_sch')
    out.append('\t(version 20250114)')
    out.append('\t(generator "openrb_gen")(generator_version "10.0")')
    out.append('\t(uuid "%s")' % ROOT)
    out.append('\t(paper "A1")')
    out.append('\t(lib_symbols')
    for ls in libsyms: out.append(ls)
    out.append('\t)')
    labels = []; ncs = []
    i = 0
    for ref,(sym,val,fp,nets) in DESIGN.items():
        sx = x0 + (i % cols) * dx
        sy = y0 + (i // cols) * dy
        i += 1
        pins = sym_pins(used[sym])
        out.append('\t(symbol (lib_id "openrb:%s") (at %.2f %.2f 0) (unit 1)' % (sym, sx, sy))
        out.append('\t\t(exclude_from_sim no)(in_bom yes)(on_board yes)(dnp no)')
        out.append('\t\t(uuid "%s")' % uid())
        out.append('\t\t(property "Reference" "%s" (at %.2f %.2f 0)(effects (font (size 1.27 1.27))))' % (ref, sx, sy-2.54))
        out.append('\t\t(property "Value" "%s" (at %.2f %.2f 0)(effects (font (size 1.27 1.27))))' % (val, sx, sy+2.54))
        out.append('\t\t(property "Footprint" "%s" (at %.2f %.2f 0)(effects (font (size 1.27 1.27))(hide yes)))' % (fp, sx, sy))
        out.append('\t\t(instances (project "openrb" (path "/%s" (reference "%s")(unit 1))))' % (ROOT, ref))
        out.append('\t)')
        for pnum,(px,py) in pins.items():
            lx = sx + px; ly = sy - py
            net = nets.get(pnum, NC)
            if net is None:
                ncs.append('\t(no_connect (at %.2f %.2f)(uuid "%s"))' % (lx, ly, uid()))
            else:
                labels.append('\t(label "%s" (at %.2f %.2f 0)(effects (font (size 1.27 1.27))(justify left bottom))(uuid "%s"))' % (net, lx, ly, uid()))
    # power-net drivers (PWR_FLAG) so ERC sees rails as driven
    ppx, ppy = sym_pins(used["PWR_FLAG"])["1"]
    py = y0 + ((len(DESIGN)//cols)+2)*dy
    for k, net in enumerate(POWER_NETS):
        sx = x0 + k*dx; sy = py
        out.append('\t(symbol (lib_id "openrb:PWR_FLAG") (at %.2f %.2f 0) (unit 1)' % (sx, sy))
        out.append('\t\t(exclude_from_sim no)(in_bom no)(on_board yes)(dnp no)')
        out.append('\t\t(uuid "%s")' % uid())
        out.append('\t\t(property "Reference" "#FLG%d" (at %.2f %.2f 0)(effects (font (size 1.27 1.27))(hide yes)))' % (k, sx, sy-2.54))
        out.append('\t\t(property "Value" "PWR_FLAG" (at %.2f %.2f 0)(effects (font (size 1.27 1.27))))' % (sx, sy+2.54))
        out.append('\t\t(instances (project "openrb" (path "/%s" (reference "#FLG%d")(unit 1))))' % (ROOT, k))
        out.append('\t)')
        labels.append('\t(label "%s" (at %.2f %.2f 0)(effects (font (size 1.27 1.27))(justify left bottom))(uuid "%s"))' % (net, sx+ppx, sy-ppy, uid()))
    out += labels + ncs
    out.append('\t(sheet_instances (path "/" (page "1")))')
    out.append(')')
    os.makedirs(OUTDIR, exist_ok=True)
    with open(os.path.join(OUTDIR, "openrb.kicad_sch"), "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")
    # minimal project file
    with open(os.path.join(OUTDIR, "openrb.kicad_pro"), "w", encoding="utf-8") as f:
        f.write('{\n  "meta": {"filename": "openrb.kicad_pro", "version": 1},\n  "sheets": [["%s", ""]]\n}\n' % ROOT)
    print("wrote", os.path.join(OUTDIR, "openrb.kicad_sch"), "with", len(DESIGN), "components,", len(labels), "labels,", len(ncs), "no-connects")

if __name__ == "__main__":
    main()
