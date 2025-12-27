import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Welcome() {
    const { auth } = usePage().props;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);

    // dropdown
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // toast
    const [toast, setToast] = useState("");

    useEffect(() => {
        axios
            .get("/api/products")
            .then((res) => setProducts(res.data))
            .finally(() => setLoading(false));
    }, []);

    // fetch cart count
    useEffect(() => {
        if (!auth.user) return;

        axios
            .get("/api/cart/count")
            .then((res) => setCartCount(res.data.count))
            .catch(() => {});
    }, [auth.user]);

    // close dropdown
    useEffect(() => {
        const handler = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(""), 2000);
    };

    const addToCart = async (productId) => {
        try {
            await axios.post("/cart", {
                product_id: productId,
                quantity: 1,
            });

            setCartCount((prev) => prev + 1);
            showToast("Added to cart");
        } catch (err) {
            if (err.response?.status === 401) {
                window.location.href = "/login";
            }
        }
    };

    return (
        <>
            <Head title="SimpleStore" />

            <div className="min-h-screen bg-gray-100 text-gray-900">
                {/* HEADER */}
                <header className="bg-white border-b sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <h1 className="text-xl font-semibold">SimpleStore</h1>

                        <div className="flex items-center gap-6">
                            {auth.user && (
                                <Link
                                    href="/cart"
                                    className="relative text-sm font-medium"
                                >
                                    Cart
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            )}

                            {auth.user ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setOpen(!open)}
                                        className="flex items-center gap-2 text-sm font-medium hover:underline"
                                    >
                                        {auth.user.name}
                                        <svg
                                            className="w-4 h-4"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {open && (
                                        <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-md">
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                href="/cart"
                                                className="block px-4 py-2 text-sm hover:bg-gray-100"
                                            >
                                                Cart
                                            </Link>
                                            <form
                                                method="POST"
                                                action="/logout"
                                            >
                                                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                                    Logout
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
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

                    {!loading && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded shadow hover:shadow-md overflow-hidden"
                                >
                                    <img
                                        src={`https://picsum.photos/seed/${product.id}/300/200`}
                                        className="h-28 w-full object-cover"
                                    />
                                    <div className="p-3">
                                        <h3 className="text-sm font-medium line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm font-semibold mb-2">
                                            ${product.price}
                                        </p>
                                        <button
                                            onClick={() =>
                                                addToCart(product.id)
                                            }
                                            className="w-full text-xs py-1.5 bg-black text-white rounded hover:bg-gray-800"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                {/* TOAST */}
                {toast && (
                    <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded shadow-lg text-sm">
                        {toast}
                    </div>
                )}
            </div>
        </>
    );
}
