'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
    event: { type: String, required: true },

    from: { type: String, required: true }, //source, may be a account, project(slug_id) or market
    from_name: { type: String }, //if a project, then the project's title
    from_account: { type: String }, //the user who acted on behalf of the project
    to: { type: String, required: true }, //receiving user account or project's slug_id

    relation: { type: String, required: true }, //project_2_user, user_2_project, user_2_user, project_2_project, site_2_user, site_2_project
    status: { type: String }, //seen, pending
    created: { type: Date, default: Date.now, required: true },
});

notificationSchema.index(
    {
        event: 1,
        relation: 1,
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

user_reward_supporter           *pending
message                         *set        //message first then notification //mongoose message model post save middleware
new_user_follow                 *pending
new_user_hire                   *pending

request_project_membership      *set 
new_project_reward_supporter    *pending
new_project_follow              *pending  

//not used
project_membership_approved     *set//message first then notification //mongoose message model post save middleware
project_membership_removed      *set
project_membership_rejected     *set
project_membership_left         *set

//used
user_beneficiary                *set
project_beneficiary             *set

//used
create_project                  *set        //message first then notification //mongoose model post save middleware
transfer_project                *set
delete_project                  *set

//used
project_membership_upgrade     *set

sign_up                         *set         //message first then notification //mongoose message model post save middleware

new_user_messages_reply         *pending

*/
