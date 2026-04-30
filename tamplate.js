function loadPage(pageId, shouldPush = true) {

    if (pageId === 'MyLibrary') {
        const currentUser = sessionStorage.getItem('currentUser');
        if (!currentUser) {
            alert("אנא התחבר כדי להיכנס לספרייה");
            loadPage('logIn');
            return; 
        }
    }

    const template = document.getElementById(pageId);
    const copyContent = template.content.cloneNode(true);
    const mainDiv = document.getElementById('main_content');
    mainDiv.innerHTML = '';
    mainDiv.appendChild(copyContent);

    if (pageId === 'signUp') {
        signUp();
    }
    if (pageId === 'logIn') {
        logIn();
    }
    if (pageId === 'MyLibrary') {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        library(currentUser);
    }

   const pathMap = {
    "welcome": "#welcome",
    "logIn": "#login",
    "signUp": "#signup",
    "MyLibrary": "#library"
};

const newPath = pathMap[pageId] || "#welcome";

if (shouldPush) {
    window.history.pushState({ pageId }, "", newPath);
}

}

    window.addEventListener("popstate", (event) => {
    const state = event.state;

    if (state && state.pageId) {
        loadPage(state.pageId, false);
    } else {
        loadPage("welcome", false);
    }
    });

    loadPage('welcome');
