const path = require("path");
const prettier = require("prettier/parser-postcss");
const { createSyncFn } = require("sync-threads");

const preprocess = (text, options) => {
  const sorter = createSyncFn(
    path.join(__dirname, "sorter.js"),
    2 * 1024 * 1024
  );

  return sorter({
    text,
    parser: options.parser,
    pluginOptions: {
      order:
        options.order === "array" ? options.customOrder : options.order,
        keepOverrides: options.keepOverrides,
    },
  });
};

module.exports = {
  options: {
    order: {
      type: "choice",
      description: "One of the built-in sort orders.",
      category: "css-declaration-sorter",
      default: "concentric-css",
      choices: [
        {
          value: "alphabetical",
          description:
            "Default, order in a simple alphabetical manner from a - z.",
        },
        {
          value: "smacss",
          description:
            "Order from most important, flow affecting properties, to least important properties.",
        },
        {
          value: "concentric-css",
          description:
            "Order properties applying outside the box model, moving inward to intrinsic changes.",
        },
        {
          value: "array",
          description: "Provide an array of declaration names in the `customOrder` property.",
        },
      ],
    },
    customOrder: {
      type: "string",
      description:
        "An array of declaration names to sort according to their index in the array.",
      category: "css-declaration-sorter",
      array: true,
      default: [{ value: [] }],
    },
    keepOverrides: {
      type: "boolean",
      description: "",
      category: "css-declaration-sorter",
      default: true,
    },
  },
  parsers: {
    css: {
      ...prettier.parsers.css,
      preprocess,
    },
    less: {
      ...prettier.parsers.less,
      preprocess,
    },
    scss: {
      ...prettier.parsers.scss,
      preprocess,
    },
  },
};
