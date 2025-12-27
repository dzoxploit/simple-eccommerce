import { Head, router } from "@inertiajs/react";

export default function Cart({ cartItems }) {
    const updateQty = (id, qty) => {
        router.patch(
            `/cart/${id}`,
            { quantity: qty },
            {
                preserveScroll: true,
            }
        );
    };

    const removeItem = (id) => {
        router.delete(`/cart/${id}`, {
            preserveScroll: true,
        });
    };

    const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return (
        <>
            <Head title="My Cart" />

            <div className="max-w-4xl mx-auto py-8">
                <h1 className="text-xl font-semibold mb-6">Shopping Cart</h1>

                {cartItems.length === 0 && (
                    <p className="text-gray-500">Your cart is empty.</p>
                )}

                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between border-b py-4"
                    >
                        <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-500">
                                ${item.product.price}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    updateQty(item.id, item.quantity - 1)
                                }
                                className="px-2 border"
                            >
                                -
                            </button>

                            <span className="w-6 text-center">
                                {item.quantity}
                            </span>

                            <button
                                onClick={() =>
                                    updateQty(item.id, item.quantity + 1)
                                }
                                className="px-2 border"
                            >
                                +
                            </button>

                            <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 ml-4"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}

                {cartItems.length > 0 && (
                    <div className="text-right mt-6 font-semibold">
                        Total: ${total.toFixed(2)}
                    </div>
                )}
            </div>
        </>
    );
}
