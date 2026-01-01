import { Head, Link, router } from "@inertiajs/react";

export default function Cart({ carts }) {
    const total = carts.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const updateQty = (id, qty) => {
        if (qty < 1) return;

        router.patch(
            `/cart/${id}`,
            { quantity: qty },
            {
                preserveScroll: true,
            }
        );
    };

    const removeItem = (id) => {
        if (!confirm("Remove this item?")) return;

        router.delete(`/cart/${id}`, {
            preserveScroll: true,
        });
    };

    const checkout = () => {
        if (!confirm("Proceed to checkout?")) return;

        router.post("/checkout");
    };

    return (
        <>
            <Head title="Your Cart" />

            <div className="max-w-5xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>

                {carts.length === 0 && (
                    <p>
                        Cart is empty.{" "}
                        <Link href="/" className="underline">
                            Continue shopping
                        </Link>
                    </p>
                )}

                {carts.length > 0 && (
                    <div className="bg-white rounded shadow divide-y">
                        {carts.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 p-4"
                            >
                                <img
                                    src={`https://picsum.photos/seed/${item.product.id}/80/80`}
                                    className="w-20 h-20 rounded"
                                />

                                <div className="flex-1">
                                    <h3 className="font-medium">
                                        {item.product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        ${item.product.price}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            updateQty(
                                                item.id,
                                                item.quantity - 1
                                            )
                                        }
                                        className="border px-2"
                                    >
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button
                                        onClick={() =>
                                            updateQty(
                                                item.id,
                                                item.quantity + 1
                                            )
                                        }
                                        className="border px-2"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="w-24 text-right">
                                    $
                                    {(
                                        item.product.price * item.quantity
                                    ).toFixed(2)}
                                </div>

                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-500 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <div className="p-4 flex justify-between">
                            <strong>Total: ${total.toFixed(2)}</strong>

                            <button
                                onClick={checkout}
                                className="bg-black text-white px-4 py-2 rounded"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
