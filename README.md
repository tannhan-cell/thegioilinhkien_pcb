# THẾ GIỚI LINH KIỆN & PCB
> Hệ sinh thái phân phối linh kiện điện tử chính hãng và Báo giá gia công mạch in PCB / PCBA 3D trực tuyến chuẩn công nghiệp.

Dự án được xây dựng hoàn thiện tại thư mục: **`D:\thegioilinhkien-pcb`**  
Sẵn sàng 100% để bạn deploy lên **Vercel** chỉ trong 1 cú click!

---

## 🌟 TÍNH NĂNG NỔI BẬT

### 1. Phân Hệ Đặt Gia Công PCB & PCB Assembly (Tương tự `https://orderpcb.lovable.app/`)
* **Trình mô phỏng 3D PCB tương tác (Three.js WebGL):**
  - Xoay 360°, zoom, pan trực quan.
  - Phím tắt góc nhìn: Mặt trên (TOP), Mặt dưới (BOT), Góc nghiêng 3D (ISO), Tự xoay tự động (Auto-rotate).
  - Chế độ khung dây (Wireframe).
  - **Thanh trượt Tách lớp 3D (Explode Slider):** Tách rời các lớp bo mạch để quan sát chi tiết.
  - **Đổi màu lớp phủ hàn (Solder Mask):** Xanh lá, Xanh dương, Đỏ, Đen, Trắng, Vàng, Tím, Không phủ -> Cập nhật trực tiếp lên bề mặt 3D theo thời gian thực!
  - **Đổi lớp mạ hoàn thiện (Surface Finish):** Mạ Thiếc (HASL), Mạ Vàng (ENIG), Mạ OSP, Mạ Thiếc không chì -> Thay đổi phản xạ kim loại thực tế!
  - **Đổi độ dày bo (Thickness) & Kích thước (Dài x Rộng mm):** Mô hình 3D co giãn đúng tỷ lệ kích thước thực!
* **Soi file Gerber .ZIP trực tiếp trên trình duyệt:**
  - Kéo thả file Gerber .ZIP, hệ thống tự động phân tích các lớp: `Top Copper (GTL)`, `Bottom Copper (GBL)`, `Solder Mask (GTS/GBS)`, `Drill (NC Drill DRL)`.
  - Hiển thị badge: **"ĐÃ NHẬN DIỆN CÁC LỚP GERBER - Hợp Lệ Cho Sản Xuất"**.
* **Cấu hình đa bo mạch (Multi-Tab Specifications):**
  - Hỗ trợ tạo `Thông số 1`, `Thông số 2`, ... tối đa 10 bo mạch trong 1 lần gửi yêu cầu.
  - Chuyển đổi linh hoạt giữa: **Gia Công Mạch In (PCB)** và **Hàn Lắp Linh Kiện (PCBA)**.
  - Đầy đủ thông số: Vật liệu (FR-4, Alu, CEM-1, FPC), số lớp (1-6 lớp), độ dày đồng (0.5oz - 2.0oz), Min Trace/Space, Min Drill, BGA Pitch, Mặt nạ Stencil (Không khung / Có khung), Impedance Control, Mạ nửa lỗ.
* **Thuật toán tính giá ước tính tức thì:**
  - Tự động tính toán chi phí tham khảo chuẩn xác theo diện tích bo, số lớp, số lượng và công nghệ mạ.
* **Gửi yêu cầu báo giá an toàn:**
  - Tự động ghi nhớ thông tin liên hệ của khách trên trình duyệt để tự điền cho lần sau.
  - Tạo mã đơn chuẩn nhận dạng cao (VD: `PCB-2026-XXXXXXX`).
  - Modal thông báo thành công với nút Sao chép mã đơn và nút mở Tra cứu tiến độ.

### 2. Tra Cứu Tiến Độ Đơn Hàng Thời Gian Thực (Order Lookup)
* Tra cứu nhanh bằng **Số Điện Thoại** hoặc **Mã Đơn Hàng**.
* Tra cứu đồng thời cả **Đơn Gia Công PCB** và **Đơn Mua Linh Kiện**.
* **Tiến độ 5 bước trực quan:** `1. Nhận đơn` ➔ `2. Báo giá` ➔ `3. Khách chốt` ➔ `4. Sản xuất` ➔ `5. Giao hàng` ➔ `6. Hoàn tất`.
* Hiển thị giá báo chính thức và phản hồi kỹ thuật từ Admin.

