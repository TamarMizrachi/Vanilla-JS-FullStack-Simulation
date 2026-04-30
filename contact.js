
function signUp(){

    const signupBtn=document.getElementById('signupBtn');

    signupBtn.addEventListener('click',(e)=>{
        e.preventDefault();
        
        const username=document.getElementById('username').value;
        const email=document.getElementById('email').value;
        const password=document.getElementById('password').value;
       
        if(validUser(email,password,username))
        {  
            const user={username:username,email:email,password:password,type:'sign up'};

            const request = new FXMLHttpRequest();
            request.open('POST', '/contactServer');
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    
                    const response = request.responseJSON;
                    if (request.status === 200) {
                        
                        alert(response.data.message);  // "המשתמש נוסף בהצלחה!"

                        sessionStorage.setItem('currentUser', JSON.stringify(response.data.user));
                        
                        loadPage('MyLibrary');

                        // המשך ניווט וכו'
                    } else {
                        
                        alert(response.data.message); // "המייל הזה כבר קיים במערכת!"
                    }
                }
            };

            request.send(user);

        }
    });

   
}

function logIn() {

    const loginBtn = document.getElementById('loginBtn');
    
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
    
        const email = document.getElementById('email1').value;
        const password = document.getElementById('password1').value;

        if (validUser(email, password)) { 
            const user = { email, password, type: 'log in' };

            const xhr = new FXMLHttpRequest();
            xhr.open("PUT", "/contactServer");

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    const response = xhr.responseJSON;

                    if (xhr.status === 200) {
                        alert("התחברות הצליחה");
                        sessionStorage.setItem('currentUser', JSON.stringify(response.data.user));
                        
                        
                        loadPage('MyLibrary');
                    } else {
                        alert(response?.data?.message || "שגיאת התחברות");
                    }
                }
            };

            xhr.send(user);
        }
    });
}

function validUser(email, password, username = 'n') {
    if (!username || !email || !password) {
        alert("אנא מלא את כל השדות");
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert("כתובת אימייל לא תקינה");
        return false;
    }

    return true;
}

function logOut() {
    sessionStorage.removeItem('currentUser');
    alert("התנתקת בהצלחה!");
    loadPage('welcome');
}
