<html>
<body>
    <h1>Transaction Details</h1>
    <p>Thank you for your purchase!</p>
    <p>Transaction ID: {{ $transaction->id }}</p>
    <p>Total: ${{ $transaction->total }}</p>
    <p>Products:</p>
    <ul>
        @foreach ($transaction->products as $product)
            <li>{{ $product->name }} - Quantity: {{ $product->pivot->quantity }}</li>
        @endforeach
    </ul>
</body>
</html>