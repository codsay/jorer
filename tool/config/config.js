"use strict";
const ReflectionUtil = require("./reflection.util").ReflectionUtil;
class Config {
    constructor(config) {
        this.config = config;
    }
    get(field, defaultValue) {
        let value = ReflectionUtil.getValue(this.config, field);
        if (value !== undefined && value !== null)
            return value;
        return defaultValue === undefined ? null : defaultValue;
    }
    is(field, forceExist) {
        let value = this.get(field);
        if (forceExist && (value === null || value === undefined)) {
            return null;
        }
        return value === true || value === "true";
    }
    has(field) {
        return this.get(field) !== undefined;
    }
    array(field) {
        let value = this.get(field, []);
        return Array.isArray(value) ? value : [value];
    }
    arrayContains(field, value) {
        this.array(field).indexOf(value) >= 0;
    }
}
exports.Config = Config;
