
Please build a web application for me using Python Flask and plain vanilla HTML, JavaScript and CSS that fetches the BigQuery Release notes from (https://docs.cloud.google.com/feeds/bigquery-release-notes.xml) and shows them to me. 

A simple refresh button with a spinner is good enough, anytime I'd like to refresh the details. 

I would also like the ability to take any specific update, select it and then Tweet about it.

---

ฉันอยากทราบรายละเอียดเกี่ยวกับโปรเจ็กต์นี้ ช่วยฉันทำความเข้าใจฟีเจอร์หลักๆ แล้วแยกออกเป็นฝั่งเซิร์ฟเวอร์และฝั่งไคลเอ็นต์ สร้างโฟลว์ตัวอย่างและแสดงให้ฉันดูว่าคำขอและการตอบกลับทำงานอย่างไร โปรดทราบว่าระบบจะสร้างไฟล์ใหม่ (อาร์ติแฟกต์) และคุณจะดูอาร์ติแฟกต์ทั้งหมดหรืออาร์ติแฟกต์ที่เฉพาะเจาะจงได้ผ่าน**คำสั่ง /artifact**

---

อธิบาย @app.py

---

สร้างไฟล์ README สำหรับโปรเจ็กต์นี้

---

โปรดใช้ฟีเจอร์ยูทิลิตี 2 อย่างที่เรียบง่าย ได้แก่ ปุ่ม "คัดลอกไปยังคลิปบอร์ด" ในการ์ดแต่ละใบ และปุ่ม "ส่งออกเป็น CSV"

Please implement two simple utility features: a "Copy to Clipboard" button on each card and an "Export to CSV" button.

---

โปรดใช้สวิตช์เปิด/ปิดอย่างง่ายในส่วนหัวเพื่อสลับรูปแบบสีของหน้าจากโหมดมืดเป็นโหมดสว่างโดยการลบล้างตัวแปรรูท CSS

Please implement a simple toggle switch in the header that swaps the page's color scheme from dark to light mode by overriding the CSS root variables.

---

เราอยากให้คุณประเมินแอปพลิเคชันจากมุมมองประสบการณ์ของผู้ใช้ ใช้งานง่าย ตอบสนองได้ดี มีข้อความที่เป็นประโยชน์ และอื่นๆ โปรดคิดรายการการปรับปรุงและส่งรายการดังกล่าวให้ฉัน

I would like you to assess the application from a user experience point of view. Ease of use, responsiveness, helpful messages and more. Please come up with a list of improvements and I would like you to provide them as a list to me.

---

## ✨ การจัดระเบียบไฟล์/โฟลเดอร์ - Organizing Files/Folders

Create the following folders "Images","Documents","Videos"

---

Go through all the files in this folder and then organize them by moving all the files ending with .jpg, .jpeg, .gif into the "Images" folder. Move all ".txt" files into the "Documents" folder. Move all the ".mp4" files in the "Videos" folder.

---

Summarization: For each document in the ‘Documents' folder, create a txt file in the same folder named ‘summary_ORIGINAL_FILENAME.txt' that contains a 3-sentence summary of the document's main points.

การสรุป: สำหรับเอกสารแต่ละฉบับในโฟลเดอร์ "เอกสาร" ให้สร้างไฟล์ txt ในโฟลเดอร์เดียวกันชื่อ "summary_ORIGINAL_FILENAME.txt" ซึ่งมีสรุป 3 ประโยคของประเด็นหลักในเอกสาร

Categorizing by Type: Scan all PDF and DOCX files in this directory. Move all files with "invoice" in their name or content into the ‘Financial/Invoices' folder. Move files with "receipt" into ‘Financial/Receipts'. Any other .docx files go into ‘Reports'.

จัดหมวดหมู่ตามประเภท: สแกนไฟล์ PDF และ DOCX ทั้งหมดในไดเรกทอรีนี้ ย้ายไฟล์ทั้งหมดที่มีคำว่า "ใบแจ้งหนี้" ในชื่อหรือเนื้อหาไปยังโฟลเดอร์ "การเงิน/ใบแจ้งหนี้" ย้ายไฟล์ที่มีคำว่า "ใบเสร็จ" ไปยังโฟลเดอร์ "การเงิน/ใบเสร็จ" ส่วนไฟล์ .docx อื่นๆ จะอยู่ในโฟลเดอร์ "รายงาน"

Extracting Key Information (and "tagging"): For each PDF file in the ‘Financial/Invoices' folder, read its content. If you find a date, rename the file to include that date in YYYY-MM-DD format, e.g., ‘invoice_2025-07-26_original_name.pdf'.

การแยกข้อมูลสำคัญ (และการ "ติดแท็ก"): อ่านเนื้อหาของไฟล์ PDF แต่ละไฟล์ในโฟลเดอร์ "การเงิน/ใบแจ้งหนี้" หากพบวันที่ ให้เปลี่ยนชื่อไฟล์ให้มีวันที่ดังกล่าวในรูปแบบ YYYY-MM-DD เช่น "invoice_2025-07-26_original_name.pdf"

---

## ✨ สรุปบทความ (ไฟล์ในเครื่องหรือเว็บ) - Summarizing Articles (Local Files or Web)

Summarize a web article (single URL): Go to https://medium.com/google-cloud/antigravity-cli-tutorial-series-12b46cfe3bf2 and summarize the top 3 key takeaways from this news article.

สรุปบทความบนเว็บ (URL เดียว): ไปที่ https://medium.com/google-cloud/antigravity-cli-tutorial-series-12b46cfe3bf2 แล้วสรุปประเด็นสำคัญ 3 อันดับแรกจากบทความข่าวนี้

Summarize multiple web articles (e.g., from a search): Find the latest news articles about "Antigravity CLI" using Google Search. For the top 5 relevant articles, summarize each in 2-3 sentences and list their URLs.

สรุปบทความบนเว็บหลายบทความ (เช่น จากการค้นหา): ค้นหาบทความข่าวล่าสุดเกี่ยวกับ "Antigravity CLI" โดยใช้ Google Search สำหรับบทความที่เกี่ยวข้อง 5 อันดับแรก ให้สรุปแต่ละบทความใน 2-3 ประโยคและแสดง URL ของบทความ

Summarize a local text file: Summarize the main points of the article in ‘my_research_paper.txt'. Focus on the methodology and conclusions.

สรุปไฟล์ข้อความในเครื่อง: สรุปประเด็นหลักของบทความใน "my_research_paper.txt" มุ่งเน้นที่ระเบียบวิธีวิจัยและข้อสรุป

Summarize a local PDF: Read ‘financial_report_Q2_2025.pdf'. Provide a summary of the financial performance and key challenges mentioned.

สรุป PDF ในเครื่อง: อ่าน "financial_report_Q2_2025.pdf" ระบุข้อมูลสรุปเกี่ยวกับผลประกอบการทางการเงินและความท้าทายที่สำคัญที่กล่าวถึง

---

## ✨ การดึงข้อมูลที่เฉพาะเจาะจง (ไฟล์ในเครื่องหรือเว็บ) - Extracting Specific Information (Local Files or Web)

Extract entities from a local article: From ‘biography.txt', list all named individuals and the significant dates associated with them.

ดึงข้อมูลเอนทิตีจากบทความในเครื่อง: จาก "biography.txt" ให้แสดงรายชื่อบุคคลที่มีชื่อทั้งหมดและวันที่สำคัญที่เกี่ยวข้อง

Extract data from a table in a PDF: In ‘quarterly_sales.pdf', extract the data from the table on page 3 that shows "Product Sales by Region" and present it in a Markdown table format.

ดึงข้อมูลจากตารางใน PDF: ใน "quarterly_sales.pdf" ให้ดึงข้อมูลจากตารางในหน้า 3 ที่แสดง "ยอดขายผลิตภัณฑ์ตามภูมิภาค" และนำเสนอในรูปแบบตาราง Markdown

Extract news headlines and sources from a news website: Go to ‘https://news.google.com/' (or a similar news site). Extract the main headlines from the front page and their corresponding news sources. Present them as a bulleted list.

ดึงพาดหัวข่าวและแหล่งที่มาจากเว็บไซต์ข่าว: ไปที่ ‘https://news.google.com/' (หรือเว็บไซต์ข่าวที่คล้ายกัน) 
ดึงหัวข้อข่าวหลักจากหน้าแรกและแหล่งข่าวที่เกี่ยวข้อง นำเสนอเป็นรายการสัญลักษณ์หัวข้อย่อย

Find product specifications from an e-commerce page: Browse to ‘https://www.amazon.in/Google-Cloud-Certified-Associate-Engineer/dp/1119871441' (example for a book). Extract the book title, author and other details. Present this in a structured JSON format.

ค้นหาข้อมูลจำเพาะของผลิตภัณฑ์จากหน้าอีคอมเมิร์ซ: ไปที่ "https://www.amazon.in/Google-Cloud-Certified-Associate-Engineer/dp/1119871441" (ตัวอย่างสำหรับหนังสือ) ดึงข้อมูลชื่อหนังสือ ผู้เขียน และรายละเอียดอื่นๆ แสดงข้อมูลนี้ในรูปแบบ JSON ที่มีโครงสร้าง

Extract duration from a video, in a certain format (eg "2h37m42s").

ดึงข้อมูลระยะเวลาจากวิดีโอในรูปแบบที่กำหนด (เช่น "2h37m42s")

---

## ✨ ตอบคำถามโดยอิงตามเนื้อหา (ลักษณะการทำงานคล้าย RAG) - Answering Questions based on Content (RAG-like behavior)

Q&A on a local document: I'm attaching ‘user_manual.pdf'. What are the steps to troubleshoot network connectivity issues?

ถามและตอบเกี่ยวกับเอกสารในเครื่อง: ฉันจะแนบไฟล์ "user_manual.pdf" ขั้นตอนในการแก้ปัญหาการเชื่อมต่อเครือข่ายมีอะไรบ้าง

Q&A on a web page: Using the content from ‘https://www.who.int/news-room/fact-sheets/detail/climate-change-and-health', what are the primary health risks associated with climate change according to WHO?

ถามและตอบในหน้าเว็บ: จากเนื้อหาใน"https://www.who.int/news-room/fact-sheets/detail/climate-change-and-health" ความเสี่ยงด้านสุขภาพหลักที่เกี่ยวข้องกับการเปลี่ยนแปลงสภาพภูมิอากาศตามข้อมูลของ WHO คืออะไร

Compare information across multiple sources: I have two news articles: ‘article1.txt' and ‘article2.txt', both discussing the recent economic policy changes. Compare and contrast their views on the potential impact on small businesses.

เปรียบเทียบข้อมูลจากแหล่งที่มาหลายแห่ง: ฉันมีบทความข่าว 2 บทความคือ "article1.txt" และ "article2.txt" ซึ่งทั้ง 2 บทความพูดถึงการเปลี่ยนแปลงนโยบายเศรษฐกิจล่าสุด เปรียบเทียบและเปรียบต่างมุมมองของพวกเขาเกี่ยวกับผลกระทบที่อาจเกิดขึ้นกับธุรกิจขนาดเล็ก

---

## ✨ การสร้างเนื้อหาตามข้อมูลที่ดึงออกมา - Content Generation based on Extracted Information

Generate a news brief from an article: Read @tech_innovation_article.txt. Write a short, engaging news brief (around 150 words) suitable for a company newsletter, highlighting the new technology and its potential.

สร้างสรุปข่าวจากบทความ: อ่าน @tech_innovation_article.txt เขียนสรุปข่าวสั้นๆ ที่น่าสนใจ (ประมาณ 150 คำ) ซึ่งเหมาะสำหรับจดหมายข่าวของบริษัท โดยเน้นเทคโนโลยีใหม่และศักยภาพของเทคโนโลยีดังกล่าว

Draft an email summarizing a meeting transcript: Here is a meeting transcript file: @meeting_transcript.txt. Draft an email to the team summarizing the key decisions made and action items assigned, including who is responsible for each.

ร่างอีเมลสรุปข้อความถอดเสียงจากการประชุม: นี่คือไฟล์ข้อความถอดเสียงจากการประชุม: @meeting_transcript.txt ร่างอีเมลถึงทีมเพื่อสรุปการตัดสินใจที่สำคัญและรายการการทำงานที่มอบหมาย รวมถึงผู้รับผิดชอบแต่ละรายการ

---

## ✨ การรองรับมัลติโมดัลของ Antigravity CLI - Antigravity CLI multi-modal support

สร้างโฟลเดอร์ในเครื่องและดาวน์โหลดใบแจ้งหนี้จากที่เก็บ GitHub ต่อไปนี้
https://github.com/rominirani/gemini-cli-codelab-projects/tree/main/invoice-processing
เปิดใช้ Antigravity CLI จากโฟลเดอร์นั้น และ ป้อนพรอมต์ต่อไปนี้เพื่อดึงข้อมูลจากใบแจ้งหนี้ในรูปแบบตาราง

The current folder contains a list of invoice files in Image format. Go through all the files in this folder and extract the following invoice information in the form of a table: Invoice No, Invoice Date, Invoice Sent By, Due Date, Due Amount.

list all files with .png extension in this folder. Extract the invoice information from it by reading them locally and display it in a table format containing the following column headers: : Invoice No, Invoice Date, Invoice Sent By, Due Date, Due Amount. Add a column at the end of the table that shows a red cross emoji in case the due date is in the past.

---

## ✨ การใช้ Antigravity CLI เพื่อสร้างข้อมูล

สร้างข้อมูล JSON ของรีวิวจากลูกค้าตัวอย่าง

Generate a JSON array of 3 synthetic customer reviews for a new smartphone. Each review should have 'reviewId' (string, UUID-like), 'productId' (string, e.g., 'SMARTPHONE_X'), 'rating' (integer, 1-5), 'reviewText' (string, 20-50 words), and 'reviewDate' (string, YYYY-MM-DD format).

การสร้างการตอบกลับ API แบบจำลอง (JSON)

Generate a JSON array representing 7 daily sales records for a mock API endpoint. Each record should include 'date' (YYYY-MM-DD, chronologically increasing), 'revenue' (float, between 5000.00 and 20000.00), 'unitsSold' (integer, between 100 and 500), and 'region' (string, either 'North', 'South', 'East', 'West').

การสร้างคำสั่งแทรกฐานข้อมูลตัวอย่าง (SQL)

Generate 5 SQL INSERT statements for a table named 'users' with columns: 'id' (INTEGER, primary key), 'username' (VARCHAR(50), unique), 'email' (VARCHAR(100)), 'password_hash' (VARCHAR(255)), 'created_at' (DATETIME, current timestamp). Ensure the password_hash is a placeholder string like 'hashed_password_X'.

สร้างไฟล์การกำหนดค่า (YAML)

Generate a sample YAML configuration for a 'user_service'. Include sections for 'database' with 'host', 'port', 'username', 'password', 'database_name'. Also include a 'api_keys' section with 'payment_gateway' and 'email_service' placeholders. Use realistic default values.

การสร้างข้อมูลทดสอบสำหรับกรณีขอบ/การตรวจสอบ

Generate a JSON array of 8 email addresses for testing purposes. Include a mix of: 2 valid standard emails, 2 with missing '@', 2 with invalid domains (e.g., '.com1'), and 2 with special characters in the local part that are usually invalid (e.g., spaces or multiple dots).

