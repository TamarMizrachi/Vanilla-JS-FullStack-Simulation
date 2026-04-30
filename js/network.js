const network = {

  omissionProbability: 0.000001, 
  delay: 800, 

  sendRequest(request = new FXMLHttpRequest()){
    if (!request || typeof request !== 'object') {
      throw new Error('הבקשה לא תקינה');
    }

    if (!request.url || typeof request.url !== 'string') {
      console.log('חסרה כתובת יעד (url)');
      throw new Error('חסרה כתובת יעד (url)');
    }

    const baseUrl = request.url.split('?')[0];

    const randomValue = Math.random(); // בין 0 ל־1

    if (randomValue < this.omissionProbability) {
      console.log('הבקשה נאבדה');
      return;
    }

    setTimeout(() => {

      try {
        switch (baseUrl) {
          case '/contactServer':
            contactServer.handleRequest(request);
            break;

          case '/mainServer':
            mainServer.handleRequest(request);
            break;

          default:
            this.sendResponse(request, { message: 'שרת לא מזוהה' }, 404);
        }
      } catch (err) {
        this.sendResponse(request, { message: err.message }, 500);
      }
    }, this.delay);
  },

  sendResponse(request, data, statusCode = 200) {

    if (!request || typeof request.simulateResponse !== 'function') {
      return;
    }

    request.simulateResponse({
      status: statusCode,
      responseText: JSON.stringify({
        status: statusCode,
        data
      }),
    });
  }
};
