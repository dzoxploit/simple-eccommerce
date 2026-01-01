import { Head, Link } from "@inertiajs/react";

export default function Transactions({ transactions }) {
    return (
        <>
            <Head title="My Transactions" />

            <div className="max-w-5xl mx-auto px-6 py-8">
                <h1 className="text-2xl mb-6">My Transactions</h1>

                <div className="bg-white shadow rounded divide-y">
                    {transactions.map((trx) => (
                        <div key={trx.id} className="p-4 flex justify-between">
                            <div>
                                <p className="font-medium">
                                    Transaction #{trx.id}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {trx.created_at}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold">
                                    ${trx.total_amount}
                                </p>
                                <Link
                                    href={`/transactions/${trx.id}`}
                                    className="text-blue-600 text-sm"
                                >
                                    View →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
