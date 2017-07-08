---
title: Test Post 3
description: Right when you were starting to feel good about your Webpack config file Webpack V2 was released and rained on your parade. Staying on the bleeding edge can get tiresome.
author: "@Dave_Conner"
tags: [javascript]
date: March 8, 2018
---


## Outline
1. Migration
	1. Loaders
	2. PreLoaders/PostLoaders
	3. ExtractTextPlugin
3. Custom Properties no longer allowed
3. Tree shaking

## Migration
Right when you were starting to feel good about your Webpack config file Webpack V2 was released and rained on your parade. Staying on the bleeding edge can get tiresome for as soon as you update Webpack and try to compile you get an error. The good news? There is now a config validator built into Webpack v2 which is pretty sweet.  The bad news? As the validator will tell you, there are several items in your config which are now incompatible with the new api schema. Lucky for us, the team has put together a [migration guide](https://webpack.js.org/guides/migrating/). One of the most improved features of Webpack may actually be their documentation. This guide is straight forward and helpful and the new documents don’t leave you with a headache.
