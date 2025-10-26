// Configurações do EmailJS
// Para conectar sua conta EmailJS:

export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  RESET_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_RESET_TEMPLATE_ID,
  WELCOME_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_WELCOME_TEMPLATE_ID,
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
}

export const EMAIL_TEMPLATES = {
  FROM_NAME: import.meta.env.VITE_EMAIL_FROM_NAME,
  SUBJECTS: {
    WELCOME: import.meta.env.VITE_EMAIL_WELCOME_SUBJECT,
  }
}

export const EMAIL_CONTENT = {
  WELCOME_TEMPLATE: {
    subject: EMAIL_TEMPLATES.SUBJECTS.WELCOME,
    html: `
      <div style="font-family: 'Orbitron', monospace; background: #0a0a0a; color: #00ff41; padding: 20px;">
        <div style="border: 2px solid #00ff41; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ff6b35; text-align: center; margin-bottom: 20px;">
            🦆 OPERAÇÃO PATO PRIMORDIAL
          </h1>
          
          <div style="background: #1a1a1a; padding: 15px; border-left: 4px solid #00ff41; margin: 20px 0;">
            <h2 style="color: #00ff41; margin: 0 0 10px 0;">MISSÃO ATIVADA</h2>
            <p><strong>Agente:</strong> {{to_name}}</p>
            <p><strong>Email:</strong> {{to_email}}</p>
            <p><strong>Patente:</strong> {{rank}}</p>
            <p><strong>Data de Alistamento:</strong> {{registration_date}}</p>
          </div>
          
          <div style="background: #2a2a2a; padding: 15px; margin: 20px 0;">
            <h3 style="color: #ff6b35;">🎯 BRIEFING DA MISSÃO</h3>
            <p>Bem-vindo ao sistema de caça e catalogação de Patos Primordiais. Sua missão:</p>
            <ul style="color: #cccccc;">
              <li>Catalogar espécimes de Patos Primordiais</li>
              <li>Analisar superpoderes e mutações</li>
              <li>Executar operações de captura estratégica</li>
              <li>Manter sigilo absoluto sobre as operações</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{app_url}}" style="background: #ff6b35; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 5px;">
              🚁 ACESSAR CENTRO DE COMANDO
            </a>
          </div>
          
          <div style="border-top: 1px solid #333; padding-top: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>{{message}}</p>
            <p><strong>Comando Central - DSIN</strong><br>
            Departamento de Segurança e Inteligência Nacional</p>
            <p style="color: #ff6b35;">⚠️ CLASSIFICAÇÃO: ULTRA SECRETO</p>
          </div>
        </div>
      </div>
    `
  },
  
  RESET_TEMPLATE: {
    subject: EMAIL_TEMPLATES.SUBJECTS.RESET,
    html: `
      <div style="font-family: 'Orbitron', monospace; background: #0a0a0a; color: #00ff41; padding: 20px;">
        <div style="border: 2px solid #00ff41; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ff6b35; text-align: center;">🦆 REDEFINIÇÃO DE SENHA</h1>
          
          <div style="background: #1a1a1a; padding: 15px; border-left: 4px solid #00ff41; margin: 20px 0;">
            <p>Olá <strong>{{to_name}}</strong>,</p>
            <p>Recebemos uma solicitação para redefinir sua senha de acesso ao sistema Duck Hunter.</p>
            <p><strong>Código de Reset:</strong> <span style="color: #ff6b35;">{{confirmation_code}}</span></p>
            <p><strong>Data:</strong> {{request_date}}</p>
            <p><strong>Hora:</strong> {{request_time}}</p>
          </div>
          
          <div style="background: #2a2a2a; padding: 15px; margin: 20px 0;">
            <p style="color: #ff6b35;">⚠️ IMPORTANTE:</p>
            <ul style="color: #cccccc;">
              <li>Este código expira em 10 minutos</li>
              <li>Use apenas se você solicitou a redefinição</li>
              <li>Não compartilhe este código com ninguém</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="{{app_url}}" style="background: #ff6b35; color: #000; padding: 10px 20px; text-decoration: none; font-weight: bold;">
              ACESSAR SISTEMA
            </a>
          </div>
          
          <div style="border-top: 1px solid #333; padding-top: 15px; text-align: center; font-size: 12px; color: #666;">
            <p><strong>Comando Central - DSIN</strong><br>
            Departamento de Segurança e Inteligência Nacional</p>
            <p style="color: #ff6b35;">⚠️ CLASSIFICAÇÃO: CONFIDENCIAL</p>
          </div>
        </div>
      </div>
    `
  }
}