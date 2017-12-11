---
title: Some Real ish!!
description: Right when you were starting to feel good about your Webpack config file Webpack V2 was released and rained on your parade. Staying on the bleeding edge can get tiresome for as soon as you update Webpack and try to compile you get an error. The good news?
author: "@Dave_Conner"
tags: [javascript, markdown]
date: March 8, 2017
---

#Webpack v.2

## resources:

1. [migration](https://webpack.js.org/guides/migrating/)
2. [ExtractTextPlugin](https://github.com/webpack-contrib/extract-text-webpack-plugin)
3. [tree shaking](http://www.2ality.com/2015/12/webpack-tree-shaking.html)


## Outline
1. Migration
	1. Loaders
	2. PreLoaders/PostLoaders
	3. ExtractTextPlugin
3. Custom Properties no longer allowed
3. Tree shaking

## Migration
Right when you were starting to feel good about your Webpack config file Webpack V2 was released and rained on your parade. Staying on the bleeding edge can get tiresome for as soon as you update Webpack and try to compile you get an error. The good news? There is now a config validator built into Webpack v2 which is pretty sweet.  The bad news? As the validator will tell you, there are several items in your config which are now incompatible with the new api schema. Lucky for us, the team has put together a [migration guide](https://webpack.js.org/guides/migrating/). One of the most improved features of Webpack may actually be their documentation. This guide is straight forward and helpful and the new documents don’t leave you with a headache.

### Loaders
So how can we get our webpack config back into working shape? For starters we must change `module.loaders` to `module.rules`.  Inside our loader objects we have a loader property which used to have several ways of declaring the loaders to be used. Now there are two supported ways. You can either declare a single loader  as a string using `rules.loader` or an array of loaders using `rules.use`. The list of loaders chained with the `!` is only supported using the legacy option `module.loaders`. As this statement implies the `modules.loaders` syntax is still valid for compatibility reason but the clarity of the new naming convention along with the new configuration abilities make the new syntax a best practice moving forward.

```
module: {
   //all loaders used in webpack
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: ['style-loader?sourceMap', 'css-loader?sourceMap', 'postcss-loader?sourceMap', 'sass-loader?sourceMap']
      }
    ]
}
```

The other gotcha with the new syntax is that the automatic `-loader` module name extension was removed for clarity. You can still opt into the old behavior with the `resolveLoader.moduleExtensions` but is not recommended.

```
resolveLoader: {
  moduleExtensions: ["-loader"]
}
```

### Preloaders/ Postloaders
So for those of us using a preloader for linting or whatever reason there is another breaking change. Both `module.preLoaders` and `module.postLoaders` were removed. Now we will include them as a loader object in the `mdoule.rules` array like our other loaders and just add the `enforce` property with a value of `”pre”`

```
{
  test: /\.js$/,
    enforce: "pre",
  loader: "eslint-loader"
}
```


### Loader Configuration
You can no longer configure a loader with custom properties in your config file. They must all be done through the options property in the loader object.

```
{
  test: /\.js$/,
  enforce: "pre",
  loader: "eslint-loader",
  options: {
    fix: true
  }
}
```

Alternatively you can pass in options using the webpack.LoaderOptionsPlugin. The following adds autoprefixer to the postcss plugin.

```
var postCSS = new webpack.LoaderOptionsPlugin({
  options: {
    context: path.join(__dirname, 'src'),
    postcss: [
      require('autoprefixer')
    ]
  }
});
```

### ExtractTextPlugin
Some plugins were also affected by the update. The ExtractTextPlugin, used to extract styles into their own stylesheet, must be updated to its latest version to be compatible with the new Webpack. The config changes for this plugin are mainly syntactical.

```
rules: [
    {
      test: /.css$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: "css-loader",
        publicPath: "/dist"
      })
    }
  ]
```

## Tree shaking
So far all of our changes seem to be syntactical and not that compelling. With Webpack v2’s support for ES2015 modules we now have access to a powerful feature which has been made popular by Rollup.js, tree shaking.

Tree shaking is a term commonly used in the JavaScript context for dead-code elimination. While this is not technically what is going on, more like live-code import, the end result is the same, less code being served to the user. Tree shaking relies on ES2015 module import/export for the static structure of its module system. Current JavaScript module formats have a dynamic structure, meaning what is imported and exported can change at runtime, as when nested inside a conditional statement. ES2015 enforces a static structure by only allowing imports and exports at the top level. This static structure along with webpack’s unused module export detection allows Webpack to exclude code which is not being used by our application. Lets look at the example given in the [docs](https://webpack.js.org/guides/tree-shaking/#example)

math.js

```
// This function isn't used anywhere
export function square(x) {
    return x * x;
}

// This function gets included
export function cube(x) {
    return x * x * x;
}
```

main.js

```
import {cube} from './maths.js';
console.log(cube(5)); // 125
```

Since the square method is not imported in `main.js` it is never exported from `math.js`. Now once our code is minified this unused  export is eliminated from our bundle. This is great! So how do we implement this feature into our build?

In order for tree shaking to work we need to tell Babel to stop transpiling our es2015 modules into commonjs modules. We do so by adding module: false in our .babelrc file.

```
{
  "presets": [
    ["es2015", {"module": false}],
    "react",
    "stage-2"
  ]
}
```

Now Webpack can handle these imports and is able to statically analyze them. The next step to achieve our tree shake is the minification of our bundle for production. This step will remove any unused code from our build. That is it! With small apps this may not provide huge wins but when using large libraries this could provide significant savings in bundled bytes.
