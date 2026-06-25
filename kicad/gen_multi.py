#!/usr/bin/env python3
"""Multi-sheet version of the OpenRB rev 0.2 schematic: a root sheet with three
child pages (USB/host, MCU, MIDI), components grouped by subsection. Reuses the
verified DESIGN + symbols from gen_sch.py. Cross-sheet connectivity is by global
labels (net name spans all pages). Validate with kicad-cli on openrb.kicad_sch."""
import os, re, uuid

HERE = os.path.dirname(os.path.abspath(__file__))
OUTDIR = os.path.join(HERE, "openrb")

# load gen_sch.py members without running its main()
_src = open(os.path.join(HERE, "gen_sch.py")).read().replace(
    'if __name__ == "__main__":\n    main()', '')
G = {"__file__": os.path.join(HERE, "gen_sch.py")}
exec(compile(_src, "gen_sch.py", "exec"), G)
DESIGN = G["DESIGN"]; get_block = G["get_block"]; sym_pins = G["sym_pins"]
POWER_NETS = G["POWER_NETS"]
def uid(): return str(uuid.uuid4())

# ---- subsection grouping (sheet -> ordered [(title, [refs])]) ----
GROUPS = {
 "USB": [
   ("USB-C INPUT / ESD", ["USBC1","D2","R15","R14","R1","R3"]),
   ("USB 2.0 HUB (CH334R)", ["U2","X2","C19","C20"]),
   ("USB-A HOST PORTS", ["USB0","USB1"]),
   ("+5V BULK", ["C12","C13","C14","C17"]),
 ],
 "MCU": [
   ("RP2040", ["U1"]),
   ("DECOUPLING", ["C1","C2","C3","C4","C5","C6","C7","C8","C9","C10","C11","C18"]),
   ("QSPI FLASH", ["U5","R10","BOOT"]),
   ("12MHz OSCILLATOR", ["X1","R12","C15","C16"]),
   ("3V3 REGULATOR", ["U4","R9","F1","H2"]),
   ("RESET", ["RESET","R11","R13"]),
   ("SWD / DEBUG UART", ["SWD1","UART"]),
   ("STATUS LEDS", ["LED_AUTH","LED_3V3","LED_5V","R6","R8","R7"]),
 ],
 "MIDI": [
   ("SERIAL MIDI INPUT", ["MIDI","U6","D1","R2","R4"]),
 ],
}
SHEET_ORDER = ["USB", "MCU", "MIDI"]
SHEET_FILE = {"USB": "usb.kicad_sch", "MCU": "mcu.kicad_sch", "MIDI": "midi.kicad_sch"}
PWR_SHEET = "MCU"

# validate every component is placed exactly once
placed = [r for s in SHEET_ORDER for _, refs in GROUPS[s] for r in refs]
assert sorted(placed) == sorted(DESIGN), (set(DESIGN) ^ set(placed))

ROOT = uid()
SHEET_UUID = {s: uid() for s in SHEET_ORDER}   # uuid of each sheet symbol in root

_blk = {}
def block(sym):
    if sym not in _blk: _blk[sym] = get_block(sym)
    return _blk[sym]
def pins(sym): return sym_pins(block(sym))
def bbox(sym):
    p = pins(sym); xs = [x for x, _ in p.values()]; ys = [y for _, y in p.values()]
    return min(xs), max(xs), min(ys), max(ys)

# ---- flow layout within a sheet ----
SHEET_W = 1050.0; MARGIN = 30.0; LAB = 26.0; VPAD = 12.0; GROUP_GAP = 22.0; GAP = 14.0

