import mongoose from "mongoose";
const { model, Schema } = mongoose;
const userSchema = new Schema(
    {
        name: String,
        email: String,
        role: String,
        products: [],
        orders: [],
    },
    { timestamps: true }
);

export const User = model("User", userSchema);
