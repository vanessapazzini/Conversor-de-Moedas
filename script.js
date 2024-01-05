const apiKey = '7d550847de02e160a247cbda';
const apiUrl = 'https://open.er-api.com/v6/latest/';

function obterCotacaoMoeda(moeda) {
    return fetch(apiUrl + moeda + '?apikey=' + apiKey)
        .then(response => response.json())
        .then(data => {
            if (data && data.rates && 'BRL' in data.rates) {
                return data.rates.BRL;
            } else {
                console.error('Estrutura da resposta inesperada ou falta de dados necessários:', data);
                return null;
            }
        })
        .catch(error => {
            console.error('Erro ao obter taxa de câmbio:', error);
            return null;
        });
}

function mostrarEntradaMoeda() {
    var informationBox = document.getElementById('information_box');

    // Limpar a caixa de informações
    informationBox.innerHTML = '';

    // Adicionar rótulo para a moeda
    var labelMoeda = document.createElement('label');
    labelMoeda.for = 'moeda_input';
    labelMoeda.id = 'label_text';
    labelMoeda.textContent = 'Digite a sigla da moeda que deseja converter para Real (ex: USD, EUR, GBP, JPY)';
    
    // Adicionar rótulo à caixa de informações
    informationBox.appendChild(labelMoeda);

    // Criar campo de entrada para a moeda
    var inputMoeda = document.createElement('input');
    inputMoeda.type = 'text';
    inputMoeda.placeholder = 'Digite a sigla da moeda';
    inputMoeda.id = 'moeda_input';

    // Adicionar campo de entrada à caixa de informações
    informationBox.appendChild(inputMoeda);

    // Adicionar botão para confirmar a moeda
    var btnConfirmarMoeda = document.createElement('button');
    btnConfirmarMoeda.type = 'button';
    btnConfirmarMoeda.textContent = 'Ok';
    btnConfirmarMoeda.onclick = interagirComUsuario;

    // Adicionar botão de confirmação à caixa de informações
    informationBox.appendChild(btnConfirmarMoeda);

    // Adicionar ouvinte de evento para a tecla "Enter" no campo de entrada da moeda
    inputMoeda.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            interagirComUsuario();
        }
    });

    // Adicionar ouvinte de evento para a tecla "Enter" no botão de confirmação
    btnConfirmarMoeda.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            interagirComUsuario();
        }
    });
}

function interagirComUsuario() {
    var moedaSelecionada = document.getElementById('moeda_input').value.toUpperCase();
    var informationBox = document.getElementById('information_box');

    // Limpar a caixa de informações antes de adicionar novos elementos
    informationBox.innerHTML = '';

    // Criar campo de entrada para o valor
    var inputValor = document.createElement('input');
    inputValor.type = 'text';
    inputValor.placeholder = 'Digite o valor em ' + moedaSelecionada;
    inputValor.id = 'input_valor';

    // Adicionar campo de entrada à caixa de informações
    informationBox.appendChild(inputValor);

    // Adicionar botão de confirmação
    var btnConfirmar = document.createElement('button');
    btnConfirmar.type = 'button';
    btnConfirmar.textContent = 'Ok';
    btnConfirmar.onclick = function () {
        // Obter valor inserido pelo usuário
        var valorEmMoeda = document.getElementById('input_valor').value;

        obterCotacaoMoeda(moedaSelecionada).then(cotacao => {
            if (cotacao !== null) {
                if (!isNaN(valorEmMoeda)) {
                    var valorEmReal = valorEmMoeda * cotacao;
                    valorEmReal = valorEmReal.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    });

                    // Criar parágrafos para exibir informações
                    var paragrafo1 = document.createElement('p');
                    paragrafo1.textContent = `Olá, o valor da moeda ${moedaSelecionada} em tempo real é de aproximadamente R$${cotacao.toFixed(2)}.`;

                    var paragrafo2 = document.createElement('p');
                    paragrafo2.textContent = `O valor em ${moedaSelecionada} convertido para o Real neste momento é de aproximadamente ${valorEmReal}.`;

                    // Adicionar os parágrafos à caixa de informações
                    informationBox.appendChild(paragrafo1);
                    informationBox.appendChild(paragrafo2);

                    // Adicionar botão "Voltar"
                    var btnVoltar = document.createElement('button');
                    btnVoltar.type = 'button';
                    btnVoltar.textContent = 'Voltar';
                    btnVoltar.onclick = function () {
                        // Chamar a função para exibir a entrada inicial da moeda
                        mostrarEntradaMoeda();
                    };

                    // Adicionar o botão "Voltar" à caixa de informações
                    informationBox.appendChild(btnVoltar);
                
                    // Desativar o campo de entrada e o botão após a conversão
                    inputValor.disabled = true;
                    btnConfirmar.disabled = true;

                } else {
                    console.error('Valor da moeda inserido pelo usuário inválido:', valorEmMoeda);
                }
            }

            // Mostrar a information_box
            informationBox.style.display = 'block';
        });
    };

    // Adicionar botão à caixa de informações
    informationBox.appendChild(btnConfirmar);

    // Adicionar ouvinte de evento para a tecla "Enter" no campo de entrada do valor
    inputValor.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            btnConfirmar.click();
        }
    });
}

// Chame a função para exibir a entrada inicial da moeda ao carregar a página
mostrarEntradaMoeda();