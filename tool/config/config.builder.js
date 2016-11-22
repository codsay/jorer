"use strict";
const ReflectionUtil = require("./reflection.util").ReflectionUtil;
;
class ConfigBuilder {
    static build(params) {
        let args = params.arguments || [];
        let profiles = null;
        for (let arg of args) {
            if (arg.indexOf("profile=") >= 0) {
                profiles = ConfigBuilder.parseValueFromArgument(arg);
                if (!(profiles instanceof Array))
                    profiles = [profiles];
                break;
            }
        }
        let config = require(params.root + "/config.json");
        if (!profiles) {
            profiles = config["profiles"];
        }
        if (!profiles)
            profiles = [];
        config.profiles = profiles;
        for (let profile of profiles) {
            let extendConfig;
            try {
                extendConfig = require(params.root + "/config/" + profile + ".json");
            }
            catch (e) {
            }
            if (extendConfig) {
                ConfigBuilder.mergeRecursive(config, require(params.root + "/config/" + profile + ".json"));
            }
        }
        config["profiles"] = profiles;
        config["profilesRaw"] = profiles.join();
        for (let arg of args) {
            if (arg.indexOf("=") <= 0) {
                continue;
            }
            let parts = arg.split("=");
            let value = ConfigBuilder.parseValue(parts.length >= 2 ? parts[1] : null);
            if (arg.indexOf("profile=") >= 0) {
                if (!(value instanceof Array))
                    value = [value];
            }
            ReflectionUtil.setValue(config, parts[0], value);
        }
        ConfigBuilder.loadData(params, config);
        ConfigBuilder.resolveInjection(config, 20);
        for (let profile of profiles) {
            config[profile] = true;
        }
        config.pro = profiles.indexOf("pro") >= 0;
        config.dev = profiles.indexOf("dev") >= 0;
        return config;
    }
    static loadData(params, config) {
        if (!params.data)
            return;
        if (!config.data || !config.data.name)
            return;
        let data = require(params.data)[config.data.name];
        if (!data)
            throw new Error("Data " + config.data.name + " does not exist.");
        for (let key in data) {
            config.data[key] = data[key];
        }
    }
    static resolveInjection(config, maxtry) {
        for (let i = 0; i < maxtry; i++) {
            let finish = ConfigBuilder.resolveInjectionWithRoot(null, config);
            if (finish)
                return;
        }
        throw new Error("Cannot resolve all injections");
    }
    static resolveInjectionWithRoot(root, config) {
        if (!root)
            root = config;
        let finish = true;
        for (let key in config) {
            let value = config[key];
            if (typeof value === "object") {
                if (!ConfigBuilder.resolveInjectionWithRoot(root, value)) {
                    if (finish)
                        finish = false;
                }
            }
            else if (typeof value === "string") {
                let injections = value.match(/(\$\{.*?\})/g);
                if (injections) {
                    for (let injection of injections) {
                        let field = injection.substring(2, injection.length - 1);
                        value = value.replace(injection, ReflectionUtil.getValue(root, field) + "");
                    }
                    if (finish)
                        finish = false;
                }
                config[key] = value;
            }
        }
        return finish;
    }
    static parseValueFromArgument(arg) {
        let parts = arg.split("=");
        let value = parts.length >= 2 ? parts[1] : null;
        return ConfigBuilder.parseValue(value);
    }
    static parseValue(value) {
        if (!ConfigBuilder.isValid(value)) {
            return true;
        }
        let values = value.split(",");
        if (values.length > 1)
            return values;
        if (value === "true" || value === "on")
            return true;
        else if (value === "false" || value === "off")
            return false;
        else if (value.indexOf('+') === 0 || value.indexOf('-') === 0)
            return parseInt(value, 10);
        return value;
    }
    static isValid(arg) {
        return arg != undefined && arg != null && arg != "";
    }
    static mergeRecursive(obj1, obj2) {
        for (let p in obj2) {
            let value2 = obj2[p];
            if (!obj1.hasOwnProperty(p)) {
                obj1[p] = value2;
            }
            else {
                let value1 = obj1[p];
                if (value2 instanceof Array) {
                    if (value2[0] === "!") {
                        value2.splice(0, 1);
                        obj1[p] = value2;
                    }
                    else {
                        if (value1 instanceof Array) {
                            obj1[p] = value1.concat(value2);
                        }
                        else {
                            obj1[p] = [value1].concat(value2);
                        }
                    }
                }
                else if (value2 instanceof Object) {
                    obj1[p] = ConfigBuilder.mergeRecursive(value1, value2);
                }
                else {
                    obj1[p] = value2;
                }
            }
        }
        return obj1;
    }
}
exports.ConfigBuilder = ConfigBuilder;