def layout(sheet):
    """return (placements {ref:(x,y)}, titles [(text,x,y)])."""
    place = {}; titles = []; y = MARGIN
    for title, refs in GROUPS[sheet]:
        titles.append((title, MARGIN, y))
        y += 12.0
        x = MARGIN; row_h = 0.0
        for ref in refs:
            sym = DESIGN[ref][0]
            mnx, mxx, mny, mxy = bbox(sym)
            cw = (mxx - mnx) + 2 * LAB; ch = (mxy - mny) + 2 * VPAD
            if x + cw > SHEET_W - MARGIN:
                x = MARGIN; y += row_h + GAP; row_h = 0.0
            ox = x + LAB - mnx          # origin so leftmost label sits at x+? keep pins inside cell
            oy = y + VPAD + mxy         # sch Y grows downward; place so top pin near y
            place[ref] = (round(ox, 2), round(oy, 2))
            x += cw + GAP; row_h = max(row_h, ch)
        y += row_h + GROUP_GAP
    return place, y

def sym_instance(ref, sym, val, fp, sx, sy, sheet):
    o = []
    o.append('\t(symbol (lib_id "openrb:%s") (at %.2f %.2f 0) (unit 1)' % (sym, sx, sy))
    o.append('\t\t(exclude_from_sim no)(in_bom yes)(on_board yes)(dnp no)')
    o.append('\t\t(uuid "%s")' % uid())
    o.append('\t\t(property "Reference" "%s" (at %.2f %.2f 0)(effects (font (size 1.27 1.27))))' % (ref, sx, sy - 2.54))
    o.append('\t\t(property "Value" "%s" (at %.2f %.2f 0)(effects (font (size 1.27 1.27))))' % (val, sx, sy + 2.54))
    o.append('\t\t(property "Footprint" "%s" (at %.2f %.2f 0)(effects (font (size 1.27 1.27))(hide yes)))' % (fp, sx, sy))
    o.append('\t\t(instances (project "openrb" (path "/%s/%s" (reference "%s")(unit 1))))' % (ROOT, SHEET_UUID[sheet], ref))
    o.append('\t)')
    return o

def glabel(net, x, y, left):
    ang = 180 if left else 0
    return ('\t(global_label "%s" (shape passive) (at %.2f %.2f %d)'
            '(effects (font (size 1.27 1.27))(justify %s))(uuid "%s"))'
            % (net, x, y, ang, "right" if left else "left", uid()))

def emit_child(sheet, file_uuid):
    place, _ = layout(sheet)
    used = sorted({DESIGN[r][0] for _, refs in GROUPS[sheet] for r in refs})
    if sheet == PWR_SHEET: used = sorted(set(used) | {"PWR_FLAG"})
    out = ['(kicad_sch', '\t(version 20250114)',
           '\t(generator "openrb_gen")(generator_version "10.0")',
           '\t(uuid "%s")' % file_uuid, '\t(paper "A1")', '\t(lib_symbols']
    for s in used: out.append(block(s))
    out.append('\t)')
    labels = []; ncs = []
    for title, tx, ty in layout_titles[sheet]:
        out.append('\t(text "%s" (at %.2f %.2f 0)(effects (font (size 2.0 2.0)(bold yes))(justify left))(uuid "%s"))'
                   % (title, tx, ty, uid()))
    for _, refs in GROUPS[sheet]:
        for ref in refs:
            sym, val, fp, nets = DESIGN[ref]
            sx, sy = place[ref]
            out += sym_instance(ref, sym, val, fp, sx, sy, sheet)
            for pnum, (px, py) in pins(sym).items():
                lx, ly = sx + px, sy - py
                net = nets.get(pnum, None)
                if net is None:
                    ncs.append('\t(no_connect (at %.2f %.2f)(uuid "%s"))' % (lx, ly, uid()))
                else:
                    labels.append(glabel(net, lx, ly, px < 0))
    # power flags on the power sheet drive the rails for all pages
    if sheet == PWR_SHEET:
        ppx, ppy = pins("PWR_FLAG")["1"]
        fy = MARGIN + 0.0
        base_y = max(y for _, _, y in layout_titles[sheet]) + 120.0
        for k, net in enumerate(POWER_NETS):
            sx = MARGIN + k * 40.0; sy = base_y
            out.append('\t(symbol (lib_id "openrb:PWR_FLAG") (at %.2f %.2f 0) (unit 1)' % (sx, sy))
            out.append('\t\t(exclude_from_sim no)(in_bom no)(on_board yes)(dnp no)')
            out.append('\t\t(uuid "%s")' % uid())
            out.append('\t\t(property "Reference" "#FLG%d" (at %.2f %.2f 0)(effects (font (size 1.27 1.27))(hide yes)))' % (k, sx, sy - 2.54))
            out.append('\t\t(property "Value" "PWR_FLAG" (at %.2f %.2f 0)(effects (font (size 1.27 1.27))))' % (sx, sy + 2.54))
            out.append('\t\t(instances (project "openrb" (path "/%s/%s" (reference "#FLG%d")(unit 1))))' % (ROOT, SHEET_UUID[sheet], k))
            out.append('\t)')
            labels.append(glabel(net, sx + ppx, sy - ppy, ppx < 0))
    out += labels + ncs
    out.append(')')
    open(os.path.join(OUTDIR, SHEET_FILE[sheet]), "w").write("\n".join(out) + "\n")

