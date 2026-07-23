// State Management Aplikasi
const state = {
    user: { name: '', age: 0, height: 0, weight: 0, bmi: 0, bmiStatus: '' },
    currentScreen: 'onboarding',
    activeStageIndex: 0,
    stageScores: [0, 0, 0, 0, 0],
    stageInputs: [null, null, null, null, null],
    completedStages: [false, false, false, false, false],
    healthIndex: 0,
    rankTitle: '',
    badges: []
};

// Konfigurasi 5 Mini-Stage
const stageConfigs = [
    {
        id: 'hydro',
        title: 'Stage 1: Hydro Surge',
        icon: '💧',
        colorBg: 'bg-blue-50',
        colorText: 'text-blue-600',
        desc: 'Berapa gelas air putih yang sudah kamu minum hari ini?',
        type: 'slider',
        min: 0, max: 12, default: 6, unit: 'Gelas'
    },
    {
        id: 'fuel',
        title: 'Stage 2: Fuel Up',
        icon: '🥗',
        colorBg: 'bg-green-50',
        colorText: 'text-green-600',
        desc: 'Bagaimana piring makan siangmu hari ini?',
        type: 'options',
        options: [
            { label: 'Dominan Gorengan / Fast Food', score: 10, desc: 'Tinggi lemak & karbohidrat olahan' },
            { label: 'Nasi + Lauk Pauk (Tanpa Sayur)', score: 20, desc: 'Cukup energi tapi kurang serat' },
            { label: 'Piring Seimbang (50% Sayur/Buah, Protein, Karbo)', score: 30, desc: 'Nutrisi lengkap dan kaya serat' }
        ]
    },
    {
        id: 'move',
        title: 'Stage 3: Move Quest',
        icon: '🏃',
        colorBg: 'bg-amber-50',
        colorText: 'text-amber-600',
        desc: 'Berapa lama kamu aktif bergerak atau berolahraga hari ini?',
        type: 'options',
        options: [
            { label: 'Duduk Seharian (<15 menit)', score: 10, desc: 'Aktivitas fisik minim / sedentari' },
            { label: 'Jalan Santai / Bergerak (15–30 menit)', score: 20, desc: 'Aktivitas fisik sedang' },
            { label: 'Olahraga Intensif (>30 menit)', score: 30, desc: 'Sangat baik untuk kebugaran jantung' }
        ]
    },
    {
        id: 'recharge',
        title: 'Stage 4: Recharge',
        icon: '🌙',
        colorBg: 'bg-indigo-50',
        colorText: 'text-indigo-600',
        desc: 'Berapa jam kamu tidur semalam & bagaimana kesegaranmu?',
        type: 'options',
        options: [
            { label: '<6 Jam / Bangun Terasa Lelah', score: 10, desc: 'Kualitas/durasi tidur kurang' },
            { label: '6–7 Jam / Cukup Segar', score: 20, desc: 'Istirahat tergolong cukup' },
            { label: '7–9 Jam / Bangun Sangat Segar', score: 30, desc: 'Kualitas & durasi tidur optimal' }
        ]
    },
    {
        id: 'zen',
        title: 'Stage 5: Zen Zone',
        icon: '🧘',
        colorBg: 'bg-purple-50',
        colorText: 'text-purple-600',
        desc: 'Bagaimana tingkat stres & suasana hatimu hari ini?',
        type: 'options',
        options: [
            { label: 'Stres Tinggi / Sangat Cemas', score: 10, desc: 'Perlu relaksasi atau jeda sejenak' },
            { label: 'Cukup Stabil / Biasa Saja', score: 20, desc: 'Emosi terkontrol dengan baik' },
            { label: 'Tenang, Bahagia & Positif', score: 30, desc: 'Kondisi emosional sangat prima' }
        ]
    }
];

// Navigasi Antar Layar
function goToScreen(screenName) {
    state.currentScreen = screenName;
    document.querySelectorAll('main > section').forEach(sec => sec.classList.add('hidden'));
    
    const activeSec = document.getElementById(`screen-${screenName}`);
    if (activeSec) {
        activeSec.classList.remove('hidden');
        activeSec.classList.add('animate-fade-in');
    }

    if (screenName === 'dashboard') {
        renderDashboard();
    } else if (screenName === 'result') {
        renderResultScreen();
    }
}

