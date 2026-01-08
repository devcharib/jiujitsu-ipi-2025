const Render = {
    dashboard(alunos, dados) {
    // ✅ CORRETO: Conta datas únicas de treino
    const datasUnicas = new Set(dados.presencas.map(p => p.Data));
    const totalPresencas = datasUnicas.size;
    
    const totalCompeticoes = dados.competicoes.length;
    const totalXP = alunos.reduce((acc, a) => acc + a.xp, 0);

        return `
            <div class="grid md:grid-cols-4 gap-6 mb-8">
                <div class="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border-2 border-blue-500/50">
                    <div class="text-4xl mb-2">👥</div>
                    <div class="text-4xl font-bold text-blue-400">${alunos.length}</div>
                    <div class="text-gray-300 font-bold">Total de Alunos</div>
                </div>
                <div class="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl p-6 border-2 border-cyan-500/50">
                    <div class="text-4xl mb-2">🔥</div>
                    <div class="text-4xl font-bold text-cyan-400">${totalPresencas}</div>
                    <div class="text-gray-300 font-bold">Total de Treinos</div>
                </div>
                <div class="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border-2 border-purple-500/50">
                    <div class="text-4xl mb-2">🏅</div>
                    <div class="text-4xl font-bold text-purple-400">${totalCompeticoes}</div>
                    <div class="text-gray-300 font-bold">Competições</div>
                </div>
                <div class="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl p-6 border-2 border-amber-500/50">
                    <div class="text-4xl mb-2">🏆</div>
                    <div class="text-4xl font-bold text-amber-400">${totalXP.toLocaleString()}</div>
                    <div class="text-gray-300 font-bold">XP Total</div>
                </div>
            </div>
        `;
    },

    alunos(alunos) {
        let html = '<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">';

        alunos.forEach((aluno) => {
            const progressoGrau = ((aluno.xp % aluno.xpNecessario) / aluno.xpNecessario) * 100;
            const fotoURL = Utils.convertGoogleDriveURL(aluno.FotoURL, aluno.Nome);
            const fallbackURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(aluno.Nome)}&background=random&size=200`;
            const faixaCor = Utils.getFaixaCor(aluno.Faixa);
            const isGradient = faixaCor.includes('gradient');

            html += `
                <div class="aluno-card bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-blue-500 transition cursor-pointer" data-nome="${aluno.Nome}">
                    <div class="flex items-center gap-4 mb-4">
                        <img src="${fotoURL}" alt="${aluno.Nome}" onerror="this.src='${fallbackURL}'" class="w-16 h-16 rounded-full border-2 border-blue-500 object-cover">
                        <div class="flex-1">
                            <h3 class="font-bold text-lg">${aluno.Nome}</h3>
                            <div class="text-xs text-gray-400 mb-1">${aluno.Idade} anos • ${aluno.categoria}</div>
                            <span class="text-sm px-3 py-1 rounded-full inline-block" style="${isGradient ? 'background: ' + faixaCor : 'background: ' + faixaCor}; color: ${Utils.getFaixaCorTexto(aluno.Faixa)}">
                                ${aluno.Faixa} - ${aluno.Grau}°
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-2"><span class="text-blue-400">⚡</span><span class="font-bold text-blue-400">${aluno.xp} XP</span></div>
                        <div class="flex items-center gap-2"><span class="text-amber-400">🏆</span><span class="font-bold">${aluno.badges.length}</span></div>
                    </div>
                    <div class="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style="width: ${progressoGrau}%"></div>
                    </div>
                    <div class="flex items-center justify-center mt-3 text-blue-400 font-bold text-sm">Ver Perfil →</div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    },

    ranking(alunos, dados) {
        const rankingXP = [...alunos].sort((a, b) => b.xp - a.xp);
        const rankingFrequencia = [...alunos].sort((a, b) => {
            const freqA = dados.presencas.filter(p => p.Nome === a.Nome).length;
            const freqB = dados.presencas.filter(p => p.Nome === b.Nome).length;
            return freqB - freqA;
        });

        let html = '<div class="grid md:grid-cols-2 gap-6">';

        html += `
            <div class="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h2 class="text-2xl font-bold mb-4 flex items-center gap-2"><span class="text-amber-400">🏆</span>Top 10 - Mais XP</h2>
                <div class="space-y-3">
        `;

        rankingXP.slice(0, 10).forEach((aluno, idx) => {
            const fotoURL = Utils.convertGoogleDriveURL(aluno.FotoURL, aluno.Nome);
            const fallbackURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(aluno.Nome)}&background=random&size=100`;
            const corPosicao = idx < 3 ? 'text-amber-400' : 'text-gray-400';

            html += `
                <div class="flex items-center gap-4 bg-slate-700/50 p-4 rounded-xl hover:bg-slate-700 transition cursor-pointer ranking-card" data-nome="${aluno.Nome}">
                    <div class="text-2xl font-bold w-8 ${corPosicao}">${idx + 1}</div>
                    <img src="${fotoURL}" alt="${aluno.Nome}" onerror="this.src='${fallbackURL}'" class="w-12 h-12 rounded-full border-2 border-amber-500 object-cover">
                    <div class="flex-1"><div class="font-bold">${aluno.Nome}</div><div class="text-sm text-gray-400">${aluno.Faixa} • ${aluno.Idade} anos</div></div>
                    <div class="flex items-center gap-2 text-blue-400 font-bold"><span>⚡</span>${aluno.xp}</div>
                </div>
            `;
        });

        html += `</div></div>`;

        html += `
            <div class="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h2 class="text-2xl font-bold mb-4 flex items-center gap-2"><span class="text-cyan-400">🔥</span>Top 10 - Frequência</h2>
                <div class="space-y-3">
        `;

        rankingFrequencia.slice(0, 10).forEach((aluno, idx) => {
            const freq = dados.presencas.filter(p => p.Nome === aluno.Nome).length;
            const fotoURL = Utils.convertGoogleDriveURL(aluno.FotoURL, aluno.Nome);
            const fallbackURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(aluno.Nome)}&background=random&size=100`;
            const corPosicao = idx < 3 ? 'text-cyan-400' : 'text-gray-400';

            html += `
                <div class="flex items-center gap-4 bg-slate-700/50 p-4 rounded-xl hover:bg-slate-700 transition cursor-pointer ranking-card" data-nome="${aluno.Nome}">
                    <div class="text-2xl font-bold w-8 ${corPosicao}">${idx + 1}</div>
                    <img src="${fotoURL}" alt="${aluno.Nome}" onerror="this.src='${fallbackURL}'" class="w-12 h-12 rounded-full border-2 border-cyan-500 object-cover">
                    <div class="flex-1"><div class="font-bold">${aluno.Nome}</div><div class="text-sm text-gray-400">${aluno.Faixa} • ${aluno.Idade} anos</div></div>
                    <div class="flex items-center gap-2 text-cyan-400 font-bold"><span>📈</span>${freq}</div>
                </div>
            `;
        });

        html += `</div></div></div>`;
        return html;
    },

    perfil(aluno, dados) {
        const grauAtual = parseInt(aluno.Grau) || 0;
        const xpGrauAtual = (aluno.xp % aluno.xpNecessario);
        const progressoGrau = (xpGrauAtual / aluno.xpNecessario) * 100;
        const xpProximoGrau = aluno.xpNecessario - xpGrauAtual;
        const presencasAluno = dados.presencas.filter(p => p.Nome === aluno.Nome);
        const datasUnicas = new Set(presencasAluno.map(p => p.Data));
        const totalPresencas = datasUnicas.size;
        const pontuais = dados.presencas.filter(p => p.Nome === aluno.Nome && p.Pontual && p.Pontual.toLowerCase() === 'sim').length;
        const totalComps = dados.competicoes.filter(c => c.Nome === aluno.Nome).length;

        const fotoURL = Utils.convertGoogleDriveURL(aluno.FotoURL, aluno.Nome);
        const fallbackURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(aluno.Nome)}&background=random&size=300`;
        const faixaCor = Utils.getFaixaCor(aluno.Faixa);
        const isGradient = faixaCor.includes('gradient');

        let html = `
            <div class="max-w-4xl mx-auto">
                <button onclick="App.voltarDashboard()" class="mb-6 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition">← Voltar</button>
                <div class="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl p-8 border-2 border-blue-500/50 mb-6">
                    <div class="flex items-start gap-6 mb-6">
                        <img src="${fotoURL}" alt="${aluno.Nome}" onerror="this.src='${fallbackURL}'" class="w-32 h-32 rounded-full border-4 border-blue-500 object-cover">
                        <div class="flex-1">
                            <h1 class="text-4xl font-bold mb-2">${aluno.Nome}</h1>
                            <div class="text-lg text-gray-300 mb-3">👤 ${aluno.Idade} anos • ${aluno.Sexo}</div>
                            <div class="flex gap-4 mb-4 flex-wrap">
                                <span class="px-4 py-1 rounded-full text-sm font-bold" style="${isGradient ? 'background: ' + faixaCor : 'background: ' + faixaCor}; color: ${Utils.getFaixaCorTexto(aluno.Faixa)}">
                                    ${aluno.Faixa} - ${grauAtual}° Grau
                                </span>
                                <span class="px-4 py-1 bg-blue-500/20 rounded-full text-sm font-bold border border-blue-500/50">${aluno.categoria}</span>
                            </div>
                            <div class="flex items-center gap-6 text-2xl flex-wrap">
                                <div class="flex items-center gap-2"><span class="text-blue-400">⚡</span><span class="font-bold text-blue-400">${aluno.xp} XP</span></div>
                                <div class="flex items-center gap-2"><span class="text-amber-400">🏆</span><span class="font-bold">${aluno.badges.length} Badges</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-6">
                        <div class="flex justify-between mb-2">
                            <span class="font-bold">Progresso para ${grauAtual + 1}° Grau</span>
                            <span class="text-blue-400 font-bold">${xpGrauAtual} / ${aluno.xpNecessario} XP</span>
                        </div>
                        <div class="h-6 bg-slate-700 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500" style="width: ${progressoGrau}%"></div>
                        </div>
                        <p class="text-sm text-gray-400 mt-2">Faltam ${xpProximoGrau} XP para o próximo grau</p>
                    </div>
        `;

        if (grauAtual >= 3) {
            html += `
                <div class="mt-4 p-4 bg-green-500/20 rounded-xl border border-green-500/50">
                    <div class="flex items-center gap-2"><span>🎯</span><span class="font-bold">Próxima Faixa: ${aluno.proximaFaixa}</span></div>
                </div>
            `;
        }

        html += `
                </div>
                <div class="bg-slate-800/50 rounded-2xl p-6 mb-6 border border-slate-700">
                    <h2 class="text-2xl font-bold mb-4 flex items-center gap-2"><span class="text-amber-400">🏅</span>Conquistas Desbloqueadas</h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        `;

        if (aluno.badges.length === 0) {
            html += '<div class="col-span-full text-center text-gray-400 py-8">Continue treinando para desbloquear badges! 💪</div>';
        } else {
            aluno.badges.forEach(badge => {
                html += `
                    <div class="badge-card bg-slate-700/50 rounded-xl p-4 text-center border border-slate-600">
                        <div class="text-4xl mb-2">${badge.icon}</div>
                        <div class="font-bold text-sm" style="color: ${badge.cor}">${badge.nome}</div>
                    </div>
                `;
            });
        }

        html += `
                    </div>
                </div>
                <div class="grid md:grid-cols-3 gap-4">
                    <div class="bg-blue-500/20 rounded-2xl p-6 border border-blue-500/50">
                        <div class="flex items-center gap-3 mb-2"><span class="text-blue-400 text-2xl">👥</span>
                        <span class="text-sm font-bold text-gray-300">Total de Treinos</span></div>
                        <div class="text-4xl font-bold text-blue-400">${totalPresencas}</div>
                    </div>
                    <div class="bg-cyan-500/20 rounded-2xl p-6 border border-cyan-500/50">
                        <div class="flex items-center gap-3 mb-2"><span class="text-cyan-400 text-2xl">⏰</span>
                        <span class="text-sm font-bold text-gray-300">Pontualidade</span></div>
                        <div class="text-4xl font-bold text-cyan-400">${pontuais}</div>
                    </div>
                    <div class="bg-purple-500/20 rounded-2xl p-6 border border-purple-500/50">
                        <div class="flex items-center gap-3 mb-2"><span class="text-purple-400 text-2xl">🏅</span>
                        <span class="text-sm font-bold text-gray-300">Competições</span></div>
                        <div class="text-4xl font-bold text-purple-400">${totalComps}</div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

};

