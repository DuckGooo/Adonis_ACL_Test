'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/User')} */
const Route = use('Route');

// Route.on('/').render('welcome')
Route.get('/', ({ response }) => response.redirect('/docs'));

Route.get('/api/hello', 'TestController.hello');

Route.post('/sign-up', 'AuthController.signUp');
Route.post('/sign-in', 'AuthController.signIn');
Route.post('/articles', 'ArticleController.create').middleware(['auth:jwt', 'can:create_users']);

// check roles
Route.post('/posts', 'TestController.hello').middleware(['auth', 'is:(admin)']);

// check permissions
// Route.get('/posts', 'TestController.hello').middleware(['auth:jwt', 'can:read_posts']);

// scopes (using permissions table for scopes)
// Route.get('/posts', 'TestController.hello').middleware(['auth:jwt', 'scope:posts.*']);
