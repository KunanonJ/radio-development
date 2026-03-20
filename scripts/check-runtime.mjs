const major = Number(process.versions.node.split(".")[0]);

if (![20, 22].includes(major)) {
  console.warn(
    `Warning: The Urban Radio is tested on Node 20 or 22. Current runtime is ${process.versions.node}.`
  );
}
