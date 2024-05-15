import * as universal from '../entries/pages/Content/_page.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/Content/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/Content/+page.js";
export const imports = ["_app/immutable/nodes/4.BXPZ_t86.js","_app/immutable/chunks/4.7ytsA8Jh.js","_app/immutable/chunks/scheduler.DW9KkVYI.js","_app/immutable/chunks/index.zzyvqDcF.js","_app/immutable/chunks/preload-helper.D6kgxu3v.js","_app/immutable/chunks/index.C774K7Pp.js"];
export const stylesheets = ["_app/immutable/assets/4.CWc7wY7w.css"];
export const fonts = [];
