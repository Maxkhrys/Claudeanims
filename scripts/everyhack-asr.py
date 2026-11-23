# Usage: python3 scripts/everyhack-asr.py <model dir prefix in d=...> block.wav ...  -> block.wav.json (tokens + timestamps)
import sys, json, wave, numpy as np, sherpa_onnx
d='sherpa-onnx-zipformer-en-2023-06-26/'
r=sherpa_onnx.OfflineRecognizer.from_transducer(encoder=d+'encoder-epoch-99-avg-1.int8.onnx',decoder=d+'decoder-epoch-99-avg-1.onnx',joiner=d+'joiner-epoch-99-avg-1.int8.onnx',tokens=d+'tokens.txt',num_threads=4)
for f in sys.argv[1:]:
    w=wave.open(f); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
    s=r.create_stream(); s.accept_waveform(16000,a); r.decode_stream(s)
    res=s.result
    json.dump({'text':res.text,'tokens':res.tokens,'ts':res.timestamps},open(f+'.json','w'))
    print(f, res.text)
