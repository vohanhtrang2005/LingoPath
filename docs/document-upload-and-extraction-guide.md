# GAKUDO - Huong Dan Upload Tai Lieu Va Trich Xuat Noi Dung

Tai lieu nay giai thich that cham luong upload file cho GAKUDO.

Muc tieu cua file nay khong phai la lam RAG ngay. Muc tieu la hieu dung buoc dau tien:

```text
Admin dua tai lieu vao he thong
-> he thong luu file
-> he thong biet file do thuoc sach nao, ngon ngu nao, level nao
-> he thong trich xuat text
-> text sau nay moi duoc dua sang chunking, embedding, AI, RAG
```

Neu khong lam chac buoc upload va extract text, cac buoc AI/RAG ve sau se rat roi.

---

## 1. Tong Quan Luong Upload

Luong dung nen la:

```text
Admin chon language + level
-> tao/chon Book
-> upload file cua Book
-> luu metadata file vao database
-> luu file vao storage
-> detect file type
-> extract text theo dung kieu file
-> luu ket qua text da extract
-> chuyen sang buoc chunking sau
```

Giai thich ngan gon:

```text
Book = quyen sach / nguon hoc
BookDocument = file cu the admin upload
ExtractedText = noi dung text lay ra tu file
```

Vi du:

```text
Book:
- name = Shin Kanzen Master N3 Goi
- language = JAPANESE
- levelSystem = JLPT
- levelCode = N3

BookDocument:
- file = shin-kanzen-n3-goi.pdf
- bookId = id cua Book phia tren
- status = UPLOADED
```

---

## 2. Tai Sao Phai Tach Book Va File?

Mot quyen sach co the co nhieu file.

Vi du:

```text
Book: Sou Matome N3 Listening

File 1: textbook.pdf
File 2: audio-track-01.mp3
File 3: audio-track-02.mp3
File 4: answer-key.pdf
```

Neu chi co bang `Book`, he thong khong quan ly duoc tung file.

Vi vay can them entity rieng:

```text
BookDocument
```

Muc dich cua `BookDocument`:

```text
Luu thong tin tung file da upload:
- file ten gi
- nam o dau
- thuoc book nao
- content type la gi
- da xu ly chua
- extract text thanh cong hay loi
```

---

## 3. Cac Trang Thai Cua File

Moi file upload nen co `status`.

De xuat:

```text
UPLOADED
EXTRACTING
EXTRACTED
FAILED
```

Giai thich:

```text
UPLOADED
```

File vua upload xong, chua xu ly.

```text
EXTRACTING
```

He thong dang trich xuat text.

```text
EXTRACTED
```

Da trich xuat text thanh cong.

```text
FAILED
```

Xu ly loi, vi du file hong, file khong doc duoc, OCR fail.

---

## 4. Buoc 1 - Admin Tao Hoac Chon Book

Muc dich:

```text
Gan tai lieu vao dung ngon ngu va dung trinh do.
```

Vi du admin muon dua sach N3 vao:

```text
language = JAPANESE
levelSystem = JLPT
levelCode = N3
```

Vi du admin muon dua sach B1 vao:

```text
language = ENGLISH
levelSystem = CEFR
levelCode = B1
```

API nen co:

```http
POST /api/content/books
GET /api/content/books?language=JAPANESE&levelSystem=JLPT&levelCode=N3
```

Ket qua cua buoc nay:

```text
He thong co mot Book trong database.
```

Sau do moi upload file vao Book do.

---

## 5. Buoc 2 - Admin Upload File Vao Book

Muc dich:

```text
Luu file goc vao he thong va tao ban ghi metadata.
```

API de xuat:

```http
POST /api/content/books/{bookId}/documents
```

Request dang multipart:

```text
file = textbook.pdf
```

Khi nhan file, he thong lam 2 viec:

```text
1. Luu file that vao storage
2. Luu metadata vao database
```

Metadata nen co:

```text
id
bookId
originalFileName
storedFileName
contentType
fileSize
storagePath
status
createdAt
updatedAt
```

Vi du:

