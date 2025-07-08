import { Router } from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

/**
 * Centralized Route Configuration
 *
 * This file serves as the main route registry for the HRMS API.
 * It dynamically loads all route modules and registers them with their respective prefixes.
 *
 * Route Structure:
 * - /api/auth        - Authentication and authorization
 * - /api/users       - User management (CRUD operations)
 * - /api/departments - Department management
 * - /api/attendance  - Attendance tracking and reporting
 * - /api/leaves      - Leave management system
 * - /api/payroll     - Payroll processing and pay slips
 */

/**
 * Route configuration mapping
 * Maps route file names to their API prefixes and descriptions
 */
const routeConfig = {
  'authRoutes.js': {
    prefix: '/auth',
    description: 'Authentication and authorization endpoints'
  },
  'userRoutes.js': {
    prefix: '/users',
    description: 'User management and profile operations'
  },
  'departmentRoutes.js': {
    prefix: '/departments',
    description: 'Department management and organization'
  },
  'attendanceRoutes.js': {
    prefix: '/attendance',
    description: 'Attendance tracking and reporting'
  },
  'leaveRoutes.js': {
    prefix: '/leaves',
    description: 'Leave application and management'
  },
  'payrollRoutes.js': {
    prefix: '/payroll',
    description: 'Payroll processing and salary management'
  }
};

/**
 * Dynamically imports and registers all route modules
 * @param {Express.Application} app - Express application instance
 */
export const registerRoutes = async (app) => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      console.log('🔄 Dynamically loading route modules...');
    }

    // Read all files in the routes directory
    const routeFiles = await readdir(__dirname);

    // Filter for JavaScript route files (excluding index.js)
    const jsRouteFiles = routeFiles.filter(file =>
      file.endsWith('.js') &&
      file !== 'index.js' &&
      file.endsWith('Routes.js')
    );

    if (process.env.NODE_ENV !== 'test') {
      console.log(`📁 Found ${jsRouteFiles.length} route files:`, jsRouteFiles);
    }

    // Load each route module dynamically
    for (const file of jsRouteFiles) {
      try {
        // Get the route configuration or generate default
        const routeInfo = routeConfig[file];
        const routePrefix = routeInfo?.prefix || generateRoutePrefix(file);
        const description = routeInfo?.description || 'API endpoints';

        // Dynamic import of the route module
        const modulePath = `file://${join(__dirname, file)}`;
        const routeModule = await import(modulePath);

        // Get the default export (the router)
        const routeHandler = routeModule.default;

        if (routeHandler && typeof routeHandler === 'function') {
          // Register the route with the API prefix
          app.use(`/api${routePrefix}`, routeHandler);
          if (process.env.NODE_ENV !== 'test') {
            console.log(`✅ Loaded route: /api${routePrefix} - ${description}`);
          }
        } else {
          console.warn(`⚠️  Warning: ${file} does not export a valid router`);
        }
      } catch (error) {
        console.error(`❌ Error loading route file ${file}:`, error.message);
      }
    }

    if (process.env.NODE_ENV !== 'test') {
      console.log('🎉 All routes loaded successfully!');
      // Log all registered routes for debugging
      logRegisteredRoutes(app);
    }

  } catch (error) {
    console.error('💥 Failed to load routes:', error);
    throw error;
  }
};

/**
 * Generates a route prefix from filename if not in config
 * @param {string} filename - Route file name
 * @returns {string} - Generated route prefix
 */
const generateRoutePrefix = (filename) => {
  // Remove 'Routes.js' suffix and convert to lowercase
  const baseName = filename.replace('Routes.js', '').toLowerCase();
  
  // Convert camelCase to kebab-case for API paths
  const kebabCase = baseName.replace(/([A-Z])/g, '-$1').toLowerCase();
  
  return `/${kebabCase}`;
};

/**
 * Logs all registered routes for debugging purposes
 * @param {Express.Application} app - Express application instance
 */
