/**
 * This plugin is used to disable the "Try it out" button in the Swagger UI
 *
 * @see {@link https://github.com/swagger-api/swagger-ui/issues/3725#issuecomment-334899276}
 */
export const DisableTryItOutPlugin = function () {
  return {
    statePlugins: {
      spec: {
        wrapSelectors: {
          allowTryItOutFor: () => () => false,
        },
      },
    },
  }
}
