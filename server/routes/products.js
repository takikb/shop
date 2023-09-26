import express from "express";
import { productModel } from "../models/Products";
import { cartModel } from "../models/Cart";


const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await productModel.find({});
        res.json(response);
    } catch (error) {
       res.json(error); 
    }
})

router.post("/", async (req, res) => {
    const product = new productModel(req.body);
    try {
        const response = await product.save();
        res.json(response);
    } catch (error) {
        res.json(error);
    }
})

router.post("/cart", async (req, res) => {
    try {
        const userID = req.body.userID;
        const productID = req.body.productID;

        const cart = await cartModel.findOne({userID});
        cart.products.pull({ productID });
        await cart.save();
        res.json({ redirect: "/cart" });
    } catch (error) {
        res.json(error);
    }
})

router.put("/:userID",  async (req, res) => {
    const userID = req.params.userID;
    const { productID, quantity } = req.body;
    try {
        let cart = await cartModel.findOne({ userID });

        if(!cart) {
            //create a new cart if it doesn't exist
            cart = new cartModel({
                userID,
                products: [{ productID, quantity }],
            });
        } else {
            // Check if the product already exists in the cart
            const existingProductIndex = cart.products.findIndex((product) =>
            product.productID.some((id) => id.toString() === productID)
          );

            if(existingProductIndex !== -1) {
                //if the product exist, update its quantity
                cart.products[existingProductIndex].quantity += quantity;
                
            } else {
                //if the product doesn't exist, add it to the cart
                cart.products.push({ productID, quantity });
                
            }
        }

        await cart.save();

        res.json(cart.products);
    } catch (error) {
        res.json(error);
    }
})

router.get("/cart/ids/:userID", async (req, res) => {
    try {
        const user = await cartModel.findOne(req.params.userID);
        res.json({ products: user?.products});
    } catch (error) {
        res.json(error);
    }
})

router.get("/cart/:userID", async (req, res) => {
        const userID = req.params.userID;
    try {
        const cart = await cartModel.findOne({userID});
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for this user' });
          }
        res.json(cart.products);
    } catch (error) {
        res.json(error);
    }
})

router.put("/cart/:userID", async (req, res) => {
    const userID = req.params.userID;
    const { productID, quantity} = req.body;
    try {
        const cart = await cartModel.findOne({userID});

        const existingProductIndex = cart.products.findIndex((product) =>
            product.productID.some((id) => id.toString() === productID)
        );

            //if the product exist, update its quantity
        cart.products[existingProductIndex].quantity = quantity;
        await cart.save();

        res.json(cart.products);
    } catch (error) {
        res.json(error);
    }
})

export { router as productRouter };