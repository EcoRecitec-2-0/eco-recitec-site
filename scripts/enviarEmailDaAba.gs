/**
 * Envia e-mail personalizado para todos os registros de uma aba específica.
 * 
 * VERSÃO DE TESTE: usando aba "INSCRIÇÃO_PAGO"
 * VERSÃO FINAL: trocar NOME_ABA para "CONSELHEIROS" ou "INSCRIÇÃO_GRATIS"
 * 
 * COMO USAR:
 * 1. Abra o editor do Apps Script na planilha (Extensões → Apps Script)
 * 2. Cole esta função no final do arquivo (após o CABECALHOS e doPost)
 * 3. No dropdown de funções, selecione "enviarEmailDaAba"
 * 4. Clique em "Executar"
 * 5. Na primeira execução o Google vai pedir autorização — autorize.
 */

function enviarEmailDaAba() {
  // ─── CONFIGURAÇÃO ──────────────────────────────────────────────
  // TESTE:   "INSCRIÇÃO_PAGO"
  // FINAL:   "CONSELHEIROS" ou "INSCRIÇÃO_GRATIS"
  const NOME_ABA = "INSCRIÇÃO_PAGO";

  const ASSUNTO = "Pré-lançamento Ecosystem8Skills - Hoje às 16h!";
  const CORPO_HTML = `
    <p>Passando para lembrar que o <strong>Pré-lançamento acontece hoje às 16h</strong>.</p>
    <p>Está imperdível a experiência!!</p>

    <p>{{NOME}},</p>

    <p>Você se inscreveu no pré‑lançamento do <strong>Ecosystem8Skills</strong>, o primeiro ecossistema circular do mundo dedicado ao desenvolvimento integrado de mentalidade e habilidades — soft skills, hard skills e meta skills — aplicadas à construção de governança sistêmica, ecossistêmica e ao desenvolvimento de projetos práticos de impacto real.</p>

    <p>O Ecosystem8Skills propõe uma jornada evolutiva e transformadora:<br>
    do linear ao circular, do circular ao sistêmico e do sistêmico ao ecossistêmico.<br>
    Uma travessia que amplia consciência, fortalece competências e cria ambientes colaborativos capazes de gerar soluções regenerativas e sustentáveis.</p>

    <p>Nesta reunião, apresentaremos a visão, os pilares, a arquitetura e as oportunidades de participação neste movimento pioneiro.</p>

    <p>Será uma alegria contar com sua presença nessa construção coletiva.</p>

    <p><strong>Quinta-feira, 28 de mai. • 16:00 – 16:15</strong></p>

    <p><strong>Como participar do Google Meet</strong><br>
    Link da videochamada: <a href="https://meet.google.com/iuf-hjwo-zaf">https://meet.google.com/iuf-hjwo-zaf</a><br>
    Ou disque: +55 41 4560-9647 PIN: 295 018 087#<br>
    Mais números de telefone: <a href="https://tel.meet/iuf-hjwo-zaf?pin=8916778620056">https://tel.meet/iuf-hjwo-zaf?pin=8916778620056</a></p>

    <p>Atenciosamente,<br><strong>Equipe EcoRecitec</strong></p>
  `;
  // ───────────────────────────────────────────────────────────────

  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const aba = planilha.getSheetByName(NOME_ABA);

  if (!aba) {
    SpreadsheetApp.getUi().alert(`A aba "${NOME_ABA}" não foi encontrada!`);
    return;
  }

  const cabecalhos = CABECALHOS[NOME_ABA];
  if (!cabecalhos) {
    SpreadsheetApp.getUi().alert(`Não há definição de cabeçalhos para "${NOME_ABA}". Adicione em CABECALHOS.`);
    return;
  }

  const dados = aba.getDataRange().getValues();
  if (dados.length < 2) {
    SpreadsheetApp.getUi().alert("Nenhum registro encontrado para envio.");
    return;
  }

  const idxNome  = cabecalhos.indexOf("Nome");
  const idxEmail = cabecalhos.indexOf("Email");

  if (idxNome === -1 || idxEmail === -1) {
    SpreadsheetApp.getUi().alert('A aba precisa ter colunas "Nome" e "Email".');
    return;
  }

  // ─── CONTROLE DE LIMITE DIÁRIO ────────────────────────────────
  // O Google limita MailApp.sendEmail() a ~100/dia (conta gratuita)
  // ou ~1.500/dia (Google Workspace pago).
  // Esta versão envia até o limite e salva onde parou para continuar depois.
  
  const props = PropertiesService.getScriptProperties();
  const chaveLinha = `ULTIMA_LINHA_ENVIO_${NOME_ABA}`;
  const chaveData  = `DATA_ENVIO_${NOME_ABA}`;
  const hoje = new Date().toDateString();

  let linhaInicial = 1; // começa do cabeçalho + 1
  const dataAnterior = props.getProperty(chaveData);
  const ultimaLinha  = props.getProperty(chaveLinha);

  // Se já rodou hoje, continua de onde parou
  if (dataAnterior === hoje && ultimaLinha) {
    linhaInicial = parseInt(ultimaLinha, 10) + 1;
  }

  let enviados = 0;
  let erros = 0;
  const LIMITE_DIARIO = 90; // margem abaixo de 100 para segurança

  for (let i = linhaInicial; i < dados.length; i++) {
    if (enviados >= LIMITE_DIARIO) {
      props.setProperty(chaveLinha, String(i - 1));
      props.setProperty(chaveData, hoje);
      SpreadsheetApp.getUi().alert(
        `⚠️ Limite diário de ${LIMITE_DIARIO} envios atingido.\n\n` +
        `📨 Enviados hoje: ${enviados}\n` +
        `❌ Erros: ${erros}\n` +
        `📌 Parou na linha ${i}.\n` +
        `▶️ Execute novamente amanhã para continuar.`
      );
      return;
    }

    const linha = dados[i];
    const nome  = String(linha[idxNome] || "").trim();
    const email = String(linha[idxEmail] || "").trim();

    if (!email) continue;

    try {
      const corpo = CORPO_HTML.replace(/\{\{NOME\}\}/g, nome);
      MailApp.sendEmail({
        to: email,
        subject: ASSUNTO,
        htmlBody: corpo
      });
      enviados++;
    } catch (e) {
      erros++;
      console.error(`Erro ao enviar para ${email}: ${e.message}`);
    }

    // Pequena pausa para não sobrecarregar
    if (enviados % 10 === 0) Utilities.sleep(1000);
  }

  // Se chegou aqui, terminou tudo
  props.deleteProperty(chaveLinha);
  props.deleteProperty(chaveData);

  SpreadsheetApp.getUi().alert(
    `✅ Envio concluído!\n\n📨 Enviados: ${enviados}\n❌ Erros: ${erros}`
  );
}