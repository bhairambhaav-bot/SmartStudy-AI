// Energy-Adaptive Heuristic Priority Engine (100% Offline)
const SchedulerAI = {
    computeScore(task, energyState = 'medium') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(task.deadline);
        const daysLeft = Math.max(0.25, (due - today) / 86400000);

        const urgency = Math.min(10, 10 / daysLeft);
        let difficultyFactor = (task.difficulty / 5) * 10;

        // Energy-Adaptive adjustment:
        // If user has LOW energy, boost easier/lighter tasks so they don't burn out
        if (energyState === 'low') {
            difficultyFactor = ((6 - task.difficulty) / 5) * 10;
        } else if (energyState === 'high') {
            difficultyFactor = (task.difficulty / 5) * 11; // Boost hardest topics when fresh
        }

        const weight = (task.importance / 3) * 10;
        const score = (urgency * 0.45) + (difficultyFactor * 0.35) + (weight * 0.20);
        return parseFloat(Math.min(9.9, score).toFixed(1));
    },

    generateReason(task) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(task.deadline);
        const daysLeft = Math.ceil((due - today) / 86400000);

        let parts = [];
        if (daysLeft <= 2) parts.push(`Urgent (${daysLeft}d left)`);
        else parts.push(`Due in ${daysLeft}d`);

        if (task.difficulty >= 4) parts.push(`High Cognitive Load (L${task.difficulty})`);
        else if (task.difficulty <= 2) parts.push(`Light Energy Friendly (L${task.difficulty})`);

        if (task.importance === 3) parts.push(`Core Exam Unit`);
        return parts.join(' • ');
    },

    getBadge(score) {
        if (score >= 8.0) return { label: `CRITICAL (${score})`, cls: 'score-high' };
        if (score >= 5.5) return { label: `MEDIUM (${score})`, cls: 'score-med' };
        return { label: `NORMAL (${score})`, cls: 'score-low' };
    },

    getXAIAdvice(tasks, energy) {
        const pending = tasks.filter(t => !t.completed);
        if (!pending.length) {
            return {
                headline: "🎉 All Scheduled Study Modules Completed!",
                reasoning: "Your offline queue is clear. Review your SM-2 Flashcards or upload a new syllabus."
            };
        }
        pending.sort((a, b) => b.priorityScore - a.priorityScore);
        const top = pending[0];
        const energyText = energy === 'high' ? 'High Energy (Best for complex units)' : (energy === 'low' ? 'Low Energy (Prioritizing lighter review)' : 'Medium Balanced Energy');
        return {
            headline: `Recommended Now: "${top.title}"`,
            reasoning: `XAI Logic [${energyText}]: Ranked #1 (Score ${top.priorityScore}/10) — ${top.reason || this.generateReason(top)}.`
        };
    }
};
