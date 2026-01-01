import { Head, Link } from "@inertiajs/react";

export default function Show({ transaction }) {
    return (
        <>
            <Head title={`Transaction #${transaction.id}`} />

            <div className="max-w-4xl mx-auto px-6 py-8">
                <Link href="/transactions" className="text-sm underline">
                    ← Back
                </Link>

                <h1 className="text-2xl mt-4 mb-2">
                    Transaction #{transaction.id}
                </h1>

                <div className="bg-white rounded shadow divide-y">
                    {transaction.items.map((item) => (
                        <div key={item.id} className="p-4 flex justify-between">
                            <div>
                                <p>{item.product.name}</p>
                                <p className="text-sm text-gray-500">
                                    ${item.price} × {item.quantity}
                                </p>
                            </div>

                            <p>${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}

                    <div className="p-4 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${transaction.total_amount}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