```text
originalFileName = shin-kanzen-n3-reading.pdf
storedFileName = 8f3a...pdf
contentType = application/pdf
fileSize = 43120000
storagePath = uploads/books/{bookId}/8f3a...pdf
status = UPLOADED
```

Tai sao khong dung ten file goc de luu?

Vi ten file goc co the trung nhau:

```text
textbook.pdf
textbook.pdf
textbook.pdf
```

Nen file luu that nen co ten unique, vi du UUID.

---

## 6. Buoc 3 - Detect File Type

Muc dich:

```text
Biet file nay nen trich xuat bang cach nao.
```

Khong nen nhin moi duoi file:

```text
.pdf
.jpg
.png
.docx
```

Vi duoi file co the bi dat sai.

Nen dung:

```text
contentType
```

Va neu can chac hon thi dung thu vien detect file type.

Phan loai don gian:

```text
application/pdf -> PDF
image/png, image/jpeg -> IMAGE
text/plain -> TEXT
application/vnd.openxmlformats-officedocument.wordprocessingml.document -> DOCX
text/html -> HTML
audio/mpeg -> AUDIO
```

Trong buoc dau, GAKUDO nen lam truoc:

```text
PDF
TEXT
IMAGE
```

Sau do moi mo rong:

```text
DOCX
HTML
AUDIO
```

---

## 7. Nhanh A - Neu File La PDF

PDF co 2 loai lon:

```text
1. PDF co text that
2. PDF scan/anh
```

Day la diem rat quan trong.

---

## 8. PDF Co Text That

PDF co text that la PDF ma user co the boi den/copy chu.

Vi du:

```text
Sach duoc export tu Word, InDesign, LaTeX
```

Voi loai nay, khong can OCR.

Thu vien nen dung trong Java:

```text
Apache PDFBox
```

Luong xu ly:

```text
PDF
-> PDFBox doc tung page
-> lay text cua tung page
-> luu text da extract
```

Muc dich:

```text
Lay chu truc tiep tu file, nhanh hon va chinh xac hon OCR.
```

Vi du ket qua:

```text
pageNumber = 12
text = "予約とは、前もって約束することです..."
```

Nen luu theo page:

```text
ExtractedPageText
- documentId
- pageNumber
- text
- extractionMethod = PDF_TEXT
```

Tai sao luu theo page?

Vi sau nay can truy vet:

```text
KnowledgeItem nay lay tu trang nao?
Bai tap nay lay tu trang nao?
AI giai thich co bang chung nao?
```

---

## 9. PDF Scan Hoac PDF Anh

PDF scan la PDF ma moi trang thuc chat la anh.

Dau hieu:

```text
Mo PDF len nhung khong copy duoc chu.
PDFBox extract ra rong hoac rat it text.
```

Voi loai nay, PDFBox khong du.

Luong xu ly:

```text
PDF
-> render tung page thanh image
-> dua image qua OCR
-> lay text
-> luu text da OCR
```

OCR la gi?

```text
OCR = Optical Character Recognition
```

No co nghia la:

```text
nhin anh co chu
-> nhan dien thanh text
```

Cong cu co the dung:

```text
Tesseract OCR
Google Vision OCR
Azure OCR
AWS Textract
```

Voi tieng Nhat, OCR kho hon tieng Anh vi co:

```text
Kanji
Hiragana
Katakana
furigana
layout nhieu cot
bang bieu
```

Nen pipeline dung nen la:

```text
Thu PDFBox truoc
Neu text lay ra qua it
-> fallback OCR
```

Khong nen OCR tat ca PDF ngay tu dau, vi OCR:

```text
cham hon
ton chi phi hon
co the sai chu hon
```

---

## 10. Cach Quyet Dinh PDF Can OCR Hay Khong

Sau khi dung PDFBox lay text, he thong tinh:

```text
so ky tu lay duoc tren moi page
```

Vi du:

```text
page 1: 2500 ky tu
page 2: 2100 ky tu
page 3: 0 ky tu
```

Neu hau het page co text du:

```text
extractionMethod = PDF_TEXT
```

