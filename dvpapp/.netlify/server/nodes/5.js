

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/groupinfo/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.Ct_l5b8P.js","_app/immutable/chunks/scheduler.DW9KkVYI.js","_app/immutable/chunks/index.zzyvqDcF.js"];
export const stylesheets = ["_app/immutable/assets/5.BJnXJvJ5.css"];
export const fonts = [];
