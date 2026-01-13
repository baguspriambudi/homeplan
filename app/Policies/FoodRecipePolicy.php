<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\FoodRecipe;
use Illuminate\Auth\Access\HandlesAuthorization;

class FoodRecipePolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:FoodRecipe');
    }

    public function view(AuthUser $authUser, FoodRecipe $foodRecipe): bool
    {
        return $authUser->can('View:FoodRecipe');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:FoodRecipe');
    }

    public function update(AuthUser $authUser, FoodRecipe $foodRecipe): bool
    {
        return $authUser->can('Update:FoodRecipe');
    }

    public function delete(AuthUser $authUser, FoodRecipe $foodRecipe): bool
    {
        return $authUser->can('Delete:FoodRecipe');
    }

    public function restore(AuthUser $authUser, FoodRecipe $foodRecipe): bool
    {
        return $authUser->can('Restore:FoodRecipe');
    }

    public function forceDelete(AuthUser $authUser, FoodRecipe $foodRecipe): bool
    {
        return $authUser->can('ForceDelete:FoodRecipe');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:FoodRecipe');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:FoodRecipe');
    }

    public function replicate(AuthUser $authUser, FoodRecipe $foodRecipe): bool
    {
        return $authUser->can('Replicate:FoodRecipe');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:FoodRecipe');
    }

}