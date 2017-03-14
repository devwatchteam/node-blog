---
title:  "BootstrApp!"
description: BootstrApp is a collection of best practices and helper functions that will help make your mobile application feel native and save you time in development.
author: "@Dave_Conner"
tags: [pwa, css, sass] 
date:   Nov 22, 2016
---



## A basic starter for creating performant, ‘native’ like mobile web apps.

The distinction between native and web based applications is blurring. The modern browser’s capabilities and the many [web APIs](https://developer.mozilla.org/en-US/docs/Web/API) available have quieted the biggest arguments against developing one’s application using web technologies. BootstrApp is a collection of best practices and helper functions that will help make your mobile application feel native and save you time in development. So, let’s break down the pieces.

## Metatags
Resources: [1](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html), [2](https://developers.chrome.com/multidevice/android/installtohomescreen)
In addition to our regular html boilerplate there are a few links and meta tags that you will have to include.


[Fullscreen dat app!](https://developers.google.com/web/fundamentals/native-hardware/fullscreen/)
This first group of metatags are necessary to remove the address bar when your app is added to the home page. This will only work on single page apps as navigating to another page will cause the address bar to reappear. **(confirm)**
```
<!-- Get rid of the address bar when saved to home screen
 -->
 <!-- iOS -->
<meta name="apple-mobile-web-app-capable" content="yes">
<!-- Android -->
<meta name="mobile-web-app-capable" content="yes">
```

Next you will want to specify the title for the app. This will appear with your app icon when saved to the home screen. On Android devices the application’s `<title>` element serves as the default label for the icon on the homescreen.

```
<!-- Specify a title for the app add to home -->
 <!-- iOS -->
<meta name="apple-mobile-web-app-title" content="App Name">
```

Adding an icon for the home screen can get a bit ridiculous when trying to serve all the different types that are out there. By serving one high res icon you can take care of most use cases.

```
<!-- Change app icon -->
 <!-- iOS, Android (deprecated) -->
<link rel="apple-touch-icon" href="/custom_icon.png">
<!-- Android -->
<link rel="icon" sizes="192x192" href="nice-highres.png">
```
