/* eslint-disable import/no-extraneous-dependencies */

const Metalsmith = require('metalsmith');
const markdown = require('@metalsmith/markdown');
const layouts = require('@metalsmith/layouts');
const collections = require('@metalsmith/collections');
const drafts = require('@metalsmith/drafts');
const permalinks = require('@metalsmith/permalinks');
const sass = require('@metalsmith/sass');
const postcss = require('@metalsmith/postcss');
const when = require('metalsmith-if');
const htmlMinifier = require('metalsmith-html-minifier');
const assets = require('metalsmith-static-files');
const metadata = require('@metalsmith/metadata');
const prism = require('metalsmith-prism');

const marked = require('marked');
const esbuild = require('@metalsmith/js-bundle');

const { dependencies } = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';

// functions to extend Nunjucks environment
const spaceToDash = (string) => string.replace(/\s+/g, '-');
const condenseTitle = (string) => string.toLowerCase().replace(/\s+/g, '');
const UTCdate = (date) => date.toUTCString('M d, yyyy');
const blogDate = (string) =>
  new Date(string).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
const trimSlashes = (string) => string.replace(/(^\/)|(\/$)/g, '');
const mdToHTML = (mdString) => {
  try {
    return marked.parse(mdString);
  } catch (e) {
    return mdString;
  }
};
const phoneNumber = (string) => {
  const cleaned = ('' + string).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
};

// Define engine options for the inplace and layouts plugins
const templateConfig = {
  directory: 'layouts',
  engineOptions: {
    path: ['layouts'],
    filters: {
      spaceToDash,
      condenseTitle,
      UTCdate,
      blogDate,
      trimSlashes,
      mdToHTML,
      phoneNumber
    }
  }
};

function msBuild() {
  Metalsmith(__dirname)
    .source('./src/content')
    .destination('./build')
    .clean(true)
    .metadata({
      msVersion: dependencies.metalsmith,
      nodeVersion: process.version
    })

    .use(when(isProduction, drafts()))

    .use(
      metadata({
        metadata: 'src/content/data',
        'metadata.site': 'src/content/data/site.json',
        'metadata.faqs': 'src/content/data/faqs.json'
      })
    )

    .use(markdown())

    .use(permalinks())

    .use(layouts(templateConfig))

    .use(
      assets({
        source: 'src/assets/',
        destination: 'assets/'
      })
    )

    .use(
      sass({
        entries: {
          'src/sass/styles.scss': 'assets/styles.css'
        }
      })
    )
    .use(postcss({ plugins: ['postcss-preset-env', 'autoprefixer', 'cssnano'], map: !isProduction }))

    .use(
      esbuild({
        drop: [],
        entries: {
          'assets/scripts': 'src/js/main.js'
        }
      })
    )

    .use(when(isProduction, htmlMinifier()))
    .build((err) => {
      if (err) {
        throw err;
      }
    });
}

if (require.main === module) {
  msBuild();
} else {
  module.exports = msBuild;
}
