// Offline HTML5 Canvas Charts
const Charts = {
    drawAll() {
        this.drawBar();
        this.drawDonut();
    },
    drawBar() {
        const c = document.getElementById('barChartCanvas');
        if (!c) return;
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data = DB.getStats().weeklyCompleted || [3, 4, 3, 5, 4, 6, 4];
        const max = Math.max(...data, 8);
        const padX = 45, baseY = 210, barW = 36, gap = 20;

        data.forEach((v, i) => {
            const h = (v / max) * 155;
            const x = padX + i * (barW + gap);
            const y = baseY - h;

            const grad = ctx.createLinearGradient(x, y, x, baseY);
            grad.addColorStop(0, '#6366f1');
            grad.addColorStop(1, '#a855f7');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect(x, y, barW, h, 6);
            ctx.fill();

            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(v, x + barW / 2, y - 8);
            ctx.fillText(days[i], x + barW / 2, baseY + 18);
        });
    },
    drawDonut() {
        const c = document.getElementById('donutChartCanvas');
        if (!c) return;
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);

        const tasks = DB.getTasks();
        let high = 0, med = 0, low = 0;
        tasks.forEach(t => {
            if (t.priorityScore >= 8) high++;
            else if (t.priorityScore >= 5.5) med++;
            else low++;
        });

        const total = Math.max(1, tasks.length);
        const segments = [
            { val: high, clr: '#f43f5e', lbl: `Critical (${high})` },
            { val: med, clr: '#f59e0b', lbl: `Medium (${med})` },
            { val: low, clr: '#06b6d4', lbl: `Normal (${low})` }
        ];

        let angle = -0.5 * Math.PI;
        segments.forEach(seg => {
            const slice = (seg.val / total) * 2 * Math.PI;
            ctx.beginPath();
            ctx.arc(125, 125, 75, angle, angle + slice);
            ctx.lineWidth = 24;
            ctx.strokeStyle = seg.clr;
            ctx.stroke();
            angle += slice;
        });

        let ly = 85;
        segments.forEach(seg => {
            ctx.fillStyle = seg.clr;
            ctx.fillRect(240, ly - 10, 14, 14);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '600 13px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(seg.lbl, 264, ly + 2);
            ly += 32;
        });
    }
};
