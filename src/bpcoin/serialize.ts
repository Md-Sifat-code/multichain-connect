// deterministic JSON stringify (sorted keys)
export function canonicalStringify(obj: any): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map(canonicalStringify).join(",")}]`;
  const keys = Object.keys(obj).sort();
  const entries = keys.map(k => `${JSON.stringify(k)}:${canonicalStringify(obj[k])}`);
  return `{${entries.join(",")}}`;
}
