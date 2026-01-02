<?php

namespace App\Jobs;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class NotifyLowStock implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public Product $product;

    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function handle(): void
    {
        Mail::raw(
            "⚠️ Product '{$this->product->name}' is running low.\nRemaining stock: {$this->product->stock}",
            function ($message) {
                $message->to(config('mail.admin_email', 'admin@example.com'))
                        ->subject('Low Stock Alert');
            }
        );
    }
}
