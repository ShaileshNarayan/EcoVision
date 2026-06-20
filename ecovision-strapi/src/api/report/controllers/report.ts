/**
 * report controller
 */

// import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::report.report');



import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::report.report', ({ strapi }) => ({
  /**
   * Custom action: update a report by its documentId
   */
  async updateByDocumentId(ctx) {
    try {
      const body = ctx.request.body ?? {};
      const { documentId, data } = body;

      if (!documentId) {
        return ctx.badRequest("Missing required field: documentId");
      }

      // Find record by documentId
      const record = await strapi.db.query("api::report.report").findOne({
        where: { documentId },
      });

      if (!record) {
        return ctx.notFound(`Report not found for documentId: ${documentId}`);
      }

      const numericId = record.id;

      // Update via entityService
      const updated = await strapi.entityService.update(
        "api::report.report",
        numericId,
        { data }
      );

      return ctx.send({ data: updated });
    } catch (err) {
      strapi.log.error("updateByDocumentId error:", err);
      return ctx.internalServerError(err?.message ?? "Failed to update report");
    }
  },
}));