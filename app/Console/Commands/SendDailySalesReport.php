<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SendDailySalesReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-daily-sales-report';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a daily sales report to the admin';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $sales = \DB::table('carts')
            ->join('products', 'carts.product_id', '=', 'products.id')
            ->select('products.name', \DB::raw('SUM(carts.quantity) as total_sold'))
            ->groupBy('products.name')
            ->get();

        $report = "Daily Sales Report:\n\n";
        foreach ($sales as $sale) {
            $report .= "Product: {$sale->name}, Total Sold: {$sale->total_sold}\n";
        }

        \Mail::raw($report, function ($message) {
            $message->to('admin@example.com')
                    ->subject('Daily Sales Report');
        });

        $this->info('Daily sales report sent successfully.');
    }
}
