import { aiService } from "../service/aiService.js";

export const aiPredict=async(req, res, next)=>{
     try{
        // console.log("ai req controller:", req.body)
            const response= await aiService(req)
            // console.log("response ai:", response.data)
         let judol = (response.data.predicted_label === 1) ? "Yes" :"No"
            res.status(200).json({
                text:response.data.text,
                predixted_label: response.data.predicted_label,
                judol:judol
            })
        }catch(err){
            console.error("Error ai:", err);
            next(err)
        }
}
