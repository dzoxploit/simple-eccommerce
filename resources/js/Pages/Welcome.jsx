import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Welcome() {
    const { auth } = usePage().props; // auth.user dari Laravel
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("/api/products")
            .then((res) => setProducts(res.data))
            .finally(() => setLoading(false));
    }, []);

    const addToCart = async (productId) => {
        try {
            await axios.post("/cart", {
                product_id: productId,
                quantity: 1,
            });
            alert("Product added to cart");
        } catch (err) {
            if (err.response?.status === 401) {
                window.location.href = "/login";
            }
        }
    };

    return (
        <>
            <Head title="SimpleStore" />

            <div className="min-h-screen bg-gray-100">
                {/* HEADER */}
                <header className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <h1 className="text-xl font-semibold">SimpleStore</h1>

                        {/* RIGHT MENU */}
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <>
                                    <Link
                                        href="/cart"
                                        className="text-sm font-medium hover:underline"
                                    >
                                        Cart
                                    </Link>
                                    <span className="text-sm text-gray-600">
                                        {auth.user.name}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-sm hover:underline"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="text-sm hover:underline"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* CONTENT */}
                <main className="max-w-7xl mx-auto px-6 py-8">
                    <h2 className="text-xl font-semibold mb-6">
                        Product Catalog
                    </h2>

                    {/* LOADING */}
                    {loading && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded shadow p-3 animate-pulse"
                                >
                                    <div className="h-28 bg-gray-200 rounded mb-3" />
                                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* PRODUCTS */}
                    {!loading && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded shadow hover:shadow-md transition overflow-hidden"
                                >
                                    {/* IMAGE */}
                                    <img
                                        src={`https://picsum.photos/seed/${product.id}/300/200`}
                                        alt={product.name}
                                        className="h-28 w-full object-cover"
                                    />

                                    {/* BODY */}
                                    <div className="p-3">
                                        <h3 className="text-sm font-medium line-clamp-2 mb-1">
                                            {product.name}
                                        </h3>

                                        <p className="text-sm font-semibold mb-2">
                                            ${product.price}
                                        </p>

                                        {/* GUARD ADD TO CART */}
                                        {auth.user ? (
                                            <button
                                                onClick={() =>
                                                    addToCart(product.id)
                                                }
                                                className="w-full text-xs py-1.5 bg-black text-white rounded hover:bg-gray-800 transition"
                                            >
                                                Add to Cart
                                            </button>
                                        ) : (
                                            <Link
                                                href="/login"
                                                className="block text-center text-xs py-1.5 border rounded hover:bg-gray-50"
                                            >
                                                Login to Add
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
