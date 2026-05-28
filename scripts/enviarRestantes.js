/**
 * Script Node.js para enviar emails restantes do pré-lançamento
 * 
 * Limite Gmail SMTP: ~500 emails/dia (vs 100 do Apps Script)
 * 
 * COMO USAR:
 * 1. npm init -y (se não tiver package.json)
 * 2. npm install nodemailer
 * 3. Copie o JSON gerado pelo AppScript para emails.json
 * 4. Preencha seus dados no .env ou direto nas variáveis abaixo
 * 5. node scripts/enviarRestantes.js
 * 
 * IMPORTANTE: Ative "Senha de App" no Google (se tiver 2FA)
 * https://myaccount.google.com/apppasswords
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// ─── CONFIGURAÇÃO ──────────────────────────────────────────────
const EMAIL_REMETENTE = 'eco.recitec@gmail.com';  // ← SEU EMAIL
const SENHA_APP = 'zsgx rhjx tmag tbmt';                               // ← SENHA DE APP (gerar no Google)
const ARQUIVO_JSON = path.join(__dirname, 'emails_com_erro.json');
// ───────────────────────────────────────────────────────────────

const ASSUNTO = "Pré-lançamento Ecosystem8Skills - Hoje às 16h!";
const CORPO_HTML = (nome) => `
    <p>Passando para lembrar que o <strong>Pré-lançamento acontece hoje às 16h</strong>.</p>
    <p>Está imperdível a experiência!!</p>

    <p>${nome},</p>

    <p>Você se inscreveu no pré‑lançamento do <strong>Ecosystem8Skills</strong>, o primeiro ecossistema circular do mundo dedicado ao desenvolvimento integrado de mentalidade e habilidades — soft skills, hard skills e meta skills — aplicadas à construção de governança sistêmica, ecossistêmica e ao desenvolvimento de projetos práticos de impacto real.</p>

    <p>O Ecosystem8Skills propõe uma jornada evolutiva e transformadora:<br>
    do linear ao circular, do circular ao sistêmico e do sistêmico ao ecossistêmico.<br>
    Uma travessia que amplia consciência, fortalece competências e cria ambientes colaborativos capazes de gerar soluções regenerativas e sustentáveis.</p>

    <p>Nesta reunião, apresentaremos a visão, os pilares, a arquitetura e as oportunidades de participação neste movimento pioneiro.</p>

    <p>Será uma alegria contar com sua presença nessa construção coletiva.</p>

    <p><strong>Quinta-feira, 28 de mai. • 16:00 – 18:15</strong></p>

    <p><strong>Como participar do Google Meet</strong><br>
    Link da videochamada: <a href="https://meet.google.com/iuf-hjwo-zaf">https://meet.google.com/iuf-hjwo-zaf</a><br>
    Ou disque: +55 41 4560-9647 PIN: 295 018 087#<br>
    Mais números de telefone: <a href="https://tel.meet/iuf-hjwo-zaf?pin=8916778620056">https://tel.meet/iuf-hjwo-zaf?pin=8916778620056</a></p>

    <p>Atenciosamente,<br><strong>Equipe EcoRecitec</strong></p>
`;

// ─── PASSO 1: GERAR O JSON PELO APPSCRIPT ─────────────────────
// Cole e execute esta função no AppScript:
//
// function gerarJSONRestantes() {
//   const NOME_ABA = "INSCRIÇÃO_PAGO";
//   const cabecalhos = CABECALHOS[NOME_ABA];
//   const aba = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOME_ABA);
//   const dados = aba.getDataRange().getValues();
//   const idxNome  = cabecalhos.indexOf("Nome");
//   const idxEmail = cabecalhos.indexOf("Email");
//   const props = PropertiesService.getScriptProperties();
//   const ultimaLinha = parseInt(props.getProperty("ULTIMA_LINHA_ENVIO_" + NOME_ABA) || "1");
//   const restantes = [];
//   for (let i = ultimaLinha; i < dados.length; i++) {
//     if (dados[i][idxEmail] && String(dados[i][idxEmail]).trim()) {
//       restantes.push({ nome: String(dados[i][idxNome] || "").trim(), email: String(dados[i][idxEmail]).trim() });
//     }
//   }
//   Logger.log(JSON.stringify(restantes));
//   // Copie o output do Logger para emails_restantes.json
// }
// ───────────────────────────────────────────────────────────────

async function main() {
  // Verifica se o JSON existe
  if (!fs.existsSync(ARQUIVO_JSON)) {
    console.error(`❌ Arquivo ${ARQUIVO_JSON} não encontrado.`);
    console.log(`👉 Execute a função gerarJSONRestantes() no AppScript`);
    console.log(`👉 Copie o output para ${ARQUIVO_JSON}`);
    process.exit(1);
  }

  // Lê os contatos
  const contatos = JSON.parse(fs.readFileSync(ARQUIVO_JSON, 'utf8'));
  if (!Array.isArray(contatos) || contatos.length === 0) {
    console.error('❌ Nenhum contato encontrado no JSON.');
    process.exit(1);
  }

  console.log(`📧 ${contatos.length} emails para enviar via Nodemailer.`);

  // Cria transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_REMETENTE,
      pass: SENHA_APP
    }
  });

  let enviados = 0;
  let erros = 0;

  for (let i = 0; i < contatos.length; i++) {
    const { nome, email } = contatos[i];

    try {
      await transporter.sendMail({
        from: `"EcoRecitec" <${EMAIL_REMETENTE}>`,
        to: email,
        subject: ASSUNTO,
        html: CORPO_HTML(nome || 'Olá')
      });
      enviados++;
      console.log(`✅ [${i + 1}/${contatos.length}] ${email}`);
    } catch (e) {
      erros++;
      console.error(`❌ [${i + 1}/${contatos.length}] ${email}: ${e.message}`);
    }

    // Pausa de 1s a cada 20 envios
    if (enviados % 20 === 0) {
      console.log('⏳ Aguardando 2s...');
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log(`\n✅ Finalizado!`);
  console.log(`📨 Enviados: ${enviados}`);
  console.log(`❌ Erros: ${erros}`);
}

main();