import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG, EMAIL_TEMPLATES, EMAIL_CONTENT } from '../config/emailjs.js'

class EmailService {
  constructor() {
    this.serviceId = EMAILJS_CONFIG.SERVICE_ID
    this.templateId = EMAILJS_CONFIG.TEMPLATE_ID
    this.welcomeTemplateId = EMAILJS_CONFIG.WELCOME_TEMPLATE_ID
    this.resetTemplateId = EMAILJS_CONFIG.RESET_TEMPLATE_ID
    this.publicKey = EMAILJS_CONFIG.PUBLIC_KEY
    
    emailjs.init({
      publicKey: this.publicKey
    })
  }

  // Gerar código de confirmação
  generateConfirmationCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = 'DH-'
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  async sendWelcomeEmail(userData) {
    try {
      const template = EMAIL_CONTENT.WELCOME_TEMPLATE
      
      const templateParams = {
        to_name: userData.name,
        to_email: userData.email,
        from_name: EMAIL_TEMPLATES.FROM_NAME,
        rank: userData.rank || 'Recruta',
        registration_date: new Date().toLocaleDateString('pt-BR'),
        message: `Bem-vindo à Operação Pato Primordial! Sua conta foi criada com sucesso.`,
        app_url: import.meta.env.VITE_APP_URL || window.location.origin
      }

      const response = await emailjs.send(
        this.serviceId,
        this.welcomeTemplateId,
        templateParams
      )

      return { success: true, messageId: response.text }
    } catch (error) {
      throw error
    }
  }

  async sendPasswordResetEmail(userData, resetCode) {
    try {
      const confirmationCode = resetCode || this.generateConfirmationCode()
      const template = EMAIL_CONTENT.RESET_TEMPLATE
      
      const templateParams = {
        to_name: userData.name || 'Soldado',
        to_email: userData.email,
        from_name: EMAIL_TEMPLATES.FROM_NAME,
        from_email: EMAIL_TEMPLATES.FROM_EMAIL,
        reply_to: EMAIL_TEMPLATES.REPLY_TO,
        subject: `${EMAIL_TEMPLATES.SUBJECT_PREFIX} ${EMAIL_TEMPLATES.SUBJECTS.RESET}`,
        confirmation_code: confirmationCode,
        request_date: new Date().toLocaleDateString('pt-BR'),
        request_time: new Date().toLocaleTimeString('pt-BR'),
        message: `Solicitação de redefinição de senha recebida. Use o código ${confirmationCode} para criar uma nova senha. Expira em 10 minutos.`,
        app_url: import.meta.env.VITE_APP_URL || window.location.origin,
        html_content: template.html
      }

      const response = await emailjs.send(
        this.serviceId,
        this.resetTemplateId,
        templateParams
      )

      return { success: true, messageId: response.text, code: confirmationCode }
    } catch (error) {
      throw error
    }
  }




}

export const sendWelcomeEmail = async (userData) => {
  const emailService = new EmailService()
  return await emailService.sendWelcomeEmail(userData)
}

export const sendPasswordResetEmail = async (userData) => {
  const emailService = new EmailService()
  return await emailService.sendPasswordResetEmail(userData)
}

export default new EmailService()