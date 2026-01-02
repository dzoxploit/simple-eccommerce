<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use Illuminate\Support\Facades\Notification;
use App\Notifications\LowStockNotification;

class CheckLowStock extends Command
{
    protected $signature = 'stock:check-low';

    protected $description = 'Check product low stock and notify admin';

    public function handle()
    {
        $threshold = 4; // Minimum Stock

        $products = Product::where('stock', '<=', $threshold)
            ->where('low_stock_notified', false)
            ->get();

        foreach ($products as $product) {
            // kirim notifikasi (email / database)
            Notification::route('mail', 'admin@email.com')
                ->notify(new LowStockNotification($product));

            // tandai sudah dinotifikasi
            $product->update([
                'low_stock_notified' => true,
            ]);

            $this->info("Low stock notified: {$product->name}");
        }

        return Command::SUCCESS;
    }
}
