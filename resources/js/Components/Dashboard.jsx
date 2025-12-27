import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductList from "./ProductList";
import Cart from "./Cart";

const Dashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [view, setView] = useState("products");

    useEffect(() => {
        axios
            .get("/api/authenticated")
            .then((response) => setIsAuthenticated(response.data.authenticated))
            .catch(() => setIsAuthenticated(false));
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <nav className="mb-4">
                <button
                    className={`mr-4 ${view === "products" ? "font-bold" : ""}`}
                    onClick={() => setView("products")}
                >
                    Products
                </button>
                {isAuthenticated && (
                    <button
                        className={`${view === "cart" ? "font-bold" : ""}`}
                        onClick={() => setView("cart")}
                    >
                        Cart
                    </button>
                )}
            </nav>
            {view === "products" && <ProductList />}
            {view === "cart" && isAuthenticated && <Cart />}
        </div>
    );
};

export default Dashboard;