def emit_root(child_uuid):
    out = ['(kicad_sch', '\t(version 20250114)',
           '\t(generator "openrb_gen")(generator_version "10.0")',
           '\t(uuid "%s")' % ROOT, '\t(paper "A4")', '\t(lib_symbols\t)']
    x = 30.0; y = 30.0
    for i, s in enumerate(SHEET_ORDER):
        out.append('\t(sheet (at %.2f %.2f) (size 60 40)' % (x, y))
        out.append('\t\t(fields_autoplaced yes)(stroke (width 0.1524)(type solid))(fill (color 0 0 0 0.0000))')
        out.append('\t\t(uuid "%s")' % SHEET_UUID[s])
        out.append('\t\t(property "Sheetname" "%s" (at %.2f %.2f 0)(effects (font (size 1.27 1.27))(justify left bottom)))' % (s, x, y - 0.5))
        out.append('\t\t(property "Sheetfile" "%s" (at %.2f %.2f 0)(effects (font (size 1.27 1.27))(justify left top)))' % (SHEET_FILE[s], x, y + 40.5))
        out.append('\t\t(instances (project "openrb" (path "/%s" (page "%d"))))' % (ROOT, i + 2))
        out.append('\t)')
        y += 55.0
    out.append('\t(sheet_instances (path "/" (page "1")))')
    out.append(')')
    open(os.path.join(OUTDIR, "openrb.kicad_sch"), "w").write("\n".join(out) + "\n")

# precompute titles per sheet
layout_titles = {}
for s in SHEET_ORDER:
    place, _ = layout(s)
    # titles recomputed deterministically below
layout_titles = {s: [] for s in SHEET_ORDER}
def collect_titles():
    for s in SHEET_ORDER:
        _, _h = layout(s)
        ts = []
        y = MARGIN
        for title, refs in GROUPS[s]:
            ts.append((title, MARGIN, y)); y += 12.0
            x = MARGIN; row_h = 0.0
            for ref in refs:
                sym = DESIGN[ref][0]; mnx, mxx, mny, mxy = bbox(sym)
                cw = (mxx - mnx) + 2 * LAB; ch = (mxy - mny) + 2 * VPAD
                if x + cw > SHEET_W - MARGIN:
                    x = MARGIN; y += row_h + GAP; row_h = 0.0
                x += cw + GAP; row_h = max(row_h, ch)
            y += row_h + GROUP_GAP
        layout_titles[s] = ts
collect_titles()

os.makedirs(OUTDIR, exist_ok=True)
for s in SHEET_ORDER:
    emit_child(s, uid())
emit_root(uid())
with open(os.path.join(OUTDIR, "openrb.kicad_pro"), "w") as f:
    f.write('{\n  "meta": {"filename": "openrb.kicad_pro", "version": 1},\n  "sheets": [["%s", ""]]\n}\n' % ROOT)
print("wrote root + %d child sheets" % len(SHEET_ORDER))
