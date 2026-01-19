<?php

namespace App\Filament\Resources\Incomes\Pages;

use App\Filament\Resources\Incomes\IncomeResource;
use Filament\Actions\CreateAction;
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
            CreateAction::make()
                ->label('Add Income')
                ->modalHeading('Create New Income')
                ->modalWidth('4xl')
                ->using(function (array $data, string $model): Model {
                    return $model::create($data);
                })
                ->createAnother(false),
        ];
    }
}
