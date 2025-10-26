const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

async function resetDatabase() {
    console.log('Starting database setup...');

    try {
        // Generate Prisma Client
        console.log('Generating Prisma Client...');
        execSync('npx prisma generate', { stdio: 'inherit' });

        // Reset database (drop and recreate)
        console.log('Resetting database...');
        execSync('npx prisma migrate reset --force', { stdio: 'inherit' });

        console.log('Database setup completed successfully!');
    } catch (error) {
        console.error('Error during database setup:', error);
        process.exit(1);
    }
}

resetDatabase();