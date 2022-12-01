import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);

        setTotalPrice((prevTotalPrice) => parseFloat((prevTotalPrice + product.price * quantity).toFixed(2)))
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

        if(checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct)=> {
                if(cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })
            setCartItems(updatedCartItems);
        } else {
            product.quantity = quantity;
            setCartItems([...cartItems, { ...product }]);
        }
        toast.success(`${qty} ${product.name} added to the cart.`)
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id)
        const newCartItems = cartItems.filter((item) => item._id !== product._id)

        setTotalPrice((prevTotalPrice) => parseFloat((prevTotalPrice - foundProduct.price * foundProduct.quantity).toFixed(2)))
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity) 
        setCartItems(newCartItems);
    }

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((product) => product._id === id);
        const newCartItems = cartItems.filter((item) => item._id !== id)

        if(value === 'inc') {
            const reorderCartItems = [...newCartItems, { ...foundProduct, 
                quantity: foundProduct.quantity + 1 }]
            reorderCartItems.move(reorderCartItems.lastIndexOf(foundProduct), index)
            setCartItems(reorderCartItems)
            setTotalPrice((prevTotalPrice) => parseFloat((prevTotalPrice + foundProduct.price).toFixed(2)))
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)
        } else if(value === 'dec') {
            if (foundProduct.quantity > 1) {
                const reorderCartItems = [...newCartItems, { ...foundProduct, 
                    quantity: foundProduct.quantity - 1 }]
                reorderCartItems.move(reorderCartItems.lastIndexOf(foundProduct), index)
                setCartItems(reorderCartItems)
                setTotalPrice((prevTotalPrice) => parseFloat((prevTotalPrice - foundProduct.price).toFixed(2)))
                setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
            }
        }
    }

    Array.prototype.move = function (from, to) {
        this.splice(to, 0, this.splice(from, 1)[0]);
    };

    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    }
    const decQty = () => {
        setQty((prevQty) => {
            if(prevQty - 1 < 1) return 1;
            return prevQty - 1
        });
    }

    return (
        <Context.Provider
            value={{
                showCart,
                setShowCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                toggleCartItemQuantity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context)