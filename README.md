mongoose-to-ui-grid
================

Mongoose plugin to map mongoose schema to ui-grid columns definition

## Installation

```sh
$ npm install mongoose-to-ui-grid --save
```

## Documentation

### Enable plugin for model
  ```js
  var toUiGrid = require('mongoose-to-ui-grid');

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var AppleSchema = new Schema({
    code: { type: Number, uiGrid: { name: 'Code' }},
    color: { type: String, uiGrid: { name: 'Color' }}
  });

  AppleSchema.plugin(toUiGrid, {});
  mongoose.model('Apples', AppleSchema, 'Apples');
  ```

### There are 2 possible ways of usage

1. Via getUiGridColumnDefinition static schema method
    ```js
        var columnDefs = Apple.getUiGridColumnDefinition(); //[ { name: 'Code', field: 'code' }, { name: 'Color', field: 'color' } ]
    ```
3. Via getUiGridColumnProjection static schema method
    ```js
        Apple.findOne({color: 'red'}, Apple.getUiGridColumnProjection()) //[ 'code', 'color' ]
            .lean().exec(fn);
    ```

## License

Copyright (c) 2014 Valorkin &lt;valorkin@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.