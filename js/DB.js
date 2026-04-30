class DB {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  getAll() {
    const data = localStorage.getItem(this.collectionName);
    return data ? JSON.parse(data) : [];
  }

  add(item) {
    const data = this.getAll();
    item.id = Date.now(); // יוצרת ID ייחודי לפי הזמן
    data.push(item);
    localStorage.setItem(this.collectionName, JSON.stringify(data));
    return item;
  }

  findByEmail(email) {
    const data = this.getAll();
    return data.find(user => user.email === email) || null;
  }

getByUserId(userId) {
  const data = this.getAll();
  return data.filter(book => String(book.userId) === String(userId));
}

deleteBook(bookId) {

  const data = this.getAll();
  const updated = data.filter(book => Number(book.id) !== Number(bookId));

  localStorage.setItem(this.collectionName, JSON.stringify(updated));
}
saveAll(data) {
    localStorage.setItem(this.collectionName, JSON.stringify(data));
}

}

const usersDB = new DB("users");
const booksDB = new DB("books");

