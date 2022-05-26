import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Order } from "./Models/Order.model.js";
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
        const limit = +req.query.limit;
        const page = +req.query.page - 1 || 0;
        const skip = limit * page;
        let products = await Product.find({});
        if (limit) {
            products = products.reverse().slice(skip, skip + limit);
        }
        res.json({
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

app.post("/product", verifyUser, async (req, res) => {
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

app.patch("/products/:id", verifyUser, async (req, res) => {
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

app.delete("/products/:id", verifyUser, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        res.json({
            product,
            success: true,
            message: "successfully deleted",
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.get("/orders", async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json({
            orders,
            success: true,
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.get("/orders/:id", verifyUser, async (req, res) => {
    try {
        const orders = await Order.findById(req.params.id);
        res.json({
            orders,
            success: true,
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.get("/my-orders/:email", verifyUser, async (req, res) => {
    try {
        const email = req.params.email || "";
        if (email) {
            const orders = await Order.find({ email: req.params.email });
            res.json({
                orders,
                success: true,
            });
        } else {
            res.json({ success: false, error: "User Not Found" });
        }
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.post("/orders", verifyUser, async (req, res) => {
    try {
        console.log(req.body);
        const newOrder = new Order({
            ...req.body,
            email: req.email,
        });
        const order = await newOrder.save();

        res.json({
            order,
            success: true,
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.patch("/orders/:id", verifyUser, async (req, res) => {
    try {
        console.log(req.params.id);
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );

        res.json({
            order,
            success: true,
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.delete("/orders/:id", verifyUser, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        res.json({
            order,
            success: true,
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.post("/review", verifyUser, async (req, res) => {
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

app.get("/reviews", async (req, res) => {
    try {
        const limit = +req.query.limit;
        const page = +req.query.page - 1 || 0;
        const skip = limit * page;
        let review = await Review.find({});
        if (limit) {
            review = review.reverse().slice(skip, skip + limit);
        }
        res.json({
            review,
            success: true,
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.get("/reviews/:id", verifyUser, async (req, res) => {
    try {
        const review = await Review.find({
            userId: req.params.id,
        });
        res.json({
            review,
            success: true,
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.patch("/reviews/:id", verifyUser, async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {
                new: true,
            }
        );

        res.json({
            review,
            success: true,
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.get("/all-user", verifyUser, async (req, res) => {
    try {
        const user = await User.find({});

        res.json({
            user,
            success: true,
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.get("/user", verifyUser, async (req, res) => {
    try {
        const email = req.query.email || "";
        if (email) {
            const user = (await User.find({ email }))[0];

            res.json({
                user,
                success: true,
            });
        } else {
            res.json({
                success: false,
                message: "User Not Found",
            });
        }
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.post("/user", async (req, res) => {
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

app.patch("/user/:id", verifyUser, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
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
            message: "Profile Updated Successfully",
        });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const token = jwt.sign(req.body, process.env.ACCESS_TOKEN, {
            expiresIn: "1d",
        });
        res.json({
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