// Kalkulator BMI Real-Time
function calculateBMI() {
    const height = parseFloat(document.getElementById('input-height').value);
    const weight = parseFloat(document.getElementById('input-weight').value);
    const previewBox = document.getElementById('bmi-preview');

    if (height > 0 && weight > 0) {
        const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);
        state.user.bmi = parseFloat(bmi);

        let status = 'Normal';
        let bgClass = 'bg-emerald-200 text-emerald-800';

        if (bmi < 18.5) {
            status = 'Underweight';
            bgClass = 'bg-blue-200 text-blue-800';
        } else if (bmi >= 25 && bmi < 29.9) {
            status = 'Overweight';
            bgClass = 'bg-amber-200 text-amber-800';
        } else if (bmi >= 30) {
            status = 'Obesitas';
            bgClass = 'bg-red-200 text-red-800';
        }

        state.user.bmiStatus = status;

        document.getElementById('bmi-value').innerText = `${bmi} kg/m²`;
        const statusEl = document.getElementById('bmi-status');
        statusEl.innerText = status;
        statusEl.className = `px-2.5 py-1 rounded-lg font-bold ${bgClass}`;

        previewBox.classList.remove('hidden');
    } else {
        previewBox.classList.add('hidden');
    }
}

// Mulai Quest
function startQuest() {
    state.user.name = document.getElementById('input-name').value || 'Tester';
    state.user.age = parseInt(document.getElementById('input-age').value) || 25;
    state.user.height = parseFloat(document.getElementById('input-height').value) || 170;
    state.user.weight = parseFloat(document.getElementById('input-weight').value) || 65;
    calculateBMI();

    goToScreen('dashboard');
}

