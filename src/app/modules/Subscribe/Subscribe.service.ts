
import { ISubscribe } from "./Subscribe.interface";
import { Subscribe } from "./Subscribe.model";


const createSubscribe = async(payload:ISubscribe)=>{
    const result = await Subscribe.create(payload)
    return result 
}

export const SubscribeService = {
    createSubscribe
};