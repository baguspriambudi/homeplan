<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    public function getHeading(): ?string
    {
        return null;
    }

    public function getWidgets(): array
    {
        return [
            \App\Filament\Widgets\GlobalFiscalFilter::class,
            \App\Filament\Widgets\ExpenseOverview::class,
            \App\Filament\Widgets\SavingsOverviewWidget::class,
            \App\Filament\Widgets\SpendingSummaryWidget::class,
        ];
    }
}
