const candidate = require("./candidate.js");

let listaEleitores = [];

function jaVotou(nomeEleitor) {
  return listaEleitores.includes(nomeEleitor);
}

function nomeValido(nome) {
  return typeof nome === "string" && nome.trim().length > 0;
}

function registarVoto(idEleitor, nomeCandidato) {
  if (!nomeValido(idEleitor)) {
    return "ID do eleitor inválido.";
  }

  if (jaVotou(idEleitor)) {
    return `${idEleitor} já votou.`;
  }

  const candidato = candidate.obterCandidatos().find(c => c.nome === nomeCandidato);

  if (!candidato) {
    return `O candidato ${nomeCandidato} não existe.`;
  }

  candidate.adicionarVoto(candidato);
  listaEleitores.push(idEleitor);
  return `Voto de ${idEleitor} em ${nomeCandidato} registado.`;
}

function obterEleitoresRegistrados() {
  return listaEleitores;
}

function limparEleitores() {
  listaEleitores = [];
}

module.exports = {
  registarVoto: registarVoto,
  obterEleitoresRegistrados: obterEleitoresRegistrados,
  limparEleitores: limparEleitores
};