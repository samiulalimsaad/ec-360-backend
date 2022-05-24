import mongoose from "mongoose";
const { model, Schema } = mongoose;
const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            unique: true,
        },
        role: String,
        education: String,
        address: String,
        phone: String,
        linkedin: String,
        products: [],
        orders: [],
    },
    { timestamps: true }
);

export const User = model("User", userSchema);
