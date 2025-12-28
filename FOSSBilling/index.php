<?php

/**
 * Copyright 2022-2025 FOSSBilling
 * Copyright 2011-2021 BoxBilling, Inc.
 * SPDX-License-Identifier: Apache-2.0.
 *
 * @copyright FOSSBilling (https://www.fossbilling.org)
 * @license http://www.apache.org/licenses/LICENSE-2.0 Apache-2.0
 */

require __DIR__ . DIRECTORY_SEPARATOR . 'load.php';
global $di;

// Setting up the debug bar
$debugBar = new DebugBar\StandardDebugBar();
$debugBar['request']->useHtmlVarDumper();
$debugBar['messages']->useHtmlVarDumper();

$config = FOSSBilling\Config::getConfig();
$config['info']['salt'] = '********';
$config['db'] = array_fill_keys(array_keys($config['db']), '********');

$configCollector = new DebugBar\DataCollector\ConfigCollector($config);
$configCollector->useHtmlVarDumper();

$debugBar->addCollector($configCollector);

// Get the request URL
$url = $_GET['_url'] ?? parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Rewrite for custom pages
if (str_starts_with($url, '/page/')) {
    $url = substr_replace($url, '/custompages/', 0, 6);
}

// Set the final URL
$_GET['_url'] = $url;
$http_err_code = $_GET['_errcode'] ?? null;

$debugBar['time']->startMeasure('session_start', 'Starting / restoring the session');

/*
 * Workaround: Session IDs get reset when using PGs like PayPal because of the `samesite=strict` cookie attribute, resulting in the client getting logged out.
 * Internally the return and cancel URLs get a restore_session GET parameter attached to them with the proper session ID to restore, so we do so here.
 */
if (!empty($_GET['restore_session'])) {
    session_id($_GET['restore_session']);
}

$di['session'];
$debugBar['time']->stopMeasure('session_start');

// InfluenceCore SSO bootstrap (pose une session PHP FOSSBilling, puis redirige vers /billing)
if (isset($_GET['_url']) && $_GET['_url'] === '/sso/influencecore') {
    $secret = getenv('INFLUENCECORE_INTERNAL_KEY') ?: '';
    $token = $_GET['token'] ?? '';
    $next = $_GET['next'] ?? ADMIN_PREFIX . '/';

    $safeNext = is_string($next) && str_starts_with($next, '/') ? $next : (ADMIN_PREFIX . '/');

    $deny = function (string $msg) {
        http_response_code(403);
        echo $msg;
        exit;
    };

    if (!$secret) {
        $deny('INFLUENCECORE_INTERNAL_KEY manquant');
    }
    if (!is_string($token) || !$token || strpos($token, '.') === false) {
        $deny('Token manquant');
    }

    [$bodyB64, $sigB64] = explode('.', $token, 2);
    $calc = hash_hmac('sha256', $bodyB64, $secret, true);
    $calcB64 = rtrim(strtr(base64_encode($calc), '+/', '-_'), '=');
    if (!hash_equals($calcB64, $sigB64)) {
        $deny('Signature invalide');
    }

    $json = base64_decode(strtr($bodyB64, '-_', '+/'));
    $payload = json_decode($json ?: '', true);
    if (!is_array($payload)) {
        $deny('Payload invalide');
    }

    $now = time();
    $exp = isset($payload['exp']) ? (int) $payload['exp'] : 0;
    if (!$exp || $exp < $now) {
        $deny('Token expiré');
    }

    $email = strtolower(trim((string) ($payload['email'] ?? '')));
    $name = trim((string) ($payload['name'] ?? 'InfluenceCore'));
    $roles = $payload['roles'] ?? [];
    $roles = is_array($roles) ? array_map('strval', $roles) : [];

    if (!$email) {
        $deny('Email manquant');
    }

    // Règle simple : si Keycloak donne "admin" ou "billing", on connecte en staff/admin FOSSBilling.
    $isAdmin = in_array('admin', $roles, true) || in_array('influencecore-admin', $roles, true);
    $isStaff = $isAdmin || in_array('billing', $roles, true) || in_array('staff', $roles, true);
    if (!$isStaff) {
        $deny('Accès refusé (rôles insuffisants)');
    }

    // Provisioning admin/staff minimal
    /** @var \RedBeanPHP\OODBBean|\Model_Admin|null $admin */
    $admin = $di['db']->findOne('Admin', 'email = ?', [$email]);
    if (!$admin instanceof \Model_Admin) {
        $admin = $di['db']->dispense('Admin');
        $admin->admin_group_id = 1;
        $admin->email = $email;
        $admin->name = $name ?: 'InfluenceCore';
        $admin->role = $isAdmin ? \Model_Admin::ROLE_ADMIN : \Model_Admin::ROLE_STAFF;
        $admin->status = \Model_Admin::STATUS_ACTIVE;
        $admin->pass = $di['password']->hashIt(bin2hex(random_bytes(16)));
        $admin->created_at = date('Y-m-d H:i:s');
        $admin->updated_at = date('Y-m-d H:i:s');
        $di['db']->store($admin);
    } else {
        // Sync role minimal
        $admin->role = $isAdmin ? \Model_Admin::ROLE_ADMIN : \Model_Admin::ROLE_STAFF;
        $admin->status = \Model_Admin::STATUS_ACTIVE;
        $admin->name = $name ?: $admin->name;
        $admin->updated_at = date('Y-m-d H:i:s');
        $di['db']->store($admin);
    }

    session_regenerate_id();
    $di['session']->set('admin', [
        'id' => $admin->id,
        'email' => $admin->email,
        'name' => $admin->name,
        'role' => $admin->role,
    ]);

    header("Location: {$safeNext}");
    exit;
}

if (strncasecmp($url, ADMIN_PREFIX, strlen(ADMIN_PREFIX)) === 0) {
    define('ADMIN_AREA', true);
    $appUrl = str_replace(ADMIN_PREFIX, '', preg_replace('/\?.+/', '', $url));
    $app = new Box_AppAdmin([], $debugBar);
} else {
    define('ADMIN_AREA', false);
    $appUrl = $url;
    $app = new Box_AppClient([], $debugBar);
}

$app->setUrl($appUrl);
$app->setDi($di);

$debugBar['time']->startMeasure('translate', 'Setting up translations');
$di['translate']();
$debugBar['time']->stopMeasure('translate');

// If HTTP error code has been passed, handle it.
if (!is_null($http_err_code)) {
    switch ($http_err_code) {
        case '404':
            $e = new FOSSBilling\Exception('Page :url not found', [':url' => $url], 404);
            echo $app->show404($e);

            break;
        default:
            $http_err_code = intval($http_err_code);
            http_response_code($http_err_code);
            $e = new FOSSBilling\Exception('HTTP Error :err_code occurred while attempting to load :url', [':err_code' => $http_err_code, ':url' => $url], $http_err_code);
            echo $app->render('error', ['exception' => $e]);
    }
    exit;
}

// If no HTTP error passed, run the app.
echo $app->run();
exit;
