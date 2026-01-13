<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\FoodMenu;
use Illuminate\Auth\Access\HandlesAuthorization;

class FoodMenuPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:FoodMenu');
    }

    public function view(AuthUser $authUser, FoodMenu $foodMenu): bool
    {
        return $authUser->can('View:FoodMenu');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:FoodMenu');
    }

    public function update(AuthUser $authUser, FoodMenu $foodMenu): bool
    {
        return $authUser->can('Update:FoodMenu');
    }

    public function delete(AuthUser $authUser, FoodMenu $foodMenu): bool
    {
        return $authUser->can('Delete:FoodMenu');
    }

    public function restore(AuthUser $authUser, FoodMenu $foodMenu): bool
    {
        return $authUser->can('Restore:FoodMenu');
    }

    public function forceDelete(AuthUser $authUser, FoodMenu $foodMenu): bool
    {
        return $authUser->can('ForceDelete:FoodMenu');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:FoodMenu');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:FoodMenu');
    }

    public function replicate(AuthUser $authUser, FoodMenu $foodMenu): bool
    {
        return $authUser->can('Replicate:FoodMenu');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:FoodMenu');
    }

}