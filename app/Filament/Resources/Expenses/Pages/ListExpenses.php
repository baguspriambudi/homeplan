<?php

namespace App\Filament\Resources\Expenses\Pages;

use Filament\Actions\CreateAction;
use Illuminate\Database\Eloquent\Model;
use Filament\Resources\Pages\ListRecords;
use App\Filament\Resources\Expenses\ExpenseResource;

class ListExpenses extends ListRecords
{
    protected static string $resource = ExpenseResource::class;

    public function getHeading(): string
    {
        return '';
    }

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->label('Add Spending')
                ->modalHeading('Create New Spending')
                ->modalWidth('4xl')
                ->using(function (array $data, string $model): Model {
                    return $model::create($data);
                })
                ->createAnother(false),
        ];
    }
}
