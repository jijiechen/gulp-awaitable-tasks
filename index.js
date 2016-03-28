
var onEndOfStream = require('end-of-stream'),
    consumeStream = require('stream-consume')
var gulpTask;

function defineTask(name, dependencies, taskFn){
    if(arguments.length < 3 && typeof dependencies === 'function'){
        taskFn = dependencies;
        dependencies = [];
    }

    if(!taskFn){
        gulpTask(name, dependencies);
    }else if(taskFn.constructor.name === 'GeneratorFunction'){
        gulpTask(name, dependencies, function (callback) {
            arrangeAsyncSteps(taskFn(), callback);
        });
    }else {
        gulpTask(name, dependencies, taskFn);
    }

    function arrangeAsyncSteps(gen, cb){
        var context = gen.next();
        if(context.done){ cb(); return; }

        var asyncStep = context.value;
        if (asyncStep && typeof asyncStep.pipe === 'function'){
            // consume and wait for completion of a stream: https://github.com/robrich/orchestrator/blob/master/lib/runTask.js
            onEndOfStream(asyncStep, { error: true, readable: asyncStep.readable, writable: asyncStep.writable && !asyncStep.readable }, function(err){
                if(err){ cb(err); return; }
                arrangeAsyncSteps(gen, cb);
            });
            consumeStream(asyncStep);
        }else if (asyncStep && typeof asyncStep.then === 'function'){
            // wait for promise to resolve
            asyncStep.then(function () {
                arrangeAsyncSteps(gen, cb);
            }, function(err) {
                cb(err);
            });
        }
    }
}


module.exports = function (gulp) {
    if(!gulp){
        gulp = require('gulp');
    }
    gulpTask = gulp.task.bind(gulp);
    gulp.task = defineTask.bind(gulp);
};
module.exports.originalGulpTask = function () {
    return gulpTask;
};




