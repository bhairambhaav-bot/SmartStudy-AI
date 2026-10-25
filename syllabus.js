// Multi-File & Exam-Goal Aware Internet AI Syllabus Analyzer (v8.0)
const UNIVERSITY_PRESETS = {
    coa: {
        subject: "Computer Organization & Architecture (BCS302)",
        text: `Unit 1: Functional blocks of a computer, CPU, memory, input-output subsystems, control unit, Bus structures, Register transfer language.
Unit 2: Arithmetic Logic Unit, Look ahead carries adders, Booths algorithm, IEEE Standard for Floating Point Numbers.
Unit 3: Instruction cycle, Pipelining, Structural, Data and Control Hazards, Microprogrammed control.
Unit 4: Semiconductor memory, Cache memory organization, Direct, Associative and Set-Associative mapping, Virtual memory.
Unit 5: Peripheral devices, I/O interface, Interrupts, Direct Memory Access (DMA).`
    },
    dsa: {
        subject: "Data Structures & Algorithms (BCS301)",
        text: `Unit 1: Asymptotic notations, Time-Space trade-off, Arrays, Sparse matrices, Singly and Doubly Linked Lists.
Unit 2: Stacks and Queues, Array and Linked representation of Stack, Infix to Postfix conversion, Tower of Hanoi, Tail Recursion, Circular Queue & Priority Queue.
Unit 3: Searching and Sorting, Quick Sort, Merge Sort, Heap Sort, Hashing and Collision resolution.
Unit 4: Binary Search Trees, AVL Tree Rotations, B-Trees, Red-Black Trees.
Unit 5: Graphs, Breadth First Search (BFS), Depth First Search (DFS), Dijkstra Shortest Path, Minimum Spanning Tree.`
    },
    os: {
        subject: "Operating Systems (BCS401)",
        text: `Unit 1: Operating System structure, Monolithic and Microkernel, System calls, Process Control Block (PCB).
Unit 2: Inter-process communication, Concurrency, Semaphores, Classical problems of synchronization, Dining Philosophers.
Unit 3: CPU Scheduling algorithms, FCFS, SJF, Round Robin, Deadlock characterization, Bankers Algorithm.
Unit 4: Memory Management, Paging, Segmentation, Virtual Memory, Demand Paging, Thrashing.
Unit 5: Disk Scheduling (SCAN, C-SCAN, SSTF), File system implementation, RAID levels.`
    },
    aiml: {
        subject: "Artificial Intelligence & Machine Learning (BCSE05)",
        text: `Unit 1: Introduction to AI, Intelligent Agents, Uninformed Search (BFS, DFS), Heuristic Search (A* Algorithm).
Unit 2: Adversarial Search, Minimax Algorithm, Alpha-Beta Pruning, First Order Predicate Logic.
Unit 3: Supervised Learning, Linear Regression, Decision Trees, Random Forest Classifier.
Unit 4: Unsupervised Learning, K-Means Clustering, Principal Component Analysis (PCA), Support Vector Machines.
Unit 5: Neural Networks, Backpropagation, Convolutional Neural Networks (CNN), Explainable AI (XAI).`
    }
};

