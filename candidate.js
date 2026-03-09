// Lista de candidatos
let candidatos = [];

// Criar candidato
function criarCandidato(nome) {
  const candidato = {
    nome: nome,
    votos: 0
  };
  candidatos.push(candidato);
  return candidato;
}
// Mostrar informações do candidato
function verCandidato(candidato) {
  return "Candidato: " + candidato.nome + " | Votos: " + candidato.votos;
}
// Adicionar voto
function adicionarVoto(candidato) {
  candidato.votos = candidato.votos + 1;
}

function obterCandidatos() {
  return candidatos;
}

function resetarVotos() {
  candidatos.forEach(c => c.votos = 0);
}

module.exports = {
  criarCandidato,
  verCandidato,
  adicionarVoto,
  obterCandidatos,
  resetarVotos
};