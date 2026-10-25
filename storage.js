// Offline LocalStorage Database Engine v5
const DB_KEYS = {
    TASKS: 'neuroplan_tasks_v5',
    HABITS: 'neuroplan_habits_v5',
    CARDS: 'neuroplan_cards_v5',
    STATS: 'neuroplan_stats_v5'
};

const SEED_DATA = {
    tasks: [
        {
            id: 'np_1',
            title: 'COA: Unit 3 - Instruction Pipelining & Structural Hazards',
            deadline: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
            duration: 3.0,
            difficulty: 5,
            importance: 3,
            completed: false,
            priorityScore: 9.6,
            reason: 'Urgent (1d left) • High Cognitive Load (L5)'
        },
        {
            id: 'np_2',
            title: 'DSA: Unit 4 - AVL Tree Rotations (LL, RR, LR, RL)',
            deadline: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
            duration: 2.5,
            difficulty: 4,
            importance: 3,
            completed: false,
            priorityScore: 8.8,
            reason: 'Due in 2 days • Core Exam Unit'
        },
        {
            id: 'np_3',
            title: 'COA: Unit 4 - Cache Memory Direct & Set-Associative Mapping',
            deadline: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
            duration: 2.0,
            difficulty: 4,
            importance: 3,
            completed: false,
            priorityScore: 8.2,
            reason: 'High Weightage Numerical Topic'
        },
        {
            id: 'np_4',
            title: 'Python: Tail Recursion & Stack Frame Optimization',
            deadline: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
            duration: 1.5,
            difficulty: 2,
            importance: 2,
            completed: true,
            priorityScore: 5.1,
            reason: 'Light Review Module'
        }
    ],
    habits: [
        {
            id: 'hb_1',
            name: 'Morning DSA Coding (2 Problems)',
            cue: '07:30 AM right after morning tea',
            routine: '45 mins coding in VS Code without phone distractions',
            reward: '+50 XP & 15 mins music break',
            streak: 7,
            lastCheck: new Date().toISOString().split('T')[0]
        },
        {
            id: 'hb_2',
            name: 'Evening SM-2 Flashcard Active Recall',
            cue: '08:00 PM before dinner',
            routine: 'Review 10 SM-2 flashcards & 5 PYQs offline',
            reward: '+50 XP & guilt-free relaxation',
            streak: 5,
            lastCheck: new Date(Date.now() - 86400000).toISOString().split('T')[0]
        }
    ],
    cards: [
        {
            id: 'fc_1',
            front: 'COA: What are the 3 types of Pipeline Hazards?',
            back: '1. Structural Hazard (Hardware conflict)\n2. Data Hazard (RAW, WAR, WAW dependencies)\n3. Control Hazard (Branch instructions)',
            interval: 1,
            ef: 2.5,
            reps: 1,
            mastered: false
        },
        {
            id: 'fc_2',
            front: 'DSA: What is the Balance Factor in an AVL Tree?',
            back: 'Balance Factor = Height(Left Subtree) - Height(Right Subtree). Must be in {-1, 0, +1}.',
            interval: 2,
            ef: 2.6,
            reps: 2,
            mastered: false
        },
        {
            id: 'fc_3',
            front: 'COA: Formula for Average Memory Access Time (AMAT)?',
            back: 'AMAT = Hit Time + (Miss Rate × Miss Penalty)',
            interval: 6,
            ef: 2.7,
            reps: 3,
            mastered: true
        }
    ],
    stats: {
        xp: 450,
        focusMinutes: 270,
        energy: 'medium',
        weeklyCompleted: [3, 4, 3, 5, 4, 6, 4]
    }
};

const DB = {
    init() {
        if (!localStorage.getItem(DB_KEYS.TASKS)) {
            this.resetToDemo();
        }
    },
    resetToDemo() {
        localStorage.setItem(DB_KEYS.TASKS, JSON.stringify(SEED_DATA.tasks));
        localStorage.setItem(DB_KEYS.HABITS, JSON.stringify(SEED_DATA.habits));
        localStorage.setItem(DB_KEYS.CARDS, JSON.stringify(SEED_DATA.cards));
        localStorage.setItem(DB_KEYS.STATS, JSON.stringify(SEED_DATA.stats));
    },
    getTasks() { return JSON.parse(localStorage.getItem(DB_KEYS.TASKS)) || []; },
    saveTasks(list) { localStorage.setItem(DB_KEYS.TASKS, JSON.stringify(list)); },
    getHabits() { return JSON.parse(localStorage.getItem(DB_KEYS.HABITS)) || []; },
    saveHabits(list) { localStorage.setItem(DB_KEYS.HABITS, JSON.stringify(list)); },
    getCards() { return JSON.parse(localStorage.getItem(DB_KEYS.CARDS)) || []; },
    saveCards(list) { localStorage.setItem(DB_KEYS.CARDS, JSON.stringify(list)); },
    getStats() { return JSON.parse(localStorage.getItem(DB_KEYS.STATS)) || SEED_DATA.stats; },
    saveStats(st) { localStorage.setItem(DB_KEYS.STATS, JSON.stringify(st)); },
    addXP(pts) {
        const st = this.getStats();
        st.xp = (st.xp || 0) + pts;
        this.saveStats(st);
        UI.showToast(`🎉 +${pts} XP Earned! Offline Progress Saved.`);
    }
};
