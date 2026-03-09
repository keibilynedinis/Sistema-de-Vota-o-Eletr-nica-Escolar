const readline = require("readline");
const candidate = require("./candidate.js");
const voteManager = require("./voteManager.js");
const validation = require("./validation.js");
const results = require("./results.js");

// Criar candidatos
candidate.criarCandidato("Ana");
candidate.criarCandidato("Bruno");
candidate.criarCandidato("Carla");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function pergunta(texto) {
    return new Promise((resolve) => {
        rl.question(texto, (resposta) => {
            resolve(resposta);
        });
    });
}

async function votar() {
    console.log("\n========== SISTEMA DE VOTAÇÃO ==========\n");
    let eleitoresRegistrados = [];
    
    while (true) {
        console.log("--- Novo Voto ---");
        const idEleitor = await pergunta("Digite seu ID de eleitor: ");
        const nomeCandidato = await pergunta("Em quem deseja votar (Ana, Bruno, Carla)? ");
        
        // Validar dados
        if (!validation.validarDados(idEleitor, nomeCandidato)) {
            console.log("OUTPUT - Dados inválidos!");
            continue;
        }
        
        // Verificar se eleitor já votou
        if (validation.eleitorJaVotou(idEleitor, eleitoresRegistrados)) {
            console.log("OUTPUT - Eleitor " + idEleitor + " já votou!");
            continue;
        }
        
        // Verificar se candidato existe
        if (!validation.candidatoExiste(nomeCandidato)) {
            console.log("OUTPUT - Candidato " + nomeCandidato + " não existe!");
            continue;
        }
        
        // Registar voto
        const resultado = voteManager.registarVoto(idEleitor, nomeCandidato);
        console.log("OUTPUT - " + resultado);
        eleitoresRegistrados = voteManager.obterEleitoresRegistrados();
        
        const resposta = await pergunta("Deseja registrar outro voto? (s/n) ");
        
        if (resposta.toLowerCase() !== "s") {
            break;
        }
        console.log("\n");
    }
    
    await mostrarResultados();
}

async function mostrarResultados() {
    console.log("\n========== RESULTADOS ==========\n");
    console.log("OUTPUT - Total de votos: " + results.totalVotos());

    let dados = results.calcularPercentagens();
    let nomes = dados[0];
    let percentagens = dados[1];

    console.log("\nOUTPUT - Votos por candidato:");
    for (let i = 0; i < nomes.length; i++) {
        console.log("OUTPUT - " + nomes[i] + ": " + percentagens[i].toFixed(2) + "%");
    }

    const resultado = results.determinarVencedor();
    console.log("\nOUTPUT - " + resultado);
    
    // Verificar se é empate e fazer 2ª volta
    if (resultado.includes("Empate:")) {
        await segunda_volta();
    } else {
        console.log("\n=====================================\n");
        rl.close();
    }
}

async function segunda_volta() {
    console.log("\n  EMPATE DETECTADO! Iniciando 2ª VOLTA...\n");
    
    // Obter candidatos empatados
    const candidatos = candidate.obterCandidatos();
    const maxVotos = Math.max(...candidatos.map(c => c.votos));
    const empatados = candidatos.filter(c => c.votos === maxVotos);
    
    console.log("Candidatos em disputa: " + empatados.map(c => c.nome).join(", "));
    console.log("\n========== 2ª VOLTA ==========\n");
    
    // Resetar votos para 2ª volta
    candidate.resetarVotos();
    voteManager.limparEleitores();
    
    let eleitoresRegistrados = [];
    
    while (true) {
        console.log("--- Novo Voto (2ª Volta) ---");
        const idEleitor = await pergunta("Digite seu ID de eleitor: ");
        const nomeCandidato = await pergunta(`Em quem deseja votar (${empatados.map(c => c.nome).join(", ")})? `);
        
        // Validar dados
        if (!validation.validarDados(idEleitor, nomeCandidato)) {
            console.log("OUTPUT - Dados inválidos!");
            continue;
        }
        
        // Verificar se eleitor já votou
        if (validation.eleitorJaVotou(idEleitor, eleitoresRegistrados)) {
            console.log("OUTPUT - Eleitor " + idEleitor + " já votou!");
            continue;
        }
        
        // Verificar se candidato está entre os empatados
        if (!empatados.some(c => c.nome === nomeCandidato)) {
            console.log("OUTPUT - Candidato " + nomeCandidato + " não está na 2ª volta!");
            continue;
        }
        
        // Registar voto
        const resultado = voteManager.registarVoto(idEleitor, nomeCandidato);
        console.log("OUTPUT - " + resultado);
        eleitoresRegistrados = voteManager.obterEleitoresRegistrados();
        
        const resposta = await pergunta("Deseja registrar outro voto? (s/n) ");
        
        if (resposta.toLowerCase() !== "s") {
            break;
        }
        console.log("\n");
    }
    
    mostrarResultadosSegundaVolta();
}

function mostrarResultadosSegundaVolta() {
    console.log("\n========== RESULTADOS DA 2ª VOLTA ==========\n");
    console.log("OUTPUT - Total de votos: " + results.totalVotos());

    const candidatos = candidate.obterCandidatos();
    const maxVotos = Math.max(...candidatos.map(c => c.votos));
    const empatados = candidatos.filter(c => c.votos === maxVotos);
    
    const total = results.totalVotos();
    
    console.log("\nOUTPUT - Votos por candidato (2ª Volta):");
    for (let i = 0; i < empatados.length; i++) {
        const percentagem = total > 0 ? (empatados[i].votos / total) * 100 : 0;
        console.log("OUTPUT - " + empatados[i].nome + ": " + percentagem.toFixed(2) + "%");
    }

    console.log("\nOUTPUT - " + results.determinarVencedor());
    console.log("\n============================================\n");
    
    rl.close();
}

votar();