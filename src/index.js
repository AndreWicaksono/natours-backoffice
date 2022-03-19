("use strict");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const { transformArgs } = strapi
      .plugin("graphql")
      .service("builders").utils;
    const { toEntityResponseCollection } = strapi
      .plugin("graphql")
      .service("format").returnTypes;
    const extensionService = strapi.plugin("graphql").service("extension");

    extensionService.use(({ nexus }) => ({
      // Add a relation field into user https://github.com/strapi/strapi/issues/12016

      types: [
        nexus.extendType({
          type: "Query",
          definition(t) {
            t.field("toursWishlist", {
              args: {
                pagination: "PaginationArg",
                sort: nexus.stringArg("Order by"),
              },
              type: "TourEntityResponseCollection",
              resolve: async (root, args, context) => {
                const transformedArgs = transformArgs(args, {
                  contentType: strapi.contentTypes["api::tour.tour"],
                  usePagination: true,
                });

                const [toursEntries, toursCount] = await strapi.db
                  .query("api::tour.tour")
                  .findWithCount({
                    // uid syntax: 'api::api-name.content-type-name'
                    where: {
                      users: {
                        id: {
                          $eq: context.state.user.id,
                        },
                      },
                    },
                    offset: args?.pagination?.start,
                    limit: args?.pagination?.limit,
                  });

                return toEntityResponseCollection(toursEntries ?? [], {
                  args: transformedArgs,
                  resourceUID: "api::tour.tour",
                });
              },
            });
          },
        }),
      ],
    }));
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
