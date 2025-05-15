import { validate } from "../validation/validation.js";
import { aiValidation } from "../validation/aiValidation.js";
import 'dotenv/config';
import responseError from "../error/responseError.js";
import axios from "axios";

export const aiService=async(req)=>{
    const promp= validate(aiValidation,req.body)
    if(!promp){
        throw new responseError(404,"InvalidUser input")
    }

    // console.log("ai req:", req.body)

    const response= await axios.post(
        "https://Stefaron-KlasifikasiJudol.hf.space/predict",
        req.body
    )

    return response
}