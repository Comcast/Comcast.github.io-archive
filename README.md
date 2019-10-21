![GitHub](https://img.shields.io/github/license/comcast/comcast.github.io)
![GitHub contributors](https://img.shields.io/github/contributors/comcast/comcast.github.io)
![GitHub last commit](https://img.shields.io/github/last-commit/comcast/comcast.github.io)

Comcast.github.io
=================

This is the main landing page for Open Source at Comcast. It highlights our efforts in the Free/Libre and Open Source Software movement.

License
=======

Comcast.github.io is licensed under [Apache License 2.0](/LICENSE-Apache-2.0). Valid-License-Identifier: Apache-2.0

Code of Conduct
===============

We take our [code of conduct](CODE_OF_CONDUCT.md) very seriously. Please abide by it.

Contributing
============

Please read our [contributing guide](CONTRIBUTING.md) for details on how to contribute to our project.

Compiling JS & CSS
==================

Run the following to install dependencies (you only have to do this once):

    $ npm install

Then run the following to compile the JS & CSS:

    $ npm run transform
    $ npm run compress

Then check in the compiled files at [js/javascript.js](js/javascript.js) & [style/css.css](style/css.css) if they were modified
