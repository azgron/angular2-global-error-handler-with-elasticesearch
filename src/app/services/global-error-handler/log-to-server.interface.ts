export interface LogToServerInterface {
  message: string;
  level: string;
  url: string;
  stack: string;
  user?: string,
  versionInfo: string;
}

export interface LoggingToServerService {
  log: (log: LogToServerInterface) => void;
}
