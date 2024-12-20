document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('curriculo-form');
    const gerarBtn = document.getElementById('gerar-curriculo');
    const addExperienciaBtn = document.getElementById('add-experiencia');
    const addEducacaoBtn = document.getElementById('add-educacao');

    let experienciaCount = 1;
    let educacaoCount = 1;

    addExperienciaBtn.addEventListener('click', function () {
        experienciaCount++;
        const experienciaSection = document.querySelector('#experiencia-profissional');
        const novaExperiencia = document.createElement('div');
        novaExperiencia.className = 'experiencia';
        novaExperiencia.innerHTML = `
            <label for="cargo-${experienciaCount}">Cargo:</label>
            <input type="text" id="cargo-${experienciaCount}" name="cargo-${experienciaCount}" class="cargo">

            <label for="empresa-${experienciaCount}">Empresa:</label>
            <input type="text" id="empresa-${experienciaCount}" name="empresa-${experienciaCount}" class="empresa">

            <label for="periodo-${experienciaCount}">Período:</label>
            <input type="text" id="periodo-${experienciaCount}" name="periodo-${experienciaCount}" class="periodo">

            <label for="descricao-cargo-${experienciaCount}">Descrição das Atividades:</label>
            <textarea id="descricao-cargo-${experienciaCount}" name="descricao-cargo-${experienciaCount}" class="descricao-cargo"></textarea>
        `;
        experienciaSection.insertBefore(novaExperiencia, addExperienciaBtn);
    });

    addEducacaoBtn.addEventListener('click', function () {
        educacaoCount++;
        const educacaoSection = document.querySelector('#educacao');
        const novaEducacao = document.createElement('div');
        novaEducacao.className = 'educacao';
        novaEducacao.innerHTML = `
            <label for="curso-${educacaoCount}">Curso:</label>
            <input type="text" id="curso-${educacaoCount}" name="curso-${educacaoCount}" class="curso">

            <label for="instituicao-${educacaoCount}">Instituição:</label>
            <input type="text" id="instituicao-${educacaoCount}" name="instituicao-${educacaoCount}" class="instituicao">

            <label for="ano-conclusao-${educacaoCount}">Ano de Conclusão:</label>
            <input type="text" id="ano-conclusao-${educacaoCount}" name="ano-conclusao-${educacaoCount}" class="ano-conclusao">
        `;
        educacaoSection.insertBefore(novaEducacao, addEducacaoBtn);
    });

    gerarBtn.addEventListener('click', function (event) {
        event.preventDefault();
        if (validarFormulario()) {
            gerarPDF();
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
            }
        });
    });

    function validarFormulario() {
        const camposObrigatorios = document.querySelectorAll('.obrigatorio');
        let valido = true;

        camposObrigatorios.forEach(campo => {
            if (!campo.value) {
                valido = false;
                campo.classList.add('erro');
            } else {
                campo.classList.remove('erro');
            }
        });

        return valido;
    }

    function gerarPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Obter cores selecionadas
        const corPrimaria = hexToRgb(document.getElementById('cor-primaria').value);
        const corSecundaria = hexToRgb(document.getElementById('cor-secundaria').value);
        const corTexto = hexToRgb(document.getElementById('cor-texto').value);
        const corDestaque = hexToRgb(document.getElementById('cor-destaque').value);

        // Fundo principal
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 297, 'F');

        // Barra lateral
        doc.setFillColor(corPrimaria.r, corPrimaria.g, corPrimaria.b);
        doc.rect(0, 0, 60, 297, 'F');

        // Adicionar foto (se existir)
        const fotoInput = document.getElementById('foto');
        if (fotoInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = new Image();
                img.onload = function () {
                    // Foto circular centralizada na barra lateral
                    doc.addImage(img, 'JPEG', 15, 20, 30, 30, '', 'MEDIUM');
                    continuarGeracaoPDF(doc, 60, corPrimaria, corSecundaria, corTexto, corDestaque);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(fotoInput.files[0]);
        } else {
            continuarGeracaoPDF(doc, 60, corPrimaria, corSecundaria, corTexto, corDestaque);
        }
    }

    function continuarGeracaoPDF(doc, y, corPrimaria, corSecundaria, corTexto, corDestaque) {
        // Nome em destaque - Ajuste responsivo
        const nome = document.getElementById('nome').value;
        let fontSize = 24;
        doc.setFontSize(fontSize);
        let textWidth = doc.getTextWidth(nome);
        
        // Reduzir fonte até caber
        while (textWidth > 55 && fontSize > 12) {
            fontSize -= 2;
            doc.setFontSize(fontSize);
            textWidth = doc.getTextWidth(nome);
        }
        
        doc.setTextColor(255, 255, 255);
        doc.text(nome, 30, 70, { align: 'center' });

        // Informações de contato na barra lateral
        adicionarInformacoesPessoais(doc, y, { r: 255, g: 255, b: 255 });

        // Conteúdo principal
        let yMain = 30;
        
        // Resumo profissional
        yMain = adicionarResumoProfissional(doc, yMain, corTexto);
        yMain += 20;

        // Experiência profissional
        yMain = adicionarExperiencias(doc, yMain, corTexto, corDestaque);
        yMain += 20;

        // Educação
        yMain = adicionarEducacao(doc, yMain, corTexto, corDestaque);
        yMain += 20;

        // Habilidades
        adicionarHabilidades(doc, yMain, corTexto, corSecundaria);

        doc.save('curriculo.pdf');
    }

    function adicionarInformacoesPessoais(doc, y, corTexto) {
        doc.setFontSize(9); // Fonte menor para informações de contato
        doc.setTextColor(corTexto.r, corTexto.g, corTexto.b);
        
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const endereco = document.getElementById('endereco').value;

        // Quebrar endereço em linhas menores
        const enderecoLinhas = doc.splitTextToSize(endereco, 45);
        
        doc.text(email, 30, 85, { align: 'center' });
        doc.text(telefone, 30, 92, { align: 'center' });
        doc.text(enderecoLinhas, 30, 99, { align: 'center' });
    }

    function adicionarResumoProfissional(doc, y, corTexto) {
        y = adicionarTitulo(doc, 'Resumo Profissional', y, corTexto);
        
        doc.setFontSize(11);
        doc.setTextColor(corTexto.r, corTexto.g, corTexto.b);
        const resumo = document.getElementById('resumo').value;
        const linhas = doc.splitTextToSize(resumo, 130);
        doc.text(linhas, 70, y);
        
        return y + linhas.length * 6;
    }

    function adicionarExperiencias(doc, y, corTexto, corDestaque) {
        y = adicionarTitulo(doc, 'Experiência Profissional', y, corTexto);

        const experiencias = document.querySelectorAll('.experiencia');
        experiencias.forEach((exp) => {
            const cargo = exp.querySelector('.cargo').value;
            const empresa = exp.querySelector('.empresa').value;
            const periodo = exp.querySelector('.periodo').value;
            const descricao = exp.querySelector('.descricao-cargo').value;

            // Título do cargo com design moderno
            doc.setFillColor(corDestaque.r, corDestaque.g, corDestaque.b);
            doc.roundedRect(70, y-5, 130, 12, 1, 1, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(12);
            doc.text(`${cargo}`, 75, y+2);
            
            y += 12;
            
            // Detalhes do emprego
            doc.setTextColor(corTexto.r, corTexto.g, corTexto.b);
            doc.setFontSize(10);
            doc.text(`${empresa} | ${periodo}`, 70, y);
            
            y += 5;
            const descLinhas = doc.splitTextToSize(descricao, 130);
            doc.text(descLinhas, 70, y);
            y += descLinhas.length * 5 + 10;
        });

        return y;
    }

    function adicionarEducacao(doc, y, corTexto, corDestaque) {
        y = adicionarTitulo(doc, 'Educação', y, corTexto);

        const educacoes = document.querySelectorAll('.educacao');
        educacoes.forEach((edu, index) => {
            const curso = edu.querySelector('.curso').value;
            const instituicao = edu.querySelector('.instituicao').value;
            const anoConclusao = edu.querySelector('.ano-conclusao').value;

            doc.setFontSize(12);
            doc.setTextColor(corDestaque.r, corDestaque.g, corDestaque.b);
            doc.text(`${curso}`, 70, y);
            y += 5;
            doc.setFontSize(11);
            doc.setTextColor(corTexto.r, corTexto.g, corTexto.b);
            doc.text(`${instituicao} | Conclusão: ${anoConclusao}`, 70, y);
            y += 10;
        });

        return y;
    }

    function adicionarHabilidades(doc, y, corTexto, corSecundaria) {
        y = adicionarTitulo(doc, 'Habilidades', y, corTexto);
        
        const habilidades = document.getElementById('habilidades').value.split(',');
        let xPos = 70;
        let yPos = y + 5;
        
        habilidades.forEach((habilidade) => {
            const texto = habilidade.trim();
            if (!texto) return;
            
            const textWidth = doc.getTextWidth(texto) + 10;
            
            if (xPos + textWidth > 190) {
                xPos = 70;
                yPos += 12;
            }
            
            doc.setFillColor(corSecundaria.r, corSecundaria.g, corSecundaria.b);
            doc.roundedRect(xPos, yPos-5, textWidth, 10, 3, 3, 'F');
            
            doc.setTextColor(corTexto.r, corTexto.g, corTexto.b);
            doc.setFontSize(9);
            doc.text(texto, xPos + 5, yPos + 2);
            
            xPos += textWidth + 5;
        });
        
        return yPos + 10;
    }

    function adicionarTitulo(doc, titulo, y, corTexto) {
        doc.setFontSize(16);
        doc.setTextColor(corTexto.r, corTexto.g, corTexto.b);
        doc.text(titulo, 70, y);
        return y + 10;
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }

    // Adicionar sistema de tags para habilidades
    document.addEventListener('DOMContentLoaded', function() {
        const habilidadesInput = document.getElementById('habilidades');
        const habilidadesHidden = document.getElementById('habilidades-hidden');
        const habilidadesContainer = document.createElement('div');
        habilidadesContainer.id = 'habilidades-tags';
        habilidadesInput.parentNode.insertBefore(habilidadesContainer, habilidadesInput.nextSibling);
        
        const tagsArray = [];
        
        habilidadesInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const valor = this.value.trim();
                if (valor && !tagsArray.includes(valor)) {
                    adicionarTag(valor);
                    tagsArray.push(valor);
                    this.value = '';
                    atualizarHabilidadesHidden();
                }
            }
        });
        
        function adicionarTag(texto) {
            const tag = document.createElement('span');
            tag.classList.add('habilidade-tag');
            tag.innerHTML = `
                ${texto}
                <button type="button" class="remover-tag">&times;</button>
            `;
            
            tag.querySelector('.remover-tag').addEventListener('click', function() {
                const index = tagsArray.indexOf(texto);
                if (index > -1) {
                    tagsArray.splice(index, 1);
                    tag.remove();
                    atualizarHabilidadesHidden();
                }
            });
            
            habilidadesContainer.appendChild(tag);
        }
        
        function atualizarHabilidadesHidden() {
            habilidadesInput.value = tagsArray.join(',');
            habilidadesHidden.value = tagsArray.join(',');
        }

        // Atualizar validação do formulário para verificar o campo hidden
        function validarFormulario() {
            const camposObrigatorios = document.querySelectorAll('.obrigatorio');
            let valido = true;

            camposObrigatorios.forEach(campo => {
                if (!campo.value) {
                    valido = false;
                    if (campo.id === 'habilidades-hidden') {
                        habilidadesInput.classList.add('erro');
                    } else {
                        campo.classList.add('erro');
                    }
                } else {
                    if (campo.id === 'habilidades-hidden') {
                        habilidadesInput.classList.remove('erro');
                    } else {
                        campo.classList.remove('erro');
                    }
                }
            });

            return valido;
        }
    });