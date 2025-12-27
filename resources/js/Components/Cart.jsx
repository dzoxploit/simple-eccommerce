import React, { useEffect, useState } from "react";
import axios from "axios";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        axios
            .get("/api/cart")
            .then((response) => setCartItems(response.data))
            .catch((error) =>
                console.error("Error fetching cart items:", error)
            );
    }, []);

    const handleRemove = (id) => {
        axios
            .delete(`/api/cart/${id}`)
            .then(() =>
                setCartItems(cartItems.filter((item) => item.id !== id))
            )
            .catch((error) => console.error("Error removing item:", error));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
            {cartItems.length > 0 ? (
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="border p-4 rounded flex justify-between items-center"
                        >
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {item.product.name}
                                </h2>
                                <p className="text-gray-700">
                                    Quantity: {item.quantity}
                                </p>
                                <p className="text-green-500 font-bold">
                                    Total: ${item.total_price}
                                </p>
                            </div>
                            <button
                                onClick={() => handleRemove(item.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-700">Your cart is empty.</p>
            )}
        </div>
    );
};

export default Cart;