Neu hau het page rong:

```text
extractionMethod = OCR
```

Nguong don gian ban dau:

```text
Neu trung binh moi page < 50 ky tu
-> coi la PDF scan
-> can OCR
```

Day chi la nguong ban dau. Sau nay co the dieu chinh.

---

## 11. Nhanh B - Neu File Khong Phai PDF

Khong phai PDF thi xu ly theo tung loai.

Ban dau nen chia:

```text
TEXT
IMAGE
DOCX
HTML
AUDIO
```

---

## 12. File Text

Vi du:

```text
.txt
.md
.csv
```

Luong xu ly:

```text
TEXT file
-> doc noi dung truc tiep
-> luu text
```

Khong can OCR.

Muc dich:

```text
Lay text nhanh nhat, don gian nhat.
```

Can chu y encoding:

```text
UTF-8
Shift-JIS
EUC-JP
```

Tieng Nhat doi khi gap file cu dung Shift-JIS. Ban dau co the uu tien UTF-8, sau nay them detect encoding.

---

## 13. File Image

Vi du:

```text
.jpg
.jpeg
.png
```

Anh khong co text that de copy.

Luong xu ly:

```text
IMAGE
-> OCR
-> text
-> luu text
```

Muc dich:

```text
Bien anh trang sach thanh text.
```

Voi anh trang sach, nen luu:

```text
pageNumber = 1
extractionMethod = OCR_IMAGE
```

Neu upload nhieu anh cho mot book:

```text
page-001.png
page-002.png
page-003.png
```

Can co `orderIndex` hoac `pageNumber` de giu dung thu tu sach.

---

## 14. File DOCX

Vi du:

```text
.docx
```

Luong xu ly:

```text
DOCX
-> Apache POI
-> text
-> luu text
```

Thu vien Java:

```text
Apache POI
```

Muc dich:

```text
Lay text tu file Word.
```

Buoc nay co the lam sau PDF va TEXT, vi sach hoc thuong hay la PDF hon.

---

## 15. File HTML

Vi du:

```text
.html
web page exported
```

Luong xu ly:

```text
HTML
-> HTML parser
-> remove script/style/nav
-> lay text chinh
```

Thu vien Java:

```text
Jsoup
```

Muc dich:

```text
Lay noi dung text tu trang web hoac file HTML.
```

Khong can OCR vi HTML da co text.

---

## 16. File Audio

Vi du:

```text
.mp3
.wav
```

Audio khong phai text.

Luong xu ly sau nay:

```text
AUDIO
-> speech-to-text
-> transcript
-> chunking
-> listening exercise
```

Day nen de sang phase sau, vi kho hon PDF/Text.

Ly do:

```text
Can model speech-to-text
Can sync transcript voi audio
Can cat cau hoi listening
Can quan ly audio segment
```

Trong buoc dau, chi nen upload va luu metadata audio truoc.

---

## 17. Entity Nen Co O Buoc Upload Dau

### 17.1. BookDocument

Muc dich:

```text
Dai dien cho file goc admin upload.
```

Field de xuat:

```text
id
bookId
originalFileName
storedFileName
contentType
fileSize
storagePath
documentType
status
errorMessage
createdAt
updatedAt
```

`documentType` co the la:

```text
PDF
IMAGE
TEXT
DOCX
HTML
AUDIO
UNKNOWN
```

### 17.2. ExtractedPageText

Muc dich:

```text
Luu text da trich xuat theo tung page hoac tung don vi cua file.
```

Field de xuat:

```text
id
documentId
pageNumber
text
extractionMethod
confidence
createdAt
```

`extractionMethod` co the la:

```text
PDF_TEXT
PDF_OCR
IMAGE_OCR
TEXT_DIRECT
DOCX_TEXT
HTML_TEXT
```

Tai sao can bang nay?

Vi sau nay `SourceReference` can truy vet:

```text
KnowledgeItem nay lay tu page nao?
Chunk nay lay tu page nao?
AI dua ra giai thich dua tren evidence nao?
```

---

## 18. Cac API Nen Lam Dau Tien

