<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected static function booted()
    {
        static::updated(function ($product) {
            if ($product->stock_quantity < 10) {
                \App\Jobs\NotifyLowStock::dispatch($product);
            }
        });
    }
}
