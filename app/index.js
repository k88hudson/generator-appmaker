'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var greeting = require('./greeting');

var AppmakerComponentGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(greeting);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re about to make an appmaker component!'));

    function validateList(str) {
      var arr = str.split(',');
      if (arr.length) {
        return true;
      } else {
        return 'Sorry, you must add a comma-separated list.'
      }
    }

    function formatList(str) {
      var arr = str.split(',');
      if (arr.length) {
        return arr.map(function (item) {
          return item.trim();
        });
      }
    }

    function getCwd() {
      var pathArr = process.cwd().split(path.sep);
      return pathArr[pathArr.length - 1];
    }


    var prompts = [
      {
        name: 'name',
        message: 'Choose a name for this component:',
        default: getCwd
      },
      {
        name: 'description',
        message: 'Write a short description for this component:',
        default: 'A component for Appmaker'
      },
      {
        name: 'broadcasts',
        message: 'Add a list of broadcasts:',
        validate: validateList,
        filter: formatList,
        default: 'currentCount'
      },
      {
        name: 'listeners',
        message: 'Add a list of listeners:',
        validate: validateList,
        filter: formatList,
        default: 'countUp, countDown, resetCount'
      },
      {
        name: 'attributes',
        message: 'Add a list of attributes:',
        validate: validateList,
        filter: formatList,
        default: 'unit, increment'
      }
    ];

    this.prompt(prompts, function (props) {
      this.name = props.name;
      this.description = props.description;

      this.broadcasts = props.broadcasts;
      this.listeners = props.listeners;
      this.attributes = props.attributes;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('locale');

    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('_README.md', 'README.md');

    this.template('_en-US.json', 'locale/en-US.json');
    this.template('_component.html', 'component.html');
    this.copy('component.css', 'component.css');
  },

  project: function() {
    this.copy('gitignore', '.gitignore');
    this.copy('Gruntfile.js', 'Gruntfile.js');
  }

});

module.exports = AppmakerComponentGenerator;
