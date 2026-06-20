export default {
  routes: [
    {
      method: "POST",
      path: "/drivers/update-by-documentId",
      handler: "api::driver.driver.updateByDocumentId",
      config: {
        policies: [],
      },
    },
  ],
};
