// Simple logger utility - no need for complex logging libraries for this project
export class Logger {
  private isDev = process.env.NODE_ENV === 'development';

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
  }

  info(message: string, meta?: any): void {
    console.log(this.formatMessage('info', message, meta));
  }

  warn(message: string, meta?: any): void {
    console.warn(this.formatMessage('warn', message, meta));
  }

  error(message: string, error?: any): void {
    const errorInfo = error instanceof Error 
      ? { message: error.message, stack: error.stack }
      : error;
    
    console.error(this.formatMessage('error', message, errorInfo));
  }

  debug(message: string, meta?: any): void {
    if (this.isDev) {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }
}

export const logger = new Logger();