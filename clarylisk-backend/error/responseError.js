
export default class responseError extends Error{
    constructor(status,message){
        super(message);
        this.status=status 
    }
}

