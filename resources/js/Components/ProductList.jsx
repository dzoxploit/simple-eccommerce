import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios
            .get("/api/products")
            .then((response) => setProducts(response.data))
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Product List</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="border p-4 rounded">
                        <h2 className="text-xl font-semibold">
                            {product.name}
                        </h2>
                        <p className="text-gray-700">{product.description}</p>
                        <p className="text-green-500 font-bold">
                            ${product.price}
                        </p>
                        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
