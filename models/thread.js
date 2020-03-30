const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema ({
    text: String,
    delete_password: String,
    created_on: Date,
    bumped_on: Date,
    reported: Boolean,
    replies: [{type: Schema.Types.ObjectId, ref: 'Reply'}],
    board: {type: Schema.Types.ObjectId, ref: 'Board'}
});

module.exports = mongoose.model('Thread', ThreadSchema);