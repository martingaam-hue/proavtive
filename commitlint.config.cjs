module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Allow a longer subject for GSD-style messages like "docs(00-local-foundation): create phase plan"
    "subject-max-length": [2, "always", 100],
    "body-max-line-length": [1, "always", 120], // warning only — strategy doc references can be long
  },
};
