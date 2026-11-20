// ==========================================
// TELEGRAM BOT NOTIFICATION SERVICE
// ==========================================
import { PCBRequest, CommerceOrder, SystemSettings } from './types';

export const telegramService = {
  /**
   * Send arbitrary message to Telegram Bot
   */
  async sendMessage(botToken: string, chatId: string, text: string): Promise<boolean> {
    if (!botToken || !chatId) return false;
    try {
      const url = `https://api.telegram.org/bot${botToken.trim()}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId.trim(),
          text: text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });
      const data = await res.json();
      return data.ok === true;
    } catch (e) {
      console.error('Lỗi gửi Telegram:', e);
      return false;
    }
  },

  /**
   * Send test message from Admin Settings
   */
  async sendTestMessage(botToken: string, chatId: string): Promise<{ success: boolean; message: string }> {
    if (!botToken.trim() || !chatId.trim()) {
      return { success: false, message: 'Vui lòng nhập đầy đủ Telegram Bot Token và Chat ID.' };
    }
    const testText = `
🔔 <b>THÔNG BÁO THỬ NGHIỆM TELEGRAM BOT</b>
━━━━━━━━━━━━━━━━━━
✅ Kết nối Telegram Bot với website <b>Thế Giới Linh Kiện & PCB</b> thành công!
⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}
🚀 Hệ thống sẽ tự động gửi thông báo khi có khách đặt mạch in PCB hoặc mua linh kiện.
    `.trim();

    const ok = await this.sendMessage(botToken, chatId, testText);
    if (ok) {
      return { success: true, message: 'Đã gửi tin nhắn test thành công tới Telegram!' };
    } else {
      return { success: false, message: 'Không gửi được tin nhắn. Vui lòng kiểm tra lại Bot Token hoặc Chat ID (chú ý đã bấm /start với bot chưa).' };
    }
  },

  /**
   * Notify new PCB Request
   */
  async notifyPCBRequest(req: PCBRequest, settings: SystemSettings): Promise<void> {
    if (!settings.enableTelegramNotify || !settings.telegramBotToken || !settings.telegramChatId) {
      return;
    }

    const isAssembly = req.specs?.[0]?.serviceType === 'assembly';
    const typeTitle = isAssembly ? '🛠 CÓ YÊU CẦU GIA CÔNG HÀN LẮP (PCBA) MỚI!' : '⚡️ CÓ YÊU CẦU GIA CÔNG MẠCH IN (PCB) MỚI!';

    let specDetails = '';
    req.specs?.forEach((s, idx) => {
      specDetails += `\n🔹 <b>Bo #${idx + 1} (${s.tabName}):</b> ${s.width}x${s.height}mm | ${s.quantity} bo | ${s.layers} | ${s.material} | Mạ ${s.surfaceFinish} | Màu ${s.maskColor}`;
      if (s.files && s.files.length > 0) {
        specDetails += `\n   📎 File: ${s.files.map(f => f.name).join(', ')}`;
      }
    });

    const text = `
${typeTitle}
━━━━━━━━━━━━━━━━━━
📋 <b>Mã Đơn:</b> <code>${req.orderCode}</code>
👤 <b>Khách Hàng:</b> ${req.customerName}
📞 <b>Số Điện Thoại:</b> <a href="tel:${req.customerPhone}">${req.customerPhone}</a>
📧 <b>Email:</b> ${req.customerEmail || 'Không có'}
📍 <b>Địa Chỉ:</b> ${req.customerAddress || 'Không có'}
${req.notes ? `📝 <b>Ghi Chú:</b> ${req.notes}\n` : ''}
📦 <b>Chi Tiết Yêu Cầu (${req.specs?.length || 1} bo):</b>${specDetails}

💰 <b>Ước Tính Giá:</b> ${req.estimatedPrice ? req.estimatedPrice.toLocaleString('vi-VN') + ' đ' : 'Chờ kỹ thuật viên báo giá'}
⏰ <b>Thời Gian:</b> ${new Date().toLocaleString('vi-VN')}
    `.trim();

    await this.sendMessage(settings.telegramBotToken, settings.telegramChatId, text);
  },

  /**
   * Notify new Commerce Order (Linh kiện)
   */
  async notifyCommerceOrder(order: CommerceOrder, settings: SystemSettings): Promise<void> {
    if (!settings.enableTelegramNotify || !settings.telegramBotToken || !settings.telegramChatId) {
      return;
    }

    const itemsText = order.items
      .map(i => `   • ${i.quantity}x ${i.productName} (${(i.price * i.quantity).toLocaleString('vi-VN')} đ)`)
      .join('\n');

    const paymentText = order.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản VietQR Napas';

    const text = `
🛒 <b>CÓ ĐƠN HÀNG MUA LINH KIỆN MỚI!</b>
━━━━━━━━━━━━━━━━━━
📋 <b>Mã Đơn:</b> <code>${order.orderCode}</code>
👤 <b>Người Nhận:</b> ${order.customerName}
📞 <b>Số Điện Thoại:</b> <a href="tel:${order.customerPhone}">${order.customerPhone}</a>
📍 <b>Địa Chỉ Giao:</b> ${order.customerAddress}
💳 <b>Hình Thức:</b> ${paymentText}
${order.notes ? `📝 <b>Ghi Chú:</b> ${order.notes}\n` : ''}
📦 <b>Sản Phẩm Đặt Mua:</b>
${itemsText}

🚚 <b>Phí Vận Chuyển:</b> ${order.shippingFee === 0 ? 'Miễn phí' : order.shippingFee.toLocaleString('vi-VN') + ' đ'}
💵 <b>TỔNG CỘNG:</b> <b>${order.totalAmount.toLocaleString('vi-VN')} đ</b>
⏰ <b>Thời Gian:</b> ${new Date().toLocaleString('vi-VN')}
    `.trim();

    await this.sendMessage(settings.telegramBotToken, settings.telegramChatId, text);
  }
};
