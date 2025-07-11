    document.addEventListener('DOMContentLoaded', () => {
        // --- 1. CONFIGURATION & STATE ---
        const config = {
            GEMINI_API_KEYS: [
             "AIzaSyCyUWKHOj0UZohe0f03UYqwYKmdTHyEK3o",// Kunci API Anda
             "AIzaSyC5hbODZv2dhTW5DCQZ9kKBD-7SoePFu0E", // Kunci API cadangan 1
                "AIzaSyDbhaB4GuyqkdTyK4LNM-QD-5AhQ30xK1U", // Kunci API cadangan 2
                "AIzaSyA3GnD0nmKNIZdw9MRUGNJzQqNzu8GTZ54", // Kunci API cadangan 3
                "AIzaSyCqpYPGQyXPU0OLiFKNCwh7tL8rsuWNNb4", // Kunci API cadangan 4

            ],
            jenjangData: {
                'SD': { menit: 35, fase: { 'A': ['I', 'II'], 'B': ['III', 'IV'], 'C': ['V', 'VI'] } },
                'SMP': { menit: 40, fase: { 'D': ['VII', 'VIII', 'IX'] } },
                'SMA/SMK': { menit: 45, fase: { 'E': ['X'], 'F': ['XI', 'XII'] } }
            },
            toastIcons: {
                success: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>',
                error: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>',
                warning: '<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>',
                info: '<path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>'
            },
            toastColors: {
                success: 'bg-green-500', error: 'bg-red-500', warning: 'bg-amber-500', info: 'bg-sky-500'
            },
            loadingMessages: [
                'Menganalisis data input...', 'Menghubungi server AI...', 'Merumuskan kompetensi & tujuan...', 'Merancang kegiatan pembelajaran...', 'Menyusun asesmen & rubrik...', 'Menyelesaikan lampiran...', 'Hampir selesai...'
            ]
        };

        const elements = {
            form: document.getElementById('modul-form'),
            generateBtn: document.getElementById('generate-btn'),
            resetBtn: document.getElementById('reset-btn'),
            btnText: document.getElementById('btn-text'),
            loader: document.getElementById('loader'),
            loaderText: document.getElementById('loader-text'),
            outputContent: document.getElementById('output-content'),
            placeholder: document.getElementById('placeholder'),
            actionButtons: document.getElementById('action-buttons'),
            jenjangSelect: document.getElementById('jenjang'),
            faseSelect: document.getElementById('fase'),
            kelasSelect: document.getElementById('kelas'),
            menitPerJpInput: document.getElementById('menitPerJp'),
            copyBtn: document.getElementById('copy-btn'),
            printBtn: document.getElementById('print-btn'),
            docBtn: document.getElementById('doc-btn'),
            pdfBtn: document.getElementById('pdf-btn'),
            dropdownBtn: document.getElementById('dropdown-btn'),
            dropdownMenu: document.getElementById('dropdown-menu'),
            dropdownArrow: document.getElementById('dropdown-arrow'),
            tanggalInput: document.getElementById('tanggal'),
            resetModal: document.getElementById('reset-modal'),
            resetModalContent: document.getElementById('reset-modal-content'),
            confirmResetBtn: document.getElementById('confirm-reset-btn'),
            cancelResetBtn: document.getElementById('cancel-reset-btn'),
        };
        
        let appState = {
            generatedContentData: null,
            loadingInterval: null
        };

        // --- 2. UTILITY & HELPER FUNCTIONS ---
        const decodeHtmlEntities = (text) => {
            if (typeof text !== 'string') return '';
            const textarea = document.createElement('textarea');
            textarea.innerHTML = text;
            return textarea.value;
        };

        // --- 3. CORE MODULES (UI, Renderer, Exporter, API, FormManager) ---

        const UI = {
            showToast(message, type = 'success') {
                const toast = document.getElementById('toast');
                document.getElementById('toast-message').textContent = message;
                document.getElementById('toast-icon').innerHTML = config.toastIcons[type];
                toast.className = toast.className.replace(/bg-\w+-\d+/g, '');
                toast.classList.add(config.toastColors[type], 'opacity-100', 'translate-y-0');
                setTimeout(() => {
                    toast.classList.remove('opacity-100', 'translate-y-0');
                }, 4000);
            },
            setLoadingState(isLoading) {
                elements.loader.classList.toggle('hidden', !isLoading);
                elements.generateBtn.disabled = isLoading;
                elements.resetBtn.disabled = isLoading;
                elements.btnText.textContent = isLoading ? 'Memproses...' : 'Buat Modul Ajar dengan AI';
                
                if (isLoading) {
                    elements.placeholder.classList.add('hidden');
                    elements.outputContent.innerHTML = '';
                    elements.actionButtons.classList.add('hidden');
                    let messageIndex = 0;
                    elements.loaderText.textContent = config.loadingMessages[messageIndex];
                    appState.loadingInterval = setInterval(() => {
                        messageIndex = (messageIndex + 1) % config.loadingMessages.length;
                        elements.loaderText.textContent = config.loadingMessages[messageIndex];
                    }, 2500);
                } else {
                    if (appState.loadingInterval) {
                        clearInterval(appState.loadingInterval);
                        appState.loadingInterval = null;
                    }
                }
            },
            updateFaseOptions() {
                const selectedJenjang = elements.jenjangSelect.value;
                const data = config.jenjangData[selectedJenjang];
                elements.faseSelect.innerHTML = '';
                if (data) {
                    Object.keys(data.fase).forEach(faseKey => {
                        elements.faseSelect.add(new Option(`Fase ${faseKey}`, faseKey));
                    });
                    elements.menitPerJpInput.value = data.menit;
                }
                this.updateKelasOptions();
            },
            updateKelasOptions() {
                const selectedJenjang = elements.jenjangSelect.value;
                const selectedFase = elements.faseSelect.value;
                const kelasOptions = config.jenjangData[selectedJenjang]?.fase[selectedFase] || [];
                elements.kelasSelect.innerHTML = '';
                kelasOptions.forEach(k => {
                    elements.kelasSelect.add(new Option(`Kelas ${k}`, k));
                });
            },
            showResetModal() {
                elements.resetModal.classList.remove('hidden');
                setTimeout(() => {
                    elements.resetModalContent.classList.remove('opacity-0', 'scale-95');
                    elements.resetModalContent.classList.add('opacity-100', 'scale-100');
                }, 10);
            },
            hideResetModal() {
                elements.resetModalContent.classList.remove('opacity-100', 'scale-100');
                elements.resetModalContent.classList.add('opacity-0', 'scale-95');
                setTimeout(() => {
                    elements.resetModal.classList.add('hidden');
                }, 200);
            },
            initialize() {
                Object.keys(config.jenjangData).forEach(jenjang => {
                    elements.jenjangSelect.add(new Option(jenjang, jenjang));
                });
                elements.jenjangSelect.value = 'SD';
                this.updateFaseOptions();
                elements.tanggalInput.valueAsDate = new Date();
                
                const style = document.createElement('style');
                style.innerHTML = `.btn { padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; border: 1px solid #d1d5db; background-color: #f9fafb; color: #374151; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 0.5rem; } .btn:hover { background-color: #f3f4f6; border-color: #9ca3af; }`;
                document.head.appendChild(style);
            }
        };

        const Renderer = {
            formatInline(text) {
                let decodedText = decodeHtmlEntities(text);
                let formattedText = decodedText
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>');
                
                formattedText = formattedText.replace(/\(\s*Prinsip:\s*(Joyful Learning|Meaningful Learning|Mindful Learning)\s*\)/gi, (match, principle) => {
                    let emoji = '';
                    if (principle.toLowerCase().includes('joyful')) emoji = '😄';
                    if (principle.toLowerCase().includes('meaningful')) emoji = '🧩';
                    if (principle.toLowerCase().includes('mindful')) emoji = '🧘';
                    const principleClass = principle.split(' ')[0].toLowerCase();
                    return `<span class="whitespace-nowrap">${emoji} <span class="learning-principle principle-${principleClass}">${principle}</span></span>`;
                });
                return formattedText;
            },
            renderContent(content) {
                if (typeof content !== 'string') {
                    console.warn("renderContent expected a string but received:", typeof content, content);
                    return '<p class="text-red-500 italic">[Konten tidak dapat dirender karena format data tidak sesuai.]</p>';
                }
                let processedContent = content.replace(/^(.*?):\s*(\|.*\|)/gm, '$1:\n$2');
                processedContent = processedContent.replace(/(\s)(?=\d+\.\s)/g, '\n');

                const lines = processedContent.split('\n');
                let html = '';
                let inList = false;
                let listType = '';
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i].trim();
                    
                    if (line.startsWith('#####')) {
                        if (inList) { html += `</${listType}>`; inList = false; }
                        html += `<h5>${this.formatInline(line.replace(/^#{5}\s*/, ''))}</h5>`;
                    } else if (line.startsWith('####')) {
                        if (inList) { html += `</${listType}>`; inList = false; }
                        html += `<h4>${this.formatInline(line.replace(/^#{4}\s*/, ''))}</h4>`;
                    } else if (line.startsWith('###')) {
                        if (inList) { html += `</${listType}>`; inList = false; }
                        html += `<h3>${this.formatInline(line.replace(/^#{3}\s*/, ''))}</h3>`;
                    } else if (line.startsWith('##')) {
                        if (inList) { html += `</${listType}>`; inList = false; }
                        html += `<h2>${this.formatInline(line.replace(/^#{2}\s*/, ''))}</h2>`;
                    }
                    else if (line.startsWith('|')) {
                        if (inList) { html += `</${listType}>`; inList = false; }
                        const headers = line.slice(1, -1).split('|').map(h => h.trim());
                        
                        // Check for specific table types to apply classes
                        const isAlurBelajarTable = headers.some(h => h.toLowerCase().includes('pertemuan')) && headers.some(h => h.toLowerCase().includes('fokus materi'));
                        const isRubrikTable = headers.some(h => h.toLowerCase().includes('aspek penilaian'));

                        let tableClass = '';
                        if (isAlurBelajarTable) {
                            tableClass = 'alur-belajar-table';
                        } else if (isRubrikTable) {
                            tableClass = 'rubrik-penilaian-table';
                        }

                        let tableHtml = `<table class="${tableClass}">`;
                        
                        tableHtml += '<thead><tr>';
                        headers.forEach(h => tableHtml += `<th>${this.formatInline(h)}</th>`);
                        tableHtml += '</tr></thead>';
                        
                        if (i + 1 < lines.length && lines[i + 1].trim().match(/^\|-.*-/)) {
                            i++; 
                        }

                        tableHtml += '<tbody>';
                        while (i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) {
                            i++;
                            const cells = lines[i].trim().slice(1, -1).split('|').map(c => c.trim().replace(/\\n/g, '<br>'));
                            tableHtml += '<tr>';
                            cells.forEach(c => tableHtml += `<td>${this.formatInline(c)}</td>`);
                            tableHtml += '</tr>';
                        }
                        tableHtml += '</tbody></table>';
                        html += tableHtml;
                        continue;
                    }
                    else if (line.match(/^(\d+\.|\-|\*|•)\s/)) {
                        const currentListType = line.match(/^\d+\./) ? 'ol' : 'ul';
                        if (!inList || listType !== currentListType) {
                            if (inList) html += `</${listType}>`;
                            html += `<${currentListType} class="list-inside ${currentListType === 'ol' ? 'list-decimal' : 'list-disc'} pl-5">`;
                            inList = true; listType = currentListType;
                        }
                        html += `<li>${this.formatInline(line.replace(/^(\d+\.|\-|\*|•)\s*/, ''))}</li>`;
                    }
                    else {
                        if (inList) { html += `</${listType}>`; inList = false; }
                        if (line) { html += `<p>${this.formatInline(line)}</p>`; }
                    }
                }
                if (inList) html += `</${listType}>`;
                return html.replace(/<br>/g, '');
            },
            renderKegiatan(content) {
                const meetingColors = ['border-blue-300 text-blue-800', 'border-purple-300 text-purple-800', 'border-teal-300 text-teal-800', 'border-orange-300 text-orange-800'];
                let colorIndex = 0;
                let processedContent = this.renderContent(content);
                processedContent = processedContent.replace(/<h2>Pertemuan (\d+)(.*?)<\/h2>/g, (match, p1, p2) => {
                    const colorClass = meetingColors[colorIndex % meetingColors.length];
                    colorIndex++;
                    return `<h2 class="${colorClass}">Pertemuan ${p1}${p2}</h2>`;
                });
                return processedContent;
            },
            createFinalHtml(data) {
                const {
                    namaGuru, nipGuru, namaSekolah, jenjang, fase, kelas, semester, mataPelajaran, materi,
                    namaKepalaSekolah, nipKepalaSekolah, lokasi, tanggal, jabatanGuru, jabatanGuruTeks,
                    jumlahSesi, jp, menitPerJp,
                    kompetensiAwal, capaianPembelajaran, tujuanPembelajaran, profilPelajar,
                    targetPesertaDidik, modelPembelajaran, kemitraanPembelajaran, lingkunganPembelajaran, pemanfaatanDigital,
                    kegiatanPembelajaran, alurBelajar, rubrikPenilaian, 
                    asesmen, pengayaanRemedial, refleksi, 
                    lkpd, bahanBacaan, glosarium, daftarPustaka
                } = data;
                const finalJabatanGuru = jabatanGuru === 'sendiri' ? jabatanGuruTeks : jabatanGuru;
                const formattedDate = new Date(tanggal + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                const komponenIntiHtml = `<div class="page-break-avoid mb-4 gradient-border-box"><div><h3>Kompetensi Awal</h3><p class="text-sm !mt-2">${kompetensiAwal}</p></div></div><div class="page-break-avoid mb-4 gradient-border-box"><div><h3>Capaian Pembelajaran</h3><p class="text-sm !mt-2">${capaianPembelajaran}</p></div></div><div class="page-break-avoid mb-4 gradient-border-box"><div><h3>Tujuan Pembelajaran</h3><div class="text-sm !mt-2">${this.renderContent(tujuanPembelajaran)}</div></div></div><div class="page-break-avoid mb-4 gradient-border-box"><div><h3>Profil Lulusan</h3><p class="text-sm !mt-2">${profilPelajar}</p></div></div><div class="page-break-avoid mb-4 gradient-border-box"><div><h3>Target Peserta Didik</h3><p class="text-sm !mt-2">${targetPesertaDidik}</p></div></div><div class="page-break-avoid mb-4 gradient-border-box"><div><h3>Kemitraan Pembelajaran</h3><p class="text-sm !mt-2">${kemitraanPembelajaran || 'Tidak ada kemitraan khusus.'}</p></div></div><div class="page-break-avoid mb-4 gradient-border-box"><div><h3>Lingkungan Pembelajaran</h3><p class="text-sm !mt-2">${lingkunganPembelajaran}</p></div></div><div class="page-break-avoid mb-4 gradient-border-box"><div><h3>Pemanfaatan Digital</h3><p class="text-sm !mt-2">${pemanfaatanDigital || 'Tidak ada pemanfaatan digital khusus.'}</p></div></div><div class="page-break-avoid mb-6 gradient-border-box"><div><h3>Model Pembelajaran</h3><p class="text-sm !mt-2">${modelPembelajaran}</p></div></div>`;
                
                const alurBelajarHtml = alurBelajar ? `<div class="page-break-avoid mb-6 gradient-border-box"><div><h3>Alur Belajar</h3>${this.renderContent(alurBelajar)}</div></div>` : '';
                
                const cleanKegiatan = (kegiatanPembelajaran || "").replace(/[\s\S]*?(?=## Pertemuan)/, "");

                const kegiatanChunks = cleanKegiatan.split('## Pertemuan').slice(1);
                const kegiatanHtml = kegiatanChunks.map(chunk => `<div class="page-break-avoid mb-6 gradient-border-box"><div>${this.renderKegiatan('## Pertemuan' + chunk)}</div></div>`).join('');
                
                const rubrikHtml = rubrikPenilaian ? `<div class="lampiran-box page-break-avoid mb-6 p-6 border border-slate-200 rounded-xl bg-white shadow-sm"><h3 class="!text-base !font-bold !mt-0 !text-indigo-700">5. Rubrik Penilaian</h3><div class="mt-4 text-sm prose-output">${this.renderContent(rubrikPenilaian)}</div></div>` : '';
                const lampiranHtml = `<div class="lampiran-box page-break-avoid mb-6 p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50"><h3 class="!text-base !font-bold !mt-0 !text-indigo-700">1. Lembar Kerja Peserta Didik (LKPD)</h3><div class="mt-4 text-sm prose-output">${this.renderContent(lkpd)}</div></div><div class="lampiran-box page-break-avoid mb-6 p-6 border border-slate-200 rounded-xl bg-white shadow-sm"><h3 class="!text-base !font-bold !mt-0 !text-indigo-700">2. Bahan Bacaan Guru & Peserta Didik</h3><div class="mt-4 text-sm prose-output">${this.renderContent(bahanBacaan)}</div></div><div class="lampiran-box page-break-avoid mb-6 p-6 border border-slate-200 rounded-xl bg-white shadow-sm"><h3 class="!text-base !font-bold !mt-0 !text-indigo-700">3. Glosarium</h3><div class="mt-4 text-sm prose-output">${this.renderContent(glosarium)}</div></div><div class="lampiran-box page-break-avoid mb-4 p-6 border border-slate-200 rounded-xl bg-white shadow-sm"><h3 class="!text-base !font-bold !mt-0 !text-indigo-700">4. Daftar Pustaka</h3><div class="mt-4 text-sm prose-output">${this.renderContent(daftarPustaka)}</div></div>${rubrikHtml}`;
                
                const langkahPembelajaranTitle = `<h3 class="text-lg font-bold !mt-6 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2"><svg class="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg><span class="gradient-title">Langkah-langkah Pembelajaran</span></h3>`;

                return `<div class="module-render-area text-slate-700 prose-output" id="module-render-area"><div class="text-center mb-10"><h1 class="text-2xl sm:text-3xl font-extrabold google-gradient uppercase">Modul Ajar dengan Pendekatan Deep Learning</h1><h2 class="text-xl font-bold mt-2 !border-none !text-green-600">${mataPelajaran.toUpperCase()}</h2></div><div class="page-break-avoid mb-6 gradient-border-box"><div><h3 class="text-lg font-bold !mt-0 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2"><svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="gradient-title">A. INFORMASI UMUM</span></h3><table class="w-full text-sm"><tbody><tr class="border-b border-slate-200"><td class="py-2.5 px-3 font-semibold text-slate-600 bg-slate-50 w-1/3 rounded-tl-lg">Nama Penyusun</td><td class="py-2.5 px-3">${namaGuru || '...'}</td></tr><tr class="border-b border-slate-200"><td class="py-2.5 px-3 font-semibold text-slate-600 bg-slate-50 w-1/3">NIP</td><td class="py-2.5 px-3">${nipGuru || '-'}</td></tr><tr class="border-b border-slate-200"><td class="py-2.5 px-3 font-semibold text-slate-600 bg-slate-50 w-1/3">Institusi</td><td class="py-2.5 px-3">${namaSekolah}</td></tr><tr class="border-b border-slate-200"><td class="py-2.5 px-3 font-semibold text-slate-600 bg-slate-50 w-1/3">Mata Pelajaran</td><td class="py-2.5 px-3">${mataPelajaran}</td></tr><tr class="border-b border-slate-200"><td class="py-2.5 px-3 font-semibold text-slate-600 bg-slate-50 w-1/3">Materi Ajar</td><td class="py-2.5 px-3">${materi}</td></tr><tr class="border-b border-slate-200"><td class="py-2.5 px-3 font-semibold text-slate-600 bg-slate-50 w-1/3">Jenjang / Fase</td><td class="py-2.5 px-3">${jenjang} / Fase ${fase}</td></tr><tr class="border-b border-slate-200"><td class="py-2.5 px-3 font-semibold text-slate-600 bg-slate-50 w-1/3">Kelas / Semester</td><td class="py-2.5 px-3">${kelas} / ${semester}</td></tr><tr><td class="py-2.5 px-3 font-semibold text-slate-600 bg-slate-50 w-1/3 rounded-bl-lg">Alokasi Waktu</td><td class="py-2.5 px-3">${jumlahSesi} Sesi &times; ${jp} JP (@${menitPerJp} Menit)</td></tr></tbody></table></div></div><h3 class="text-lg font-bold !mt-8 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2 page-break-after"><svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg><span class="gradient-title">B. KOMPONEN INTI</span></h3>${komponenIntiHtml}<h3 class="text-lg font-bold !mt-8 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2 page-break-after"><svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg><span class="gradient-title">C. KEGIATAN PEMBELAJARAN</span></h3>${alurBelajarHtml}${langkahPembelajaranTitle}${kegiatanHtml}<div class="page-break-avoid mt-8 mb-6 gradient-border-box page-break-after"><div><h3 class="text-lg font-bold !mt-0 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2"><svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="gradient-title">D. ASESMEN / PENILAIAN</span></h3><div class="text-sm max-w-none">${this.renderContent(asesmen)}</div></div></div><div class="page-break-avoid mb-6 gradient-border-box"><div><h3 class="text-lg font-bold !mt-0 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2"><svg class="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg><span class="gradient-title">E. PENGAYAAN DAN REMEDIAL</span></h3><div class="text-sm max-w-none">${this.renderContent(pengayaanRemedial)}</div></div></div><div class="page-break-avoid mb-6 gradient-border-box"><div><h3 class="text-lg font-bold !mt-0 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2"><svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg><span class="gradient-title">F. REFLEKSI</span></h3><div class="text-sm max-w-none">${this.renderContent(refleksi)}</div></div></div><h3 class="text-lg font-bold !mt-8 mb-4 pb-2 border-b border-slate-200 flex items-center gap-2 page-break-after"><svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg><span class="gradient-title">G. LAMPIRAN</span></h3>${lampiranHtml}<div class="signature-section mt-16 pt-8 page-break-avoid"><table class="w-full border-none text-center text-sm"><tbody class="border-none"><tr class="border-none"><td class="border-none p-2 w-1/2">Mengetahui,<br>Kepala Sekolah</td><td class="border-none p-2 w-1/2">${lokasi}, ${formattedDate}<br>${finalJabatanGuru}</td></tr><tr class="border-none"><td class="border-none h-24"></td><td class="border-none h-24"></td></tr><tr class="border-none"><td class="border-none p-2 font-bold underline">${namaKepalaSekolah || '____________________'}</td><td class="border-none p-2 font-bold underline">${namaGuru || '____________________'}</td></tr><tr class="border-none"><td class="border-none p-2">NIP. ${nipKepalaSekolah || '................................................'}</td><td class="border-none p-2">NIP. ${nipGuru || '................................................'}</td></tr></tbody></table></div></div>`;
            }
        };

        const Exporter = {
            downloadDoc() {
                const contentArea = document.getElementById('module-render-area');
                if (!contentArea || !contentArea.innerHTML) { UI.showToast("Tidak ada konten untuk diunduh.", "warning"); return; }
                const styles = `<style>body{font-family: 'Times New Roman', Times, serif; font-size: 12pt;} table{border-collapse: collapse; width: 100%;} th, td{border: 1px solid black; padding: 8px; text-align: left; vertical-align: top;} h1,h2,h3,h4,h5{font-family: 'Arial', sans-serif;}</style>`;
                const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Modul Ajar</title>${styles}</head><body>`;
                const footer = "</body></html>";
                const sourceHTML = header + contentArea.innerHTML + footer;
                const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
                const fileDownload = document.createElement("a");
                document.body.appendChild(fileDownload);
                fileDownload.href = source;
                fileDownload.download = 'Modul-Ajar.doc';
                fileDownload.click();
                document.body.removeChild(fileDownload);
            },
            downloadPdf() {
                if (!appState.generatedContentData) { UI.showToast("Tidak ada konten untuk diunduh.", "warning"); return; }
                const pdfBtn = elements.pdfBtn;
                const originalBtnHTML = pdfBtn.innerHTML;
                pdfBtn.disabled = true;
                pdfBtn.innerHTML = `<svg class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Membuat...</span>`;
                UI.showToast("Mempersiapkan PDF, mohon tunggu...", "warning");
                try {
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
                    const { namaGuru, nipGuru, namaSekolah, jenjang, fase, kelas, semester, mataPelajaran, materi, namaKepalaSekolah, nipKepalaSekolah, lokasi, tanggal, jabatanGuru, jabatanGuruTeks, jumlahSesi, jp, menitPerJp, ...contentData } = appState.generatedContentData;
                    const pageHeight = doc.internal.pageSize.height; const pageWidth = doc.internal.pageSize.width; const margin = 40; let yPos = margin;
                    const checkPageSpace = (h) => { if (yPos + h >= pageHeight - margin) { doc.addPage(); yPos = margin; } };
                    const addText = (text, options) => { const { size, style, x = margin, maxWidth = pageWidth - margin * 2, color = [0,0,0] } = options; doc.setFontSize(size).setFont(undefined, style).setTextColor(color[0], color[1], color[2]); const lines = doc.splitTextToSize(text, maxWidth); checkPageSpace(lines.length * size * 1.2); doc.text(lines, x, yPos); yPos += (lines.length * size * 1.15) + (options.spacing || 0); };
                    const addTitle = (text, level) => { const s = { h1: { size: 18, style: 'bold', spacing: 15, color: [0,0,0] }, h2: { size: 14, style: 'bold', spacing: 10, color: [52, 168, 83] }, h3: { size: 12, style: 'bold', spacing: 8, color: [66, 133, 244] } }[level]; doc.setTextColor(s.color[0], s.color[1], s.color[2]); addText(text.toUpperCase(), { ...s }); };
                    
                    const parseAndDrawMarkdown = (markdown) => {
                        if (typeof markdown !== 'string') return;
                        const lines = markdown.split('\n');

                        for (let i = 0; i < lines.length; i++) {
                            let line = decodeHtmlEntities(lines[i].trim());
                            line = line.replace(/&#8226;/g, '•');
                            line = line.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');

                            if (line.startsWith('#####')) {
                                addText(line.replace(/^#{5}\s*/, ''), { size: 10, style: 'bold', spacing: 6, color: [0,0,0] });
                            } else if (line.startsWith('####')) {
                                addText(line.replace(/^#{4}\s*/, ''), { size: 11, style: 'bold', spacing: 6, color: [0,0,0] });
                            } else if (line.startsWith('###')) {
                                addTitle(line.replace(/^#{3}\s*/, ''), 'h3');
                            } else if (line.startsWith('##')) {
                                addTitle(line.replace(/^#{2}\s*/, ''), 'h2');
                            } else if (line.startsWith('|')) {
                                const tableData = { head: [], body: [] };
                                const headers = decodeHtmlEntities(line).slice(1, -1).split('|').map(h => h.trim());
                                tableData.head.push(headers);
                                i++; 
                                
                                while (i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) {
                                    i++;
                                    const cells = decodeHtmlEntities(lines[i].trim()).slice(1, -1).split('|').map(c => c.trim().replace(/\\n/g, '\n'));
                                    tableData.body.push(cells);
                                }
                                
                                checkPageSpace(50);
                                doc.autoTable({
                                    head: tableData.head,
                                    body: tableData.body,
                                    startY: yPos,
                                    theme: 'grid',
                                    styles: { fontSize: 9, cellPadding: 5, overflow: 'linebreak' },
                                    headStyles: { fillColor: [239, 246, 255], textColor: [29, 78, 216], fontStyle: 'bold' },
                                    didDrawPage: (data) => { yPos = data.cursor.y; }
                                });
                                yPos = doc.autoTable.previous.finalY + 15;

                            } else if (line.match(/^(\-|\*|•)\s/)) {
                                const cleanLine = line.replace(/^(\-|\*|•)\s*/, '');
                                addText(`- ${cleanLine}`, { size: 10, style: 'normal', x: margin + 10, maxWidth: pageWidth - margin * 2 - 10, spacing: 4, color: [55, 65, 81] });
                            } else if (line.match(/^\d+\.\s/)) {
                                addText(line, { size: 10, style: 'normal', x: margin + 10, maxWidth: pageWidth - margin * 2 - 10, spacing: 4, color: [55, 65, 81] });
                            } else if (line) {
                                addText(line, { size: 10, style: 'normal', spacing: 10, color: [55, 65, 81] });
                            }
                        }
                    };

                    const addSignatureBlock = () => { checkPageSpace(120); yPos += 40; const finalJabatanGuru = jabatanGuru === 'sendiri' ? jabatanGuruTeks : jabatanGuru; const formattedDate = new Date(tanggal + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); const col1X = margin; const col2X = pageWidth / 2; const startY = yPos; doc.setFontSize(10).setFont(undefined, 'normal'); doc.text('Mengetahui,', col1X, startY); doc.text('Kepala Sekolah', col1X, startY + 12); doc.text(namaKepalaSekolah || '____________________', col1X, startY + 72); doc.text(`NIP. ${nipKepalaSekolah || '..............................'}`, col1X, startY + 84); doc.text(`${lokasi}, ${formattedDate}`, col2X, startY); doc.text(finalJabatanGuru, col2X, startY + 12); doc.text(namaGuru || '____________________', col2X, startY + 72); doc.text(`NIP. ${nipGuru || '..............................'}`, col2X, startY + 84); yPos = startY + 96; };
                    
                    addTitle(`Modul Ajar: ${mataPelajaran}`, 'h1'); addText(materi, { size: 12, style: 'normal', spacing: 20 });
                    addTitle('A. Informasi Umum', 'h2'); doc.autoTable({ startY: yPos, theme: 'grid', body: [['Nama Penyusun', namaGuru], ['Institusi', namaSekolah], ['Jenjang/Fase', `${jenjang} / Fase ${fase}`], ['Kelas/Semester', `${kelas} / ${semester}`], ['Alokasi Waktu', `${jumlahSesi} Sesi x ${jp} JP (@${menitPerJp} Menit)`]], styles: { fontSize: 9, cellPadding: 5 }, didDrawPage: data => yPos = data.cursor.y + 15 }); yPos = doc.autoTable.previous.finalY + 15;
                    addTitle('B. Komponen Inti', 'h2'); parseAndDrawMarkdown(`### Kompetensi Awal\n${contentData.kompetensiAwal}\n### Capaian Pembelajaran\n${contentData.capaianPembelajaran}\n### Tujuan Pembelajaran\n${contentData.tujuanPembelajaran}`);
                    addTitle('C. Kegiatan Pembelajaran', 'h2'); 
                    if (contentData.alurBelajar) {
                        addTitle('Alur Belajar', 'h3');
                        parseAndDrawMarkdown(contentData.alurBelajar);
                    }
                    parseAndDrawMarkdown(contentData.kegiatanPembelajaran);
                    addTitle('D. Asesmen', 'h2'); parseAndDrawMarkdown(contentData.asesmen);
                    addTitle('E. Pengayaan dan Remedial', 'h2'); parseAndDrawMarkdown(contentData.pengayaanRemedial);
                    addTitle('F. Refleksi', 'h2'); parseAndDrawMarkdown(contentData.refleksi);
                    addTitle('G. Lampiran', 'h2'); parseAndDrawMarkdown(`### Lembar Kerja Peserta Didik\n${contentData.lkpd}\n### Bahan Bacaan\n${contentData.bahanBacaan}\n### Glosarium\n${contentData.glosarium}\n### Daftar Pustaka\n${contentData.daftarPustaka}\n### Rubrik Penilaian\n${contentData.rubrikPenilaian}`);
                    addSignatureBlock();
                    doc.save('Modul-Ajar-AI-Generated.pdf');
                    UI.showToast("Unduhan PDF berhasil!", "success");
                } catch (error) { console.error("Gagal membuat PDF:", error); UI.showToast("Terjadi kesalahan saat membuat PDF.", "error"); }
                finally { pdfBtn.disabled = false; pdfBtn.innerHTML = originalBtnHTML; }
            }
        };

        const API = {
            createPromptFromForm() {
                const formData = new FormData(elements.form);
                const data = Object.fromEntries(formData.entries());
                const getFinalValue = (opsiKey, teksKey, aiInstruction) => data[opsiKey] === 'sendiri' && data[teksKey] ? data[teksKey] : aiInstruction;
                const selectedModels = Array.from(document.querySelectorAll('input[name="model"]:checked')).map(cb => cb.value).join(', ') || 'AI akan memilih yang paling sesuai.';
                const selectedFokus = Array.from(document.querySelectorAll('input[name="fokus"]:checked')).map(cb => cb.value).join(', ') || 'AI akan menentukan fokus yang relevan.';
                const selectedDimensi = Array.from(document.querySelectorAll('input[name="dimensi"]:checked')).map(cb => cb.value.split(':')[1].trim()).join(', ');
                const promptData = { ...data, kompetensiAwal: getFinalValue('kompetensiAwalOpsi', 'kompetensiAwalTeks', 'AI akan merumuskan kompetensi awal yang relevan.'), capaianPembelajaran: getFinalValue('capaianPembelajaranOpsi', 'capaianPembelajaranTeks', 'AI akan merumuskan capaian pembelajaran berdasarkan fase dan materi.'), tujuanPembelajaran: getFinalValue('tujuanPembelajaranOpsi', 'tujuanPembelajaranTeks', 'AI akan merumuskan tujuan pembelajaran yang spesifik dalam bentuk daftar poin.'), targetPesertaDidik: getFinalValue('targetPesertaDidikOpsi', 'targetPesertaDidikTeks', 'AI akan mendeskripsikan target peserta didik (reguler/tipikal).'), kemitraanPembelajaran: getFinalValue('kemitraanPembelajaranOpsi', 'kemitraanPembelajaranTeks', 'AI akan merumuskan kemitraan pembelajaran yang relevan.'), lingkunganPembelajaran: getFinalValue('lingkunganPembelajaranOpsi', 'lingkunganPembelajaranTeks', 'AI akan merumuskan lingkungan pembelajaran yang relevan.'), pemanfaatanDigital: getFinalValue('pemanfaatanDigitalOpsi', 'pemanfaatanDigitalTeks', 'AI akan merumuskan pemanfaatan digital yang relevan.'), modelPembelajaran: selectedModels, fokusPembelajaran: selectedFokus, profilPelajar: selectedDimensi };
                
                // PERBAIKAN: Menambahkan System Instruction untuk memperkuat peran AI
                return `Anda adalah seorang ahli kurikulum dan perancang pembelajaran veteran dari Indonesia yang sangat teliti, kreatif, dan praktis. Selalu berikan jawaban dalam Bahasa Indonesia yang formal dan baku. Hasilkan konten yang siap pakai dan melampaui ekspektasi seorang guru profesional. Tugas Anda adalah membuat konten untuk sebuah modul ajar berdasarkan data yang diberikan.

DATA INPUT:
- Mata Pelajaran: ${promptData.mataPelajaran}
- Materi Pokok: ${promptData.materi}
- Fase/Kelas: ${promptData.fase} / ${promptData.kelas}
- Jumlah Sesi: ${promptData.jumlahSesi}
- Profil Lulusan yang dituju: ${promptData.profilPelajar}
- Model Pembelajaran yang diinginkan: ${promptData.modelPembelajaran}
- Fokus Pembelajaran: ${promptData.fokusPembelajaran}

INSTRUKSI PENTING:
Hasilkan respons dalam format JSON. JANGAN tambahkan markdown \`\`\`json.
Isi setiap properti JSON dengan konten yang **SANGAT RINCI, LENGKAP, dan SIAP PAKAI**. Jangan pernah memberikan jawaban singkat atau hanya deskripsi umum. Buatlah konten yang seolah-olah dibuat oleh seorang guru ahli.

**ATURAN KERAS YANG TIDAK BOLEH DILANGGAR:**
- **DILARANG KERAS MENGGABUNGKAN PERTEMUAN.** Contoh larangan: "Pertemuan 3-12: ...". Anda harus menulis "## Pertemuan 3", lalu "## Pertemuan 4", dan seterusnya, masing-masing dengan konten lengkap.
- **DILARANG KERAS MENGGUNAKAN KALIMAT TEMPLATE/PLACEHOLDER.** Contoh larangan: "Lanjutkan dengan pola yang sama", "Struktur mengikuti pertemuan sebelumnya", "Kegiatan disesuaikan". Setiap deskripsi harus unik dan spesifik.

1.  **alurBelajar**: Buat tabel markdown yang merangkum alur pembelajaran. Kolom: | Pertemuan | Fokus Materi | Deskripsi Kegiatan |. Gunakan 'P1', 'P2', dst. untuk kolom pertama. Pastikan deskripsi kegiatan di setiap pertemuan detail dan menjelaskan alur logis.
2.  **kegiatanPembelajaran**: **TULIS SECARA LENGKAP DAN DETAIL** untuk **SETIAP SESI** dari ${promptData.jumlahSesi} sesi yang diminta. **WAJIB** ikuti struktur format markdown ini untuk setiap pertemuan:
    ## Pertemuan [Nomor]
    #### Topik: [Topik Spesifik untuk pertemuan ini]
    ### Pendahuluan
    - ...
    ### Inti
    - ...
    ### Penutup
    - ...
    Untuk setiap poin kegiatan dalam daftar ('- '), jika relevan, WAJIB tambahkan label prinsip pembelajaran di akhir kalimat. Contoh: '- Peserta didik berdiskusi dalam kelompok (Prinsip: Joyful Learning)'. Jika 'Pembelajaran Diferensiasi' dipilih, pastikan rencananya mencakup **strategi diferensiasi yang jelas dan praktis** untuk konten, proses, produk, atau lingkungan belajar.
3.  **asesmen**: Jelaskan teknik dan instrumen penilaian secara **komprehensif dan mendalam**. Wajib mencakup konsep **assessment as learning (penilaian diri/sejawat), for learning (umpan balik), dan of learning (pencapaian)**. Berikan **contoh konkret** seperti lembar observasi dengan indikator jelas, rubrik terperinci, daftar pertanyaan pemantik yang spesifik, atau contoh portofolio. Jangan hanya menyebutkan nama tekniknya.
4.  **rubrikPenilaian**: Buat tabel markdown untuk rubrik penilaian yang **relevan dan terukur** dengan tugas utama dalam modul. Format: | Aspek Penilaian | Kriteria Sangat Baik (4) | Kriteria Baik (3) | Kriteria Cukup (2) | Kriteria Kurang (1) |. Isi dengan **minimal 3-5 aspek penilaian** yang konkret, dengan deskripsi kriteria yang jelas untuk setiap level (dari Sangat Baik hingga Kurang) agar mudah digunakan oleh guru.
5.  **lkpd**: Buat Lembar Kerja Peserta Didik yang **lengkap dan siap cetak**. WAJIB sertakan **minimal 5 soal latihan** yang bervariasi (misalnya: pilihan ganda, isian singkat, uraian, analisis kasus) dan **KUNCI JAWABAN yang jelas dan penjelasan singkat** di bawahnya untuk setiap soal. Jangan hanya memberi deskripsi atau contoh soal.
6.  **bahanBacaan**: Sediakan **daftar bahan bacaan (artikel, buku, tautan video, dll.)** yang relevan dan bisa diakses oleh guru dan peserta didik. Berikan judul, penulis/sumber, dan deskripsi singkat. Minimal 3 sumber.
7.  **glosarium**: Buat **daftar istilah-istilah penting** yang digunakan dalam modul ajar beserta definisinya secara singkat dan jelas. Minimal 5-10 istilah.
8.  **daftarPustaka**: Susun **daftar pustaka lengkap** yang digunakan sebagai referensi dalam penyusunan modul ajar ini (minimal 3-5 sumber, format standar APA atau MLA).
9.  **pengayaanRemedial**: Berikan rencana yang jelas dan operasional. Gunakan format berikut:
    ### A. Pengayaan
    - **Untuk Siapa:** Jelaskan kriteria peserta didik yang mendapatkan pengayaan.
    - **Bentuk Kegiatan:** Berikan contoh kegiatan pengayaan yang spesifik dan menantang (misalnya: proyek mini, studi kasus, membuat produk kreatif, menjadi tutor sebaya).
    ### B. Remedial
    - **Untuk Siapa:** Jelaskan kriteria peserta didik yang mendapatkan remedial.
    - **Bentuk Kegiatan:** Berikan contoh kegiatan remedial yang konkret (misalnya: pendampingan individu, pengerjaan ulang tugas dengan bimbingan, penggunaan media berbeda, latihan soal terstruktur).
10. **refleksi**: Buat daftar pertanyaan refleksi yang terpisah untuk peserta didik dan guru. Gunakan format berikut:
    ### A. Refleksi Peserta Didik
    - Apa bagian yang paling menarik dari pembelajaran hari ini?
    - Apa tantangan terbesar yang kamu hadapi, dan bagaimana kamu mengatasinya?
    - Apa satu hal baru yang kamu pelajari dan akan kamu ingat?
    ### B. Refleksi Guru
    - Apakah semua peserta didik mencapai tujuan pembelajaran?
    - Strategi apa yang paling efektif dalam membantu pemahaman peserta didik?
    - Apa yang akan saya lakukan secara berbeda pada pembelajaran berikutnya?

Berikut adalah struktur JSON yang harus Anda hasilkan:
{
    "kompetensiAwal": "...",
    "capaianPembelajaran": "...",
    "tujuanPembelajaran": "...",
    "profilPelajar": "...",
    "targetPesertaDidik": "...",
    "kemitraanPembelajaran": "...",
    "lingkunganPembelajaran": "...",
    "pemanfaatanDigital": "...",
    "modelPembelajaran": "...",
    "alurBelajar": "Sesuai instruksi #1.",
    "kegiatanPembelajaran": "Sesuai instruksi #2.",
    "asesmen": "Sesuai instruksi #3.",
    "pengayaanRemedial": "Sesuai instruksi #9.",
    "refleksi": "Sesuai instruksi #10.",
    "lkpd": "Sesuai instruksi #5.",
    "bahanBacaan": "Sesuai instruksi #6.",
    "glosarium": "Sesuai instruksi #7.",
    "daftarPustaka": "Sesuai instruksi #8.",
    "rubrikPenilaian": "Sesuai instruksi #4."
}`;
            },
            async generateWithGemini(prompt) {
                const MAX_RETRIES = 2; const RETRY_DELAY = 1000;
                for (const key of config.GEMINI_API_KEYS) {
                    if (key.startsWith("GANTI_DENGAN_API_KEY_GEMINI")) continue;
                    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                        try {
                            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
                            console.log(`Mencoba kunci: ${key.substring(0, 8)}... (Percubaan ${attempt})`);
                            const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.8, topK: 40, topP: 0.95, } }) });
                            if (response.status === 503 || response.status === 429) { const errorData = await response.json(); const errorMessage = errorData.error?.message || `HTTP Error: ${response.status}`; console.warn(`Layanan sibuk (Kunci: ${key.substring(0,8)}, Percubaan: ${attempt}): ${errorMessage}. Mencuba lagi dalam ${RETRY_DELAY / 1000} saat.`); if(attempt < MAX_RETRIES) { await new Promise(resolve => setTimeout(resolve, RETRY_DELAY)); continue; } else { throw new Error(errorMessage); } }
                            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error?.message || `HTTP Error: ${response.status}`); }
                            console.log(`Layanan Gemini berhasil!`);
                            const result = await response.json();
                            if (!result.candidates?.[0]?.content?.parts?.[0]?.text) { throw new Error("API response is empty or invalid."); }
                            let jsonString = result.candidates[0].content.parts[0].text;
                            const jsonMatch = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
                            jsonString = (jsonMatch && jsonMatch[1]) ? jsonMatch[1] : jsonString.trim();
                            // PERBAIKAN: Tambahkan blok try-catch khusus untuk parsing JSON
                            try {
                                return JSON.parse(jsonString);
                            } catch (parseError) {
                                console.error("JSON Parse Error:", parseError);
                                console.error("Invalid JSON string received from API:", jsonString);
                                throw new Error("Invalid JSON format received from AI.");
                            }
                        } catch (error) { 
                            console.warn(`Kunci Gemini ${key.substring(0, 8)}... gagal (Percubaan ${attempt}): `, error.message); 
                            if (attempt === MAX_RETRIES) {
                                // Melempar error asli untuk ditangkap di handleFormSubmit
                                throw error;
                            }
                            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY)); 
                        }
                    }
                }
                throw new Error("All API keys and retries failed.");
            }
        };
        
        const FormManager = {
            saveState() {
                const formData = new FormData(elements.form);
                const data = Object.fromEntries(formData.entries());
                
                // Also save checkbox states
                document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    data[cb.name + '_' + cb.value] = cb.checked;
                });

                localStorage.setItem('modulAjarFormState', JSON.stringify(data));
            },
            loadState() {
                const savedState = localStorage.getItem('modulAjarFormState');
                if (savedState) {
                    const data = JSON.parse(savedState);
                    for (const key in data) {
                        const el = elements.form.querySelector(`[name="${key}"]`);
                        if (el) {
                            if (el.type === 'checkbox') {
                                // Checkboxes are handled separately below
                            } else if (el.type === 'radio') {
                                if (el.value === data[key]) {
                                    el.checked = true;
                                }
                            } else {
                                el.value = data[key];
                            }
                        }
                    }
                    
                    // Restore checkboxes
                    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                        const key = cb.name + '_' + cb.value;
                        if (data[key] !== undefined) {
                            cb.checked = data[key];
                        }
                    });

                    // Trigger change events for dependent dropdowns and dynamic fields
                    elements.jenjangSelect.dispatchEvent(new Event('change'));
                    setTimeout(() => {
                        elements.faseSelect.value = data.fase;
                        elements.faseSelect.dispatchEvent(new Event('change'));
                        setTimeout(() => {
                           elements.kelasSelect.value = data.kelas;
                        }, 50);
                    }, 50);
                    
                    document.querySelectorAll('select[id$="Opsi"], #jabatanGuru').forEach(select => {
                        select.dispatchEvent(new Event('change'));
                    });

                    UI.showToast("Data formulir terakhir berhasil dipulihkan.", "info");
                }
            },
            reset() {
                elements.form.reset();
                localStorage.removeItem('modulAjarFormState');
                
                // Manually trigger updates for dynamic fields after reset
                UI.updateFaseOptions();
                document.querySelectorAll('select[id$="Opsi"], #jabatanGuru').forEach(select => {
                    select.dispatchEvent(new Event('change'));
                });
                elements.tanggalInput.valueAsDate = new Date();

                UI.showToast("Formulir telah direset.", "success");
                UI.hideResetModal();
            },
            setupDynamicFields() {
                const fields = ['kompetensiAwal', 'capaianPembelajaran', 'tujuanPembelajaran', 'targetPesertaDidik', 'kemitraanPembelajaran', 'lingkunganPembelajaran', 'pemanfaatanDigital'];
                fields.forEach(fieldName => {
                    const selectEl = document.getElementById(`${fieldName}Opsi`);
                    const textEl = document.getElementById(`${fieldName}Teks`);
                    if (selectEl && textEl) {
                        selectEl.addEventListener('change', (e) => {
                            textEl.classList.toggle('hidden', e.target.value !== 'sendiri');
                            textEl.required = e.target.value === 'sendiri' && !selectEl.parentElement.innerText.includes('(Opsional)');
                        });
                    }
                });
                const jabatanSelect = document.getElementById('jabatanGuru');
                const jabatanTeks = document.getElementById('jabatanGuruTeks');
                jabatanSelect.addEventListener('change', (e) => {
                    jabatanTeks.classList.toggle('hidden', e.target.value !== 'sendiri');
                    jabatanTeks.required = e.target.value === 'sendiri';
                });
            }
        };

        // --- 4. MAIN APPLICATION LOGIC & EVENT LISTENERS ---

        async function handleFormSubmit(e) {
            e.preventDefault();
            const dimensiCheckboxes = document.querySelectorAll('input[name="dimensi"]:checked');
            if (dimensiCheckboxes.length < 2 || dimensiCheckboxes.length > 4) {
                UI.showToast("Pilih 2 hingga 4 Dimensi Profil Lulusan.", "warning");
                return;
            }
            const validGeminiKeys = config.GEMINI_API_KEYS.filter(key => !key.startsWith("GANTI_DENGAN_API_KEY_GEMINI"));
            if (validGeminiKeys.length === 0) {
                UI.showToast("Tidak ada API Key Gemini yang valid.", "error");
                elements.outputContent.innerHTML = `<div class="flex flex-col items-center justify-center min-h-[300px] text-center text-red-500 p-8 border-2 border-dashed border-red-300 rounded-2xl"><strong>API Key Error:</strong><p class="mt-2">Silakan masukkan setidaknya satu API Key Gemini yang valid di dalam kode JavaScript.</p></div>`;
                elements.placeholder.classList.add('hidden');
                return;
            }
            UI.setLoadingState(true);
            try {
                const prompt = API.createPromptFromForm();
                const generatedContent = await API.generateWithGemini(prompt);
                const formData = new FormData(elements.form);
                const userInput = Object.fromEntries(formData.entries());
                appState.generatedContentData = { ...userInput, ...generatedContent };
                elements.outputContent.innerHTML = Renderer.createFinalHtml(appState.generatedContentData);
                elements.actionButtons.classList.remove('hidden');
                UI.showToast("Modul ajar berhasil dibuat!", "success");
            } catch (error) {
                console.error(`Error during generation:`, error);
                // PERBAIKAN: Logika penanganan error yang lebih spesifik
                let finalErrorMessage;
                let errorTitle = "Terjadi Kesalahan";

                if (error.message.includes("overloaded") || error.message.includes("503") || error.message.includes("429")) {
                    finalErrorMessage = "Layanan AI sedang sibuk atau kelebihan beban. Mohon coba lagi dalam beberapa saat.";
                    errorTitle = "Layanan Sibuk";
                } else if (error.message.includes("API key not valid")) {
                    finalErrorMessage = "Kunci API yang digunakan tidak valid. Pastikan kunci API Anda benar dan memiliki izin yang cukup.";
                    errorTitle = "Kunci API Tidak Valid";
                } else if (error.message.includes("Invalid JSON format")) {
                    finalErrorMessage = "AI memberikan respons dengan format yang tidak terduga. Silakan coba lagi. Jika masalah berlanjut, ubah sedikit input Anda.";
                    errorTitle = "Format Respons Tidak Sesuai";
                } else if (error.message.includes("All API keys and retries failed")) {
                    finalErrorMessage = "Semua percobaan koneksi ke layanan AI gagal. Periksa koneksi internet Anda dan validitas semua kunci API.";
                    errorTitle = "Koneksi Gagal";
                } else {
                    finalErrorMessage = "Terjadi kesalahan yang tidak diketahui. Silakan periksa konsol browser untuk detail teknis.";
                }

                elements.outputContent.innerHTML = `<div class="flex flex-col items-center justify-center min-h-[300px] text-center text-red-500 p-8 border-2 border-dashed border-red-300 rounded-2xl"><strong>${errorTitle}:</strong><p class="mt-2">${finalErrorMessage}</p></div>`;
                elements.placeholder.classList.add('hidden');
                elements.outputContent.classList.remove('hidden');
                UI.showToast(finalErrorMessage, "error");
            } finally {
                UI.setLoadingState(false);
            }
        }

        function setupEventListeners() {
            elements.form.addEventListener('submit', handleFormSubmit);
            elements.form.addEventListener('input', FormManager.saveState);
            
            // PERBAIKAN: Tombol reset sekarang membuka modal
            elements.resetBtn.addEventListener('click', UI.showResetModal);
            elements.confirmResetBtn.addEventListener('click', FormManager.reset);
            elements.cancelResetBtn.addEventListener('click', UI.hideResetModal);
            
            elements.copyBtn.addEventListener('click', () => {
                const contentArea = document.getElementById('module-render-area');
                if(!contentArea) return;
                navigator.clipboard.writeText(contentArea.innerText)
                    .then(() => UI.showToast('Teks berhasil disalin!', 'success'))
                    .catch(() => UI.showToast('Gagal menyalin teks.', 'error'));
            });
            elements.printBtn.addEventListener('click', () => {
                 if (!appState.generatedContentData) { UI.showToast("Tidak ada konten untuk dicetak.", "warning"); return; }
                window.print();
            });
            elements.docBtn.addEventListener('click', () => Exporter.downloadDoc());
            elements.pdfBtn.addEventListener('click', () => Exporter.downloadPdf());

            // Dropdown logic
            elements.dropdownBtn.addEventListener('click', (event) => {
                event.stopPropagation();
                const isHidden = elements.dropdownMenu.classList.contains('hidden');
                if (isHidden) {
                    elements.dropdownMenu.classList.remove('hidden');
                    setTimeout(() => {
                        elements.dropdownMenu.classList.remove('opacity-0', 'scale-95');
                        elements.dropdownMenu.classList.add('opacity-100', 'scale-100');
                        elements.dropdownArrow.classList.add('rotate-180');
                    }, 10);
                } else {
                    elements.dropdownMenu.classList.remove('opacity-100', 'scale-100');
                    elements.dropdownMenu.classList.add('opacity-0', 'scale-95');
                    elements.dropdownArrow.classList.remove('rotate-180');
                    setTimeout(() => elements.dropdownMenu.classList.add('hidden'), 200);
                }
            });
            window.addEventListener('click', (e) => {
                if (!elements.dropdownMenu.classList.contains('hidden') && !elements.dropdownBtn.contains(e.target)) {
                    elements.dropdownMenu.classList.remove('opacity-100', 'scale-100');
                    elements.dropdownMenu.classList.add('opacity-0', 'scale-95');
                    elements.dropdownArrow.classList.remove('rotate-180');
                    setTimeout(() => elements.dropdownMenu.classList.add('hidden'), 200);
                }
            });

            // Dependent dropdown listeners
            elements.jenjangSelect.addEventListener('change', () => UI.updateFaseOptions());
            elements.faseSelect.addEventListener('change', () => UI.updateKelasOptions());
        }

        // --- 5. INITIALIZE APP ---
        UI.initialize();
        FormManager.setupDynamicFields();
        FormManager.loadState();
        setupEventListeners();
    });
