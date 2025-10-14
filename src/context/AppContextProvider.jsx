// This file defines your Context Provider component
// It manages and shares state across your entire app
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";


export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY;


    // 1️⃣ React Router's navigation hook (to move between pages)
    const navigate = useNavigate();
    // 2️⃣ Global states shared across the app
    const [user, setUser] = useState(null);       // holds the current user data
    const [isSeller, setIsSeller] = useState(false); // checks if user is a seller
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});

    // Fetch All Products
    const fetchProducts = async () => {
        setProducts(dummyProducts);
    }

    // Add Cart Item Quantity
    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to Cart");
    }

    // Update Cart Item Quantity
    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart Updated");
    }

    // remove Product from Cart
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        toast.success("Remove from Cart");
        setCartItems(cartData);
    }


    useEffect(() => {
        fetchProducts();
    }, [])

    // 3️⃣ Combine all values in one object (easy to share)
    const value = { navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItem, removeFromCart, cartItems, searchQuery, setSearchQuery };

    // 4️⃣ Provide the value to all child components
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