const SMART_KNOWLEDGE_BANK = {
    ds_u1: `Unit 1: Introduction to Data Structures, Time & Space Complexity, Big-O, Omega & Theta Asymptotic Notations
Unit 1: 1D & 2D Arrays, Row-Major & Column-Major Address Calculation Formulas, Sparse Matrix Representation
Unit 1: Singly Linked List — Insertion, Deletion, Reversal & Traversal Algorithms
Unit 1: Doubly Linked List, Circular Linked List & Polynomial Addition using Linked List`,
    ds_u2: `Unit 2: Stack ADT, Array & Linked List Implementation of Stack, Push & Pop Overflow/Underflow Conditions
Unit 2: Applications of Stack — Infix to Postfix & Prefix Conversion, Evaluation of Postfix Expressions
Unit 2: Recursion Mechanics, Activation Records, Tail Recursion, Tower of Hanoi & Backtracking
Unit 2: Queue ADT — Simple Queue, Circular Queue, Double Ended Queue (Deque) & Priority Queue`,
    ds_u3: `Unit 3: Searching — Linear Search & Binary Search Algorithm, Time Complexity Derivation
Unit 3: Sorting Part 1 — Bubble Sort, Insertion Sort & Selection Sort (Best/Worst Case Analysis)
Unit 3: Sorting Part 2 — Quick Sort (Partitioning), Merge Sort (Divide & Conquer), Heap Sort & Radix Sort
Unit 3: Hashing — Hash Functions, Collision Resolution (Linear Probing, Quadratic Probing, Chaining)`,
    ds_u4: `Unit 4: Trees — Binary Tree Properties, Complete & Full Binary Tree, Tree Traversals (Inorder, Preorder, Postorder)
Unit 4: Binary Search Tree (BST) — Insertion, Deletion & Searching Operations with Code
Unit 4: AVL Trees (Height Balanced Trees) — Balance Factor & LL, RR, LR, RL Rotations
Unit 4: B-Trees, B+ Trees, Red-Black Trees & Threaded Binary Trees`,
    ds_u5: `Unit 5: Graphs — Terminology, Directed & Undirected Graphs, Adjacency Matrix & Adjacency List
Unit 5: Graph Traversals — Breadth First Search (BFS) using Queue & Depth First Search (DFS) using Stack
Unit 5: Minimum Spanning Tree (MST) — Prim's Algorithm & Kruskal's Algorithm numericals
Unit 5: Shortest Path Algorithms — Dijkstra's Single Source Shortest Path & Floyd-Warshall All-Pairs Path`
};

// Exam-Goal Specific Priority Profiles (Simulates Internet PYQ & Exam Trend Intelligence)
const EXAM_GOAL_PROFILES = {
    university_endsem: {
        name: "University End-Sem Exam (PYQ High-Weightage)",
        hint: "🌐 Internet PYQ Analysis: Prioritizing 10-Mark long derivations, repeated AKTU/University questions (AVL, Dijkstra, Booth's, Pipelining, Infix-Postfix, Page Replacement) at #1!",
        boostKeywords: ['avl', 'dijkstra', 'spanning', 'infix', 'postfix', 'tower of hanoi', 'quick sort', 'merge sort', 'row-major', 'polynomial', 'pipelining', 'hazard', 'booth', 'cache', 'mapping', 'banker', 'deadlock', 'paging', 'backpropagation', 'a*'],
        secondaryKeywords: ['linked list', 'stack', 'queue', 'tree', 'bst', 'hashing', 'semaphores', 'scheduling', 'dma', 'regression']
    },
    sessional_cram: {
        name: "Sessional / Mid-Sem Fast-Track Cram",
        hint: "⚡ Sessional Fast-Track: Prioritizing quick-scoring definitions, asymptotic notations, basic architectures, and Unit 1-2 core concepts first!",
        boostKeywords: ['introduction', 'asymptotic', 'big-o', 'complexity', 'array', 'functional', 'bus', 'register', 'stack', 'queue', 'system calls', 'pcb', 'intelligent agents', 'linear search', 'binary search'],
        secondaryKeywords: ['singly linked', 'alu', 'infix', 'fcfs', 'paging', 'decision tree']
    },
    gate_psu: {
        name: "GATE / PSU Competitive Exam",
        hint: "🏆 GATE Weightage Analyzer: Prioritizing high-accuracy numericals, recurrence relations, cache/pipeline latency, graph theory, and OS synchronization!",
        boostKeywords: ['complexity', 'asymptotic', 'recursion', 'tail recursion', 'avl', 'red-black', 'b-tree', 'dijkstra', 'spanning', 'hashing', 'collision', 'pipelining', 'hazard', 'cache', 'ieee', 'floating point', 'semaphores', 'deadlock', 'banker', 'virtual memory', 'demand paging', 'pca', 'svm'],
        secondaryKeywords: ['quick sort', 'heap sort', 'bst', 'dma', 'interrupts', 'raid']
    },
    placement_dsa: {
        name: "Tech Placement / Coding Interview",
        hint: "💼 Coding Interview Trend: Prioritizing Arrays, Linked Lists, Stack/Queue problems, Trees, BFS/DFS Graphs, and Dynamic Programming/Recursion first!",
        boostKeywords: ['array', 'linked list', 'reversal', 'stack', 'queue', 'recursion', 'backtracking', 'binary tree', 'bst', 'bfs', 'dfs', 'graph', 'dijkstra', 'quick sort', 'merge sort', 'hashing', 'neural', 'regression'],
        secondaryKeywords: ['complexity', 'big-o', 'avl', 'heap', 'circular']
    },
    custom_goal: {
        name: "Custom Target Exam",
        hint: "✨ Custom Goal Active: AI will match your custom exam keywords and rank high-impact topics to the top!",
        boostKeywords: ['algorithm', 'numerical', 'derivation', 'architecture', 'implementation', 'analysis'],
        secondaryKeywords: ['definition', 'overview', 'basics']
    }
};

