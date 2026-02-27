# Clarity Website CMS

This website uses Decap CMS (formerly Netlify CMS) to manage content and the site nav.

## Usage

Loading `/admin/` will launch the CMS interface to upload images and edit content. Images are
directly committed, but content changes are submitted as pull requests.

## Configuration and Technical Details

Decap CMS is configured via a `config.yml` file located at `src/admin/config.yml`. This file defines
the collections and file paths.

When running locally, the file changes are written directly to the local file system via the `netlify-cms-proxy-server`.

The deployment GitHub Actions workflows have a "Configure CMS" step that runs a script to configure
the CMS for GitHub. This ensures that the CMS interface will edit content in the correct repo and
branch.

Content is stored as markdown files in the `cms-content` folder in the root of the repository. When
building the website, the `compile-content.js` script is executed to compile the markdown to html
and save export it to json files in the `src/compiled-content` folder.

The site nav and CMS page components uses those json files to render the content.
