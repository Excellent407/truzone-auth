import Counter from "./Counter.js";

export async function generateCustomId(prefix) {
  let counter = await Counter.findOne({ name: prefix });
  if (!counter) {
    counter = new Counter({ name: prefix, value: 0 });
  }
  counter.value += 1;
  await counter.save();
  return prefix + counter.value.toString().padStart(6, "0");
}
