/**
 * Represents the possible deployment environments for error notifications.
 *
 * These environments help categorize where an error occurred, allowing
 * for different handling strategies based on the context.
 */
export type EnvironmentType = 'local' | 'staging' | 'production'
