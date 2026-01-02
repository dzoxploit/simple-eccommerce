<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Product;

class LowStockNotification extends Notification
{
    public function __construct(public Product $product) {}

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('⚠️ Low Stock Alert')
            ->line("Product **{$this->product->name}** is running low.")
            ->line("Remaining stock: {$this->product->stock}")
            ->action('View Product', url('/admin/products'))
            ->line('Please restock immediately.');
    }
}