### 3. Phân Hệ Thương Mại Điện Tử Bán Linh Kiện
* Danh mục linh kiện phong phú: Vi điều khiển (STM32, ESP32, Arduino), Cảm biến (DHT22, MPU6050), Nguồn hạ áp LM2596, Cuộn điện trở SMD 0805, Jack USB Type-C, Relay Opto...
* Bộ lọc tìm kiếm thông minh: Tìm kiếm theo tên / SKU / thương hiệu, lọc theo danh mục, lọc còn hàng, sắp xếp theo giá.
* Trang chi tiết sản phẩm: Gallery ảnh, thuộc tính kỹ thuật chi tiết, link tải Datasheet PDF, tồn kho, chọn số lượng.
* Giỏ hàng nhanh (Cart Drawer) & Trang giỏ hàng đầy đủ với thanh tiến trình Miễn phí vận chuyển.
* **Thanh toán chuyên nghiệp:**
  - Hỗ trợ cả khách vãng lai (Guest) và khách đã đăng ký.
  - Hình thức thanh toán: **COD (Thu tiền tận nơi)** hoặc **Chuyển khoản VietQR**.
  - **Tích hợp VietQR Napas 24/7:** Tạo mã QR động tự động điền STK, tên chủ tài khoản, số tiền và nội dung chuyển khoản mã đơn.

### 4. Cổng Quản Trị Admin (`/admin`)
* **Dashboard:** Biểu đồ doanh thu, số đơn hàng, yêu cầu chờ báo giá, cảnh báo tồn kho thấp.
* **Quản Lý Yêu Cầu PCB (`/admin/pcb-requests`):** Xem chi tiết thông số bo, danh sách file Gerber, nhập giá báo chính thức, ghi chú kỹ thuật, chuyển trạng thái đơn.
* **Quản Lý Đơn Hàng Linh Kiện (`/admin/orders`):** Cập nhật trạng thái thanh toán (pending / paid), trạng thái đóng gói và giao hàng.
* **Quản Lý Sản Phẩm (`/admin/products`):** Thêm linh kiện mới, sửa thông số, điều chỉnh giá bán và số lượng tồn kho.
* **Cài Đặt Cửa Hàng & VietQR (`/admin/settings`):** Thay đổi Hotline, Zalo, Facebook, thông tin tài khoản ngân hàng (MBBank, STK, Chủ tài khoản), phí vận chuyển và banner thông báo.

---

## 🚀 HƯỚNG DẪN TRIỂN KHAI LÊN VERCEL (CHỈ MẤT 1 PHÚT)

Dự án đã được cấu hình file `vercel.json` chuẩn Single Page Application (SPA), đảm bảo khi tải lại trang (F5) không bao giờ bị lỗi 404!

### Cách 1: Deploy qua GitHub (Khuyên dùng - Cực kỳ tiện lợi)
1. Mở cửa sổ dòng lệnh tại `D:\thegioilinhkien-pcb`:
   ```bash
   cd /d D:\thegioilinhkien-pcb
   git add .
   git commit -m "Initial commit Thế Giới Linh Kiện & PCB"
   ```
2. Tạo 1 repository mới trên GitHub (ví dụ: `thegioilinhkien-pcb`).
3. Đẩy code lên GitHub:
   ```bash
   git remote add origin https://github.com/<tai-khoan-cua-ban>/thegioilinhkien-pcb.git
   git branch -M main
   git push -u origin main
   ```
4. Đăng nhập [vercel.com](https://vercel.com), bấm **"Add New Project"** ➔ Chọn repo vừa tạo ➔ Bấm **"Deploy"**.  
   *Vercel sẽ tự động build và cung cấp cho bạn tên miền miễn phí dạng `*.vercel.app`!*

### Cách 2: Deploy trực tiếp bằng Vercel CLI
1. Cài đặt Vercel CLI (nếu chưa có):
   ```bash
   npm i -g vercel
   ```
2. Đứng tại thư mục `D:\thegioilinhkien-pcb` và gõ:
   ```bash
   vercel
   ```
3. Nhấn `Enter` theo các gợi ý mặc định là website được public ngay lập tức!

---

## 🗄️ KẾT NỐI SUPABASE (TÙY CHỌN)

Website **đã tích hợp sẵn cơ chế Auto-Fallback**: Ngay cả khi bạn chưa gắn Supabase, website vẫn hoạt động 100% đầy đủ chức năng lưu đơn, đặt PCB, tra cứu và admin.

Khi bạn muốn kết nối Supabase Cloud thực tế:
1. Tạo một dự án mới tại [supabase.com](https://supabase.com).
2. Vào mục **SQL Editor** trong Supabase, mở file `supabase/migrations/20261120_init_schema.sql` trong thư mục dự án và bấm **Run** để khởi tạo toàn bộ bảng, RLS và dữ liệu mẫu.
3. Vào mục **Project Settings ➔ API**, sao chép `Project URL` và `anon key`.
4. Thêm 2 biến này vào file `.env` trên máy hoặc phần **Environment Variables** trên Vercel:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

---

## 💻 CHẠY THỬ NGHIỆM TẠI MÁY LOCAL

```bash
cd /d D:\thegioilinhkien-pcb
npm run dev
```
Trình duyệt sẽ mở tại địa chỉ: `http://localhost:3000`
"# thegioilinhkien_pcb" 
