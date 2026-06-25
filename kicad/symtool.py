import re, sys

def load(path):
    with open(path, encoding='utf-8') as f:
        return f.read()

def blocks(text):
    """Return list of (name, start, end) for each top-level (symbol "...") at 2-space indent."""
    out = []
    for m in re.finditer(r'\n  \(symbol "([^"]+)"', text):
        name = m.group(1); i = m.start() + 1
        depth = 0; j = i
        while j < len(text):
            c = text[j]
            if c == '(':
                depth += 1
            elif c == ')':
                depth -= 1
                if depth == 0:
                    out.append((name, i, j + 1)); break
            j += 1
    return out

def get_block(text, name):
    for n, s, e in blocks(text):
        if n == name:
            return text[s:e]
    return None

def pins(block):
    """Return list of (number, name, x, y) connection points."""
    out = []
    for m in re.finditer(r'\(pin\s', block):
        seg = block[m.start():m.start() + 400]
        at = re.search(r'\(at ([-\d.]+) ([-\d.]+) ([-\d.]+)\)', seg)
        nu = re.search(r'\(number "([^"]*)"', seg)
        nm = re.search(r'\(name "([^"]*)"', seg)
        if at and nu:
            out.append((nu.group(1), nm.group(1) if nm else '', float(at.group(1)), float(at.group(2))))
    return out

if __name__ == '__main__':
    text = load(sys.argv[1])
    if len(sys.argv) > 2 and sys.argv[2] == '--names':
        for n, _, _ in blocks(text):
            print(n)
    elif len(sys.argv) > 2:
        blk = get_block(text, sys.argv[2])
        if not blk:
            print("NOT FOUND"); sys.exit(1)
        ps = pins(blk)
        print(f"{sys.argv[2]}: {len(ps)} pins")
        for nu, nm, x, y in sorted(ps, key=lambda p: (len(p[0]), p[0])):
            print(f"  {nu:>4} {nm:<16} ({x:>7.2f},{y:>7.2f})")
