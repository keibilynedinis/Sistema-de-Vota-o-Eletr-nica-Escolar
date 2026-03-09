function totalVotos() {
  const candidate = require("./candidate.js");
  return candidate.obterCandidatos().reduce((total, c) => total + c.votos, 0);
}

function calcularPercentagens() {
  const candidate = require("./candidate.js");
  const candidatos = candidate.obterCandidatos();
  const total = totalVotos();
  
  const nomes = candidatos.map(c => c.nome);
  const percentagens = candidatos.map(c => total > 0 ? (c.votos / total) * 100 : 0);
  
  return [nomes, percentagens];
}

function determinarVencedor() {
  const candidate = require("./candidate.js");
  const candidatos = candidate.obterCandidatos();
  
  if (candidatos.length === 0) {
    return "Nenhum candidato registado.";
  }
  
  const maxVotos = Math.max(...candidatos.map(c => c.votos));
  
  if (maxVotos === 0) {
    return "Nenhum voto foi registado.";
  }
  
  const vencedores = candidatos.filter(c => c.votos === maxVotos);
  
  if (vencedores.length > 1) {
    const nomes = vencedores.map(c => c.nome).join(", ");
    return `Empate: ${nomes} com ${maxVotos} voto(s) cada.`;
  }
  
  return `Vencedor: ${vencedores[0].nome} com ${maxVotos} voto(s)`;
}

module.exports = {
  totalVotos,
  calcularPercentagens,
  determinarVencedor
};