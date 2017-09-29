export interface LogToServerInterface {
  message: string;
  level: string;
  url: string;
  stack: string;
}

export interface LoggingToServerService {
  log: (log: LogToServerInterface) => (Promise<void>);
}
