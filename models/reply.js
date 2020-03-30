const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema ({
    text: String,
    created_on: Date,
    delete_password: String,
    reported: Boolean,
    thread: {type: Schema.Types.ObjectId, ref: 'Thread'}
});

module.exports = mongoose.model('Reply', ReplySchema);