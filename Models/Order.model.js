import mongoose from "mongoose";
const { model, Schema } = mongoose;
const orderSchema = new Schema(
    {
        name: String,
        image: String,
        price: Number,
        paid: Boolean,
        status: String,
        email: String,
    },
    { timestamps: true }
);

export const Order = model("Order", orderSchema);
