
const App = {
    dados: {
        alunos: [],
        presencas: [],
        competicoes: [],
        comportamentos: []
    },

    estado: {
        viewMode: 'dashboard',
        selectedAluno: null,
        filterCategoria: 'all',
        filterSexo: 'all'
    },

    processarAlunos() {
        return this.dados.alunos.map(aluno => ({
            ...aluno,
            xp: Calculations.calcularXP(aluno, this.dados),
            badges: Calculations.calcularBadges(aluno, this.dados),
            categoria: Utils.getCategoria(parseInt(aluno.Idade) || 0),
            xpNecessario: Calculations.getXPNecessario(aluno),
            proximaFaixa: Utils.getProximaFaixa(aluno.Faixa, aluno.Idade)
        }));
    },

    render() {
        const alunosProcessados = this.processarAlunos();

        let alunosFiltrados = alunosProcessados.filter(aluno => {
            if (this.estado.filterCategoria !== 'all' && aluno.categoria !== this.estado.filterCategoria) return false;
            if (this.estado.filterSexo !== 'all' && aluno.Sexo !== this.estado.filterSexo) return false;
            return true;
        });

        const mainApp = document.getElementById('mainApp');

        if (this.estado.selectedAluno) {
            mainApp.innerHTML = Render.perfil(this.estado.selectedAluno, this.dados);
            return;
        }

        let content = `
            <header class="text-center mb-8 py-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl border-2 border-blue-500/50">
                <h1 class="text-5xl">🥋</h1>
                <h1 class="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Jiu-Jitsu IPI</h1>
                <p class="text-xl text-gray-300">Plataforma Gamificada de Evolução</p>
            </header>
            <div class="flex gap-4 mb-6 overflow-x-auto pb-2">
                <button onclick="App.mudarView('dashboard')" class="px-6 py-3 rounded-xl font-bold transition whitespace-nowrap ${this.estado.viewMode === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}">📊 Dashboard</button>
                <button onclick="App.mudarView('alunos')" class="px-6 py-3 rounded-xl font-bold transition whitespace-nowrap ${this.estado.viewMode === 'alunos' ? 'bg-blue-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}">👥 Alunos (${alunosFiltrados.length})</button>
                <button onclick="App.mudarView('ranking')" class="px-6 py-3 rounded-xl font-bold transition whitespace-nowrap ${this.estado.viewMode === 'ranking' ? 'bg-blue-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}">🏆 Rankings</button>
            </div>
            <div class="flex gap-4 mb-6 flex-wrap">
                <select id="selectCategoria" onchange="App.filtrarCategoria(this.value)" class="px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 font-bold text-white">
                    <option value="all" ${this.estado.filterCategoria === 'all' ? 'selected' : ''}>Todas as Categorias</option>
                    <option value="👶 4-6 anos" ${this.estado.filterCategoria === '👶 4-6 anos' ? 'selected' : ''}>👶 4-6 anos</option>
                    <option value="👦 7-9 anos" ${this.estado.filterCategoria === '👦 7-9 anos' ? 'selected' : ''}>👦 7-9 anos</option>
                    <option value="👧 10-12 anos" ${this.estado.filterCategoria === '👧 10-12 anos' ? 'selected' : ''}>👧 10-12 anos</option>
                    <option value="🧑 13-15 anos" ${this.estado.filterCategoria === '🧑 13-15 anos' ? 'selected' : ''}>🧑 13-15 anos</option>
                    <option value="🥋 Adulto (16+)" ${this.estado.filterCategoria === '🥋 Adulto (16+)' ? 'selected' : ''}>🥋 Adulto (16+)</option>
                </select>
                <select id="selectSexo" onchange="App.filtrarSexo(this.value)" class="px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 font-bold text-white">
                    <option value="all" ${this.estado.filterSexo === 'all' ? 'selected' : ''}>Todos</option>
                    <option value="Masculino" ${this.estado.filterSexo === 'Masculino' ? 'selected' : ''}>Masculino</option>
                    <option value="Feminino" ${this.estado.filterSexo === 'Feminino' ? 'selected' : ''}>Feminino</option>
                </select>
            </div>
        `;

        if (this.estado.viewMode === 'dashboard') {
            content += Render.dashboard(alunosFiltrados, this.dados);
        } else if (this.estado.viewMode === 'alunos') {
            content += Render.alunos(alunosFiltrados);
        } else if (this.estado.viewMode === 'ranking') {
            content += Render.ranking(alunosFiltrados, this.dados);
        }

        mainApp.innerHTML = content;

        // Adicionar event listeners
        this.attachEventListeners();
    },

    attachEventListeners() {
        // Cards de alunos
        document.querySelectorAll('.aluno-card').forEach(card => {
            card.addEventListener('click', () => {
                const nome = card.getAttribute('data-nome');
                this.verPerfilPorNome(nome);
            });
        });

        // Cards de ranking
        document.querySelectorAll('.ranking-card').forEach(card => {
            card.addEventListener('click', () => {
                const nome = card.getAttribute('data-nome');
                this.verPerfilPorNome(nome);
            });
        });
    },

    mudarView(view) {
        this.estado.viewMode = view;
        this.render();
    },

    filtrarCategoria(categoria) {
        this.estado.filterCategoria = categoria;
        this.render();
    },

    filtrarSexo(sexo) {
        this.estado.filterSexo = sexo;
        this.render();
    },

    verPerfilPorNome(nome) {
        const alunosProcessados = this.processarAlunos();
        this.estado.selectedAluno = alunosProcessados.find(a => a.Nome === nome);
        this.render();
    },

    voltarDashboard() {
        this.estado.selectedAluno = null;
        this.render();
    },

    async loadAllData() {
        try {
            const alunosRes = await fetch(CONFIG.SHEETS_URLS.alunos);
            const alunosCSV = await alunosRes.text();
            this.dados.alunos = Utils.parseCSV(alunosCSV);

            try {
                const presencaRes = await fetch(CONFIG.SHEETS_URLS.presenca);
                const presencaCSV = await presencaRes.text();
                this.dados.presencas = Utils.parseCSV(presencaCSV);
            } catch (e) { console.log('Aba Presença vazia'); }

            try {
                const compRes = await fetch(CONFIG.SHEETS_URLS.competicoes);
                const compCSV = await compRes.text();
                this.dados.competicoes = Utils.parseCSV(compCSV);
            } catch (e) { console.log('Aba Competições vazia'); }

            try {
                const compRes = await fetch(CONFIG.SHEETS_URLS.comportamento);
                const compCSV = await compRes.text();
                this.dados.comportamentos = Utils.parseCSV(compCSV);
            } catch (e) { console.log('Aba Comportamento vazia'); }

            document.getElementById('loading').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            this.render();

        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            document.getElementById('loading').innerHTML = '<div class="text-red-400 text-xl">❌ Erro ao carregar dados. Verifique se as planilhas estão publicadas corretamente.</div>';
        }
    },

    init() {
        this.loadAllData();
    }
};

// Iniciar aplicação
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
