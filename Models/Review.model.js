import mongoose from "mongoose";
const { model, Schema } = mongoose;
const reviewSchema = new Schema(
    {
        name: String,
        email: String,
        description: String,
        rating: Number,
    },
    { timestamps: true }
);

export const Review = model("Review", reviewSchema);
