

class AppErorr extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('2')?'Success':'Failed'
    }
}



export default AppErorr;