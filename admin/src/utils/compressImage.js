export const compressImageIfNeeded = async (file) => {
  const limitSize = 2 * 1024 * 1024; // 2MB (giảm từ 10MB để đảm bảo ảnh luôn được nén trước khi upload)
  if (!file || !file.type.startsWith("image/") || file.size < limitSize) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Giới hạn kích thước tối đa 2560px (QHD - vẫn cực kỳ sắc nét cho web)
        const maxDimension = 2560;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Chuyển định dạng PNG/BMP sang JPEG để hỗ trợ nén dung lượng tốt nhất
        let mimeType = file.type;
        let extension = file.name.substring(file.name.lastIndexOf("."));
        if (mimeType === "image/png" || mimeType === "image/bmp") {
          mimeType = "image/jpeg";
          extension = ".jpg";
        }

        let quality = 0.85; // Chất lượng cao để không suy giảm chi tiết ảnh (mắt thường không phân biệt được)

        const tryCompress = (q) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file); // Trả về file gốc nếu xảy ra lỗi
                return;
              }

              // Nếu ảnh nén xong vẫn >= 2MB, thực hiện giảm chất lượng đệ quy để đảm bảo dưới 2MB
              if (blob.size >= limitSize && q > 0.3) {
                tryCompress(q - 0.15);
              } else {
                const baseName = file.name.substring(0, file.name.lastIndexOf("."));
                const newName = baseName + extension;
                const compressedFile = new File([blob], newName, {
                  type: mimeType,
                  lastModified: Date.now(),
                });
                console.log(`Đã nén ảnh thành công từ ${(file.size / (1024 * 1024)).toFixed(2)}MB xuống ${(compressedFile.size / (1024 * 1024)).toFixed(2)}MB (chất lượng nén: ${q})`);
                resolve(compressedFile);
              }
            },
            mimeType,
            q
          );
        };

        tryCompress(quality);
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};
