type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  context?: Record<string, unknown>;
}

class Logger {
  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, requestId, context } = entry;
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    const reqIdStr = requestId ? ` [${requestId}]` : '';
    return `[${timestamp}] [${level.toUpperCase()}]${reqIdStr} ${message}${contextStr}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, requestId?: string): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      requestId,
      context,
    };

    const formattedLog = this.formatLog(entry);

    switch (level) {
      case 'error':
        console.error(formattedLog);
        break;
      case 'warn':
        console.warn(formattedLog);
        break;
      case 'debug':
        if (process.env.NODE_ENV === 'development') {
          console.debug(formattedLog);
        }
        break;
      default:
        console.log(formattedLog);
    }
  }

  info(message: string, context?: Record<string, unknown>, requestId?: string): void {
    this.log('info', message, context, requestId);
  }

  warn(message: string, context?: Record<string, unknown>, requestId?: string): void {
    this.log('warn', message, context, requestId);
  }

  error(message: string, context?: Record<string, unknown>, requestId?: string): void {
    this.log('error', message, context, requestId);
  }

  debug(message: string, context?: Record<string, unknown>, requestId?: string): void {
    this.log('debug', message, context, requestId);
  }
}

export const logger = new Logger();
