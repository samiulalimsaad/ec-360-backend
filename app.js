import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Product } from "./Models/Product.model.js";

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
};

app.get("/", (req, res) => {
    res.json({ hello: "hello" });
});

app.get("/products", async (req, res) => {
    const limit = +req.query.limit || 10;
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
});

app.get("/products/:id", async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id });
    res.json({
        product,
        success: true,
    });
});

app.post("/product", async (req, res) => {
    const productData = new Product(req.body);
    const product = await productData.save();
    res.json({
        product,
        success: true,
        message: "successfully added",
    });
});

app.post("/login", async (req, res) => {
    const token = jwt.sign(req.body, process.env.ACCESS_TOKEN, {
        expiresIn: "1d",
    });
    res.json({
        token,
        success: true,
    });
});

app.patch("/products/:id", async (req, res) => {
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
