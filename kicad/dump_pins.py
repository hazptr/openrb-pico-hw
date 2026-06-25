import sys, re
text = open(sys.argv[1], encoding='utf-8').read()
def block(name):
    i = text.find('(symbol "%s"' % name)
    if i<0: return None
    d=0; j=i
    while j<len(text):
        if text[j]=='(':d+=1
        elif text[j]==')':
            d-=1
            if d==0: return text[i:j+1]
        j+=1
def pins(b):
    out=[]
    for m in re.finditer(r'\(pin\s+\S+\s+\S+\s*\(at ([-\d.]+) ([-\d.]+) ([-\d.]+)\)(.*?)(?=\(pin |\Z)', b, re.S):
        x,y,a,rest=m.groups()
        nm=re.search(r'\(name "([^"]*)"',rest); nu=re.search(r'\(number "([^"]*)"',rest)
        out.append((nu.group(1) if nu else '?', nm.group(1) if nm else '', float(x),float(y)))
    return out
for name in sys.argv[2:]:
    b=block(name)
    if not b: print(f"## {name}: NOT FOUND"); continue
    ps=pins(b)
    print(f"## {name}  ({len(ps)} pins)")
    print("  " + "  ".join(f"{nu}:{nm}" for nu,nm,x,y in ps))
