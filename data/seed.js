import Promise from '../models/promise.js'
import parsePromise from '../lib/parse.js'

// utility to populate table with hardcoded promises below
export function setup() { 
  Promise.sync({force: true}) // 'force: true' just drops the table if it exists
    .then(function(){         // and creates a new one!
      // Add the default promises to the database
      for (var i = 0; i < promises.length; i++) {
        Promise.create(parsePromise(promises[i]))
      }
    })
}

// we're domain agnostic, but we have to have a default
export const domain = 'commits.to' ;

export const users = [ 
  /* testing */ 
  "alice", "bob", "carol",
  /* initial co-conspirators */ 
  "dreev", "sergii", "kim", "bee", "braden", 
  /* daily beemail */ 
  "byorgey", "nick", "josh", "dehowell", "caillu", "mbork", "roy", "jennyli", 
  "owen",
  /* weekly beemail */ 
  "samuel", "cole", "jessica", "steven",
  /* contributors */ 
  "chris", "stephen",
  /* invitees */ 
  "pierre", "chelsea", 
]

// dreev calls dibs on "danny", "dan", & "d" in case we implement aliases
// usernames to disallow: "www", "admin", 

// Initial promise list hardcoded so don't have to worry about blowing db away
export const promises = [
  "alice.promises.to/File_the_TPS_report/by/noon_mon",
  "bob.promises.to/Send_vacation_photos/by/saturday",
  "carol.promises.to/Call_the_dentist/by/12am",
  "dreev.promises.to/show_sergii_this_doing_something_useful/by/3am", // 9-10, done, B
  "dreev.promises.to/show_bee_open_questions/by/10:30pm", // 9-10, done, B
  "braden.promises.to/help_with_javascript/by/5pm", // 9-11
  "dreev.promises.to/show_brennan_intro/by/10:50pm", // 9-11, done, B
  "dreev.promises.to/queue_tweet_etc_for_blog_post/by/2pm", // 9-11, done, B
  "dreev.promises.to/order_indian/by/5:30pm", // 9-12, done, B
  "dreev.commits.to/ask_bee_re_sunday_parkways", // 9-13, done, B
  "dreev.commits.to/follow_up_with_everyone_re_guest_blogging", // 9-13, B
  "josh.commits.to/get_realisies_running/by/september_30", // 9-13
  "braden.commits.to/outline_bite_counting_post/by/Sunday_11pm", // 9-13
  "dreev.commits.to/report_glitch_bug", // 9-14, done, B
  "dreev.commits.to/googledocify_intern_form/by/12pm", // 9-14, done, B
  "dreev.promises.to/test_penalty_func/by/saturday_noon", // 9-14, done, B
  "sergii.promises.to/work_on_points_2_to_4/by/next_monday", // 9-14
  "dreev.commits.to/meta_debrief_kim/by/midnight_friday", // 9-14, done, B
  "dreev.commits.to/ping_mirabai/by/sep_22", // 9-14, done, B
  "dreev.commits.to/send_ms_gross_email/by/sunday_11am", // 9-14, done, B
  "dreev.promises.to/ping_oli/by/nov_16", // 9-15, B
  "dreev.promises.to/ping_byorgey/by/dec_20", // 9-15, B
  "dreev.promises.to/labelzero/by/1am", // 9-15, done, B
  "chris.promises.to/follow_up_on_that_support_thread", // 9-18
  "bee.commits.to/new-family-photo-to-yoko/by/tomorrow-night", // 9-18, done
  "bee.commits.to/rest-of-paperwork-to-yoko-before-the-gym-tomorrow", // 9-18, done 2 hours late
  "dreev.promises.to/debug_capitalization/by/tomorrow", // 9-18, done 23.4 hours late, B
  "bee.commits.to/email-sleep-as-android-for-specifics-about-sleep-length-measurement", // 9-19
  "jessica.commits.to/let_bob_know_re_meeting/by/tomorrow_5pm", // 9-19
  "samuel.commits.to/finish_ch_23_problem_set/by/today_6_pm", // 9-19
  "dreev.promises.to/intern_disc/by/wed", // 9-19, done, B
  "kim.promises.to/email_argue_summary/by/fri", // 9-19
  "dreev.commits.to/clear_bogus_commit_for_nick/by/5_minutes_from_now", // 9-19, done, B
  "kim.promises.to/reflect_Respond_anxiety_spiral_Assist/by/sat", // 9-19
  "dreev.commits.to/schedule-k_tax_thing/by/5pm", // 9-19, done, B
  "dreev.promises.to/set_up_mom_on_wordfeud/by/tomorrow", // 9-20, done/void, B
  "dreev.promises.to/reply_to_use_case_email/by/midnight", // 9-20, done
  "kim.promises.to/consider_all_weekend_social_options/by/fri/10pm", // 9-20
  "kim.promises.to/submit_conclusion_email/by/10/16", // 9-21
  "kim.promises.to/complete_type_1_essay/by/10/1", // 9-21
  "kim.promises.to/inform_eve_plans/by/2", // 9-21
  "kim.promises.to/email_cynthia_charlap_tickets/by/9/22", // 9-21
  "kim.promises.to/schedule_attorney_meet/by/10/1", // 9-21
  "kim.promises.to/john_PAM_photos_ask/by/10/1", // 9-21
  "kim.promises.to/Nike_p5_email/by/10/1", // 9-21
  "kim.promises.to/intro_martin_marna/by/10/5", // 9-21
  "kim.promises.to/sbonomic_jitsjudgelist_doc/by/10/15", // 9-21
  "kim.promises.to/consider_all_weekend_social_options/by/fri/10pm", // 9-21
  "dreev.commits.to/dedup_the_iwills/by/nov", // 9-22
  "byorgey.promises.to/email_cut_property_summary/by/7pm", // 9-22
  "dreev.commits.to/copy_editing_pass_on_tao2/by/tmw_2pm", // 9-22, done
  "chris.promises.to/open_a_smoothie_shop/by/December", // 9-25
  "pierre.promises.to/water_the_office_plant/by/Friday", // 9-25
  "dreev.promises.to/hanna_reply/by/tonight", // 9-26, done
  "bee.promises.to/read-hannas-emails", // 9-26, done
  "bee.promises.to/reping-one-with-heart", // 9-26
  "bee.promises.to/fill-out-metromile-feedback", // 9-26
  "bee.promises.to/schedule-planning-with-cantor/by/friday-night", // 9-26, done
  "dreev.promises.to/ask_jana_about_blood_testers/by/dec_1", // 9-26
  "dreev.commits.to/take_copyediting_pass_on_micheles_draft/by/saturday", // 9/27, done
  "stephen.promises.to/decide_upon_late_october_trip/by/saturday", // 9-27
  "roy.promises.to/sign_up_for_app", // 9-27
  "jennyli.promises.to/water_the_plants/by/sunday", // 9-27
  "owen.promises.to/adjust-the-shed/by/tonight_7pm", // 9-28
  "cole.promises.to/find_a_rep_for_dining_vendors", // 9-28
  "chris.promises.to/learn-more-about-glitch/by/monday", // 9-28
  "chris.promises.to/learn-more-about-something-else/by/monday", // 9-28
  "dreev.promises.to/add_chelsea_to_commits_to/by/11am", // 9-29, done
  "bee.commits.to/put-away-camping-gear-this-weekend", // 9-29
  "owen.promises.to/research_and_pseudocode_calendar_integration/by/oct_6", // 9-29, done
  "caillu.commits.to/test_trying_out_time/by/2017-09-30_20:42", // 9-30
  "dreev.commits.to/let_yall_know_about_monitor/by/next_week", // 10-02, done
  "bee.commits.to/prettying_road_editor", // 10-04
  "kim.promises.to/talk_finances_w_D/by/2017-10-30", // 10-05
  "dreev.commits.to/give_marcin_status_update/by/oct-5-noon", // 9-04, done 10.5 hours late
  "dreev.commits.to/give_james_d_status_update/by/oct-5-noon", // 9-04, done 10.5 hours late
  "mbork.promises.to/edit_tutorial_for_students/by/tomorrow_8am", // 10-06
  "dreev.commits.to/ping_josh_re_realsies_integration/by/nov_7", // 10-06, done
  "chris.promises.to/learn-more-about-something-else/by/monday", // 10-08
  "dreev.commits.to/curtain_edit/by/oct_20", // 10-09, done
  "dreev.commits.to/reply_to_smreeves/by/today", // 10-11, done
  "dreev.promises.to/update_jess_and_ryan/by/december", // 10-11
  "dreev.promises.to/look_at_chrome_minder/by/end_of_next_week", // 10-12
  "dreev.commits.to/finish_implementing_this_system/by/january", // 10-12
  "chris.promises.to/build-out-a-promise-completion-interface/by/next-week", // 10-13
  "byorgey.promises.to/upload_new_factorization_cards/by/Oct_25", // 10-18
  "byorgey.promises.to/email_cut_property_summary", // 10-18
  "dreev.promises.to/find_ein_etc/by/3pm", // 10-18, done, B
  "bee.commits.to/go_to_bed/by/11pm", // 10-20
  "dreev.commits.to/ascertain_re_sunday/by/wed", // 10-23, B
  "dreev.promises.to/do_redirect_for_mel/by/10pm", // 10-23, B
  "dreev.commits.to/ping_malcolm_re_android/by/today", // 10-24, B
  "dreev.commits.to/talk_to_bee_and_uluc_re_beedroid_publishing/by/tomorrow_night", // 10-24, 
]
