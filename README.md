# BigQuery Release Insights Dashboard

**BigQuery Release Insights Dashboard** คือระบบแดชบอร์ดอัจฉริยะแบบ Single Page Application (SPA) ที่ออกแบบมาเพื่อติดตาม วิเคราะห์สถิติ และแชร์ข้อมูลอัปเดตฟีเจอร์ใหม่ ๆ ของ Google Cloud BigQuery โดยระบบจะทำการดึงข้อมูลผ่าน XML Feed อย่างเป็นทางการของ Google Cloud และจัดหมวดหมู่ข้อมูลมาแสดงผลในรูปแบบหน้าจอ UI ที่มีความล้ำสมัย สวยงาม และใช้งานง่าย

> [!NOTE]
> 🛠️ **พัฒนาโดยใช้ Antigravity CLI:** โปรเจกต์นี้ได้รับการพัฒนาโครงสร้าง สถาปัตยกรรมระบบ โค้ดฝั่ง Backend (Python Flask) ฝั่ง Frontend (HTML/Vanilla CSS/JS) และเอกสารทั้งหมด โดยมี **Antigravity CLI** (ผู้ช่วยเขียนโค้ด AI อัจฉริยะจากทีม Google DeepMind - Advanced Agentic Coding) เป็นคู่หูคู่คิดในการเขียนโปรแกรม (Pair Programmer)

---

## ✨ ความสามารถเด่นของระบบ (Key Features)

* **ระบบดึงข้อมูลอัปเดตสดจาก Google Cloud (XML Parser Engine):** หลังบ้านจะทำการร้องขอไฟล์ XML ล่าสุด ดึงเนื้อหาขึ้นมาล้างลิงก์ให้ปลอดภัย และหั่นซอยส่วนอัปเดตรายวันแยกย่อยเป็นทีละรายการอัปเดต (Sub-updates) ทำให้ค้นหาและกรองข้อมูลได้อย่างตรงจุด
* **การค้นหาและฟิลเตอร์ในระดับเมมโมรี่ (Instant Search & Filter):** ค้นหาคำสำคัญและสแกนข้อความอัปเดตแบบเรียลไทม์ พร้อมตัวกรองหมวดหมู่ข่าวสาร เช่น Features, Announcements, Bug Fixes, Deprecations และ Changes
* **สถิติสดแสดงผลทันที (Live Stats Counter):** แผงรายงานสถิติสดสรุปจำนวนอัปเดตแต่ละประเภทเพื่อให้ผู้ใช้เห็นแนวโน้มการพัฒนาของ BigQuery ได้ทันที
* **ตัวช่วยเตรียมเนื้อหาแชร์สู่ X / Twitter (Smart Composer):**
  - พรีเซ็ตปรับแต่งอารมณ์ของทวีตได้ 3 รูปแบบ: **Professional** (แบบทางการ), **Hype** (แบบตื่นเต้น), และ **Dev Tip** (แบบแนะนำนักพัฒนา)
  - ตัวนับจำนวนอักขระอัจฉริยะ (จำลองระบบย่อลิงก์เหลือ 23 ตัวอักษรของ Twitter จริง)
  - วงแหวนแจ้งเตือน SVG Progress Ring สำหรับแสดงสัดส่วนตัวอักษรที่เหลือพร้อมการเปลี่ยนสีตามความเสี่ยงที่จะพ้นโควตาจำกัด
* **ระบบดีไซน์ระดับพรีเมียม (Glassmorphic Dark Mode):**
  - ใช้ระบบสี HSL ควบคุมผ่าน CSS Variables เพื่อเอฟเฟกต์กระจกโปร่งแสงและความโปร่งใสสวยงาม
  - แอนิเมชันลื่นไหล เอฟเฟกต์ Glow และ Skeleton Loading ระหว่างรอข้อมูลเสร็จสิ้นเพื่อประสบการณ์การใช้งานที่ไร้รอยต่อ

---

## 🛠️ เทคโนโลยีที่เลือกใช้ (Technology Stack)

* **Backend:** Python 3, Flask, `feedparser` (วิเคราะห์ XML), `BeautifulSoup4` (จัดการและล้างความปลอดภัย HTML)
* **Frontend:** HTML5, Vanilla CSS3 (ดีไซน์ระบบ HSL tokens & Glassmorphism), Vanilla JavaScript (จัดการแอปพลิเคชันสเตตและการฟิลเตอร์บนหน่วยความจำของบราวเซอร์)
* **ความปลอดภัยและการจัดโครงสร้าง:** มาตรฐานเปิดลิงก์ภายนอกผ่านแท็บใหม่ด้วย `rel="noopener noreferrer"` และการยึดถือดีไซน์แบบ Responsive สนับสนุนหน้าจอมือถือ ไอแพด และเดสก์ท็อปอย่างสมบูรณ์

---

## 📂 โครงสร้างโฟลเดอร์ของโปรเจกต์ (Project Directory)

```text
bq-releases-notes/
│
├── app.py                     # เซิร์ฟเวอร์หลัก (Flask) และ API สำหรับ Fetch Feed
├── requirements.txt           # ไฟล์รายการโมดูล Python ที่ต้องติดตั้ง
├── implementation_plan.md     # เอกสารสรุปการออกแบบและสถาปัตยกรรมระบบ
├── task.md                    # เอกสารรายละเอียดแผนการติดตั้งใช้งานและตรวจสอบระบบ
├── README.md                  # เอกสารรายละเอียดของโปรเจกต์ (ไฟล์นี้)
│
├── templates/
│   └── index.html             # โครงสร้างหน้า Dashboardหลัก และส่วนของ Composer Modal
│
└── static/
    ├── css/
    │   └── style.css          # ไฟล์ CSS ควบคุมดีไซน์ สี แอนิเมชัน และ Grid ระบบทั้งหมด
    └── js/
        └── main.js            # ไฟล์จัดการ Logic ฝั่งหน้าบ้าน (State, DOM Actions, UI Events)
```

---

## 🚀 เริ่มต้นใช้งานและทดสอบในเครื่องคอมพิวเตอร์ (Getting Started)

สำหรับขั้นตอนแบบละเอียดและแผนการนำขึ้นเซิร์ฟเวอร์จริง กรุณาศึกษาได้จากเอกสาร [task.md](file:///D:/NhanceSolos/Kaggle/agy-cli-projects/bq-releases-notes/task.md)

1. **เตรียมสภาพแวดล้อมและติดตั้งไลบรารี:**
   ```bash
   python -m venv venv
   # บน Windows:
   .\venv\Scripts\Activate.ps1
   # ติดตั้ง Modules:
   pip install -r requirements.txt
   ```

2. **รันเซิร์ฟเวอร์ขึ้นทำงาน:**
   ```bash
   python app.py
   ```
   *เปิดใช้งานเว็บบราวเซอร์ของคุณแล้วไปที่ [http://127.0.0.1:5000](http://127.0.0.1:5000)*
