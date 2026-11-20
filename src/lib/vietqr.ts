// ==========================================
// VIETQR QUICK GENERATION UTILITY
// ==========================================

export interface VietQRParams {
  bankId: string;      // e.g. "MB", "ICB" (Vietinbank), "VCB" (Vietcombank), "TCB"
  accountNo: string;   // e.g. "0392733577"
  accountName: string; // e.g. "VO TAN NHAN"
  amount: number;      // e.g. 250000
  memo: string;        // e.g. "TLK 2026 849201"
}

export function getVietQRUrl(params: VietQRParams): string {
  const { bankId, accountNo, accountName, amount, memo } = params;
  const encodedName = encodeURIComponent(accountName.toUpperCase());
  const encodedMemo = encodeURIComponent(memo);
  return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${Math.round(amount)}&addInfo=${encodedMemo}&accountName=${encodedName}`;
}
