// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
  const hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  } else {
    return path;
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

const appPackageJson = require(resolveApp('package.json'));
const srcPaths = appPackageJson.srcPaths || [];

const defaultTargOpts = {
  appBuild: 'build',
  appHtml: 'index.html',
  appIndexJs: 'index.js',
  jsExts: [],
}

const getPathOpts = appPackage => {
  console.error('get path opts for: ', appPackage)
  // const appPackage  = require(appPackageJson);
  const target = process.env.TARGET;
  let targOpts = defaultTargOpts;

  if (target) {
    targOpts = appPackage.targets && appPackage.targets[target];
    if (!targOpts) {
      throw new Error(`Target ${target} not defined in package.json`);
    }
    targOpts = Object.assign({}, defaultTargOpts, targOpts)
    targOpts.appBuild = `${defaultTargOpts.appBuild}_${target}`
  }

  return {
    appBuild: targOpts.appBuild,
    appHtml: path.join('public', targOpts.appHtml),
    appIndexJs: path.join('src', targOpts.appIndexJs),
    jsExts: targOpts.jsExts,
  }
}

//const appPackageJson = resolveApp('package.json');
let pathOpts = getPathOpts(appPackageJson)
console.error('Path opts: ', pathOpts)

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appBuild: resolveApp(pathOpts.appBuild),
  appPublic: resolveApp('public'),
  appHtml: resolveApp(pathOpts.appHtml),
  appIndexJs: resolveApp(pathOpts.appIndexJs),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  srcPaths: srcPaths.map(resolveApp),
  jsExts: pathOpts.jsExts,
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
};

// @remove-on-eject-begin
const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);

// config before eject: we're in ./node_modules/react-scripts/config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp(pathOpts.appBuild),
  appPublic: resolveApp('public'),
  appHtml: resolveApp(pathOpts.appHtml),
  appIndexJs: resolveApp(pathOpts.appIndexJs),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  srcPaths: srcPaths.map(resolveApp),
  jsExts: pathOpts.jsExts,
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  // These properties only exist before ejecting:
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'), // This is empty on npm 3
};

const ownPackageJson = require('../package.json');
const reactScriptsPath = resolveApp(`node_modules/${ownPackageJson.name}`);
const reactScriptsLinked =
  fs.existsSync(reactScriptsPath) &&
  fs.lstatSync(reactScriptsPath).isSymbolicLink();

// config before publish: we're in ./packages/react-scripts/config/
if (
  !reactScriptsLinked &&
  __dirname.indexOf(path.join('packages', 'react-scripts', 'config')) !== -1
) {
  const appPackageJson = require(resolveOwn('package.json'));
  const srcPaths = appPackageJson.srcPaths || [];
  pathOpts = getPathOpts(appPackageJson)
  module.exports = {
    dotenv: resolveOwn('template/.env'),
    appPath: resolveApp('.'),
    appBuild: resolveOwn('../../' + pathOpts.appBuild),
    appPublic: resolveOwn('template/public'),
    appHtml: resolveOwn('template/' + pathOpts.appHtml),
    appIndexJs: resolveOwn('template/' + pathOpts.appIndexJs),
    appPackageJson: resolveOwn('package.json'),
    appSrc: resolveOwn('template/src'),
    srcPaths: srcPaths.map(resolveOwn),
    jsExts: pathOpts.jsExts,
    yarnLockFile: resolveOwn('template/yarn.lock'),
    testsSetup: resolveOwn('template/src/setupTests.js'),
    appNodeModules: resolveOwn('node_modules'),
    publicUrl: getPublicUrl(resolveOwn('package.json')),
    servedPath: getServedPath(resolveOwn('package.json')),
    // These properties only exist before ejecting:
    ownPath: resolveOwn('.'),
    ownNodeModules: resolveOwn('node_modules'),
  };
}
// @remove-on-eject-end
