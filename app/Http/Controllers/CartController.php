<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = Cart::where('user_id', Auth::id())->with('product')->get();
        return response()->json($cartItems);
    }

    public function countCart(){
        $count = Cart::where('user_id', auth()->id())->sum('quantity');
        return response()->json(['count' => $count]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = Cart::updateOrCreate(
            ['user_id' => Auth::id(), 'product_id' => $validated['product_id']],
            ['quantity' => $validated['quantity']]
        );

        return response()->json(['message' => 'Item added to cart', 'cartItem' => $cartItem]);
    }

    public function destroy($id)
    {
        $cartItem = Cart::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart']);
    }
}