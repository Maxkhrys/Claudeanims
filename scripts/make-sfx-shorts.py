#!/usr/bin/env python3
"""Extra sound effects for the Shorts (tension bed, call chimes, ring tones). Needs numpy.
Usage: python3 scripts/make-sfx-shorts.py"""
import os, wave
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
rng = np.random.default_rng(7)


def save(name, x, peak=0.85):
    x = x / max(1e-9, np.abs(x).max()) * peak
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def t(sec):
    return np.arange(int(SR * sec)) / SR


def fade(x, a=0.005, r=0.03):
    n = len(x); e = np.ones(n)
    a, r = int(a * SR), int(r * SR)
    e[:a] = np.linspace(0, 1, a); e[-r:] = np.linspace(1, 0, r)
    return x * e


def lowpass(x, k):
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += k * (v - acc); y[i] = acc
    return y


# bed: 60 s low drone that slowly swells, with a soft pulse once a second
tt = t(60)
drone = sum(np.sin(2 * np.pi * f * tt + p) * a for f, a, p in
            [(55, 1, 0), (55.4, .8, 1), (82.5, .45, 2), (110.3, .3, .5), (164.8, .12, 1.3), (27.5, .7, 0)])
drone *= 0.75 + 0.25 * np.sin(2 * np.pi * 0.11 * tt)
air = lowpass(rng.uniform(-1, 1, len(tt)), 0.02) * 1.5 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.07 * tt + 1))
pulse = np.zeros_like(tt)
pt = t(0.35); hit = np.sin(2 * np.pi * (70 - 60 * pt) * pt) * np.exp(-14 * pt)
for s in np.arange(0.5, 59.5, 1.0):
    i = int(s * SR); pulse[i:i + len(hit)] += hit * (0.5 + 0.5 * min(1, s / 40))
bed = (drone * 0.5 + air + pulse * 1.3) * (0.6 + 0.4 * np.minimum(1, tt / 40))
save("bed", fade(bed, 0.3, 1.5), 0.8)

# join: two-note rising chime when someone joins a call
def bell(f, sec=0.5):
    x = t(sec)
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * 2 * f * x)) * np.exp(-9 * x)
j = np.zeros(int(SR * 0.7)); a = bell(660); b = bell(990)
j[:len(a)] += a; o = int(0.11 * SR); j[o:o + len(b)] += b[:len(j) - o]
save("join", fade(j), 0.7)

# ring: one cycle of a soft digital ringtone (1.4 s)
r = np.zeros(int(SR * 1.4))
for k, f in enumerate([784, 988, 1175, 988, 784, 988, 1175, 988]):
    n = bell(f, 0.22); o = int(k * 0.13 * SR); r[o:o + len(n)] += n
save("ring", fade(r), 0.7)

# dial: UK ringback, two bursts of 400+450 Hz
d = np.zeros(int(SR * 1.2))
bt = t(0.4); burst = fade((np.sin(2 * np.pi * 400 * bt) + np.sin(2 * np.pi * 450 * bt)), 0.01, 0.01)
d[:len(burst)] += burst; o = int(0.6 * SR); d[o:o + len(burst)] += burst
save("dial", d, 0.5)

# boom: deep sub hit with a noise tail
bt = t(1.6)
boom = np.sin(2 * np.pi * (90 * np.exp(-6 * bt) + 34) * bt) * np.exp(-3 * bt)
boom += lowpass(rng.uniform(-1, 1, len(bt)), 0.05) * np.exp(-7 * bt) * 2
save("boom", fade(boom, 0.002, 0.2), 0.95)
