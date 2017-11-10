import Promises from '../models/promise'
import { parsePromise } from '../lib/parse'

// utility to populate table with hardcoded promises below
export function setup() { 
  Promises.sync({force: true}) // 'force: true' just drops the table if it exists
    .then(function(){         // and creates a new one!
      // Add the default promises to the database
      for (var i = 0; i < promises.length; i++) {
        Promises.create(parsePromise({ urtext: promises[i] }))
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

  "chris.promises.to/follow_up_on_that_support_thread", // 9-18
  "chris.promises.to/open_a_smoothie_shop/by/December", // 9-25
  "chris.promises.to/learn-more-about-glitch/by/monday", // 9-28
  "chris.promises.to/learn-more-about-something-else/by/monday", // 9-28
  "chris.promises.to/learn-more-about-something-else/by/monday", // 10-08
  "chris.promises.to/build-out-a-promise-completion-interface/by/next-week", // 10-13
  "chris.promises.to/finish-the-datepicker-feature/by/tomorrow", // 10-28
  "chris.promises.to/finish-the-latest-pr/by/tonight", // 11-02

  "braden.promises.to/help_with_javascript/by/5pm", // 9-11
  "braden.commits.to/outline_bite_counting_post/by/Sunday_11pm", // 9-13

  "byorgey.promises.to/email_cut_property_summary/by/7pm", // 9-22
  "byorgey.promises.to/upload_new_factorization_cards/by/Oct_25", // 10-18
  "byorgey.promises.to/email_cut_property_summary", // 10-18

  "owen.promises.to/adjust-the-shed/by/tonight_7pm", // 9-28
  "owen.promises.to/research_and_pseudocode_calendar_integration/by/oct_6", // 9-29, done
  
  "sergii.promises.to/work_on_points_2_to_4/by/next_monday", // 9-14
  "jessica.commits.to/let_bob_know_re_meeting/by/tomorrow_5pm", // 9-19
  "samuel.commits.to/finish_ch_23_problem_set/by/today_6_pm", // 9-19
  "pierre.promises.to/water_the_office_plant/by/Friday", // 9-25
  "stephen.promises.to/decide_upon_late_october_trip/by/saturday", // 9-27
  "roy.promises.to/sign_up_for_app", // 9-27
  "jennyli.promises.to/water_the_plants/by/sunday", // 9-27
  "cole.promises.to/find_a_rep_for_dining_vendors", // 9-28
  "caillu.commits.to/test_trying_out_time/by/2017-09-30_20:42", // 9-30
  "josh.commits.to/get_realisies_running/by/september_30", // 9-13
  "mbork.promises.to/edit_tutorial_for_students/by/tomorrow_8am", // 10-06

  "kim.promises.to/email_argue_summary/by/fri", // 9-19
  "kim.promises.to/reflect_Respond_anxiety_spiral_Assist/by/sat", // 9-19
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
  "kim.promises.to/talk_finances_w_D/by/2017-10-30", // 10-05

  "bee.commits.to/new-family-photo-to-yoko/by/tomorrow-night", // 9-18, done
  "bee.commits.to/rest-of-paperwork-to-yoko-before-the-gym-tomorrow", // 9-18, done 2 hours late
  "bee.commits.to/email-sleep-as-android-for-specifics-about-sleep-length-measurement", // 9-19
  "bee.promises.to/read-hannas-emails", // 9-26, done
  "bee.promises.to/reping-one-with-heart", // 9-26
  "bee.promises.to/fill-out-metromile-feedback", // 9-26
  "bee.promises.to/schedule-planning-with-cantor/by/friday-night", // 9-26, done
  "bee.commits.to/put-away-camping-gear-this-weekend", // 9-29
  "bee.commits.to/prettying_road_editor", // 10-04
  "bee.commits.to/go_to_bed/by/11pm", // 10-20
]
