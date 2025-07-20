const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  status: { type: String, enum: ['Available', 'Borrowed'], default: 'Available' },
  dueDate: { type: Date  },
  email: { type: String }
});

const Book = mongoose.model('Book', bookSchema);

// Khởi tạo dữ liệu mẫu
const initialBooks = [ /* ... */ ];

async function seedInitialBooks() {
  const count = await Book.countDocuments();
  if (count === 0) {
    await Book.insertMany(initialBooks);
    console.log("✅ Đã khởi tạo dữ liệu sách mẫu");
  }
}

module.exports = { Book, seedInitialBooks };
