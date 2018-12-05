'use strict';

//always keep in sync with ../models/notification.js

var messages = {};

messages.new_user_welcome =
    'Thank you for joining {{to}}. Please read our <a href="/support/faqs">FAQs</a> or visit our <a href="/support">support center</a> to get started.';
messages.new_user_reward_supporter =
    'Wow, you just received a new post reward split support from @{{from}}.';
messages.new_user_message = 'You have received a new message from @{{from}}.';
messages.new_user_follow = '@{{from}} started following you!';
messages.new_user_hire = '@{{from}} wants to hire you!';

messages.new_project_membership_request =
    '@{{from}} requested to join your project.';

messages.new_project_member_welcome =
    'Welcome to the {{from_name}} project. We hope to do great things together.'; //used project does not have a custom message for new members

messages.new_project_reward_supporter =
    'Your project has received a new reward split support from @{{from}}';
messages.new_project_follow = '@{{from}} started following your project.';

messages.new_project_creation_message =
    '{{from_name}} looks great. Remember to create queries to enlist like-minded peers to your project.';

messages.project_membership_approved =
    'Your membership request to {{from_name}} has been approved!';
messages.project_membership_declined =
    'Your membership of request to {{from_name}} has been declined.';
messages.project_membership_removed =
    'Your membership of {{from_name}} has been removed.';

module.exports = messages;
