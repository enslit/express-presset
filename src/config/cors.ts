import cors from 'cors';

export const corsConfig = cors({
  origin: [/http:\/\/localhost(:\d+)?/, /https?:\/\/([a-zA-Z]+\.)?enslit.ru/],
  credentials: true,
});
