'use strict';

//always keep in sync with ../models/notification.js

var messages = {};

messages.new_user_message = 'You have received a new message from @{{from}}.';
messages.new_user_follow = '@{{from}} started following you!';
messages.new_user_hire = '@{{from}} wants to hire you!';

messages.new_project_membership_request =
    '@{{from}} requested to join your project.';

messages.new_project_member_welcome =
    'Welcome to the {{from}} project. We hope to do great things together.'; //used project does not have a custom message for new members

messages.new_project_follow = '@{{from}} started following your project.';

messages.project_membership_approved =
    'Your membership request to {{from}} has been approved!';
messages.project_membership_declined =
    'Your membership of request to {{from}} has been declined.';
messages.project_membership_removed =
    'Your membership of {{from}} has been removed.';

/* active */

//informators
messages.project_membership_upgrade =
    'You have been made a team member of the <a href="/project/{{from}}">{{from}}</a> project.';

//thankers
messages.sign_up =
    'Thank you for joining <a href="/peer/{{to}}">{{from}}</a>. Please read our <a href="/support/faqs">FAQs</a> or visit our <a href="/support">support center</a> to get started.';

messages.user_beneficiary =
    'Wow, you just received a new post reward split support from <a href="/peer/{{from}}">@{{from}}</a>.';

messages.project_beneficiary =
    'Your project has received a new reward split support from <a href="/peer/{{from}}">@{{from}}</a>';

//manage
messages.create_project =
    '<a href="/peer/{{from}}">@{{from}}</a> looks great. Remember to create queries to enlist like-minded peers to your project.';
messages.tranfer_project =
    'The <a href="/project/{{from}}">{{from}}</a> project has been transfered to you.';
messages.delete_project =
    'Your <a href="/project/{{from}}">{{from}}</a> project has been deleted. Remember, you can always create a new one.';

module.exports = messages;
