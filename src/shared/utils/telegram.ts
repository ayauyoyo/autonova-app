// Вставь сюда токен бота от @BotFather и свой chat_id
export const TELEGRAM_BOT_TOKEN = '8627109065:AAFl8emAkf4uid4C62sx4DheEDZDL9L2bgw';
export const TELEGRAM_CHAT_ID = '926325453';

export async function sendTelegramNotification(text: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.startsWith('ВСТАВЬ')) return;
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML' }),
    });
  } catch {
    // не блокируем пользователя при сбое сети
  }
}