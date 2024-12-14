// getApiConfig is an arrow function that returns an environment-specific frozen configuration
// The syntax ({...})[key] is an Immediately Indexed Object Literal where:
// 1. {...} creates an object with development and production configs
// 2. [import.meta.env.MODE] immediately accesses the right environment object
// 3. Object.freeze() makes the selected config immutable
export const getApiConfig = () =>
  Object.freeze(
    {
      development: { API_URL: import.meta.env.API_URL },
      production: {
        API_URL: import.meta.env.VITE_PROD_API_URL,
      },
    }[import.meta.env.MODE]
  );
