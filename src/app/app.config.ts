export const AppConfig = {
  loggingToElasticService: {
    configOptions: {
      hosts: ['http']
    },
    indexLogName: 'index_name',
    indexType: '',
    bulkSize: 100,
    level: 'info'
  }
};
