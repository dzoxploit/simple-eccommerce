<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\TransactionDetails;

class TransactionController extends Controller
{
    public function __construct()
    {
        // WAJIB LOGIN
        $this->middleware('auth');
    }

    /**
     * Checkout cart → create transaction
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Ambil semua cart user
        $carts = Cart::with('product')
            ->where('user_id', $user->id)
            ->get();

        if ($carts->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty'
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Hitung total
            $total = 0;
            foreach ($carts as $cart) {
                $total += $cart->product->price * $cart->quantity;
            }

            // Create transaction
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'total'   => $total,
                'status'  => 'PAID', // bisa PENDING kalau pakai payment gateway
            ]);

            // Simpan items
            foreach ($carts as $cart) {
                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id'     => $cart->product_id,
                    'quantity'       => $cart->quantity,
                    'price'          => $cart->product->price,
                ]);
            }

            // Update cart setelah checkout
            Cart::where('user_id', $user->id)
                ->where('status', true)
                ->update(['status' => false]);

            DB::commit();

            // Load relasi untuk email
            $transaction->load(['items.product', 'user']);

            // Kirim email
            Mail::to($user->email)
                ->send(new TransactionDetails($transaction));

            // ✅ REDIRECT KE TRANSACTION LIST
            return redirect()
                ->route('transactions.index')
                ->with('success', 'Checkout success');

        } catch (\Throwable $e) {
            DB::rollBack();

            return redirect()
                ->route('transactions.index')
                ->with('error', 'Checkout failed', $e->getMessage());
        }
    }

    /**
     * Detail transaksi (AUTH USER ONLY)
     */
    public function show($id)
    {
        $transaction = Transaction::with(['items.product'])
            ->where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * History transaksi user
     */
    public function index()
    {
        $transactions = Transaction::with('items.product')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }
}