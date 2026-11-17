#!/usr/bin/env python3
"""Synthesizes the sound effects in public/sfx. No samples, no dependencies.
Usage: python3 scripts/make-sfx.py"""
import math, random, struct, wave, os

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
random.seed(7)


def save(name, samples, peak=0.85):
    m = max(1e-9, max(abs(s) for s in samples))
    data = b"".join(struct.pack("<h", int(max(-1, min(1, s / m * peak)) * 32767)) for s in samples)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data)


def buf(sec):
    return [0.0] * int(SR * sec)


def noise(n, lp=1.0, hp=0.0):
    """white noise through one-pole low-pass (lp: 0..1, 1 = open) and high-pass."""
    out, y, prev_x, hy = [], 0.0, 0.0, 0.0
    for _ in range(n):
        x = random.uniform(-1, 1)
        y += lp * (x - y)
        hy = hp * (hy + y - prev_x) if hp else y
        prev_x = y
        out.append(hy)
    return out


def add(dst, src, at=0.0, gain=1.0):
    o = int(at * SR)
    for i, s in enumerate(src):
        if 0 <= o + i < len(dst):
            dst[o + i] += s * gain


def tone(sec, f0, f1=None, decay=6.0, shape="sine"):
    n, out, ph = int(SR * sec), [], 0.0
    f1 = f0 if f1 is None else f1
    for i in range(n):
        t = i / n
        f = f0 + (f1 - f0) * t
        ph += 2 * math.pi * f / SR
        v = math.sin(ph) if shape == "sine" else (1.0 if math.sin(ph) > 0 else -1.0)
        out.append(v * math.exp(-decay * t))
    return out


def env(samples, attack=0.005, release=0.02):
    n, a, r = len(samples), int(attack * SR), int(release * SR)
    return [s * min(1, i / max(1, a)) * min(1, (n - i) / max(1, r)) for i, s in enumerate(samples)]


def key_click(gain=1.0):
    n = int(SR * random.uniform(0.012, 0.022))
    body = noise(n, lp=random.uniform(0.35, 0.6), hp=0.9)
    click = [s * math.exp(-9 * i / n) for i, s in enumerate(body)]
    thock = tone(0.03, random.uniform(180, 260), 120, decay=7)
    out = buf(0.035)
    add(out, click, 0, gain)
    add(out, thock, 0, 0.5 * gain)
    return out


# typing loop: irregular keystrokes, ~13 per second
b = buf(2.0)
t = 0.02
while t < 1.95:
    add(b, key_click(random.uniform(0.6, 1.0)), t)
    t += random.uniform(0.045, 0.11)
save("type", b, 0.55)

# counter tick loop: fast soft blips
b = buf(1.0)
for i in range(28):
    add(b, env(tone(0.018, 1500 + (i % 4) * 140, decay=3)), i / 28, 0.8)
save("tick", b, 0.4)

# single ui click
save("click", key_click(), 0.6)

# pop
save("pop", env(tone(0.09, 420, 980, decay=5)), 0.5)

# title slam: sub boom + crack
b = buf(0.9)
add(b, tone(0.9, 95, 38, decay=5.5), 0, 1.0)
add(b, [s * math.exp(-28 * i / (SR * 0.25)) for i, s in enumerate(noise(int(SR * 0.25), lp=0.5))], 0, 0.9)
add(b, tone(0.3, 220, 110, decay=9, shape="square"), 0, 0.15)
save("slam", b, 0.9)

# stamp: dull thud + paper slap
b = buf(0.45)
add(b, tone(0.4, 130, 70, decay=9), 0, 1.0)
add(b, [s * math.exp(-40 * i / (SR * 0.12)) for i, s in enumerate(noise(int(SR * 0.12), lp=0.25))], 0, 1.0)
save("stamp", b, 0.85)

