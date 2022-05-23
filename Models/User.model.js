import mongoose from "mongoose";
const { model, Schema } = mongoose;
const userSchema = new Schema(
    {
        name: String,
        email: String,
        role: String,
        products: [String],
        order: [String],
    },
    { timestamps: true }
);

export const Product = model("product", userSchema);
