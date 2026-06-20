/**
 * driver controller
 */

// import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::driver.driver');

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::driver.driver",
  ({ strapi }) => ({
    /**
     * Custom action: update driver by documentId
     */
    async updateByDocumentId(ctx) {
      try {
        const body = ctx.request.body ?? {};
        const { documentId, data } = body;

        if (!documentId) {
          return ctx.badRequest("Missing required field: documentId");
        }

        // Find driver by documentId
        const record = await strapi.db
          .query("api::driver.driver")
          .findOne({
            where: { documentId },
          });

        if (!record) {
          return ctx.notFound(
            `Driver not found for documentId: ${documentId}`
          );
        }

        const numericId = record.id;

        // Update via entityService
        const updated = await strapi.entityService.update(
          "api::driver.driver",
          numericId,
          { data }
        );

        return ctx.send({ data: updated });
      } catch (err) {
        strapi.log.error("driver updateByDocumentId error:", err);
        return ctx.internalServerError(
          err?.message ?? "Failed to update driver"
        );
      }
    },
  })
);
