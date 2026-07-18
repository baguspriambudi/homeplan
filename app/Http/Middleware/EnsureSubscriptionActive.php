<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSubscriptionActive
{
    /**
     * User dengan masa aktif habis dialihkan ke halaman perpanjangan.
     * Super admin selalu lolos.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $user->hasActiveSubscription()) {
            return redirect()->route('subscription.expired');
        }

        return $next($request);
    }
}
