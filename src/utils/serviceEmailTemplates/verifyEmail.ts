export const verifyEmailTemplate = (token: string): string => `
  <p>Для потверждения учетной записи, перейдите по <a href='http://localhost:5000/rest/v1/auth/verify/${token}' target='_blank'>ссылке</a></p>
`