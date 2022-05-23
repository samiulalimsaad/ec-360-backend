import cors from "cors";
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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

app.post("/login", async (req, res) => {
    const token = jwt.sign(req.body, process.env.ACCESS_TOKEN, {
        expiresIn: "1d",
    });
    res.json({
        token,
        success: true,
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
