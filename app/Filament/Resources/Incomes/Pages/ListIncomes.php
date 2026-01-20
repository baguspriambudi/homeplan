<?php

namespace App\Filament\Resources\Incomes\Pages;

use App\Filament\Resources\Incomes\IncomeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListIncomes extends ListRecords
{
    protected static string $resource = IncomeResource::class;

    public function getHeading(): string
    {
        return '';
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->label('Add Income')
                ->modalHeading('Create New Income')
                ->modalWidth('4xl')
                ->createAnother(false),
        ];
    }
}
