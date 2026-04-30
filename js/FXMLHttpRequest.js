
class FXMLHttpRequest {
    constructor() {
        this.readyState = 0;           
        this.status = 0;               
        this.responseText = '';        
        this.onreadystatechange = null;
        this.method = '';              
        this.url = '';                 
        this.body = null;            
    }

    open(method, url) {
        this.method = method.toUpperCase(); 
        this.url = url;                     
        this.readyState = 1;                
        this.#triggerReadyStateChange();
    }

 
    send(body = null) {
        this.body = body;
        this.readyState = 2; 
        this.#triggerReadyStateChange();
        network.sendRequest(this);
        
    }

    simulateResponse({ status = 200, responseText = '', responseHeaders = {} }) {
        this.status = status;
        this.responseText = responseText;
        this.readyState = 4; // DONE
        this.#triggerReadyStateChange();
    }

    get responseJSON() {
        try {
            return JSON.parse(this.responseText);
        } catch {
            return null;
        }
    }


    #triggerReadyStateChange() {
        if (typeof this.onreadystatechange === 'function') {
            this.onreadystatechange();
        }
    }
}


