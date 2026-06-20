# แผนการติดตั้งและเตรียมใช้งานระบบ (Setup & Deployment Task List)
## Project: BigQuery Release Insights Dashboard

ไฟล์นี้แสดงขั้นตอนการจัดเตรียมสภาพแวดล้อม การรันระบบในโหมดพัฒนา และแผนการส่งมอบติดตั้งสู่การใช้งานจริง (Deployment) เพื่อให้โปรเจกต์พร้อมใช้อย่างสมบูรณ์

---

## 📋 รายการงานสำหรับการติดตั้งระบบ (Task Checklist)

### 1. การเตรียมสภาพแวดล้อมภายในเครื่อง (Local Environment Setup)
- [ ] **ติดตั้ง Python 3.8+**
  - ตรวจสอบเวอร์ชันในเครื่องโดยใช้คำสั่ง: `python --version`
- [ ] **สร้าง Virtual Environment (แนะนำ)**
  - คำสั่งสำหรับ Windows (PowerShell):
    ```powershell
    python -m venv venv
    .\venv\Scripts\Activate.ps1
    ```
- [ ] **ติดตั้งแพ็กเกจที่จำเป็น**
  - ติดตั้งไลบรารีจากไฟล์ [requirements.txt](file:///D:/NhanceSolos/Kaggle/agy-cli-projects/bq-releases-notes/requirements.txt):
    ```powershell
    pip install -r requirements.txt
    ```

### 2. การรันและทดสอบระบบขั้นต้น (Development & Verification)
- [ ] **รัน Flask Backend Server**
  - เปิดการทำงานโดยเรียกใช้ [app.py](file:///D:/NhanceSolos/Kaggle/agy-cli-projects/bq-releases-notes/app.py):
    ```powershell
    python app.py
    ```
  - เซิร์ฟเวอร์จะเริ่มทำงานบนโลคัลโฮสต์ที่พอร์ต 5000: `http://127.0.0.1:5000`
- [ ] **ทดสอบ API Endpoint สำหรับดึง Feed ข้อมูล**
  - เปิดเว็บบราวเซอร์ไปที่: `http://127.0.0.1:5000/fetch-notes`
  - ตรวจสอบว่าได้ผลลัพธ์เป็นโครงสร้าง JSON ที่สมบูรณ์และถูกต้อง
- [ ] **ทดสอบฟังก์ชันการทำงานส่วนหน้าบ้าน (Frontend Features)**
  - ทดสอบการดึงข้อมูลอัตโนมัติเมื่อเปิดหน้าแรก
  - ทดสอบช่องค้นหาอัปเดต (Fuzzy Search)
  - ทดสอบปุ่มตัวกรองประเภทการอัปเดต (Features, Announcements, Fixes ฯลฯ)
  - ทดสอบการกดปุ่ม "Tweet Update" เพื่อเปิด Composer Modal และทดสอบปุ่ม "Copy Details"

---

## 🚀 แผนการติดตั้งใช้งานจริง (Production Deployment Plan)

สำหรับการนำขึ้นระบบจริงในโปรดักชัน เนื่องจาก Flask Web Server ในเครื่องมือ debug ไม่ได้ออกแบบมารองรับทราฟฟิกจริง ขอเสนอ 3 แนวทางเลือกในการติดตั้งดังนี้:

### ทางเลือกที่ 1: การรันในรูปแบบ WSGI Server (ในเครื่องหรือ VM)
การรันหลังบ้านด้วยเซิร์ฟเวอร์แบบพร้อมรบ เช่น **Waitress** (สำหรับ Windows) หรือ **Gunicorn** (สำหรับ Linux)
* **การติดตั้ง (เช่น Windows ด้วย Waitress):**
  1. เพิ่มแพ็กเกจ: `pip install waitress`
  2. รันแอปพลิเคชันด้วยคำสั่ง:
     ```powershell
     waitress-serve --port=5000 app:app
     ```

### ทางเลือกที่ 2: การใช้ระบบ Docker Containers (Dockerization)
สร้าง Docker Image เพื่อนำไปรันบนระบบใด ๆ ที่รองรับ Docker หรือ Cloud Services
* **ไฟล์ Dockerfile ตัวอย่าง:**
  ```dockerfile
  FROM python:3.9-slim
  WORKDIR /app
  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt
  COPY . .
  EXPOSE 5000
  CMD ["python", "app.py"]
  ```

### ทางเลือกที่ 3: ติดตั้งบนระบบคลาวด์ Google Cloud (Cloud Run)
เนื่องจากโปรเจกต์นี้ทำงานกับ BigQuery Release Notes การใช้ **Google Cloud Run** จึงเหมาะสมที่สุด (แบบไร้เซิร์ฟเวอร์และประหยัดงบประมวลผลสูง)
* **ขั้นตอนย่อ:**
  1. ใช้ Docker build และอัปโหลดไปยัง Artifact Registry
  2. สั่ง Deploy เข้าสู่ Cloud Run โดยใช้คำสั่ง:
     ```powershell
     gcloud run deploy bq-insights-dashboard --source . --port 5000 --allow-unauthenticated
     ```

---

## 🛠️ แผนการตรวจสอบความเสถียร (Monitoring & Quality Checks)
- [ ] **ตรวจสอบการเชื่อมต่ออินเทอร์เน็ตเพื่อดึงข้อมูลภายนอก**
  - ตรวจสอบว่าเครื่องแม่ข่าย (Server) มีสิทธิ์ในการส่งคำขอ HTTP ขาออกไปหาเว็บของ Google Cloud สำหรับดึงข้อมูล Feed (พอร์ต 80 และ 443)
- [ ] **การแคชข้อมูล (Caching Strategy - แนะนำสำหรับอนาคต)**
  - หากระบบมีการเข้าใช้งานบ่อย ควรพิจารณาบันทึกข้อมูล XML ที่ดึงมาล่าสุดเก็บไว้ในหน่วยความจำชั่วคราว (เช่น Redis หรือตัวแปรโกลบอลที่มีอายุ 15-30 นาที) เพื่อไม่ให้ระบบส่งการค้นหาไปขอนอกเครือข่ายบ่อยเกินจำเป็น ซึ่งจะส่งผลให้หน้าเว็บโหลดรวดเร็วยิ่งขึ้น
