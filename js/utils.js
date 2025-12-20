const Utils = {
    parseCSV(csv) {
        const lines = csv.trim().split('\n');
        if (lines.length < 2) return [];

        // Parse da primeira linha (headers)
        const headers = this.parseCSVLine(lines[0]);
        const data = [];

        // Parse das linhas de dados
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue; // Pula linhas vazias

            const values = this.parseCSVLine(lines[i]);
            const obj = {};

            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });

            // Só adiciona se tiver nome
            if (obj[headers[0]] && obj[headers[0]].trim() !== '') {
                data.push(obj);
            }
        }

        return data;
    },

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Aspas duplas escapadas
                    current += '"';
                    i++; // Pula a próxima aspa
                } else {
                    // Alterna entre dentro/fora de aspas
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // Fim do campo
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        // Adiciona o último campo
        result.push(current.trim());

        return result;
    },

    convertGoogleDriveURL(url, nome) {

        console.log('🔍 Processando foto:', {
            nome: nome,
            url: url,
            caminho: url ? CONFIG.LOCAL_FOTOS_PATH + url.trim() : 'SEM URL'
        });

        // Verifica se é um arquivo local (extensão de imagem)
        if (url && /\.(jpg|jpeg|png|webp|gif)$/i.test(url.trim())) {
            const caminhoCompleto = CONFIG.LOCAL_FOTOS_PATH + url.trim();
            console.log('✅ Tentando carregar:', caminhoCompleto);
            return caminhoCompleto;
        }
        if (url && /\.(jpg|jpeg|png|webp|gif)$/i.test(url.trim())) {
            return CONFIG.LOCAL_FOTOS_PATH + url.trim();
        }

        if (!url || url.trim() === '') {
            return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(nome) + '&background=random&size=300';
        }

        url = url.trim();

        if (url.includes('imgur.com')) {
            if (url.includes('i.imgur.com')) return url;
            const id = url.split('imgur.com/')[1].split(/[.?]/)[0];
            return 'https://i.imgur.com/' + id + '.jpg';
        }

        if (url.includes('drive.google.com/uc?')) return url;

        let fileId = null;
        if (url.includes('/file/d/')) fileId = url.split('/d/')[1].split('/')[0];
        else if (url.includes('open?id=')) fileId = url.split('open?id=')[1].split('&')[0];
        else if (url.includes('thumbnail?id=')) fileId = url.split('thumbnail?id=')[1].split('&')[0];

        if (fileId) return 'https://drive.google.com/uc?export=view&id=' + fileId;

        return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(nome) + '&background=random&size=300';
    },

    getCategoria(idade) {
        if (idade >= 4 && idade <= 6) return '👶 4-6 anos';
        if (idade >= 7 && idade <= 9) return '👦 7-9 anos';
        if (idade >= 10 && idade <= 12) return '👧 10-12 anos';
        if (idade >= 13 && idade <= 15) return '🧑 13-15 anos';
        return '🥋 Adulto (16+)';
    },

    getFaixaCor(faixa) {
        const f = (faixa || '').toLowerCase();
        if (f.includes('branca')) return '#f8fafc';
        if (f.includes('cinza') && f.includes('branca')) return 'linear-gradient(135deg, #94a3b8 0%, #f8fafc 100%)';
        if (f.includes('cinza') && f.includes('preta')) return 'linear-gradient(135deg, #64748b 0%, #0f172a 100%)';
        if (f.includes('cinza')) return '#64748b';
        if (f.includes('amarela') && f.includes('branca')) return 'linear-gradient(135deg, #fbbf24 0%, #f8fafc 100%)';
        if (f.includes('amarela')) return '#fbbf24';
        if (f.includes('laranja') && f.includes('clara')) return '#fb923c';
        if (f.includes('laranja') && f.includes('escura')) return '#ea580c';
        if (f.includes('laranja')) return '#f97316';
        if (f.includes('verde') && f.includes('clara')) return '#4ade80';
        if (f.includes('verde') && f.includes('escura')) return '#16a34a';
        if (f.includes('verde')) return '#22c55e';
        if (f.includes('azul')) return '#3b82f6';
        if (f.includes('roxa')) return '#a855f7';
        if (f.includes('marrom')) return '#92400e';
        if (f.includes('preta')) return '#0f172a';
        return '#f8fafc';
    },

    getFaixaCorTexto(faixa) {
        const f = (faixa || '').toLowerCase();
        if (f.includes('branca') && !f.includes('cinza') && !f.includes('amarela')) return '#0f172a';
        return '#fff';
    },

    getProximaFaixa(faixa, idade) {
        const f = (faixa || '').toLowerCase();
        const i = parseInt(idade) || 0;

        if (i >= 4 && i <= 6) {
            if (f.includes('branca') && !f.includes('cinza')) return 'Cinza Branca';
            if (f.includes('cinza') && f.includes('branca')) return 'Cinza Preta';
            if (f.includes('cinza') && f.includes('preta')) return 'Cinza Preta (Máximo)';
            return 'Cinza Branca';
        }

        if (i >= 7 && i <= 9) {
            if (f.includes('cinza') && !f.includes('amarela')) return 'Amarela Branca';
            if (f.includes('amarela') && f.includes('branca')) return 'Amarela';
            if (f.includes('amarela')) return 'Amarela (Máximo)';
            return 'Amarela Branca';
        }

        if (i >= 10 && i <= 12) {
            if (f.includes('amarela') && !f.includes('laranja')) return 'Laranja Clara';
            if (f.includes('laranja') && f.includes('clara')) return 'Laranja Escura';
            if (f.includes('laranja')) return 'Laranja (Máximo)';
            return 'Laranja Clara';
        }

        if (i >= 13 && i <= 15) {
            if (f.includes('laranja') && !f.includes('verde')) return 'Verde Clara';
            if (f.includes('verde') && f.includes('clara')) return 'Verde Escura';
            if (f.includes('verde')) return 'Verde (Máximo)';
            return 'Verde Clara';
        }

        if (f.includes('branca')) return 'Azul';
        if (f.includes('azul')) return 'Roxa';
        if (f.includes('roxa')) return 'Marrom';
        if (f.includes('marrom')) return 'Preta';
        if (f.includes('preta')) return 'Preta (Máximo)';
        return 'Branca';
    }
};