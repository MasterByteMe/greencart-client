// This file defines your Context Provider component
// It manages and shares state across your entire app
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";
import toast from "react-hot-toast";
import axios from "axios";

// Enable sending and receiving cookies (for authentication) with every Axios request
axios.defaults.withCredentials = true;

// Set the base URL for all Axios requests using the environment variable from Vite
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY;


    // 1️⃣ React Router's navigation hook (to move between pages)
    const navigate = useNavigate();
    // 2️⃣ Global states shared across the app
    const [user, setUser] = useState(null);       // holds the current user data
    const [isSeller, setIsSeller] = useState(false); // checks if user is a seller
    const [isAuthLoaded, setIsAuthLoaded] = useState(false);

    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});



    // ✅ Fetch user and mark auth as loaded after done
    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/user/is-auth");
            if (data.success) {
                setUser(data.user);
                setCartItems(data.user.cartItems || {});
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setIsAuthLoaded(true); // ✅ Always mark finished
        }
    };

    // Fetch Seller Status
    const fetchSeller = async () => {
        try {
            const { data } = await axios.get("/api/seller/is-auth");
            setIsSeller(data.success);
        } catch {
            setIsSeller(false);
        }
    };


    // Fetch All Products
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("/api/product/list");
            if (data.success) setProducts(data.products);
            else toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

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

    // Get Cart Item Count
    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item];
        }
        return totalCount;
    }

    // Get Cart Total Amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }



    useEffect(() => {
        fetchUser()
        fetchSeller()
        fetchProducts();
    }, [])


    // Update Database Cart Items
    useEffect(() => {
        const updateCart = async () => {
            try {
                const { data } = await axios.post('/api/cart/update', { cartItems })
                if (!data.success) {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
        if (user) {
            updateCart()
        }
    }, [cartItems, user])




    // 3️⃣ Combine all values in one object (easy to share)
    const value = { navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItem, removeFromCart, cartItems, searchQuery, setSearchQuery, getCartCount, getCartAmount, axios, fetchProducts, setCartItems, isAuthLoaded, fetchUser };

    // 4️⃣ Provide the value to all child components
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
