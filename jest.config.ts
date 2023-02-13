const { getJestProjects } = require("@nrwl/jest");

export default {
  projects: getJestProjects(),
  bail: true,
};
