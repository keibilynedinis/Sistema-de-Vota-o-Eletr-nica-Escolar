function validarDados(idEleitor, nomeCandidato) {
  return idEleitor && idEleitor.trim().length > 0 && nomeCandidato && nomeCandidato.trim().length > 0;
}

function eleitorJaVotou(idEleitor, eleitoresRegistrados) {
  return eleitoresRegistrados.includes(idEleitor);
}

function candidatoExiste(nomeCandidato) {
  const candidate = require("./candidate.js");
  return candidate.obterCandidatos().some(c => c.nome === nomeCandidato);
}

module.exports = {
  validarDados,
  eleitorJaVotou,
  candidatoExiste
};