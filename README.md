Comcast.github.io
=================

This is the main landing page for Open Source at Comcast. It highlights our efforts in the Free/Libre and Open Source Software movement.

License
=======

Comcast.github.io is licensed under [Apache License 2.0](LICENSE).

Code of Conduct
===============

We take our [code of conduct](CODE_OF_CONDUCT.md) very serioulsly. Please abide by it.

Contributing
============

Please read our [contributing guide](CONTRIBUTING.md) for details on how to contribue to our project.

Compiling JS
============

Run the following to install [UglifyJS](https://github.com/mishoo/UglifyJS2):

    $ npm install uglify-js -g

Then run the following to compile the JS (order matters):

    $ uglifyjs -o js/javascript.js --compress --mangle -- js/jquery.min.js js/GitHub.bundle.min.js js/promise.min.js js/menu_toggle.js js/menu_sticky.js js/carousel.js js/gh_stats.js

Then check in the compiled file at [js/javascript.js](js/javascript.js).

Compiling CSS
=============

Run the following to install [UglifyCSS](https://github.com/fmarcia/UglifyCSS):

    $ npm install uglifycss -g

Then run the following to compile the CSS (order matters):

    $ uglifycss --output style/css.css style/all-digital.css style/style.css

Then check in the compiled file at [style/css.css](style/css.css).
