const Calculations = {
    calcularXP(aluno, dados) {
        let xp = 0;
        
        // 1. XP de PRESENÇA
        const presencasAluno = dados.presencas.filter(p => p.Nome === aluno.Nome);
        
        presencasAluno.forEach(p => {
            // Se tem coluna XP_Total (nova estrutura), usa ela
            if (p.XP_Total && p.XP_Total !== '') {
                xp += parseInt(p.XP_Total) || 0;
            } 
            // Senão, calcula manualmente (compatibilidade)
            else {
                xp += 10; // Presença base
                if (p.Pontual && p.Pontual.toLowerCase() === 'sim') xp += 5;
                if (p.Disciplina && p.Disciplina.toLowerCase() === 'sim') xp += 15;
            }
        });
        
        // 2. XP de COMPETIÇÕES
        const compsAluno = dados.competicoes.filter(c => c.Nome === aluno.Nome);
        compsAluno.forEach(comp => {
            const resultado = comp.Resultado ? comp.Resultado.toLowerCase() : '';
            if (resultado === 'ouro') xp += CONFIG.XP_CONFIG.OURO;
            else if (resultado === 'prata') xp += CONFIG.XP_CONFIG.PRATA;
            else if (resultado === 'bronze') xp += CONFIG.XP_CONFIG.BRONZE;
            else xp += CONFIG.XP_CONFIG.PARTICIPACAO;
        });
        
        // 3. XP de COMPORTAMENTO
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
        
        // Conta DATAS ÚNICAS
        const datasUnicas = new Set(presencasAluno.map(p => p.Data));
        const totalPresencas = datasUnicas.size;
        
        // Badges de frequência
        if (totalPresencas >= 1) badges.push({ nome: 'Primeira Luta', icon: '🥋', cor: '#3b82f6' });
        if (totalPresencas >= 10) badges.push({ nome: 'Iniciante', icon: '⭐', cor: '#06b6d4' });
        if (totalPresencas >= 25) badges.push({ nome: 'Dedicado', icon: '🔥', cor: '#f59e0b' });
        if (totalPresencas >= 50) badges.push({ nome: 'Guerreiro', icon: '💪', cor: '#8b5cf6' });
        if (totalPresencas >= 100) badges.push({ nome: 'Campeão da Frequência', icon: '👑', cor: '#eab308' });
        if (totalPresencas >= 200) badges.push({ nome: 'Lenda', icon: '🎖️', cor: '#dc2626' });
        
        // Badge de pontualidade
        const pontuais = presencasAluno.filter(p => 
            p.Pontual && p.Pontual.toLowerCase() === 'sim'
        ).length;
        if (pontuais >= 20) badges.push({ nome: 'Sempre Pontual', icon: '⏰', cor: '#10b981' });
        
        // Badges de disciplina
        const disciplina = presencasAluno.filter(p => 
            p.Disciplina && p.Disciplina.toLowerCase() === 'sim'
        ).length;
        if (disciplina >= 10) badges.push({ nome: 'Disciplina de Aço', icon: '🛡️', cor: '#6366f1' });
        if (disciplina >= 25) badges.push({ nome: 'Mestre da Disciplina', icon: '⚔️', cor: '#8b5cf6' });
        
        // Badge de mês perfeito
        const hoje = new Date();
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();
        const presencasMes = presencasAluno.filter(p => {
            let data;
            if (p.Data instanceof Date) {
                data = p.Data;
            } else if (typeof p.Data === 'string') {
                const partes = p.Data.split('/');
                if (partes.length === 3) {
                    data = new Date(partes[2], partes[1] - 1, partes[0]);
                } else {
                    data = new Date(p.Data);