Khong nen lam qua nhieu API mot luc.

Buoc dau chi can:

```http
POST /api/content/books/{bookId}/documents
```

Muc dich:

```text
Upload file vao mot Book.
```

```http
GET /api/content/books/{bookId}/documents
```

Muc dich:

```text
Xem danh sach file cua mot Book.
```

```http
POST /api/content/documents/{documentId}/extract
```

Muc dich:

```text
Bat dau trich xuat text tu file.
```

```http
GET /api/content/documents/{documentId}/pages
```

Muc dich:

```text
Xem text da trich xuat theo tung page.
```

---

## 19. Vi Sao Extract Nen La API Rieng?

Khong nen upload xong extract ngay trong cung request.

Ly do:

```text
File PDF co the rat nang
OCR co the chay lau
Upload request khong nen bi treo qua lau
Sau nay co the chuyen extract sang async/RabbitMQ
```

Luong tot hon:

```text
POST upload
-> tra ve documentId ngay

POST extract
-> status = EXTRACTING
-> xu ly
-> status = EXTRACTED hoac FAILED
```

Ban dau co the xu ly sync cho de hoc.

Sau nay moi doi thanh async.

---

## 20. Thu Tu Hoc Va Lam Code De Xuat

Khong lam het mot luc.

Nen di theo 5 buoc nho:

### Buoc 1 - Them BookDocument

Muc dich:

```text
He thong luu duoc file admin upload thuoc book nao.
```

Chi lam:

```text
Entity BookDocument
Repository
DTO request/response
Upload API
List document API
```

Chua extract.

### Buoc 2 - Luu File Vao Local Storage

Muc dich:

```text
File upload khong bi mat sau khi request ket thuc.
```

Chi lam:

```text
tao folder uploads
luu file bang UUID
luu storagePath vao DB
```

Chua PDFBox.

### Buoc 3 - Extract Text Cho PDF Co Text That

Muc dich:

```text
Doc duoc sach PDF co text that bang PDFBox.
```

Chi lam:

```text
add PDFBox dependency
POST /documents/{id}/extract
neu PDF thi dung PDFBox
luu ExtractedPageText theo page
```

Chua OCR.

### Buoc 4 - Extract Text Cho File Text

Muc dich:

```text
Ho tro file text don gian.
```

Chi lam:

```text
neu contentType la text/plain
doc text truc tiep
luu vao ExtractedPageText pageNumber = 1
```

### Buoc 5 - Fallback OCR Cho PDF Scan Va Image

Muc dich:

```text
Xu ly tai lieu dang scan/anh.
```

Chi lam sau khi PDFBox da on:

```text
neu PDFBox lay duoc qua it text
-> render page thanh image
-> OCR

neu file image
-> OCR truc tiep
```

OCR nen de sau vi day la phan kho.

---

## 21. Ket Qua Sau Khi Lam Xong Buoc Upload/Extract

Sau cac buoc tren, he thong se co:

```text
Book
-> BookDocument
   -> ExtractedPageText
```

Vi du:

```text
Book: Shin Kanzen Master N3 Goi

BookDocument:
- textbook.pdf
- status = EXTRACTED

ExtractedPageText:
- page 1: ...
- page 2: ...
- page 3: ...
```

Luc nay moi san sang sang buoc tiep:

```text
ExtractedPageText
-> DocumentChunk
-> Embedding
-> KnowledgeItem
-> SourceExercise
-> PracticeItem
```

---

## 22. Ket Luan Quan Trong

Can nho:

```text
PDF text that -> PDFBox
PDF scan -> OCR
Image -> OCR
Text file -> doc truc tiep
DOCX -> Apache POI
HTML -> Jsoup
Audio -> speech-to-text
```

Thu tu dung cho GAKUDO:

```text
1. Upload va luu metadata
2. Extract PDF text that bang PDFBox
3. Extract text file
4. Sau do moi OCR
5. Sau nua moi chunking/embedding/AI/RAG
```

Di cham nhu vay thi he thong se chac nen, va m se de hieu tung phan hon.
