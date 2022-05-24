import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Product } from "./Models/Product.model.js";
import { Review } from "./Models/Review.model.js";
import { User } from "./Models/User.model.js";

const app = express();
const PORT = process.env.PORT || 5000;

//  middleWares
// enable cors
app.use(cors());
app.use(express.json());

const verifyUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "unauthorized access",
        });
    }
    const token = authHeader.split(" ")[1];

    try {
        await jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden access",
                });
            }
            req.email = decoded?.email;
            next();
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
};

app.get("/", (req, res) => {
    res.json({ hello: "hello" });
});

app.get("/products", async (req, res) => {
    try {
        const limit = +req.query.limit || 6;
        const page = +req.query.page - 1 || 0;
        const skip = limit * page;
        let products = await Product.find({});
        const total = Math.ceil(products.length / limit);
        products = products.slice(skip, skip + limit);
        res.json({
            total,
            products,
            success: true,
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        res.json({
            product,
            success: true,
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.post("/product", async (req, res) => {
    try {
        const productData = new Product(req.body);
        const product = await productData.save();
        res.json({
            product,
            success: true,
            message: "successfully added",
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.patch("/products/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                minOrderQuantity: req.body.minOrderQuantity,
                availableQuantity: req.body.availableQuantity,
            },
            {
                new: true,
            }
        );
        res.json({
            product,
            success: true,
            message: "successfully updated",
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.patch("/order/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    orders: {
                        id: req.body.productId,
                        status: "pending",
                    },
                },
            },
            {
                new: true,
            }
        );

        res.json({
            user,
            success: true,
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.post("/review", async (req, res) => {
    try {
        const newReview = new Review(req.body);
        const review = await newReview.save();

        res.json({
            review,
            success: true,
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.get("/review", async (req, res) => {
    try {
        console.log(req.query);
        const review = await Review.find({
            email: req.query.email,
        });
        res.json({
            review,
            success: true,
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});
app.patch("/review/:id", async (req, res) => {
    try {
        const user = await Review.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );

        res.json({
            user,
            success: true,
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const newUser = new User(req.body);
        const user = await newUser.save();

        const token = jwt.sign(req.body, process.env.ACCESS_TOKEN, {
            expiresIn: "1d",
        });
        res.json({
            user,
            token,
            success: true,
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.listen(PORT, async () => {
    console.log(`server is running at http://localhost:${PORT}`);
    mongoose.connect(
        process.env.DATABASE_URL,
        {
            useNewUrlParser: true,
        },
        () => {
            console.log("Database is connected");
        }
    );
});

/**
 * let ids = ['id1','id2','id3']
let data = await MyModel.find(
  {'_id': { $in: ids}}
);
 * 
 */
