// SuperMemo SM-2 Spaced Repetition Flashcard Engine + Offline Notes Quiz Generator
const FlashcardEngine = {
    currentIndex: 0,
    showingAnswer: false,

    renderDeck() {
        const cards = DB.getCards();
        document.getElementById('fcCountBadge').textContent = `${cards.length} Cards in Offline Deck`;
        document.getElementById('headerCardsDue').textContent = cards.filter(c => !c.mastered).length;

        const stage = document.getElementById('flashcardStage');
        if (!cards.length) {
            stage.innerHTML = `<div class="empty-state-box">No flashcards yet. Upload a syllabus or add one on the left!</div>`;
            return;
        }

        if (this.currentIndex >= cards.length) this.currentIndex = 0;
        const card = cards[this.currentIndex];

        stage.innerHTML = `
            <div class="flashcard-box" onclick="FlashcardEngine.flip()">
                <span class="pill-tag">CARD ${this.currentIndex + 1} OF ${cards.length} • SM-2 INTERVAL: ${card.interval} DAYS</span>
                <h4>${card.front}</h4>
                <p class="text-muted" style="font-size:0.8rem;">(Click card to reveal answer)</p>
                <div id="fcAnswerArea" class="fc-answer" style="display:${this.showingAnswer ? 'block' : 'none'};">
                    ${card.back.replace(/\n/g, '<br>')}
                </div>
            </div>
            <div class="sm2-buttons">
                <button class="btn btn-outline" onclick="FlashcardEngine.rateCard(1)">😓 Hard (1d)</button>
                <button class="btn btn-amber" onclick="FlashcardEngine.rateCard(3)">⚡ Good (${Math.round(card.interval * 1.8)}d)</button>
                <button class="btn btn-emerald" onclick="FlashcardEngine.rateCard(5)">🚀 Easy / Mastered (${Math.round(card.interval * card.ef)}d)</button>
            </div>
        `;
    },

    flip() {
        this.showingAnswer = !this.showingAnswer;
        this.renderDeck();
    },

    // Official SuperMemo SM-2 Mathematical Update
    rateCard(quality) {
        const cards = DB.getCards();
        const card = cards[this.currentIndex];
        if (!card) return;

        if (quality < 3) {
            card.reps = 0;
            card.interval = 1;
            card.mastered = false;
        } else {
            card.reps += 1;
            if (card.reps === 1) card.interval = 1;
            else if (card.reps === 2) card.interval = 6;
            else card.interval = Math.round(card.interval * card.ef);

            card.ef = Math.max(1.3, card.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
            if (quality === 5) card.mastered = true;
        }

        DB.saveCards(cards);
        DB.addXP(20);
        this.showingAnswer = false;
        this.currentIndex = (this.currentIndex + 1) % cards.length;
        UI.renderAll();
    }
};

// Offline Notes & Keyword Cloze Quiz Generator
const NotesEngine = {
    saveNote() {
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;
        localStorage.setItem('neuroplan_saved_note', JSON.stringify({ title, content }));
        DB.addXP(30);
        UI.showToast('📝 Note Saved to Offline Storage!');
    },

    generateQuizFromNote() {
        const content = document.getElementById('noteContent').value.trim();
        const box = document.getElementById('quizContainer');
        box.innerHTML = '';

        const sentences = content.split(/[.?!\n]/).map(s => s.trim()).filter(s => s.length > 20);
        if (!sentences.length) {
            box.innerHTML = `<p class="text-muted">Write at least 2 sentences in your notes to generate an offline quiz.</p>`;
            return;
        }

        const techTerms = ['pipelining', 'hazard', 'structural', 'data', 'control', 'cache', 'memory', 'microprocessor', 'instruction', 'program', 'buffer', 'algorithm', 'tree', 'graph', 'recursion'];

        sentences.slice(0, 5).forEach((sent, idx) => {
            const words = sent.split(' ');
            let targetWord = words.find(w => techTerms.includes(w.toLowerCase().replace(/[^a-z]/g, '')));
            if (!targetWord) {
                targetWord = words.find(w => w.length > 6) || words[0];
            }
            const cleanTarget = targetWord.replace(/[^a-zA-Z0-9-]/g, '');
            const maskedSentence = sent.replace(cleanTarget, '_______');

            const div = document.createElement('div');
            div.className = 'stack-item';
            div.style.flexDirection = 'column';
            div.style.alignItems = 'flex-start';
            div.innerHTML = `
                <div style="margin-bottom:0.5rem;"><strong>Q${idx + 1}:</strong> ${maskedSentence}</div>
                <div style="display:flex; gap:8px; width:100%;">
                    <input type="text" placeholder="Type missing keyword..." id="qz_in_${idx}" style="padding:0.4rem 0.6rem;">
                    <button class="btn btn-emerald" style="padding:0.4rem 0.8rem; font-size:0.78rem;" onclick="NotesEngine.checkAns(${idx}, '${cleanTarget}')">Check</button>
                </div>
            `;
            box.appendChild(div);
        });
        UI.showToast('🎯 Offline Fill-in-the-Blank Quiz Generated!');
    },

    checkAns(idx, ans) {
        const val = document.getElementById(`qz_in_${idx}`).value.trim().toLowerCase();
        if (val === ans.toLowerCase()) {
            DB.addXP(30);
            UI.showToast(`✅ Correct! Answer is "${ans}"`);
        } else {
            alert(`❌ Not quite! The correct keyword is: "${ans}"`);
        }
    }
};
