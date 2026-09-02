# 1. Khai báo môi trường gốc: Lấy Java 21 (bản JRE nhẹ gọn)
FROM eclipse-temurin:21-jre-alpine

# 2. Định nghĩa thư mục làm việc bên trong chiếc hộp (container)
WORKDIR /app

# 3. Copy file .jar từ máy của bạn vào bên trong chiếc hộp (đổi tên thành app.jar cho dễ gọi)
COPY target/*.jar app.jar

# 4. Khi chiếc hộp khởi động, chạy lệnh này
ENTRYPOINT ["java", "-jar", "app.jar"]