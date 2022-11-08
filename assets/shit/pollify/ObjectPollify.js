var __$$__global_uniqueId$$__ = 0;
if (!Object.prototype.hasOwnProperty("__$$uniqueId$$__")) {
    Object.defineProperty(Object.prototype, "__$$uniqueId$$__", {
        enumerable: false,
        get: function () {
            if (!!!this["___$$$uniqueId$$$___"]) {
                this["___$$$uniqueId$$$___"] = ++__$$__global_uniqueId$$__;
            }
            return this["___$$$uniqueId$$$___"];
        }
    })
}