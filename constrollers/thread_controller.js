const Thread = require('../models/thread');
const Board = require('../models/board');

exports.threadPost = (req, res, next) => {
    //Save a new thread
    //First check if specified board exists
    Board.findOne({name: req.params.board}, (err, doc) => {
        if (err) console.log(err);
        //Create new board doc if one doesn't exist 
        if (!doc) {
            doc = new Board ({name: req.params.board, threads: []});
            doc.save();
        }
        //Create and save new thread
        const newThread = new Thread({
            text: req.body.text,
            delete_password: req.body.delete_password,
            created_on: new Date(),
            bumped_on: new Date(),
            reported: false,
            replies: [],
            board: doc._id
        });
        newThread.save((err, doc) => {
            if (err) console.log(err);
            res.redirect('/b/' + req.params.board + '/');
        });
        doc.threads.push(newThread._id);
    });
};

exports.threadGet = (req, res, next) => {
    //Get 10 most recent threads from specified board
    Board.findOne({name: req.params.board}, (err, board) => {
        if (err) console.log(err);
        Thread.find({board: board._id})
        .sort({bumped_on: -1})
        .limit(10)
        .select('text created_on bumped_on replies')
        .populate('replies')
        .exec((err, threads) => {
            if (err) console.log(err);
            threads = threads.map((thread) => {
                thread.replies = thread.replies.sort((reply1, reply2) => reply2.created_on - reply1.created_on).slice(0, 3).map((reply) => {
                    reply.delete_password = undefined;
                    reply.reported = undefined;
                    return reply;
                });
                return thread;
            });
            res.send(threads);
        });
    });
};

exports.threadDelete = (req, res, next) => {
    Board.findOne({name: req.params.board}, (err, board) => {
        if (err) console.log(err);
        Thread.findById(req.body.thread_id)
        .exec((err, thread) => {
            if (err) console.log(err);
            if (!thread) res.send ('no thread with id: ' + req.body.thread_id + ' found');
            if (req.body.delete_password === thread.delete_password) {
                Thread.findByIdAndDelete(req.body.thread_id, (req, doc) => {
                    if (err) console.log(err);
                    res.send('success');
                });
            } else {
                res.send('incorrect password');
            }
        });
    });
};

exports.threadPut = (req, res, next) => {
    Board.findOne({name: req.params.board}, (err, board) => {
        if (err) console.log(err);
        Thread.findById(req.body.report_id)
        .exec((err, thread) => {
            if (err) console.log(err);
            if (!thread) res.send ('no thread with id: ' + req.body.report_id + ' found');
            thread.reported = true;
            thread.save();
            res.send('success');
        });
    });
};