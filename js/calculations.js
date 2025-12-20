const Calculations = {
    calcularXP(aluno, dados) {
        let xp = 0;

        const presencasAluno = dados.presencas.filter(p => p.Nome === aluno.Nome);
        xp += presencasAluno.length * CONFIG.XP_CONFIG.PRESENCA;

        const pontuais = presencasAluno.filter(p => p.Pontual && p.Pontual.toLowerCase() === 'sim');
        xp += pontuais.length * CONFIG.XP_CONFIG.PONTUAL;

        const compsAluno = dados.competicoes.filter(c => c.Nome === aluno.Nome);
        compsAluno.forEach(comp => {
            const resultado = comp.Resultado ? comp.Resultado.toLowerCase() : '';
            if (resultado === 'ouro') xp += CONFIG.XP_CONFIG.OURO;
            else if (resultado === 'prata') xp += CONFIG.XP_CONFIG.PRATA;
            else if (resultado === 'bronze') xp += CONFIG.XP_CONFIG.BRONZE;
            else xp += CONFIG.XP_CONFIG.PARTICIPACAO;
        });

        const comportamentosAluno = dados.comportamentos.filter(c => c.Nome === aluno.Nome);
        comportamentosAluno.forEach(comp => {
            const pontos = parseInt(comp.Pontos) || 0;
            xp += pontos;
        });

        return xp;
    },

    calcularBadges(aluno, dados) {
        const badges = [];
        const presencasAluno = dados.presencas.filter(p => p.Nome === aluno.Nome);
        const totalPresencas = presencasAluno.length;
        const pontuais = presencasAluno.filter(p => p.Pontual && p.Pontual.toLowerCase() === 'sim').length;

        if (totalPresencas >= 1) badges.push({ nome: 'Primeira Luta', icon: '🥋', cor: '#3b82f6' });
        if (totalPresencas >= 10) badges.push({ nome: 'Iniciante', icon: '⭐', cor: '#06b6d4' });
        if (totalPresencas >= 25) badges.push({ nome: 'Dedicado', icon: '🔥', cor: '#f59e0b' });
        if (totalPresencas >= 50) badges.push({ nome: 'Guerreiro', icon: '💪', cor: '#8b5cf6' });
        if (totalPresencas >= 100) badges.push({ nome: 'Campeão da Frequência', icon: '👑', cor: '#eab308' });
        if (totalPresencas >= 200) badges.push({ nome: 'Lenda', icon: '🎖️', cor: '#dc2626' });
        if (pontuais >= 20) badges.push({ nome: 'Sempre Pontual', icon: '⏰', cor: '#10b981' });

        const hoje = new Date();
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();
        const presencasMes = presencasAluno.filter(p => {
            const data = new Date(p.Data);
            return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
        });
        if (presencasMes.length >= 8) badges.push({ nome: 'Mês Perfeito', icon: '📅', cor: '#ec4899' });

        return badges;
    },

    getXPNecessario(aluno) {
        const idade = parseInt(aluno.Idade) || 0;

        if (idade >= 4 && idade <= 15) {
            return 400;
        } else {
            const faixa = aluno.Faixa ? aluno.Faixa.toLowerCase() : '';
            if (faixa.includes('azul')) return 800;
            if (faixa.includes('roxa')) return 1200;
            if (faixa.includes('marrom')) return 1600;
            if (faixa.includes('preta')) return 2000;
            return 400;
        }
    }
};