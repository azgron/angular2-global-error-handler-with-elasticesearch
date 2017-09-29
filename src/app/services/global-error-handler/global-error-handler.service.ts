import {ErrorHandler, Injectable, Injector} from '@angular/core';
import {LocationStrategy, PathLocationStrategy} from '@angular/common';
import * as StackTrace from 'stacktrace-js';
import {LoggingToElasticService} from '../logging-to-elastic/logging-to-elastic.service';
import {LogToServerInterface} from './log-to-server.interface';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private injector: Injector) {
  }

  handleError(error) {
    const loggingService = this.injector.get(LoggingToElasticService);
    const location = this.injector.get(LocationStrategy);
    const message: string = error.message ? error.message : error.toString();
    const url: string = location instanceof PathLocationStrategy
      ? location.path() : '';

    // get the stack trace, lets grab the last 10 stacks only
    StackTrace.fromError(error).then(stackframes => {
      const stackString: string = stackframes
        .splice(0, 20)
        .map(function (sf) {
          return sf.toString();
        }).join('\n');

      // log on the server
      loggingService.log({message, url, stack: stackString, level: 'ERROR'});

    });

    throw error;
  }

}
