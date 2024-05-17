

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/about/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.B-wemn1f.js","_app/immutable/chunks/scheduler.DW9KkVYI.js","_app/immutable/chunks/index.zzyvqDcF.js"];
export const stylesheets = [];
export const fonts = [];
