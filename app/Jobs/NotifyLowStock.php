<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class NotifyLowStock implements ShouldQueue
{
    use Queueable;

    protected $product;

    /**
     * Create a new job instance.
     */
    public function __construct($product)
    {
        $this->product = $product;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        \Mail::raw("The product '{$this->product->name}' is running low on stock.", function ($message) {
            $message->to('admin@example.com')
                    ->subject('Low Stock Alert');
        });
    }
}
