import {Injectable} from '@angular/core';
import {LoggingToServerService, LogToServerInterface} from '../global-error-handler/log-to-server.interface';
import BulkIndexDocumentsParams = Elasticsearch.BulkIndexDocumentsParams;
import {AppConfig} from '../../app.config';

@Injectable()
export class LoggingToElasticService implements LoggingToServerService {

  private _logs: LogToServerInterface[];
  private _client: Elasticsearch.Client;

  constructor() {
    this._logs = [];

    const elasticConfig: Elasticsearch.ConfigOptions = AppConfig.loggingToElasticService.configOptions;
    this._client = new Elasticsearch.Client(elasticConfig);
  }

  public async log(log: LogToServerInterface): Promise<void> {
    //TODO: if(AppConfig.loggingToElasticService.level > ...)
    this._logs.push(log);
    if (this._logs.length === (AppConfig.loggingToElasticService.bulkSize || 10)) {
      await this.sendBulk();
      this._logs = [];
    }
  }

  private async sendBulk() {
    // https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html
    const body = [];
    this._logs.forEach(l => {
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
