import mongoose from "mongoose";
const { model, Schema } = mongoose;
const reviewSchema = new Schema(
    {
        userId: String,
        name: String,
        email: String,
        image: String,
        description: String,
        rating: Number,
    },
    { timestamps: true }
);

export const Review = model("Review", reviewSchema);
