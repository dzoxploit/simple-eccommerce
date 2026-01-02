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
use Inertia\Inertia;

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

        $carts = Cart::with('product')
            ->where('user_id', $user->id)
            ->where('status', true)
            ->get();

        if ($carts->isEmpty()) {
            return back()->with('error', 'Cart is empty');
        }

        DB::beginTransaction();

        try {
            // ✅ VALIDASI STOCK
            foreach ($carts as $cart) {
                if ($cart->product->stock < $cart->quantity) {
                    throw new \Exception("Stock for {$cart->product->name} is not enough");
                }
            }

            // Hitung total
            $total = $carts->sum(fn ($cart) =>
                $cart->product->price * $cart->quantity
            );

            // Create transaction
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'total'   => $total,
                'status'  => 'PAID',
            ]);

            // Simpan items + update stock
            foreach ($carts as $cart) {
                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id'     => $cart->product_id,
                    'quantity'       => $cart->quantity,
                    'price'          => $cart->product->price,
                ]);

                // ⬇️ UPDATE STOCK
                $cart->product->decrement('stock', $cart->quantity);

                // 🚨 LOW STOCK CHECK
                if ($cart->product->stock <= 5) {
                    NotifyLowStock::dispatch($cart->product);
                }
            }

            // Update cart status
            Cart::where('user_id', $user->id)
                ->where('status', true)
                ->update(['status' => false]);

            DB::commit();

            // Load relasi untuk email
            $transaction->load(['items.product', 'user']);

            // Kirim email transaksi
            Mail::to($user->email)
                ->send(new TransactionDetails($transaction));

            return redirect()
                ->route('transactions.index')
                ->with('success', 'Checkout success');

        } catch (\Throwable $e) {
            DB::rollBack();

            return back()->with('error', $e->getMessage());
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