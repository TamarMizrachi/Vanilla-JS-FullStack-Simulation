class Server {

    handleRequest(request) {
        throw new Error("Must be implemented in subclass");
    }

    validateRequest(request) {
       if (!request || typeof request !== 'object') {
        throw new Error("הבקשה חייבת להיות אובייקט תקין");
        }

        if (!request.method || typeof request.method !== 'string') {
            throw new Error("חסר סוג בקשה (method)");
        }

        if (request.method === "POST" && !request.body) {
        throw new Error("בקשת POST חייבת לכלול body");
        }
    }
    getParamsFromUrl(url) {
            const params = {};
            const parts = url.split('?');
            if (parts.length < 2) return params;

            const queryString = parts[1];
            const pairs = queryString.split('&');

            for (const pair of pairs) {
                const [key, value] = pair.split('=');
                params[key] = decodeURIComponent(value);
            }

            return params;
    }
}

class ContactServer extends Server{
    
  handleRequest(request) {
    try {
        this.validateRequest(request);

        switch (request.method) {
            case 'POST':
                this.POST(request);
                break;

            case 'PUT':
                this.PUT(request);
                break;

            default:
                network.sendResponse(request, { message: 'סוג בקשה לא נתמך' }, 405);
        }
    } catch (error) {
        network.sendResponse(request, { message: error.message }, 400);
    }
}


    POST(request){
        
        const user=request.body;
        
        const existingUser = usersDB.findByEmail(user.email);

        if (existingUser) {
        network.sendResponse(request, { message: "המייל הזה כבר קיים במערכת!" }, 400);
        } else {
        usersDB.add(user);
        
        network.sendResponse(request, { message: "המשתמש נוסף בהצלחה!", user }, 200);
        }


    }

   PUT(request) {
    const user = request.body;

    const existingUser = usersDB.findByEmail(user.email);

    if (!existingUser || existingUser.password !== user.password) {
        network.sendResponse(request, { message: "אימייל או סיסמה שגויים" }, 401);
    } else {

        network.sendResponse(request, { message: "התחברות הצליחה", user: existingUser }, 200);
    }
}

       
};


class MainServer extends Server {

   
   handleRequest(request) {
    try {
        this.validateRequest(request);

        switch (request.method) {
            case 'GET':
                this.GET(request);
                break;

            case 'POST':
                this.POST(request);
                break;

            case 'DELETE':
                this.DELETE(request);
                break;

            case 'PUT':
                this.PUT(request);
                break;

            default:
                network.sendResponse(request, { message: 'סוג בקשה לא נתמך' }, 405);
        }

    } catch (error) {
        network.sendResponse(request, { message: error.message }, 400);
    }
}

    GET(request) {
        
    const url = request.url;
    const params = this.getParamsFromUrl(url); // פונקציה שמחזירה אובייקט של פרמטרים

    const userId = params.userId;
    const bookId = params.bookId;

    
    if (userId) {
        // שליפת כל הספרים של יוזר
        const books = booksDB.getByUserId(userId);
        network.sendResponse(request, { books }, 200);
    } else if (bookId) {
        // שליפת ספר מסוים
        const books = booksDB.getAll();
        const book = books.find(b => b.id == bookId); // ישווה גם אם הטיפוס שונה
        
        if (book) {
            network.sendResponse(request, { book }, 200);
        } else {
            network.sendResponse(request, { message: "ספר לא נמצא" }, 404);
        }
    } else {
        // לא הגיע שום מזהה
        network.sendResponse(request, { message: "חסר userId או bookId" }, 400);
    }
}

    POST(request){

        booksDB.add(request.body);
        network.sendResponse(request,' ',200);

        
    }
    DELETE(request){
        const url = request.url;
        const bookId = url.includes('?bookId=') ? url.split('?bookId=')[1] : null;
        
        booksDB.deleteBook(bookId);
        network.sendResponse(request,' ',200);

    }
PUT(request) {

    const url = request.url;
    const params = this.getParamsFromUrl(url);
    const bookId = params.bookId;
    const action = params.action;

    const books = booksDB.getAll();
    const book = books.find(b => b.id == bookId);

    if (!book) {
        network.sendResponse(request, { message: 'ספר לא נמצא' }, 404);
        return;
    }
    const updatedData=request.body;
    // הבחנה בין פעולות:
    if (action === 'incrementRead') {
        book.readCount++;
    } else if (action === 'edit') {
        
        if (updatedData.title) {
            
            book.title = updatedData.title;
        }
        if (updatedData.author) {
            book.author = updatedData.author;
        }
        if (typeof updatedData.readCount === 'number') {
            book.readCount = updatedData.readCount;
        }
    }

    booksDB.saveAll(books);
    network.sendResponse(request, { books }, 200);
}




}

const mainServer = new MainServer();
const contactServer =new ContactServer();
