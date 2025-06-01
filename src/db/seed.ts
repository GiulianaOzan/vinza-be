import { hashPassword } from '@/auth/auth';
import { Permissions } from '@/rbac/permissions';
import { permissionsService, rolesService } from '@/rbac/service';
import { User } from '@/users/model';
import { Bodega } from '@/bodega/model';

async function seed() {
  try {
    // Create bodega 'zuccardi'
    const zuccardi = await Bodega.create({
      nombre: 'zuccardi',
      descripcion: 'Bodega Zuccardi',
    });

    // Create admin role (all permissions except SUDO), related to zuccardi
    const adminRole = await rolesService.create({
      nombre: 'ADMIN',
      bodegaId: zuccardi.id,
    });

    // Create all permissions
    const permissions = await Promise.all(
      Object.values(Permissions).map(async (permission) => {
        return await permissionsService.create({
          nombre: permission,
          clave: permission,
        });
      }),
    );

    // All permissions except SUDO for admin
    const adminPermissions = permissions.filter(
      (p) => p.nombre !== Permissions.SUDO,
    );
    await rolesService.update(adminRole.id, {
      permisos: adminPermissions.map((p) => p.id),
    });

    // Create admin user related to zuccardi
    const adminPassword = await hashPassword('admin123');
    const adminUser = await User.create({
      nombre: 'Admin',
      apellido: 'User',
      email: 'admin@example.com',
      contrasena: adminPassword,
      roles: [adminRole.id],
      bodegaId: zuccardi.id,
    });
    await adminUser.$set('roles', [adminRole.id]);

    // This new user is a vinza admin, so there is no bodega related to the
    // role nor the user itself

    // Create SUDO role (all permissions), no bodega related
    const sudoRole = await rolesService.create({
      nombre: 'SUDO',
    });
    await rolesService.update(sudoRole.id, {
      permisos: permissions.map((p) => p.id),
    });

    // Create sudoer user with SUDO role and no bodega
    const sudoPassword = await hashPassword('sudo123');
    const sudoer = await User.create({
      nombre: 'sudoer',
      apellido: 'sudoer',
      email: 'sudo@sudo.com',
      contrasena: sudoPassword,
      roles: [sudoRole.id],
    });
    await sudoer.$set('roles', [sudoRole.id]);

    // eslint-disable-next-line no-console
    console.log('Database seeded successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run the seed
seed()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Seed completed');
    process.exit(0);
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Seed failed:', error);
    process.exit(1);
  });
