import {Injectable} from '@angular/core';
import {LoggingToServerService, LogToServerInterface} from '../global-error-handler/log-to-server.interface';
import {AppConfig} from '../../app.config';
import ConfigOptions = Elasticsearch.ConfigOptions;
import Client = Elasticsearch.Client;
import * as _ from 'lodash';

@Injectable()
export class LoggingToElasticService implements LoggingToServerService {

  private _logs: LogToServerInterface[];
  private _client: Client;

  constructor() {
    this._logs = [];

    const elasticConfig: ConfigOptions = AppConfig.loggingToElasticService.configOptions;
    this._client = new Elasticsearch.Client(elasticConfig);
  }

  public log(log: LogToServerInterface): void {
    // TODO: if(AppConfig.loggingToElasticService.level > ...)
    this._logs.push(log);
    if (this._logs.length === (AppConfig.loggingToElasticService.bulkSize || 10)) {
      this.sendBulk(_.clone<LogToServerInterface[]>(this._logs));
      this._logs = [];
    }
  }

  private async sendBulk(logs: LogToServerInterface[]) {
    // https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html
    const body = [];
    logs.forEach(l => {
      // action description
      body.push({
        index: {
          _index: AppConfig.loggingToElasticService.indexLogName,
          _type: AppConfig.loggingToElasticService.indexType
        }
      });

      // the document to index
      body.push(l);
    });
    await this._client.bulk({body});
  }

}