// Render Layar Dashboard Map
function renderDashboard() {
    document.getElementById('dash-name').innerText = state.user.name;
    document.getElementById('dash-bmi').innerText = state.user.bmi || '22.5';
    document.getElementById('dash-bmi-status').innerText = state.user.bmiStatus || 'Normal';

    const totalScore = state.stageScores.reduce((a, b) => a + b, 0);
    state.healthIndex = Math.round((totalScore / 150) * 100);
    document.getElementById('dash-index').innerText = state.healthIndex;

    const completedCount = state.completedStages.filter(Boolean).length;
    document.getElementById('dash-progress').innerText = `${completedCount}/5 Selesai`;

    const container = document.getElementById('stage-list');
    container.innerHTML = '';

    stageConfigs.forEach((cfg, idx) => {
        const isDone = state.completedStages[idx];
        const score = state.stageScores[idx];

        const card = document.createElement('div');
        card.className = `p-3 rounded-xl border transition flex items-center justify-between ${
            isDone ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'
        }`;

        card.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 ${cfg.colorBg} ${cfg.colorText} rounded-xl flex items-center justify-center text-xl shadow-sm">
                    ${cfg.icon}
                </div>
                <div>
                    <div class="font-bold text-xs text-slate-800">${cfg.title.split(':')[1] || cfg.title}</div>
                    <div class="text-[11px] text-slate-500">${isDone ? `Poin: ${score}/30` : 'Belum Diisi'}</div>
                </div>
            </div>
            <button onclick="openStageQuiz(${idx})" class="px-3 py-1.5 rounded-lg font-bold text-xs ${
                isDone ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }">
                ${isDone ? 'Edit' : 'Mulai'}
            </button>
        `;
        container.appendChild(card);
    });

    const resultBtn = document.getElementById('btn-show-result');
    if (completedCount > 0) {
        resultBtn.disabled = false;
        resultBtn.className = "w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2";
    } else {
        resultBtn.disabled = true;
        resultBtn.className = "w-full bg-slate-300 text-slate-500 font-bold py-3 px-4 rounded-xl cursor-not-allowed transition flex items-center justify-center space-x-2";
    }
}

// Buka Modal Kuis Stage
function openStageQuiz(idx) {
    state.activeStageIndex = idx;
    const cfg = stageConfigs[idx];

    document.getElementById('stage-badge-step').innerText = `Stage ${idx + 1} dari 5`;
    document.getElementById('stage-icon-box').innerText = cfg.icon;
    document.getElementById('stage-title').innerText = cfg.title;
    document.getElementById('stage-desc').innerText = cfg.desc;

    const inputContainer = document.getElementById('stage-input-container');
    inputContainer.innerHTML = '';

    if (cfg.type === 'slider') {
        const currentVal = state.stageInputs[idx] !== null ? state.stageInputs[idx] : cfg.default;
        inputContainer.innerHTML = `
            <div class="space-y-4 text-center py-2">
                <div class="text-4xl font-black text-blue-600" id="slider-val-disp">${currentVal} ${cfg.unit}</div>
                <input type="range" min="${cfg.min}" max="${cfg.max}" value="${currentVal}" id="stage-slider-input" oninput="document.getElementById('slider-val-disp').innerText = this.value + ' ' + '${cfg.unit}'" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600">
                <div class="flex justify-between text-[10px] text-slate-400">
                    <span>0 Gelas</span>
                    <span>Target Minimal: 8 Gelas</span>
                    <span>12 Gelas</span>
                </div>
            </div>
        `;
    } else if (cfg.type === 'options') {
        const selectedIdx = state.stageInputs[idx];
        const optsDiv = document.createElement('div');
        optsDiv.className = 'space-y-2';

        cfg.options.forEach((opt, oIdx) => {
            const isSelected = selectedIdx === oIdx;
            optsDiv.innerHTML += `
                <label onclick="selectOptionCard(${oIdx})" id="opt-card-${oIdx}" class="block p-3 border-2 rounded-xl cursor-pointer transition ${
                    isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }">
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-xs text-slate-800">${opt.label}</span>
                        <input type="radio" name="stage_opt" value="${oIdx}" ${isSelected ? 'checked' : ''} class="accent-emerald-600">
                    </div>
                    <p class="text-[11px] text-slate-500 mt-1">${opt.desc}</p>
                </label>
            `;
        });
        inputContainer.appendChild(optsDiv);
    }

    goToScreen('stage');
}

// Seleksi Pilihan Kartu
function selectOptionCard(oIdx) {
    document.querySelectorAll('[id^="opt-card-"]').forEach(el => {
        el.classList.remove('border-emerald-500', 'bg-emerald-50');
        el.classList.add('border-slate-200', 'bg-slate-50');
    });
    const selected = document.getElementById(`opt-card-${oIdx}`);
    if (selected) {
        selected.classList.remove('border-slate-200', 'bg-slate-50');
        selected.classList.add('border-emerald-500', 'bg-emerald-50');
        const radio = selected.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
    }
}

// Simpan Jawaban Stage
function saveStageAnswer() {
    const idx = state.activeStageIndex;
    const cfg = stageConfigs[idx];

    if (cfg.type === 'slider') {
        const val = parseInt(document.getElementById('stage-slider-input').value);
        state.stageInputs[idx] = val;

        if (val >= 8) state.stageScores[idx] = 30;
        else if (val >= 4) state.stageScores[idx] = 20;
        else state.stageScores[idx] = 10;

    } else if (cfg.type === 'options') {
        const checkedRadio = document.querySelector('input[name="stage_opt"]:checked');
        if (!checkedRadio) {
            alert('Pilih salah satu jawaban terlebih dahulu!');
            return;
        }
        const optIdx = parseInt(checkedRadio.value);
        state.stageInputs[idx] = optIdx;
        state.stageScores[idx] = cfg.options[optIdx].score;
    }

    state.completedStages[idx] = true;

    if (idx < 4) {
        openStageQuiz(idx + 1);
    } else {
        goToScreen('dashboard');
    }
}

// Render Layar Hasil Laporan Akhir
function renderResultScreen() {
    const totalScore = state.stageScores.reduce((a, b) => a + b, 0);
    state.healthIndex = Math.round((totalScore / 150) * 100);

    document.getElementById('res-score-number').innerText = state.healthIndex;

    const rankBadge = document.getElementById('res-rank-badge');
    const msgEl = document.getElementById('res-avatar-msg');
    const avatarEl = document.getElementById('dash-avatar');

    if (state.healthIndex >= 85) {
        state.rankTitle = 'FIT MASTER';
        rankBadge.innerText = '🌟 FIT MASTER';
        rankBadge.className = 'inline-block px-4 py-1.5 rounded-full font-bold text-xs bg-emerald-400 text-slate-950 shadow-md';
        msgEl.innerText = '"Tubuhmu sangat bertenaga, bugar, dan siap menaklukkan hari!"';
        if (avatarEl) avatarEl.innerText = '👑';
    } else if (state.healthIndex >= 60) {
        state.rankTitle = 'GUARDIAN';
        rankBadge.innerText = '🛡️ GUARDIAN';
        rankBadge.className = 'inline-block px-4 py-1.5 rounded-full font-bold text-xs bg-amber-400 text-slate-950 shadow-md';
        msgEl.innerText = '"Kesehatanmu cukup baik, namun ada beberapa hal kecil yang bisa ditingkatkan."';
        if (avatarEl) avatarEl.innerText = '🏃';
    } else {
        state.rankTitle = 'NOVICE';
        rankBadge.innerText = '🌱 NOVICE';
        rankBadge.className = 'inline-block px-4 py-1.5 rounded-full font-bold text-xs bg-rose-400 text-slate-950 shadow-md';
        msgEl.innerText = '"Tubuhmu butuh perhatian ekstra. Yuk perbaiki pola hidup harianmu!"';
        if (avatarEl) avatarEl.innerText = '🛋️';
    }

    const breakdownContainer = document.getElementById('breakdown-list');
    breakdownContainer.innerHTML = '';

    stageConfigs.forEach((cfg, idx) => {
        const score = state.stageScores[idx];
        const pct = Math.round((score / 30) * 100);

        breakdownContainer.innerHTML += `
            <div class="space-y-1">
                <div class="flex justify-between text-[11px] font-semibold text-slate-700">
                    <span>${cfg.icon} ${cfg.title.split(':')[1]}</span>
                    <span>${score}/30 Poin (${pct}%)</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div class="bg-emerald-500 h-2 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                </div>
            </div>
        `;
    });

    state.badges = [];
    if (state.stageScores[0] === 30) state.badges.push('🏆 Hydration Hero');
    if (state.stageScores[1] === 30) state.badges.push('🥗 Nutrition Master');
    if (state.stageScores[3] === 30) state.badges.push('🌙 Sleep Champion');
    if (state.healthIndex >= 90) state.badges.push('👑 Health Legend');

    const badgesContainer = document.getElementById('badges-container');
    badgesContainer.innerHTML = '';

    if (state.badges.length > 0) {
        state.badges.forEach(badge => {
            badgesContainer.innerHTML += `
                <span class="px-2.5 py-1 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-lg border border-amber-200">
                    ${badge}
                </span>
            `;
        });
    } else {
        badgesContainer.innerHTML = `<span class="text-xs text-slate-400 italic">Belum ada lencana terbuka. Selesaikan quest dengan poin maksimal!</span>`;
    }

    const recList = document.getElementById('recommendation-list');
    recList.innerHTML = '';

    const recommendations = [];

    if (state.stageScores[0] <= 10) recommendations.push('Tingkatkan konsumsi air putih minimal 8 gelas (2 Liter) hari ini.');
    else if (state.stageScores[0] == 20) recommendations.push('Tambahkan 1–2 gelas air lagi untuk mencapai hidrasi optimal.');

    if (state.stageScores[1] <= 10) recommendations.push('Kurangi gorengan/fast food & tambahkan porsi sayur di piring makanmu.');
    else if (state.stageScores[1] == 20) recommendations.push('Lengkapi makan siangmu dengan serat dari buah atau sayuran hijau.');

    if (state.stageScores[2] <= 10) recommendations.push('Luangkan waktu minimal 15–20 menit untuk berjalan kaki atau peregangan.');
    
    if (state.stageScores[3] <= 10) recommendations.push('Usahakan tidur malam 7–8 jam dan kurangi penggunaan HP sebelum tidur.');

    if (state.stageScores[4] <= 10) recommendations.push('Lakukan teknik pernapasan dalam (4-7-8) selama 2 menit untuk meredakan stres.');

    if (recommendations.length === 0) {
        recommendations.push('Pertahankan pola hidup luar biasa ini secara konsisten!');
        recommendations.push('Bagikan inspirasi gaya hidup sehatmu kepada teman-teman.');
        recommendations.push('Tetap jadwalkan pemeriksaan kesehatan rutin secara berkala.');
    }

    recommendations.slice(0, 3).forEach(rec => {
        recList.innerHTML += `<li>${rec}</li>`;
    });
}

// Fitur Testing: Auto-Fill Demo Data
function triggerAutoFillDemo() {
    state.user.name = state.user.name || 'Tester Pro';
    state.user.age = 24;
    state.user.height = 172;
    state.user.weight = 64;
    calculateBMI();

    state.stageInputs = [8, 2, 2, 2, 2];
    state.stageScores = [30, 30, 30, 20, 30];
    state.completedStages = [true, true, true, true, true];

    goToScreen('result');
}

// Reset Aplikasi
function resetApp() {
    state.user = { name: '', age: 0, height: 0, weight: 0, bmi: 0, bmiStatus: '' };
    state.stageScores = [0, 0, 0, 0, 0];
    state.stageInputs = [null, null, null, null, null];
    state.completedStages = [false, false, false, false, false];
    state.healthIndex = 0;

    document.getElementById('input-name').value = '';
    document.getElementById('input-age').value = '';
    document.getElementById('input-height').value = '';
    document.getElementById('input-weight').value = '';
    document.getElementById('bmi-preview').classList.add('hidden');

    goToScreen('onboarding');
}
