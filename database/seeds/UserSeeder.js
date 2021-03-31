'use strict';

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const User = use('App/Models/User');
const Role = use('Adonis/Acl/Role');
const Permission = use('Adonis/Acl/Permission');

class UserSeeder {
  async run() {
    const roleSet = [
      { name: 'SuperAdmin', slug: 'superAdmin', description: '최고관리자' },
      { name: 'Admin', slug: 'admin', description: '관리자' },
      { name: 'User', slug: 'user', description: '유저' },
    ];
    const [roleSuperAdmin, roleAdmin, roleUser] = await Promise.all(roleSet.map((role) => Role.create(role)));

    const userSet = [
      { email: 'super_admin@admin.admin', name: 'Super Admin', password: 'adm!n@' },
      { email: 'admin@admin.admin', name: 'Admin', password: 'adm!n@' },
      { email: 'user@user.user', name: 'User', password: 'user' },
    ];
    const [super_admin, admin, user] = await Promise.all(userSet.map((user) => User.create(user)));

    await super_admin.roles().attach([roleSuperAdmin.id]);
    await admin.roles().attach([roleAdmin.id]);
    await user.roles().attach([roleUser.id]);

    const testUser = await User.find(1);

    console.log('--- user role ', await testUser.getRoles());

    const permissionSet = [
      { slug: 'create_users', name: 'Create Users', description: 'create users permission' },
      { slug: 'read_users', name: 'Read Users', description: 'read users permission' },
      { slug: 'update_users', name: 'Update Users', description: 'update users permission' },
      { slug: 'delete_users', name: 'Delete Users', description: 'delete users permission' },
    ];
    const [
      createUsersPermission,
      readUsersPermission,
      updateUsersPermission,
      deleteUsersPermission,
    ] = await Promise.all(permissionSet.map((permission) => Permission.create(permission)));

    // role permission
    await roleSuperAdmin
      .permissions()
      .attach([createUsersPermission.id, readUsersPermission.id, updateUsersPermission.id, deleteUsersPermission.id]);
    await roleAdmin.permissions().attach([createUsersPermission.id, readUsersPermission.id, updateUsersPermission.id]);
    await roleUser.permissions().attach([readUsersPermission.id]);

    //  user permission
    await super_admin
      .permissions()
      .attach([createUsersPermission.id, readUsersPermission.id, updateUsersPermission.id, deleteUsersPermission.id]);
    await admin.permissions().attach([createUsersPermission.id, readUsersPermission.id, updateUsersPermission.id]);
    await user.permissions().attach([readUsersPermission.id]);
  }
}

module.exports = UserSeeder;
