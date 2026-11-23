#!/usr/bin/env python3
"""Extra synthesized sound effects for the Top 5 crypto video (public/sfx).
boom, firework, crowd, flatline, beep, crack, dissolve, kaching, heartbeat, creak, plane.
Usage: python3 scripts/make-sfx-crypto.py  (needs numpy)"""
import os, wave
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
rng = np.random.default_rng(11)


def save(name, x, peak=0.9):
    x = np.asarray(x, dtype=np.float64)
    x = x / max(1e-9, np.max(np.abs(x))) * peak
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def t_(sec):
    return np.arange(int(SR * sec)) / SR


def lp(x, a):
    """one-pole low-pass, a in 0..1 (1 = open)"""
    y = np.zeros_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc); y[i] = acc
    return y


def hp(x, a):
    return x - lp(x, a)


def env(n, attack, decay):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(1e-4, attack)) * np.exp(-t / decay)


def sweep(sec, f0, f1, curve=1.0):
    t = t_(sec); k = (t / sec) ** curve
    f = f0 + (f1 - f0) * k
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


# boom: sub drop + noise thump + tail
n = int(SR * 2.2)
sub = sweep(2.2, 110, 32, 0.35) * env(n, 0.002, 0.55)
thump = lp(rng.uniform(-1, 1, n), 0.08) * env(n, 0.001, 0.08) * 2.5
tail = lp(rng.uniform(-1, 1, n), 0.02) * env(n, 0.01, 0.7) * 1.2
save("boom", sub * 1.4 + thump + tail)

# firework: rising whistle, then crackling burst
whistle = sweep(0.55, 900, 2600, 1.2) * np.linspace(0.2, 0.6, int(SR * 0.55))
burst_n = int(SR * 1.6)
burst = lp(rng.uniform(-1, 1, burst_n), 0.25) * env(burst_n, 0.001, 0.12) * 2
crackle = np.zeros(burst_n)
for _ in range(90):
    p = int(rng.uniform(0.05, 1.5) * SR)
    L = int(SR * 0.006)
    if p + L < burst_n:
        crackle[p:p + L] += rng.uniform(-1, 1, L) * rng.uniform(0.3, 1) * np.exp(-p / SR * 1.6)
save("firework", np.concatenate([whistle, burst + crackle]))

# crowd: swelling cheer (band-passed noise with slow wobble)
n = int(SR * 3.0)
t = t_(3.0)
c = hp(lp(rng.uniform(-1, 1, n), 0.18), 0.02)
wob = 0.7 + 0.3 * np.sin(2 * np.pi * 3.1 * t) * np.sin(2 * np.pi * 0.7 * t)
shape = np.minimum(1, t / 0.5) * np.minimum(1, (3.0 - t) / 1.2)
save("crowd", c * wob * shape, 0.7)

# beep: one heart-monitor beep
b = np.sin(2 * np.pi * 1000 * t_(0.16)) * np.minimum(1, (0.16 - t_(0.16)) / 0.02)
save("beep", np.concatenate([b, np.zeros(int(SR * 0.1))]), 0.6)

# flatline: beep beep then a long tone
seg = []
for _ in range(2):
    seg += [np.sin(2 * np.pi * 1000 * t_(0.14)), np.zeros(int(SR * 0.36))]
seg.append(np.sin(2 * np.pi * 1000 * t_(2.2)) * np.minimum(1, (2.2 - t_(2.2)) / 0.3))
save("flatline", np.concatenate(seg), 0.55)

# crack: sharp glass/ice crack
n = int(SR * 0.9)
cr = np.zeros(n)
for k in range(14):
    p = int((k * 0.018 + rng.uniform(0, 0.01)) * SR)
    L = int(SR * 0.012)
    cr[p:p + L] += hp(rng.uniform(-1, 1, L), 0.6) * (1 - k / 16)
cr += hp(rng.uniform(-1, 1, n), 0.4) * env(n, 0.001, 0.05)
cr += sweep(0.9, 420, 60, 0.5) * env(n, 0.001, 0.12) * 0.5
save("crack", cr)

# dissolve: glittery downward shimmer
n = int(SR * 1.5)
t = t_(1.5)
d = np.zeros(n)
for _ in range(220):
    p = int(rng.uniform(0, 1.3) * SR); L = int(SR * 0.03)
    f = rng.uniform(1800, 6000) * (1 - p / n * 0.6)
    if p + L < n:
        d[p:p + L] += np.sin(2 * np.pi * f * np.arange(L) / SR) * np.exp(-np.arange(L) / (SR * 0.008)) * rng.uniform(0.2, 1)
d += hp(rng.uniform(-1, 1, n), 0.3) * np.exp(-t / 0.5) * 0.25
save("dissolve", d * np.minimum(1, (1.5 - t) / 0.4), 0.75)

# kaching: two bright bell strikes + a drawer clunk
def bell(sec, f):
    tt = t_(sec)
    return sum(np.sin(2 * np.pi * f * m * tt) * a for m, a in [(1, 1), (2.76, 0.5), (5.4, 0.25)]) * np.exp(-tt / 0.25)
k = np.zeros(int(SR * 1.0))
k[:int(SR * 0.08)] += lp(rng.uniform(-1, 1, int(SR * 0.08)), 0.15) * np.exp(-t_(0.08) / 0.02) * 2
b1 = bell(0.8, 2100); k[int(SR * 0.08):int(SR * 0.08) + len(b1)] += b1
b2 = bell(0.8, 2650)[:len(k) - int(SR * 0.17)]; k[int(SR * 0.17):int(SR * 0.17) + len(b2)] += b2
save("kaching", k, 0.75)

# heartbeat: lub-dub
def thud(f, d):
    tt = t_(0.25)
    return np.sin(2 * np.pi * f * tt) * np.exp(-tt / d)
hb = np.concatenate([thud(55, 0.05), np.zeros(int(SR * 0.08)), thud(48, 0.06) * 0.7, np.zeros(int(SR * 0.3))])
save("heartbeat", hb)

# creak: slow wooden/metal creak
n = int(SR * 1.2); t = t_(1.2)
f = 140 + 60 * np.sin(2 * np.pi * 0.8 * t) + 40 * t
saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
cre = lp(saw * (0.6 + 0.4 * (rng.uniform(0, 1, n) > 0.6)), 0.3) * np.minimum(1, t / 0.1) * np.minimum(1, (1.2 - t) / 0.3)
save("creak", cre, 0.6)

# plane: jet pass-by (filtered noise swell + doppler hum)
n = int(SR * 2.5); t = t_(2.5)
pl = lp(rng.uniform(-1, 1, n), 0.12) + 0.3 * sweep(2.5, 320, 180, 1.0)
shape = np.exp(-((t - 1.1) / 0.6) ** 2)
save("plane", pl * shape, 0.7)
print("ok")
