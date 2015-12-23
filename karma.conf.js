module.exports = function(config){
  config.set({

    basePath : './',

	  preprocessors: {
      'app/templates/**/*.html': ['html2js']
    },

    files : [
  	  'app/js/vendor/jquery-1.11.3.min.js',
      'app/js/**/*.js',
      'app/tests/**/*.js',
      'app/templates/**/*.html'
    ],

    exclude : [
      'app/js/index.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine-ajax', 'jasmine'],

    browsers : ['Chrome'],

    plugins : [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-jasmine-ajax',
      'karma-html2js-preprocessor'
    ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
