// Our dependency container that holds all our dependencies
const dependencyContainer = {};

/**
 * Inject Decorator: Inject a singleton instance of a service
 *
 * @export
 * @param {*} service
 * @param {string} [serviceName] If you are using minification, you may need
 *   to pass the service name as a string
 * @returns
 */
export function Inject(service: any, serviceName?: string) {
  return (target: any, propName: string): any => {
    Object.defineProperty(target, propName, {
      get: () => {
        const name = (serviceName) ? serviceName : service.name;
        if(!dependencyContainer[name]) {
          dependencyContainer[name] = new service();
        }
        return dependencyContainer[name];
      }
    });
  }
}


/**
 * Set / Override a dependency. Useful when running unit tests
 *
 * @export
 * @param {string} serviceName
 * @param {*} dependencyInstance
 */
export function override(serviceName: string, dependencyInstance: any) {
  dependencyContainer[serviceName] = dependencyInstance;
}


/**
 * Get a service, if it does not exist already, we create one
 *
 * @export
 * @param {*} service
 * @param {string} [serviceName]
 * @returns {*}
 */
export function getService(service: any, serviceName?: string): any {
  const name = (serviceName) ? serviceName : service.name;
  if(!dependencyContainer[name] && service) {
    dependencyContainer[name] = new service();
  }
  return dependencyContainer[name];
}