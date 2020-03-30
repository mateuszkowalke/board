const Reply = require('../models/reply');
const Thread = require('../models/thread');
const Board = require('../models/board');

exports.replyPost = (req, res, next) => {
    Thread.findById({_id: req.body.thread_id}, (err, thread) => {
        if (err) console.log(err);
        const reply = new Reply ({
            text: req.body.text,
            created_on: new Date(),
            delete_password: req.body.delete_password,
            reported: false,
            thread: req.body.thread_id
        });
        thread.replies.push(reply._id);
        thread.bumped_on = reply.created_on;
        thread.save();
        reply.save();
        //Change this to redirect to specific thread => get /b/:board/:thread_id/
        res.redirect('/b/' + req.params.board + '/');
    });
};

exports.replyGet = (req, res, next) => {
    Thread.findById({_id: req.query.thread_id})
    .select('text created_on bumped_on replies')
    .populate('replies')
    .exec((err, thread) => {
        if (err) console.log(err);
        thread.replies = thread.replies.sort((reply1, reply2) => reply2.created_on - reply1.created_on).map((reply) => {
            reply.delete_password = undefined;
            reply.reported = undefined;
            return reply;
        });
        res.send(thread);
    });
};

exports.replyDelete = (req, res, next) => {
    Thread.findById(req.body.thread_id)
    .select('text created_on bumped_on replies')
    .populate('replies')
    .exec((err, thread) => {
        if (err) console.log(err);
        if (!thread) res.send ('no thread with id: ' + req.body.report_id + ' found');
        const toDelete = thread.replies.find((reply) => String(reply._id) === req.body.reply_id);
        if (toDelete.delete_password === req.body.delete_password) {
            toDelete.text = '[deleted]';
            toDelete.save();
        }
        res.send('success');
    });
};

exports.replyPut = (req, res, next) => {
    Thread.findById(req.body.thread_id)
    .select('text created_on bumped_on replies')
    .populate('replies')
    .exec((err, thread) => {
        if (err) console.log(err);
        if (!thread) res.send ('no thread with id: ' + req.body.report_id + ' found');
        const toUpdate = thread.replies.find((reply) => String(reply._id) === req.body.reply_id);
        toUpdate.reported = true;
        toUpdate.save();
        res.send('success');
    });
};
