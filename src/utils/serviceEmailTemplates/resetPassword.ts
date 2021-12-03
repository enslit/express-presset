export const resetPasswordTemplate = (token: string): string => `
  <p>Для сброса пароля, перейдите по <a href='http://localhost:5000/rest/v1/auth/reset/${token}' target='_blank'>ссылке</a>.</p>
  <p><strong>Внимение! </strong>Ссылка активна в течение 30 минут</p>
`