<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\MealPlan;
use Illuminate\Auth\Access\HandlesAuthorization;

class MealPlanPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:MealPlan');
    }

    public function view(AuthUser $authUser, MealPlan $mealPlan): bool
    {
        return $authUser->can('View:MealPlan');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:MealPlan');
    }

    public function update(AuthUser $authUser, MealPlan $mealPlan): bool
    {
        return $authUser->can('Update:MealPlan');
    }

    public function delete(AuthUser $authUser, MealPlan $mealPlan): bool
    {
        return $authUser->can('Delete:MealPlan');
    }

    public function restore(AuthUser $authUser, MealPlan $mealPlan): bool
    {
        return $authUser->can('Restore:MealPlan');
    }

    public function forceDelete(AuthUser $authUser, MealPlan $mealPlan): bool
    {
        return $authUser->can('ForceDelete:MealPlan');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:MealPlan');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:MealPlan');
    }

    public function replicate(AuthUser $authUser, MealPlan $mealPlan): bool
    {
        return $authUser->can('Replicate:MealPlan');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:MealPlan');
    }

}