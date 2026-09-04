module.exports = function (api) {
    const isTest = api.env('test');
    api.cache(true);
    
    // In Jest tests, disable NativeWind's custom JSX runtime to prevent createInteropElement crashes
    if (isTest) {
        return {
            presets: ["babel-preset-expo"],
        };
    }
    
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
    };
};