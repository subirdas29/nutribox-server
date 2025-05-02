import { IContact } from "./Contact.interface";
import { Contact } from "./Contact.model";


const createContact = async(payload:IContact)=>{
    const result = await Contact.create(payload)
    return result 
}

export const contactService = {
    createContact 
};