# glitch: stuttering digital bursts
b = buf(0.4)
t = 0.0
while t < 0.38:
    d = random.uniform(0.012, 0.05)
    if random.random() < 0.75:
        f = random.choice([90, 180, 440, 1200, 2400, 3300])
        seg = tone(d, f, f * random.choice([1, 1, 0.5, 2]), decay=0.5, shape="square")
        crush = max(1, int(random.choice([1, 4, 9, 16])))
        seg = [seg[(i // crush) * crush] for i in range(len(seg))]
        add(b, seg, t, random.uniform(0.3, 0.7))
    else:
        add(b, noise(int(SR * d), lp=0.9), t, 0.6)
    t += d + random.uniform(0, 0.02)
save("glitch", env(b, 0.002, 0.04), 0.5)

# whoosh
n = int(SR * 0.45)
w = noise(n, lp=0.12)
save("whoosh", [s * math.sin(math.pi * i / n) ** 2 for i, s in enumerate(w)], 0.5)

# coin / cash register: two bright partials with shimmer, plus a drawer click
b = buf(0.9)
add(b, key_click(1.0), 0.0, 0.7)
for f, g, at in [(1318.5, 1.0, 0.03), (1975.5, 0.8, 0.09), (2637, 0.35, 0.09), (3951, 0.2, 0.09)]:
    add(b, tone(0.75, f, decay=5), at, g)
save("coin", b, 0.5)

# notification: soft two-note chime
b = buf(0.5)
add(b, env(tone(0.22, 880, decay=4)), 0.0, 1.0)
add(b, env(tone(0.3, 1174.7, decay=4)), 0.11, 1.0)
save("notify", b, 0.45)

# error: descending buzz
b = buf(0.45)
add(b, env(tone(0.2, 220, 200, decay=1, shape="square")), 0, 0.5)
add(b, env(tone(0.22, 165, 150, decay=1, shape="square")), 0.2, 0.5)
save("error", b, 0.4)

# riser: tension build
n = int(SR * 1.6)
r = noise(n, lp=0.2)
ph = 0.0
out = []
for i in range(n):
    t = i / n
    ph += 2 * math.pi * (120 + 700 * t * t) / SR
    out.append((r[i] * 0.6 + math.sin(ph) * 0.5) * t * t)
save("riser", env(out, 0.01, 0.01), 0.55)

# car crash: impact, crunch, glass
b = buf(1.5)
add(b, tone(0.8, 80, 30, decay=5), 0, 1.2)
add(b, [s * math.exp(-5 * i / (SR * 0.9)) for i, s in enumerate(noise(int(SR * 0.9), lp=0.35))], 0, 1.0)
for _ in range(40):
    at = random.uniform(0.05, 0.9)
    add(b, tone(random.uniform(0.02, 0.06), random.uniform(2500, 6500), decay=6), at, random.uniform(0.05, 0.22) * (1 - at))
save("crash", b, 0.9)

# heavy metal door
b = buf(1.3)
add(b, tone(0.5, 70, 45, decay=7), 0, 1.0)
add(b, [s * math.exp(-30 * i / (SR * 0.15)) for i, s in enumerate(noise(int(SR * 0.15), lp=0.4))], 0, 0.8)
for f, g in [(211, 0.5), (347, 0.35), (523, 0.25), (797, 0.15)]:
    add(b, tone(1.2, f, decay=4.5), 0.01, g)
save("door", b, 0.7)

# garage door / mechanical rumble loop
n = int(SR * 1.0)
rum = noise(n, lp=0.04)
b = [rum[i] * 2.5 + 0.25 * math.sin(2 * math.pi * 55 * i / SR) + (0.3 if (i // 1470) % 2 == 0 and i % 1470 < 160 else 0) * random.uniform(-1, 1) for i in range(n)]
save("rumble", b, 0.45)

# camera shutter / snap
b = buf(0.18)
add(b, key_click(1.0), 0.0)
add(b, key_click(0.8), 0.07)
save("snap", b, 0.6)

print("wrote", len(os.listdir(OUT)), "sounds to public/sfx")
