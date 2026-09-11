const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Multer storage engine streaming the uploaded file straight to Cloudinary.
// Replaces the unmaintained `multer-storage-cloudinary` package, whose peer
// dependency was pinned to the vulnerable cloudinary 1.x line.
const storage = {
  _handleFile(req, file, callback) {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "user-pictures" },
      (err, resp) => {
        if (err) return callback(err);
        // `path` is what the routes read back as the picture URL
        callback(null, {
          path: resp.secure_url,
          size: resp.bytes,
          filename: resp.public_id,
        });
      }
    );
    file.stream.on("error", callback);
    file.stream.pipe(stream);
  },

  _removeFile(req, file, callback) {
    cloudinary.uploader.destroy(file.filename, { invalidate: true }, callback);
  },
};

// fieldArrayIndexLimit is opt-in (default Infinity): without it a field named
// e.g. `a[999999999]` makes multer allocate a huge array (CVE-2026-82333).
// No form posts array-indexed fields, so a small bound is safe.
const fileUploader = multer({ storage, limits: { fieldArrayIndexLimit: 100 } });
module.exports = fileUploader;
