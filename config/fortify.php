<?php

use Laravel\Fortify\Features;

return [

    'guard' => 'web',

    'middleware' => ['web'],

    'auth_middleware' => 'auth',

    'passwords' => 'users',

    'username' => 'email',

    'email' => 'email',

    'lowercase_usernames' => true,

    'home' => '/dashboard',

    'prefix' => '',

    'domain' => null,

    'views' => true,

    'limiters' => [
        'login' => 'login',
    ],

    'paths' => [],

    'redirects' => [],

    'features' => [
        Features::resetPasswords(),
        Features::emailVerification(),
    ],

];