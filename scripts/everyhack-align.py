# Aligns sherpa-onnx token timestamps onto the script words of each recorded block.
import json, re, sys, difflib
script = open(sys.argv[1]).read()
blocks = re.split(r'=+ BLOCK (\d+): [^=]+=+', script)
txt = {int(blocks[i]): blocks[i+1] for i in range(1, len(blocks), 2)}
def clean(t):
    t = t.split('==========')[0]
    t = t.replace('TEASER:', '')
    t = re.sub(r'\[[^\]]*\]', ' ', t)
    return t.split()
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
def asr_words(f):
    d = json.load(open(f)); toks, ts = d['tokens'], d['ts']
    words = []
    for t, s in zip(toks, ts):
        if t.startswith(' ') or not words: words.append([t.strip(), s])
        else: words[-1][0] += t
    out = []
    for i, (w, s) in enumerate(words):
        e = words[i+1][1] - 0.02 if i+1 < len(words) else s + 0.4
        e = min(e, s + 0.12 * len(w) + 0.2)
        out.append((w, s, max(e, s + 0.08)))
    return out
# usage: python3 scripts/everyhack-align.py <script.txt> <outDir> <block>:<asr.json> ...
# asr.json = sherpa-onnx result {tokens, ts} for that block's mp3 (zipformer-en-2023-06-26, see memory/README)
SCRIPT, OUT = sys.argv[1], sys.argv[2]
jobs = [(int(a.split(':')[0]), a.split(':')[1], 'block%02d' % int(a.split(':')[0])) for a in sys.argv[3:]]
for blk, wav, name in jobs:
    sw = clean(txt[blk]); aw = asr_words(wav)
    # character streams
    achars, atimes = [], []
    for w, s, e in aw:
        n = norm(w)
        for k, ch in enumerate(n):
            achars.append(ch); atimes.append(s + (e - s) * k / max(1, len(n)))
    schars, sidx = [], []
    for i, w in enumerate(sw):
        for ch in norm(w): schars.append(ch); sidx.append(i)
    sm = difflib.SequenceMatcher(None, ''.join(schars), ''.join(achars), autojunk=False)
    cmap = {}
    for a, b, n in sm.get_matching_blocks():
        for k in range(n): cmap[a+k] = atimes[b+k]
    starts = [None]*len(sw); ends=[None]*len(sw)
    for ci, wi in enumerate(sidx):
        if ci in cmap:
            if starts[wi] is None: starts[wi] = cmap[ci]
            ends[wi] = cmap[ci]
    # interpolate missing
    for i in range(len(sw)):
        if starts[i] is None:
            prev = next((ends[j] for j in range(i-1,-1,-1) if ends[j] is not None), 0)
            nxt = next((starts[j] for j in range(i+1,len(sw)) if starts[j] is not None), prev+0.4)
            starts[i] = prev + 0.05; ends[i] = max(starts[i]+0.1, nxt-0.05)
    words = []
    for i, w in enumerate(sw):
        e = ends[i] + 0.12
        if i+1 < len(sw): e = min(e, starts[i+1] - 0.01)
        words.append({'text': w, 'start': round(starts[i],3), 'end': round(max(e, starts[i]+0.08),3)})
    json.dump({'clip': name, 'model': 'sherpa-zipformer-en + script align', 'words': words}, open(f'{OUT}/{name}.json','w'), indent=1)
    print(name, len(words), words[-1], sm.ratio())
