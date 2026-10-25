// 100% Offline AI Study Strategist Chatbot (Zero Internet Needed)
const OfflineTutor = {
    init() {
        const box = document.getElementById('chatHistory');
        if (box && box.children.length === 0) {
            this.appendMsg('bot', '👋 Namaste! Main aapka **100% Offline AI Study Strategist** hoon. Mere paas aapke local syllabus tasks, deadlines, energy state aur habit streaks ka live access hai. Niche kisi prompt par click karein ya apna sawal puchein!');
        }

        const form = document.getElementById('chatForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const inp = document.getElementById('chatInput');
                const q = inp.value.trim();
                if (!q) return;
                inp.value = '';
                this.ask(q);
            });
        }
    },

    ask(query) {
        this.appendMsg('user', query);
        const reply = this.generateOfflineResponse(query.toLowerCase());
        setTimeout(() => this.appendMsg('bot', reply), 220);
    },

    generateOfflineResponse(q) {
        const tasks = DB.getTasks().filter(t => !t.completed);
        tasks.sort((a, b) => b.priorityScore - a.priorityScore);
        const top = tasks[0];
        const cards = DB.getCards();
        const stats = DB.getStats();

        if (q.includes('now') || q.includes('priority') || q.includes('start') || q.includes('kya padhu')) {
            if (!top) return '🎉 Aapke saare pending tasks complete ho chuke hain! Aap **SM-2 Flashcards** tab me jaakar active recall revision kar sakte hain.';
            return `🎯 **Offline XAI Analysis:** Aapko abhi sabse pehle **"${top.title}"** padhna chahiye.\n• **AI Priority Score:** ${top.priorityScore}/10\n• **Reason:** ${top.reason}\n• **Tip:** Deep Focus Studio me jaakar 25-min Pomodoro + Brown Noise on karein!`;
        }

        if (q.includes('syllabus') || q.includes('exam') || q.includes('finish') || q.includes('strategy')) {
            const totalHrs = tasks.reduce((acc, t) => acc + t.duration, 0).toFixed(1);
            return `📅 **Syllabus Completion Blueprint:**\n• Pending Modules: **${tasks.length} topics** (${totalHrs} total study hours)\n• Agar aap roz **3 hours** (6 Pomodoros) padhte hain, to aap **${Math.ceil(totalHrs / 3)} days** me pura syllabus aaram se khatam kar lenge!`;
        }

        if (q.includes('low energy') || q.includes('distract') || q.includes('tired') || q.includes('mann nahi')) {
            return `🔋 **Low Energy Recovery Protocol:**\n1. Left sidebar me **Current Energy** ko **"Low"** par switch karein — AI automatically bhari topics hata kar light topics upar kar dega.\n2. Sirf **5 minute** ke liye **SM-2 Flashcards** flip karein (${cards.length} cards ready hain).\n3. Pomodoro me **Offline Brown Noise** on karein,isse brain waves calm hoti hain.`;
        }

        if (q.includes('sm-2') || q.includes('spaced') || q.includes('flashcard')) {
            return `🧠 **SuperMemo SM-2 Algorithm:** Humara دماغ (brain) Ebbinghaus Forgetting Curve ke hisab se 24 ghante me 70% naya padha hua bhool jata hai. SM-2 algorithm aapke har card par **Easiness Factor (EF)** aur **Interval (1d ➔ 6d ➔ 15d)** offline calculate karta hai taaki exam tak 95%+ retention rahe!`;
        }

        return `💡 **Offline AI Insight:** Aapke paas abhi **${tasks.length} pending modules** aur **${cards.length} flashcards** hain, aur aapka current XP **${stats.xp}** hai. Kya aap chahenge ki main aapka sabse high-priority topic (${top ? top.title : 'Revision'}) Pomodoro timer me set kar doon?`;
    },

    appendMsg(sender, text) {
        const box = document.getElementById('chatHistory');
        if (!box) return;
        const div = document.createElement('div');
        div.className = `chat-msg ${sender}`;
        div.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        box.appendChild(div);
        box.scrollTop = box.scrollHeight;
    }
};
