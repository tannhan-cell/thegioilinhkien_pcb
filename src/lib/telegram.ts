// ==========================================
// TELEGRAM BOT NOTIFICATION SERVICE
// ==========================================
import { PCBRequest, CommerceOrder, SystemSettings } from './types';
import { estimatePCBPrice } from './pricing';

function escapeHtml(text: any): string {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export const telegramService = {
  /**
   * Gửi tin nhắn trực tiếp tới Telegram Bot API
   * Hỗ trợ HTML, tự động dự phòng Plain Text nếu có lỗi cú pháp
   */
  async sendMessage(botToken: string, chatId: string, text: string): Promise<boolean> {
    const token = (botToken || '').trim();
    const chat = (chatId || '').trim();
    if (!token || !chat) {
      console.warn('Telegram sendMessage: Thiếu Bot Token hoặc Chat ID');
      return false;
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
      // 1. Thử gửi định dạng HTML
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chat,
          text: text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });

      const data = await res.json();
      if (data.ok === true) {
        return true;
      }

      // 2. Nếu Telegram báo lỗi cú pháp HTML (ví dụ lỗi tag hoặc ký tự đặc biệt), tự động gửi lại dưới dạng văn bản thuần
      console.warn('Gửi Telegram dạng HTML không thành công, đang thử lại dạng Plain Text...', data);
      const plainText = text
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');

      const retryRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chat,
          text: plainText,
          disable_web_page_preview: true,
        }),
      });

      const retryData = await retryRes.json();
      if (retryData.ok === true) {
        return true;
      }

      console.error('Lỗi gửi Telegram cuối cùng:', retryData);
      return false;
    } catch (e) {
      console.error('Lỗi kết nối mạng tới Telegram Bot API:', e);
      return false;
    }
  },

  /**
   * Gửi tin nhắn kiểm tra kết nối từ Admin Settings
   */
  async sendTestMessage(botToken: string, chatId: string): Promise<{ success: boolean; message: string }> {
    if (!botToken?.trim() || !chatId?.trim()) {
      return { success: false, message: 'Vui lòng nhập đầy đủ Telegram Bot Token và Chat ID.' };
    }
    const testText = `
🔔 <b>THÔNG BÁO THỬ NGHIỆM TELEGRAM BOT</b>
━━━━━━━━━━━━━━━━━━
✅ Kết nối Telegram Bot với website <b>Thế Giới Linh Kiện &amp; PCB</b> thành công!
⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}
🚀 Hệ thống sẽ tự động gửi thông báo khi có khách đặt mạch in PCB hoặc mua linh kiện.
    `.trim();

    const ok = await this.sendMessage(botToken, chatId, testText);
    if (ok) {
      return { success: true, message: 'Đã gửi tin nhắn test thành công tới Telegram!' };
    } else {
      return { success: false, message: 'Không gửi được tin nhắn. Vui lòng kiểm tra lại Bot Token hoặc Chat ID (chú ý đã bấm /start với bot).' };
    }
  },

  /**
   * Thông báo yêu cầu gia công PCB / PCBA mới
   */
  async notifyPCBRequest(req: PCBRequest, settings?: SystemSettings): Promise<boolean> {
    const token = (settings?.telegramBotToken || (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN || '').trim();
    const chatId = (settings?.telegramChatId || (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID || '').trim();

    if (!token || !chatId) {
      console.warn('Bỏ qua thông báo Telegram PCB: Chưa cấu hình Bot Token hoặc Chat ID');
      return false;
    }

    if (settings && settings.enableTelegramNotify === false) {
      console.warn('Thông báo Telegram đang tắt trong cài đặt');
      return false;
    }

    const isAssembly = req.specs?.[0]?.serviceType === 'assembly';
    const typeTitle = isAssembly 
      ? '🛠 <b>CÓ YÊU CẦU GIA CÔNG HÀN LẮP (PCBA) MỚI!</b>' 
      : '⚡️ <b>CÓ YÊU CẦU GIA CÔNG MẠCH IN (PCB) MỚI!</b>';

    let totalCalculated = 0;
    let hasEstimate = false;
    let specDetails = '';
    req.specs?.forEach((s, idx) => {
      const boPrice = estimatePCBPrice(s);
      if (boPrice && boPrice > 0) {
        totalCalculated += boPrice;
        hasEstimate = true;
      }
      const priceSub = boPrice ? ` | 💵 ~${boPrice.toLocaleString('vi-VN')} đ` : '';
      specDetails += `\n🔹 <b>Bo #${idx + 1} (${escapeHtml(s.tabName)}):</b> ${escapeHtml(String(s.width))}x${escapeHtml(String(s.height))}mm | ${escapeHtml(String(s.quantity))} bo | ${escapeHtml(s.layers)} | ${escapeHtml(s.material)} | Mạ ${escapeHtml(s.surfaceFinish)} | Màu ${escapeHtml(s.maskColor)}${priceSub}`;
      if (s.files && s.files.length > 0) {
        const fileNames = s.files.map(f => typeof f === 'string' ? f : f.name).join(', ');
        specDetails += `\n   📎 File: ${escapeHtml(fileNames)}`;
      }
    });

    const boCount = req.specs?.length || 1;
    const finalPrice = req.estimatedPrice || (hasEstimate ? totalCalculated : null);
    const priceText = finalPrice 
      ? `${finalPrice.toLocaleString('vi-VN')} đ ${boCount > 1 ? `(Tổng cộng ${boCount} bo)` : ''}`
      : 'Chờ kỹ thuật viên báo giá';

    const safeOrderCode = escapeHtml(req.orderCode);
    const safeCustomerName = escapeHtml(req.customerName);
    const safePhone = escapeHtml(req.customerPhone);
    const safeEmail = req.customerEmail ? escapeHtml(req.customerEmail) : 'Không có';
    const safeAddress = req.customerAddress ? escapeHtml(req.customerAddress) : 'Không có';
    const safeNotes = req.notes ? `\n📝 <b>Ghi Chú:</b> ${escapeHtml(req.notes)}` : '';

    const text = `
${typeTitle}
━━━━━━━━━━━━━━━━━━
📋 <b>Mã Đơn:</b> <code>${safeOrderCode}</code>
👤 <b>Khách Hàng:</b> ${safeCustomerName}
📞 <b>Số Điện Thoại:</b> ${safePhone}
📧 <b>Email:</b> ${safeEmail}
📍 <b>Địa Chỉ:</b> ${safeAddress}${safeNotes}
📦 <b>Chi Tiết Yêu Cầu (${boCount} bo):</b>${specDetails}

💰 <b>Ước Tính Giá:</b> ${priceText}
⏰ <b>Thời Gian:</b> ${new Date().toLocaleString('vi-VN')}
    `.trim();

    return await this.sendMessage(token, chatId, text);
  },

  /**
   * Thông báo đơn hàng mua linh kiện mới
   */
  async notifyCommerceOrder(order: CommerceOrder, settings?: SystemSettings): Promise<boolean> {
    const token = (settings?.telegramBotToken || (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN || '').trim();
    const chatId = (settings?.telegramChatId || (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID || '').trim();

    if (!token || !chatId) {
      console.warn('Bỏ qua thông báo Telegram đơn hàng: Chưa cấu hình Bot Token hoặc Chat ID');
      return false;
    }

    if (settings && settings.enableTelegramNotify === false) {
      return false;
    }

    const itemsText = order.items
      .map(i => `   • ${i.quantity}x ${escapeHtml(i.productName)} (${(i.price * i.quantity).toLocaleString('vi-VN')} đ)`)
      .join('\n');

    const paymentText = order.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản VietQR Napas';
    const safeOrderCode = escapeHtml(order.orderCode);
    const safeCustomerName = escapeHtml(order.customerName);
    const safePhone = escapeHtml(order.customerPhone);
    const safeAddress = escapeHtml(order.customerAddress);
    const safeNotes = order.notes ? `\n📝 <b>Ghi Chú:</b> ${escapeHtml(order.notes)}` : '';

    const text = `
🛒 <b>CÓ ĐƠN HÀNG MUA LINH KIỆN MỚI!</b>
━━━━━━━━━━━━━━━━━━
📋 <b>Mã Đơn:</b> <code>${safeOrderCode}</code>
👤 <b>Người Nhận:</b> ${safeCustomerName}
📞 <b>Số Điện Thoại:</b> ${safePhone}
📍 <b>Địa Chỉ Giao:</b> ${safeAddress}
💳 <b>Hình Thức:</b> ${paymentText}${safeNotes}
📦 <b>Sản Phẩm Đặt Mua:</b>
${itemsText}

🚚 <b>Phí Vận Chuyển:</b> ${order.shippingFee === 0 ? 'Miễn phí' : order.shippingFee.toLocaleString('vi-VN') + ' đ'}
💵 <b>TỔNG CỘNG:</b> <b>${order.totalAmount.toLocaleString('vi-VN')} đ</b>
⏰ <b>Thời Gian:</b> ${new Date().toLocaleString('vi-VN')}
    `.trim();

    return await this.sendMessage(token, chatId, text);
  }
};
