// Master Application Controller v5
const UI = {
    currentFilter: 'all',
    simulatedOffline: false,

    init() {
        DB.init();
        SyllabusAI.init();
        OfflineTutor.init();
        this.bindNav();
        this.bindForms();
        this.updateNetworkBadge();
        window.addEventListener('online', () => this.updateNetworkBadge());
        window.addEventListener('offline', () => this.updateNetworkBadge());
        NotesEngine.generateQuizFromNote();
        this.renderAll();
    },

    updateNetworkBadge() {
        const box = document.getElementById('netIndicator');
        const txt = document.getElementById('netText');
        const isOff = this.simulatedOffline || !navigator.onLine;
        if (isOff) {
            box.classList.add('offline-mode');
            txt.textContent = '⚡ 100% Offline Mode Active';
        } else {
            box.classList.remove('offline-mode');
            txt.textContent = '🌐 Hybrid Online (Upload Ready)';
        }
    },

    toggleOfflineSimulation() {
        this.simulatedOffline = !this.simulatedOffline;
        this.updateNetworkBadge();
        const btn = document.getElementById('simOfflineBtn');
        btn.textContent = this.simulatedOffline ? '🌐 Go Online' : '✈️ Sim Offline';
        this.showToast(this.simulatedOffline
            ? '✈️ Simulated Offline Mode ON! Notice how Timetable, Flashcards, Quiz & AI Bot still work 100%!'
            : '🌐 Back to Hybrid Online Mode (Ready for Syllabus Upload)');
    },

    onEnergyChange(level) {
        const st = DB.getStats();
        st.energy = level;
        DB.saveStats(st);

        // Recalculate AI Priority Scores dynamically based on new energy state
        const tasks = DB.getTasks();
        tasks.forEach(t => {
            t.priorityScore = SchedulerAI.computeScore(t, level);
        });
        DB.saveTasks(tasks);
        this.renderAll();
        this.showToast(`⚡ AI Timetable Re-Ranked for ${level.toUpperCase()} Energy!`);
    },

    bindNav() {
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', () => this.switchView(btn.dataset.target));
        });

        document.getElementById('themeBtn').addEventListener('click', () => {
            const html = document.documentElement;
            const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            document.getElementById('themeBtn').textContent = next === 'dark' ? '☀️ Light' : '🌙 Dark';
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('Reset all tasks, flashcards & habits back to B.Tech Demo Data?')) {
                DB.resetToDemo();
                this.renderAll();
                this.showToast('↺ Demo Data Restored!');
            }
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            const payload = { tasks: DB.getTasks(), habits: DB.getHabits(), cards: DB.getCards(), stats: DB.getStats() };
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'neuroplan_offline_backup_v5.json';
            a.click();
            this.showToast('💾 Offline JSON Backup Downloaded!');
        });
    },

    switchView(viewId) {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.target === viewId));
        document.querySelectorAll('.view-section').forEach(s => s.classList.toggle('active', s.id === viewId));
        if (viewId === 'view-analytics') Charts.drawAll();
        if (viewId === 'view-flashcards') FlashcardEngine.renderDeck();
    },

    bindForms() {
        document.getElementById('addTaskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const st = DB.getStats();
            const task = {
                id: 't_' + Date.now(),
                title: document.getElementById('tTitle').value,
                deadline: document.getElementById('tDeadline').value,
                duration: parseFloat(document.getElementById('tHours').value),
                difficulty: parseInt(document.getElementById('tDiff').value),
                importance: parseInt(document.getElementById('tWeight').value),
                completed: false
            };
            task.priorityScore = SchedulerAI.computeScore(task, st.energy || 'medium');
            task.reason = SchedulerAI.generateReason(task);

            const list = DB.getTasks();
            list.push(task);
            DB.saveTasks(list);
            e.target.reset();
            DB.addXP(25);
            this.renderAll();
        });

        document.getElementById('addCardForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const cards = DB.getCards();
            cards.unshift({
                id: 'fc_' + Date.now(),
                front: document.getElementById('fcFront').value,
                back: document.getElementById('fcBack').value,
                interval: 1,
                ef: 2.5,
                reps: 0,
                mastered: false
            });
            DB.saveCards(cards);
            e.target.reset();
            DB.addXP(30);
            this.renderAll();
        });

        document.getElementById('addHabitForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const list = DB.getHabits();
            list.push({
                id: 'hb_' + Date.now(),
                name: document.getElementById('hName').value,
                cue: document.getElementById('hCue').value,
                routine: document.getElementById('hRoutine').value,
                reward: document.getElementById('hReward').value,
                streak: 1,
                lastCheck: new Date().toISOString().split('T')[0]
            });
            DB.saveHabits(list);
            e.target.reset();
            DB.addXP(40);
            this.renderAll();
        });
    },

    filterTasks(mode, ev) {
        this.currentFilter = mode;
        document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        if (ev && ev.target) ev.target.classList.add('active');
        this.renderAll();
    },

    toggleTask(id) {
        const tasks = DB.getTasks();
        const item = tasks.find(t => t.id === id);
        if (item) {
            item.completed = !item.completed;
            DB.saveTasks(tasks);
            if (item.completed) DB.addXP(50);
            this.renderAll();
        }
    },

    deleteTask(id) {
        DB.saveTasks(DB.getTasks().filter(t => t.id !== id));
        this.renderAll();
    },

    checkInHabit(id) {
        const habits = DB.getHabits();
        const h = habits.find(x => x.id === id);
        if (!h) return;
        h.streak += 1;
        DB.saveHabits(habits);
        DB.addXP(50);
        this.renderAll();
    },

    renderAll() {
        const tasks = DB.getTasks();
        const habits = DB.getHabits();
        const cards = DB.getCards();
        const stats = DB.getStats();

        const xp = stats.xp || 450;
        const level = Math.floor(xp / 100) + 1;
        const prog = xp % 100;
        document.getElementById('userLevelBadge').textContent = `LVL ${level} Scholar`;
        document.getElementById('userXpText').textContent = `${xp} XP`;
        document.getElementById('userXpFill').style.width = `${prog}%`;

        const pending = tasks.filter(t => !t.completed);
        const done = tasks.filter(t => t.completed);
        const maxStreak = habits.length ? Math.max(...habits.map(h => h.streak)) : 0;

        document.getElementById('kpiPending').textContent = pending.length;
        document.getElementById('kpiCompletedSub').textContent = `${done.length} Completed`;
        document.getElementById('kpiFlashcards').textContent = `${cards.length} Cards`;
        document.getElementById('kpiStreak').textContent = `${maxStreak} Days`;
        document.getElementById('headerStreak').textContent = `${maxStreak} Days`;
        document.getElementById('headerFocus').textContent = `${(stats.focusMinutes / 60).toFixed(1)} hrs`;

        // Readiness Score
        const readiness = tasks.length ? Math.min(98, Math.round(65 + (done.length / tasks.length) * 35)) : 86;
        document.getElementById('kpiReadiness').textContent = `${readiness}%`;

        // XAI Banner
        const xai = SchedulerAI.getXAIAdvice(tasks, stats.energy || 'medium');
        document.getElementById('xaiHeadline').textContent = xai.headline;
        document.getElementById('xaiReasoning').textContent = xai.reasoning;

        const sorted = [...tasks].sort((a, b) => b.priorityScore - a.priorityScore);

        // Dashboard Priority List
        const dashStack = document.getElementById('dashPriorityList');
        dashStack.innerHTML = '';
        sorted.filter(t => !t.completed).slice(0, 4).forEach(t => {
            const b = SchedulerAI.getBadge(t.priorityScore);
            const div = document.createElement('div');
            div.className = 'stack-item';
            div.innerHTML = `
                <div>
                    <strong>${t.title}</strong>
                    <div class="text-muted" style="font-size:0.75rem;">🧠 ${t.reason || SchedulerAI.generateReason(t)}</div>
                </div>
                <span class="score-pill ${b.cls}">${b.label}</span>
            `;
            dashStack.appendChild(div);
        });

        // Dashboard Habits
        const dashHabits = document.getElementById('dashHabitList');
        dashHabits.innerHTML = '';
        habits.forEach(h => {
            const div = document.createElement('div');
            div.className = 'stack-item';
            div.innerHTML = `
                <div>
                    <strong>${h.name}</strong>
                    <div class="text-muted" style="font-size:0.75rem;">📍 Cue: ${h.cue}</div>
                </div>
                <button class="btn btn-emerald" style="padding:0.4rem 0.75rem; font-size:0.76rem;" onclick="UI.checkInHabit('${h.id}')">
                    🔥 ${h.streak}d (+50 XP)
                </button>
            `;
            dashHabits.appendChild(div);
        });

        // Full Timetable
        const tbody = document.getElementById('fullScheduleBody');
        tbody.innerHTML = '';
        let filtered = sorted;
        if (this.currentFilter === 'pending') filtered = sorted.filter(t => !t.completed);
        if (this.currentFilter === 'done') filtered = sorted.filter(t => t.completed);

        filtered.forEach(t => {
            const b = SchedulerAI.getBadge(t.priorityScore);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="checkbox" ${t.completed ? 'checked' : ''} onchange="UI.toggleTask('${t.id}')"></td>
                <td style="${t.completed ? 'text-decoration:line-through;opacity:0.5;' : ''}">
                    <strong>${t.title}</strong>
                    <div class="text-muted" style="font-size:0.73rem;">${t.reason || SchedulerAI.generateReason(t)}</div>
                </td>
                <td>${t.deadline}</td>
                <td>${t.duration}h</td>
                <td><span class="score-pill ${b.cls}">${b.label}</span></td>
                <td><button class="icon-btn danger" onclick="UI.deleteTask('${t.id}')">🗑️</button></td>
            `;
            tbody.appendChild(tr);
        });

        // Habit Cards
        const hBox = document.getElementById('habitCardsContainer');
        hBox.innerHTML = '';
        habits.forEach(h => {
            const card = document.createElement('div');
            card.className = 'habit-box';
            card.innerHTML = `
                <div>
                    <h4>${h.name}</h4>
                    <div class="habit-meta">
                        <div>📍 <strong>Cue:</strong> ${h.cue}</div>
                        <div>⚡ <strong>Routine:</strong> ${h.routine}</div>
                        <div>🎁 <strong>Reward:</strong> ${h.reward}</div>
                    </div>
                </div>
                <div style="text-align:right;">
                    <span class="score-pill score-med" style="display:inline-block;margin-bottom:6px;">🔥 ${h.streak} Day Streak</span><br>
                    <button class="btn btn-emerald" style="padding:0.4rem 0.85rem;font-size:0.78rem;" onclick="UI.checkInHabit('${h.id}')">✅ Complete Loop</button>
                </div>
            `;
            hBox.appendChild(card);
        });

        // Pomodoro Task Link
        const pomoSel = document.getElementById('pomoActiveTask');
        pomoSel.innerHTML = '';
        pending.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = `${t.title} (AI Score: ${t.priorityScore})`;
            pomoSel.appendChild(opt);
        });

        FlashcardEngine.renderDeck();
        Charts.drawAll();
    },

    showToast(msg) {
        const box = document.getElementById('toastBox');
        box.textContent = msg;
        box.classList.add('show');
        setTimeout(() => box.classList.remove('show'), 3200);
    }
};

document.addEventListener('DOMContentLoaded', () => UI.init());
