"use strict";
class ReflectionUtil {
    static setValue(obj, field, value) {
        if (!field || field.length === 0) {
            throw new Error("Cannot set value of empty field");
        }
        let nestedFields = field.split(".");
        let curObj = obj;
        for (let i = 0; i < nestedFields.length - 1; i++) {
            let nestedField = nestedFields[i];
            let curValue = curObj[nestedField];
            if (curObj[nestedField] instanceof Array || !(curObj[nestedField] instanceof Object)) {
                curObj[nestedField] = {};
            }
            curObj = curObj[nestedField];
        }
        curObj[nestedFields[nestedFields.length - 1]] = value;
    }
    static getValue(obj, field) {
        if (!field || field.length === 0) {
            throw new Error("Cannot get value of empty field");
        }
        if (!obj)
            return null;
        let nestedFields = field.split(".");
        let value = obj;
        for (let nestedField of nestedFields) {
            if (!value)
                return null;
            value = value[nestedField];
        }
        return value;
    }
}
exports.ReflectionUtil = ReflectionUtil;
