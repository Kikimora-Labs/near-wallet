const { ENVIRONMENTS } = require('./constants');

function initFeatureFlags(flagState, environment) {
    if (typeof flagState !== 'object') {
        throw Error('invalid flags');
    }

    if (!Object.values(ENVIRONMENTS).includes(environment)) {
        throw Error(`invalid environment: "${environment}"`);
    }

    return new Proxy(flagState, {
       get(flags, flag) {
           const feature = flags[flag];
           if (!feature) {
               throw Error(`invalid feature: "${flag}"`);
           }

           if (!feature[environment]) {
               throw Error(`${flag} missing definition for environment: "${environment}"`);
           }

           return feature[environment].enabled;
       },
    });
}

module.exports = {
    initFeatureFlags,
};