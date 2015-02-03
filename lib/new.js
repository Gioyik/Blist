/*jshint node:true, asi:true, expr:true */

'use strict';

var fs = require('fs')
var join = require('path').join
var resolve = require('path').resolve
var format = require('util').format
var mkdirp = require('mkdirp')
var async = require('async')
var spawn = require('./utils/spawn')
var then = require('./utils/then')
require('colors')

module.exports = function(blogPath, options) {
  blogPath = resolve(process.cwd(), blogPath)

  if (fs.existsSync(blogPath)) {
    console.log(('The directory `%s` already exists.').yellow, blogPath)
    return false
  }

  var argsGroup = [
    ['index.html', 'init.js', blogPath],
    ['-r', 'css', blogPath],
    ['-r', 'js', blogPath]
  ]
  var tasks = []
  var cwd = join(__dirname, '..', 'templates')

  argsGroup.forEach(function(args) {
    tasks.push(function(callback) {
      spawn('cp', args, {
        cwd: cwd,
        exit: function(code) {
          code === 0 && callback()
        }
      })
    })
  })

  mkdirp.sync(join(blogPath))

  async.parallel(tasks, then(function() {
    var tips = format('Your blog is successfully created in `%s`. Enjoy!'.green, blogPath)
    console.log(tips);
  }))
}
