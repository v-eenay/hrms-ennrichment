import chalk from 'chalk';
import figlet from 'figlet';
import boxen from 'boxen';

/**
 * Professional logging utility for HRMS application
 * Provides clean, visually appealing console output
 */
class Logger {
    constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
        this.isTest = process.env.NODE_ENV === 'test';
    }

    /**
     * Display application banner with ASCII art
     */
    displayBanner() {
        if (this.isTest) return;

        const banner = figlet.textSync('HRMS API', {
            font: 'Small',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        });

        console.log(chalk.cyan(banner));
        console.log(chalk.gray('Human Resource Management System'));
        console.log(chalk.gray('━'.repeat(50)));
        console.log();
    }

    /**
     * Log database connection status
     * @param {boolean} success - Connection success status
     * @param {string} message - Optional message
     */
    logDatabase(success, message = '') {
        if (this.isTest) return;

        const status = success 
            ? chalk.green('✓ Connected') 
            : chalk.yellow('⚠ Disconnected');
        
        console.log(`${chalk.bold('Database:')} ${status}`);
        if (message && !success) {
            console.log(chalk.gray(`  ${message}`));
        }
    }

    /**
     * Log route loading summary
     * @param {number} routeCount - Number of routes loaded
     */
    logRoutes(routeCount) {
        if (this.isTest) return;
        
        console.log(`${chalk.bold('Routes:')} ${chalk.green('✓')} ${routeCount} modules loaded`);
    }

    /**
     * Display server startup success with key information
     * @param {number} port - Server port
     */
    displayServerInfo(port) {
        if (this.isTest) return;

        const serverInfo = [
            `${chalk.bold('Server:')} ${chalk.green('✓ Running')}`,
            '',
            `${chalk.bold('Local:')}    ${chalk.cyan(`http://localhost:${port}`)}`,
            `${chalk.bold('API Docs:')} ${chalk.cyan(`http://localhost:${port}/api-docs`)}`,
            `${chalk.bold('Health:')}   ${chalk.cyan(`http://localhost:${port}/health`)}`
        ].join('\n');

        const box = boxen(serverInfo, {
            padding: 1,
            margin: { top: 1, bottom: 1 },
            borderStyle: 'round',
            borderColor: 'green',
            title: '🚀 HRMS API Server',
            titleAlignment: 'center'
        });

        console.log(box);
    }

    /**
     * Log error messages
     * @param {string} message - Error message
     * @param {Error} error - Error object
     */
    error(message, error = null) {
        if (this.isTest) return;

        console.log(chalk.red(`✗ ${message}`));
        if (error && this.isDevelopment) {
            console.log(chalk.gray(error.stack));
        }
    }

    /**
     * Log warning messages
     * @param {string} message - Warning message
     */
    warn(message) {
        if (this.isTest) return;
        console.log(chalk.yellow(`⚠ ${message}`));
    }

    /**
     * Log info messages (development only)
     * @param {string} message - Info message
     */
    info(message) {
        if (this.isTest || !this.isDevelopment) return;
        console.log(chalk.blue(`ℹ ${message}`));
    }

    /**
     * Log success messages
     * @param {string} message - Success message
     */
    success(message) {
        if (this.isTest) return;
        console.log(chalk.green(`✓ ${message}`));
    }

    /**
     * Create a simple divider
     */
    divider() {
        if (this.isTest) return;
        console.log(chalk.gray('─'.repeat(40)));
    }

    /**
     * Clear console (development only)
     */
    clear() {
        if (this.isTest) return;
        console.clear();
    }

    /**
     * Log startup summary
     * @param {Object} config - Startup configuration
     */
    logStartupSummary(config) {
        if (this.isTest) return;

        const { port, dbConnected, routeCount, environment } = config;
        
        this.clear();
        this.displayBanner();
        
        console.log(chalk.bold('Startup Summary:'));
        this.logDatabase(dbConnected);
        this.logRoutes(routeCount);
        console.log(`${chalk.bold('Environment:')} ${chalk.cyan(environment)}`);
        
        this.displayServerInfo(port);

        if (this.isDevelopment) {
            console.log(chalk.gray('Press Ctrl+C to stop the server\n'));
        }
    }
}

export default new Logger();
