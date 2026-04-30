function library(currentUser) {
    if (!currentUser || !currentUser.id) {
        alert("לא ניתן לטעון ספרים – אין משתמש מחובר");
        return;
    }
    getAllBooks();

    
}

function renderBooks(books) {
  const list = document.getElementById('bookList');
  list.innerHTML = '';

    books.forEach(book => {
    const div = document.createElement('div');
    div.className = 'bookCard';

    div.innerHTML = `
      <strong>${book.title}</strong> / ${book.author}<br>
      נקרא: ${book.readCount} פעמים
      <br>
      <button onclick="incrementRead(${book.id})">+ קראתי שוב</button>
      <button onclick="openEditForm(${book.id})">✏ ערוך</button>
      <button onclick="deleteBook(${book.id})">🗑 מחק</button>
    `;

    list.appendChild(div);
  });
}


function submitNewBook() {
    console.log('submitNewBook');
    
  const title = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const newBook = {
  title,
  author,
  readCount: 0,
  userId: currentUser.id // ← זה חובה!
};

  if (!isBookValid(newBook)) {
    alert("נא למלא את כל השדות");
    return;
  }


  // ליצור בקשת פוסטלשלוח את הספר בדרך הארוכה
  const request = new FXMLHttpRequest();
  request.method = 'POST';
  request.url = '/mainServer'; // כתובת שמתאימה לשרת שלך
  request.body = newBook;
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
        console.log('request.readyState');
        console.log(request.status);
      if (request.status === 200) {
        //להציג בדף עצמו
        
        alert("הספר נוסף בהצלחה!");
        const response = request.responseJSON;
        getAllBooks(); // אם את שומרת גם מקומית
      } else {
        alert("הייתה שגיאה בהוספת הספר");
      }
    }
  };
  request.send(newBook);

  document.getElementById('bookTitle').value = '';
  document.getElementById('bookAuthor').value = '';
  document.getElementById('addBookForm').style.display = 'none';
}

function openAddBookForm() {
    document.getElementById('addBookForm').style.display = 'block';
}

function isBookValid(book) {
  return book.title && book.author;
}

function getAllBooks()
{

    const currentUser=JSON.parse(sessionStorage.getItem('currentUser'));
    const request = new FXMLHttpRequest();
    request.open('GET', `/mainServer?userId=${encodeURIComponent(currentUser.id)}`);
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
             
            const response = request.responseJSON;

            if (request.status === 200) {
                renderBooks(response.data.books); 
            } else {
                alert("אירעה שגיאה בשליפת הספרים: " + response.data.message);
            }
        }
    };
    request.send();
}

function deleteBook(bookId){

    const request = new FXMLHttpRequest();
    request.open('DELETE', `/mainServer?bookId=${encodeURIComponent(bookId)}`);
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            
            const response = request.responseJSON;

            if (request.status === 200) {
                getAllBooks(); 
            } else {
                alert("אירעה שגיאה במחיקת הסר " + response.data.message);
            }
        }
    };
    request.send();


}

function incrementRead(bookId){

    const request = new FXMLHttpRequest();
    request.open('PUT', `/mainServer?bookId=${encodeURIComponent(bookId)}&action=incrementRead`);
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            const response = request.responseJSON;
            if (request.status === 200) {
                getAllBooks(); 
            } else {
                alert("אירעה שגיאה בהוספה " + response.data.message);
            }
        }
    };
    request.send();

}


function submitEdit(bookId) {
  const title = document.getElementById('editBookTitle').value;
    const author = document.getElementById('editBookAuthor').value;
  
    const updatedData = {
        title: title,
        author: author
    };
    
    const request = new FXMLHttpRequest();
    request.open('PUT', `/mainServer?bookId=${encodeURIComponent(bookId)}&action=edit`);

    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            const response = request.responseJSON;
            if (request.status === 200) {
                console.log('הספר נערך בהצלחה');
                getAllBooks(); // ריענון ספרים
                closeEditForm();
            } else {
                alert("שגיאה בעריכה: " + response.data.message);
            }
        }
    };

    request.send(updatedData);
}


function closeEditForm() {
    document.getElementById('editBookForm').style.display = 'none';
}

function getBookById(bookId, callback) {
  const request = new FXMLHttpRequest();
  request.open('GET', `/mainServer?bookId=${encodeURIComponent(bookId)}`);
  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      if (request.status === 200) {
        const response = JSON.parse(request.responseText);
        callback(response.data);
      } else {
        const response = JSON.parse(request.responseText);
        alert("אירעה שגיאה בשליפת הספר: " + response.data.message);
      }
    }
  };
  request.send();
}

function openEditForm(bookId) {
  getBookById(bookId, (book) => {
 
    document.getElementById('editBookTitle').value = book.book.title;
    document.getElementById('editBookAuthor').value = book.book.author;
    
    
    document.getElementById('saveEditBtn').onclick = () => submitEdit(bookId);

    document.getElementById('editBookForm').style.display = 'block';
  });
}
