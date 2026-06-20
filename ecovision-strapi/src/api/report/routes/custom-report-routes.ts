export default {
  routes: [
    {
      method: 'POST',
      path: '/reports/update-by-documentId',
      handler: 'api::report.report.updateByDocumentId',
      config: {
        policies: [],
      },
    },
  ],
};
