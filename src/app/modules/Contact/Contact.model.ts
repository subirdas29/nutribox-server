import { model, Schema } from "mongoose";
import { IContact } from "./Contact.interface";


const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const Contact = model<IContact>("Contact", ContactSchema);
