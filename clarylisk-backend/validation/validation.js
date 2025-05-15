import responseError from "../error/responseError.js"

export const validate= (schema,req)=>{
    const result= schema.validate(req)
    if(result.error){
        throw new responseError(400,result.error.message)
    }else{
        return result.value
    }
}