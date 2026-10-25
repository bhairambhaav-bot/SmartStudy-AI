// Deep Focus Studio + Offline Web Audio Brown Noise Generator
const FocusStudio = {
    totalSecs: 25 * 60,
    leftSecs: 25 * 60,
    interval: null,
    running: false,
    audioCtx: null,
    noiseNode: null,
    noisePlaying: false,

    setMode(mins, label, ev) {
        this.pause();
        this.totalSecs = mins * 60;
        this.leftSecs = this.totalSecs;
        document.getElementById('pomoSubLabel').textContent = label;
        this.updateUI();

        document.querySelectorAll('.pomo-mode-btn').forEach(b => b.classList.remove('active'));
        if (ev && ev.target) ev.target.classList.add('active');
    },

    start() {
        if (this.running) return;
        this.running = true;
        document.getElementById('pomoStartBtn').disabled = true;
        document.getElementById('pomoPauseBtn').disabled = false;

        this.interval = setInterval(() => {
            if (this.leftSecs > 0) {
                this.leftSecs--;
                this.updateUI();
            } else {
                this.finish();
            }
        }, 1000);
    },

    pause() {
        this.running = false;
        clearInterval(this.interval);
        const s = document.getElementById('pomoStartBtn');
        const p = document.getElementById('pomoPauseBtn');
        if (s) s.disabled = false;
        if (p) p.disabled = true;
    },

    reset() {
        this.pause();
        this.leftSecs = this.totalSecs;
        this.updateUI();
    },

    updateUI() {
        const m = Math.floor(this.leftSecs / 60);
        const s = this.leftSecs % 60;
        const el = document.getElementById('pomoTimeDisplay');
        if (el) el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    },

    finish() {
        this.pause();
        const st = DB.getStats();
        st.focusMinutes = (st.focusMinutes || 0) + Math.floor(this.totalSecs / 60);
        DB.saveStats(st);
        DB.addXP(75);
        UI.renderAll();
    },

    toggleBrownNoise() {
        const btn = document.getElementById('whiteNoiseBtn');
        if (!this.noisePlaying) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
            const bufferSize = 4096;
            let lastOut = 0.0;
            this.noiseNode = this.audioCtx.createScriptProcessor(bufferSize, 1, 1);
            this.noiseNode.onaudioprocess = function(e) {
                const output = e.outputBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    const white = Math.random() * 2 - 1;
                    output[i] = (lastOut + (0.02 * white)) / 1.02;
                    lastOut = output[i];
                    output[i] *= 0.15;
                }
            };
            this.noiseNode.connect(this.audioCtx.destination);
            this.noisePlaying = true;
            btn.textContent = '🎧 Offline Focus Sound: ON';
            btn.classList.add('btn-primary');
            UI.showToast('🎧 Offline Soothing Brown Noise Active!');
        } else {
            if (this.noiseNode) this.noiseNode.disconnect();
            if (this.audioCtx) this.audioCtx.close();
            this.noisePlaying = false;
            btn.textContent = '🎧 Offline Focus Sound: OFF';
            btn.classList.remove('btn-primary');
        }
    }
};
