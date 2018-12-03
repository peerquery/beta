'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
    event: { type: String, required: true },

    from: { type: String, required: true }, //source, may be a account, project(slug_id) or market
    from_name: { type: String }, //if a project, then the project's title
    from_account: { type: String }, //the user who acted on behalf of the project

    to: { type: String, required: true }, //receiving user account or project's slug_id
    message: { type: String, required: true }, //typically set by projects to their new members, or to members during ban, upgrade or downgrade

    source: { type: String, required: true }, //user, project
    status: { type: String }, //seen, pending
    created: { type: Date, default: Date.now, required: true },
});

notificationSchema.index(
    {
        event: 1,
        from_account: 1,
        from: 1,
        to: 1,
        source: 1,
        state: 1,
        created: 1,
    },
    { name: 'notification_index' }
);

module.exports = mongoose.model('notificationSchema', notificationSchema);

/*

standard recognized event types will be:

new_user_welcome
new_user_reward_supporter
new_user_message
new_user_follow
new_user_hire

new_project_membership_request
new_project_member_welcome
new_project_reward_supporter
new_project_follow

new_project_creation_message

project_membership_approved
project_membership_declined
project_membership_removed

*/