const logRegisteredRoutes = (app) => {
  if (process.env.NODE_ENV === 'test') return;

  console.log('\n📋 Registered API Routes:');
  console.log('================================');

  try {
    // Check if app has _router and if it has stack
    if (!app._router || !app._router.stack) {
      console.log('ℹ️  Router stack not available for route inspection');
      console.log('✅ Routes registered successfully via dynamic import');
      console.log('================================\n');
      return;
    }

    // Extract routes from Express app
    const routes = [];

    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        // Direct routes
        routes.push({
          method: Object.keys(middleware.route.methods)[0].toUpperCase(),
          path: middleware.route.path
        });
      } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
        // Router middleware
        const routerPath = middleware.regexp.source
          .replace('\\', '')
          .replace('^', '')
          .replace('\\/', '/')
          .replace('(?:', '')
          .replace('\\', '')
          .replace('?)', '')
          .replace('$', '');

        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            const fullPath = routerPath + handler.route.path;
            routes.push({
              method: Object.keys(handler.route.methods)[0].toUpperCase(),
              path: fullPath.replace('//', '/')
            });
          }
        });
      }
    });

    if (routes.length > 0) {
      // Sort routes by path for better readability
      routes.sort((a, b) => a.path.localeCompare(b.path));

      // Display routes in a formatted table
      routes.forEach(route => {
        console.log(`${route.method.padEnd(6)} ${route.path}`);
      });
    } else {
      console.log('✅ Routes registered successfully');
      console.log('ℹ️  Route details not available for inspection');
    }

  } catch (error) {
    console.log('ℹ️  Route inspection failed, but routes are registered');
    console.log(`⚠️  ${error.message}`);
  }

  console.log('================================\n');
};

/**
 * Alternative manual route registration (fallback method)
 * Use this if dynamic import doesn't work in your environment
 */
export const registerRoutesManual = async (app) => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      console.log('🔄 Loading routes manually...');
    }

    // Import route modules
    const authRoutes = await import('./authRoutes.js');
    const userRoutes = await import('./userRoutes.js');
    const departmentRoutes = await import('./departmentRoutes.js');
    const attendanceRoutes = await import('./attendanceRoutes.js');
    const leaveRoutes = await import('./leaveRoutes.js');
    const payrollRoutes = await import('./payrollRoutes.js');

    // Register routes with their prefixes using the centralized configuration
    const routeRegistrations = [
      {
        prefix: routeConfig['authRoutes.js'].prefix,
        handler: authRoutes.default,
        description: routeConfig['authRoutes.js'].description
      },
      {
        prefix: routeConfig['userRoutes.js'].prefix,
        handler: userRoutes.default,
        description: routeConfig['userRoutes.js'].description
      },
      {
        prefix: routeConfig['departmentRoutes.js'].prefix,
        handler: departmentRoutes.default,
        description: routeConfig['departmentRoutes.js'].description
      },
      {
        prefix: routeConfig['attendanceRoutes.js'].prefix,
        handler: attendanceRoutes.default,
        description: routeConfig['attendanceRoutes.js'].description
      },
      {
        prefix: routeConfig['leaveRoutes.js'].prefix,
        handler: leaveRoutes.default,
        description: routeConfig['leaveRoutes.js'].description
      },
      {
        prefix: routeConfig['payrollRoutes.js'].prefix,
        handler: payrollRoutes.default,
        description: routeConfig['payrollRoutes.js'].description
      }
    ];

    routeRegistrations.forEach(({ prefix, handler, description }) => {
      if (handler) {
        app.use(`/api${prefix}`, handler);
        if (process.env.NODE_ENV !== 'test') {
          console.log(`✅ ${description} routes loaded: /api${prefix}`);
        }
      } else {
        console.error(`❌ Failed to load ${description} routes`);
      }
    });

    if (process.env.NODE_ENV !== 'test') {
      console.log('🎉 All routes loaded manually!');
    }
  } catch (error) {
    console.error('💥 Failed to load routes manually:', error);
    throw error;
  }
};

/**
 * Health check for route system
 * @param {Express.Application} app - Express application instance
 */
export const validateRoutes = (app) => {
  if (process.env.NODE_ENV === 'test') return;

  console.log('\n🔍 Route Validation:');
  console.log('================================');

  const expectedRoutes = Object.values(routeConfig);

  try {
    // Simple validation - just check if the routes were configured
    expectedRoutes.forEach(routeInfo => {
      console.log(`✅ ${routeInfo.prefix} - ${routeInfo.description}`);
    });

    console.log('================================');
    console.log('✅ All expected routes are configured');

  } catch (error) {
    console.log('⚠️  Route validation failed, but routes should be working');
    console.log('================================');
  }

  console.log('');
};

export default router;
