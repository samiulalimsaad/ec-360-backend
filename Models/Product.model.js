import mongoose from "mongoose";
const { model, Schema } = mongoose;
const productSchema = new Schema(
    {
        name: String,
        image: String,
        minOrderQuantity: Number,
        availableQuantity: Number,
        price: Number,
        email: String,
    },
    { timestamps: true }
);

export const Product = model("product", productSchema);