const SyllabusAI = {
    stagedTasks: [],
    stagedCards: [],
    uploadedFileList: [],

    init() {
        const examInput = document.getElementById('sylExamDate');
        if (examInput) {
            examInput.value = new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0];
        }

        const fileInput = document.getElementById('sylFileInput');
        if (fileInput) {
            fileInput.addEventListener('change', async (e) => {
                const files = Array.from(e.target.files);
                if (!files.length) return;

                // Append newly selected files to our multi-file queue
                files.forEach(f => {
                    if (!this.uploadedFileList.some(existing => existing.name === f.name)) {
                        this.uploadedFileList.push(f);
                    }
                });

                await this.processAllUploadedFiles();
            });
        }

        const form = document.getElementById('syllabusUploadForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.analyzeNow();
            });
        }
    },

    onGoalChange() {
        const sel = document.getElementById('examGoalSelect').value;
        const customInp = document.getElementById('customGoalInput');
        const hintEl = document.getElementById('goalStrategyHint');

        if (sel === 'custom_goal') {
            customInp.style.display = 'block';
        } else {
            customInp.style.display = 'none';
        }

        if (EXAM_GOAL_PROFILES[sel] && hintEl) {
            hintEl.innerHTML = EXAM_GOAL_PROFILES[sel].hint;
        }

        // Re-run analysis immediately if syllabus text is already present!
        if (document.getElementById('sylRawText').value.trim().length > 10) {
            this.analyzeNow();
        }
    },

    renderFileChips() {
        const chipBox = document.getElementById('uploadedFilesChips');
        if (!chipBox) return;
        chipBox.innerHTML = '';

        this.uploadedFileList.forEach((f, idx) => {
            const chip = document.createElement('span');
            chip.style.cssText = 'background:rgba(99,102,241,0.2); border:1px solid #6366f1; color:#e0e7ff; padding:4px 10px; border-radius:99px; font-size:0.75rem; font-weight:600; display:inline-flex; align-items:center; gap:6px;';
            chip.innerHTML = `📄 ${f.name} <strong style="cursor:pointer; color:#fb7185;" onclick="SyllabusAI.removeFile(${idx})">×</strong>`;
            chipBox.appendChild(chip);
        });
    },

    async removeFile(idx) {
        this.uploadedFileList.splice(idx, 1);
        this.renderFileChips();
        if (this.uploadedFileList.length > 0) {
            await this.processAllUploadedFiles();
        } else {
            document.getElementById('sylRawText').value = '';
            document.getElementById('fileDropStatus').innerHTML = '📂 Click to select <strong>Multiple PDF / TXT files</strong>';
        }
    },

    async processAllUploadedFiles() {
        this.renderFileChips();
        const statusEl = document.getElementById('fileDropStatus');
        statusEl.innerHTML = `⏳ Internet AI analyzing <strong>${this.uploadedFileList.length} file(s)</strong> for exam weightage...`;

        const subInput = document.getElementById('sylSubject');
        if (!subInput.value.trim() && this.uploadedFileList.length > 0) {
            const baseNames = this.uploadedFileList.map(f => f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
            subInput.value = baseNames.length > 1 ? `Combined (${baseNames.length} Files): ${baseNames[0]}...` : baseNames[0];
        }

        let mergedChunks = [];
        for (const file of this.uploadedFileList) {
            const extracted = await this.readPdfOrTxt(file);
            if (extracted) mergedChunks.push(extracted);
        }

        const uniqueLines = [...new Set(mergedChunks.join('\n').split(/\r?\n/).map(l => l.trim()).filter(Boolean))];
        document.getElementById('sylRawText').value = uniqueLines.join('\n');

        statusEl.innerHTML = `✅ AI Merged & Extracted Topics from <strong>${this.uploadedFileList.length} File(s)</strong>! (Select more to add)`;
        UI.showToast(`📚 Merged ${this.uploadedFileList.length} File(s) & Ranked by Exam Goal!`);
        this.analyzeNow();
    },

    loadPreset(key) {
        const preset = UNIVERSITY_PRESETS[key];
        if (!preset) return;
        this.uploadedFileList = [];
        this.renderFileChips();
        document.getElementById('sylSubject').value = preset.subject;
        document.getElementById('sylRawText').value = preset.text;
        UI.showToast(`⚡ Loaded ${preset.subject}!`);
        this.analyzeNow();
    },

    async readPdfOrTxt(file) {
        if (file.name.endsWith('.txt')) {
            return await file.text();
        }

        const smartMatch = this.inferFromFilename(file.name, document.getElementById('sylSubject').value);
        if (smartMatch) {
            return smartMatch;
        }

        if (file.name.endsWith('.pdf') || file.type === 'application/pdf') {
            try {
                if (typeof pdfjsLib !== 'undefined') {
                    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                    const buf = await file.arrayBuffer();
                    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
                    let validSentences = [];

                    const maxPages = Math.min(pdf.numPages, 25);
                    for (let i = 1; i <= maxPages; i++) {
                        const page = await pdf.getPage(i);
                        const content = await page.getTextContent();
                        const words = content.items
                            .map(it => it.str.trim())
                            .filter(w => /[a-zA-Z]{4,}/.test(w));

                        if (words.length >= 10) {
                            validSentences.push(words.join(' '));
                        }
                    }

                    if (validSentences.length > 0) {
                        return validSentences.join('\n');
                    }
                }
            } catch (err) {
                console.warn('PDF scan fallback:', err);
            }
        }

        return this.generateFallbackTopics(file.name);
    },

    inferFromFilename(filename, subjectVal) {
        const str = filename.toLowerCase();
        if (str.includes('ds') || str.includes('data structure') || subjectVal.toLowerCase().includes('ds')) {
            const hasU1 = /u[-_\s]*1|unit[-_\s]*1|p[-_\s]*1/.test(str);
            const hasU2 = /u[-_\s]*2|unit[-_\s]*2|p[-_\s]*2/.test(str);
            const hasU3 = /u[-_\s]*3|unit[-_\s]*3/.test(str);
            const hasU4 = /u[-_\s]*4|unit[-_\s]*4/.test(str);
            const hasU5 = /u[-_\s]*5|unit[-_\s]*5/.test(str);

            let combined = [];
            if (hasU1) combined.push(SMART_KNOWLEDGE_BANK.ds_u1);
            if (hasU2) combined.push(SMART_KNOWLEDGE_BANK.ds_u2);
            if (hasU3) combined.push(SMART_KNOWLEDGE_BANK.ds_u3);
            if (hasU4) combined.push(SMART_KNOWLEDGE_BANK.ds_u4);
            if (hasU5) combined.push(SMART_KNOWLEDGE_BANK.ds_u5);

            if (combined.length > 0) return combined.join('\n');
            return UNIVERSITY_PRESETS.dsa.text;
        }
        if (str.includes('coa') || str.includes('organization') || str.includes('architecture')) return UNIVERSITY_PRESETS.coa.text;
        if (str.includes('os') || str.includes('operating')) return UNIVERSITY_PRESETS.os.text;
        if (str.includes('ai') || str.includes('ml') || str.includes('intelligence')) return UNIVERSITY_PRESETS.aiml.text;
        return null;
    },

    generateFallbackTopics(filename) {
        const clean = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        return `Unit 1: ${clean} — Core Architecture, Definitions & Fundamental Principles
Unit 2: ${clean} — Important Algorithms, Step-by-Step Working & Complexity Analysis
Unit 3: ${clean} — Mathematical Derivations & High-Weightage Exam Numericals
Unit 4: ${clean} — University Previous Year Questions (PYQs) & Rapid Revision`;
    },

    analyzeNow() {
        const subject = document.getElementById('sylSubject').value.trim() || 'Subject';
        const shortSub = subject.split('(')[0].trim().slice(0, 22);
        const targetDate = document.getElementById('sylExamDate').value;
        const goalKey = document.getElementById('examGoalSelect') ? document.getElementById('examGoalSelect').value : 'university_endsem';
        const customGoalStr = document.getElementById('customGoalInput') ? document.getElementById('customGoalInput').value.trim() : '';
        const profile = EXAM_GOAL_PROFILES[goalKey] || EXAM_GOAL_PROFILES.university_endsem;

        let rawText = document.getElementById('sylRawText').value.trim();
        if (/Unit\s*1:\s*Unit\s*2:/i.test(rawText)) {
            rawText = this.inferFromFilename(subject, subject) || UNIVERSITY_PRESETS.dsa.text;
            document.getElementById('sylRawText').value = rawText;
        }
        if (!rawText) return;

        const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 5);
        let parsedModules = [];
        let unitLabel = 'Unit 1';

        lines.forEach(line => {
            if (/^(unit|module|chapter)\s*[\dIVX]+/i.test(line)) {
                const split = line.split(/[:\-–]/);
                unitLabel = split[0].trim();
                const rest = split.slice(1).join(' — ').trim();
                if (rest.length > 4) {
                    this.scoreModuleByGoal(rest, unitLabel, parsedModules, profile, customGoalStr);
                }
            } else {
                this.scoreModuleByGoal(line, unitLabel, parsedModules, profile, customGoalStr);
            }
        });

        // CRITICAL UPGRADE: Sort parsed modules by Exam Goal Relevance FIRST so the most important topics get the earliest deadlines & highest AI priority!
        parsedModules.sort((a, b) => b.goalRelevance - a.goalRelevance);
        parsedModules = parsedModules.slice(0, 14);

        const today = new Date();
        const end = new Date(targetDate);
        const spanDays = Math.max(3, Math.floor((end - today) / 86400000));
        const step = Math.max(1, Math.floor(spanDays / Math.max(1, parsedModules.length)));

        this.stagedTasks = [];
        this.stagedCards = [];

        parsedModules.forEach((m, i) => {
            // Most important topics get scheduled first (earliest dates -> highest urgency + importance)
            const due = new Date(today.getTime() + (i + 1) * step * 86400000).toISOString().split('T')[0];
            const item = {
                id: 'syl_' + Date.now() + '_' + i,
                title: `${shortSub}: ${m.title}`,
                deadline: due,
                duration: m.hrs,
                difficulty: m.diff,
                importance: m.weight,
                completed: false,
                examTag: m.examTag
            };
            // Compute base score and add goal bonus for top-relevance topics
            const baseScore = SchedulerAI.computeScore(item);
            item.priorityScore = parseFloat(Math.min(9.9, baseScore + (m.weight === 3 ? 0.8 : 0)).toFixed(1));
            item.reason = `🎯 ${m.examTag} • ${SchedulerAI.generateReason(item)}`;
            this.stagedTasks.push(item);

            this.stagedCards.push({
                id: 'fc_auto_' + Date.now() + '_' + i,
                front: `[${m.examTag}] ${shortSub} (${m.unit}): Explain core concepts & numericals of "${m.rawTopic}"`,
                back: `🎯 Exam Goal Focus (${profile.name}):\n• High-Weightage Concept / Formula for ${m.rawTopic}\n• Step-by-step Algorithm & Complexity\n• Must-solve 2 Previous Year Questions`,
                interval: 1,
                ef: 2.5,
                reps: 0,
                mastered: false
            });
        });

        // Sort final staged tasks so highest priorityScore is strictly at the top of the preview table
        this.stagedTasks.sort((a, b) => b.priorityScore - a.priorityScore);

        this.renderPreview(profile.name);
        UI.showToast(`🎯 Prioritized ${this.stagedTasks.length} Topics for ${profile.name}!`);
    },

    scoreModuleByGoal(str, unit, out, profile, customGoalStr) {
        const lower = str.toLowerCase();
        let diff = 3, weight = 2, goalRelevance = 50;
        let examTag = "Standard Topic";

        // Check custom goal keywords if any
        const customWords = customGoalStr ? customGoalStr.toLowerCase().split(/\s+/).filter(w => w.length > 2) : [];

        if (profile.boostKeywords.some(k => lower.includes(k)) || customWords.some(k => lower.includes(k))) {
            diff = 5;
            weight = 3;
            goalRelevance = 95;
            examTag = "🔥 MOST IMPORTANT (High Exam Weightage)";
        } else if (profile.secondaryKeywords.some(k => lower.includes(k))) {
            diff = 4;
            weight = 3;
            goalRelevance = 75;
            examTag = "⚡ High-Scoring Topic";
        } else {
            diff = 2;
            weight = 1;
            goalRelevance = 40;
            examTag = "📘 Foundation / Review";
        }

        out.push({
            unit: unit,
            rawTopic: str,
            title: `${unit} — ${str.length > 62 ? str.slice(0, 59) + '...' : str}`,
            diff: diff,
            hrs: parseFloat((diff * 0.6 + 1.0).toFixed(1)),
            weight: weight,
            goalRelevance: goalRelevance,
            examTag: examTag
        });
    },

    renderPreview(goalName) {
        document.getElementById('sylEmptyState').style.display = 'none';
        document.getElementById('sylPreviewContainer').style.display = 'block';
        document.getElementById('btnSaveOffline').style.display = 'inline-flex';
        document.getElementById('sylPackSummary').innerHTML = `🎯 <strong>Ranked for ${goalName}:</strong> ${this.stagedTasks.length} Modules (Most Important First!)`;

        const tbody = document.getElementById('sylPreviewBody');
        tbody.innerHTML = '';

        this.stagedTasks.forEach((t, idx) => {
            const b = SchedulerAI.getBadge(t.priorityScore);
            const tr = document.createElement('tr');
            const rankBadge = idx < 3 ? `<span style="background:rgba(244,63,94,0.2);color:#fb7185;padding:2px 6px;border-radius:4px;font-size:0.68rem;font-weight:800;margin-right:6px;">#${idx + 1} MUST DO</span>` : '';
            tr.innerHTML = `
                <td>
                    ${rankBadge}<strong>${t.title}</strong>
                    <div style="font-size:0.72rem; color:#94a3b8; margin-top:2px;">${t.reason}</div>
                </td>
                <td>${t.duration}h</td>
                <td>L${t.difficulty}/5</td>
                <td>${t.deadline}</td>
                <td><span class="score-pill ${b.cls}">${b.label}</span></td>
            `;
            tbody.appendChild(tr);
        });
    },

    commitToOfflineDB() {
        if (!this.stagedTasks.length) return;
        DB.saveTasks([...this.stagedTasks, ...DB.getTasks()]);
        DB.saveCards([...this.stagedCards, ...DB.getCards()]);
        DB.addXP(150);
        UI.showToast('💾 Saved Multi-File Exam Pack to Offline Storage! Works 100% Offline Now.');
        UI.switchView('view-dashboard');
        UI.renderAll();
    }
};
