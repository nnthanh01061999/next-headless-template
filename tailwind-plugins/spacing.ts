const plugin = require("tailwindcss/plugin");

function getSpacingUtilities(input: any) {
  return {
    0: "0rem",
    ...Array(input * 4)
      .fill(0)
      .map((_, i) => i + 1)
      .reduce((acc: any, i) => {
        acc[String(i / 4) as keyof typeof acc] = i / 16 + "rem";
        return acc;
      }, {}),
  };
}

function checkForValidSpacingInput(input: any) {
  if (typeof input === "number") return;
  throw new Error("The Spacing Plugin expects a `spacing` option passed to it, which is a number.");
}

module.exports = plugin.withOptions(
  () => () => {},
  (options: { spacing: number }) => {
    const { spacing } = options;
    checkForValidSpacingInput(spacing);
    return {
      theme: {
        spacing: getSpacingUtilities(spacing),
      },
    };
  },
);
