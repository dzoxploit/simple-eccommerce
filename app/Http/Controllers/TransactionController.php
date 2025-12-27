<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    // Create a new transaction
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $transaction = Transaction::create([
            'user_id' => Auth::id(),
            'product_id' => $validated['product_id'],
            'quantity' => $validated['quantity'],
            'total_price' => $validated['quantity'] * $request->input('price'),
        ]);

        return response()->json(['message' => 'Transaction successful', 'transaction' => $transaction], 201);
    }

    // View transaction details
    public function show($id)
    {
        $transaction = Transaction::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        return response()->json($transaction);
    }

    // List transaction history for a user
    public function index()
    {
        $transactions = Transaction::where('user_id', Auth::id())->get();

        return response()->json($transactions);
    }
}