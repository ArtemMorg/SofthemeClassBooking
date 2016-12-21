using System.Web;
using System.Web.Optimization;

namespace SofthemeClassBooking
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            #region scripts

            bundles.Add(new ScriptBundle("~/bundles/scripts/general").Include(
                        "~/Scripts/jquery/jquery-{version}.js",
                        "~/Scripts/ajax/loader.js",
                        "~/Scripts/datetime.js",
                        "~/Scripts/shared.js",
                        "~/Scripts/dialog.js",
                        "~/Scripts/event/event-datetime.js",
                         "~/Scripts/event/event-modal.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/scripts/jquery").Include(
                        "~/Scripts/jquery/jquery-{version}.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/scripts/event-modal").Include(
                         "~/Scripts/event/event-modal.js"
                         ));

            bundles.Add(new ScriptBundle("~/bundles/scripts/jqueryval").Include(
                        "~/Scripts/validation/jquery.validate*"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/scripts/feedback").Include(
                        "~/Scripts/feedback/feedback.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/scripts/map").Include(
                        "~/Scripts/map/jquery.mapit.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/scripts/calendar").Include(
                        "~/Scripts/roomevent/calendar.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/scripts/event-popup").Include(
                        "~/Scripts/roomevent/roomevent-popup.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/scripts/WeekCalendar").Include(
                       "~/Scripts/jquery/jquery-ui.js",
                        "~/Scripts/roomevent/calendar.js",
                        "~/Scripts/roomevent/render.js",
                        "~/Scripts/roomevent/initialization.js"
                      ));

            bundles.Add(new ScriptBundle("~/bundles/scripts/roomevent").Include(
                        "~/Scripts/jquery/jquery-ui.js",
                        "~/Scripts/roomevent/calendar.js",
                        "~/Scripts/roomevent/render.js",
                        "~/Scripts/roomevent/initialization.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/scripts/eventpage").Include(
                        "~/Scripts/event/eventpage.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/scripts/roompage").Include(
                        "~/Scripts/roompage/roompage.js",
                        "~/Scripts/roomevent/calendar.js",
                        "~/Scripts/roompage/roompage-calendar.js",
                        "~/Scripts/roomevent/render.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/scripts/plan").Include(
                        "~/Scripts/plan/plan-section.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/scripts/profile").Include(
                        "~/Scripts/profile/profile.js"
                        ));
            #endregion


            #region styles

            bundles.Add(new StyleBundle("~/bundles/styles/general-auth").Include(
                      "~/Content/css/registration.css",
                      "~/Content/css/font-awesome.css",
                      "~/Content/css/custom-input.css",
                      "~/Content/css/dialog.css"
                      ));

            bundles.Add(new StyleBundle("~/bundles/styles/general").Include(
                      "~/Content/css/reset.css",
                      "~/Content/css/layout.css",
                      "~/Content/css/global.css",
                      "~/Content/css/font-awesome.css",
                      "~/Content/css/custom-input.css",
                      "~/Content/css/dialog.css",
                       "~/Content/css/event-modal.css"
                      ));

            bundles.Add(new StyleBundle("~/bundles/styles/registration").Include(
                "~/Content/css/registration.css"
                      ));

            bundles.Add(new StyleBundle("~/bundles/styles/layout").Include(
                  "~/Content/css/layout.css"
                  ));

            bundles.Add(new StyleBundle("~/bundles/styles/maplink").Include(
                  "~/Content/css/maplink.css"
                  ));

            bundles.Add(new StyleBundle("~/bundles/styles/feedback").Include(
                    "~/Content/css/feedback.css"
                    ));

            bundles.Add(new StyleBundle("~/bundles/styles/profile").Include(
                    "~/Content/css/profile.css"
                    ));

            bundles.Add(new StyleBundle("~/bundles/styles/users").Include(
                     "~/Content/css/users.css"
                     ));

            bundles.Add(new StyleBundle("~/bundles/styles/plan").Include(
                    "~/Content/css/plan.css",
                    "~/Content/css/additionalInfoRoom.css"
                    ));

            bundles.Add(new StyleBundle("~/bundles/styles/roompage").Include(
                     "~/Content/css/roompage-calendar.css"
                    ));

            bundles.Add(new StyleBundle("~/bundles/styles/event").Include(
                    "~/Content/css/eventpage.css"
                    ));

            bundles.Add(new StyleBundle("~/bundles/styles/roomevent").Include(
                    "~/Content/css/roomevent.css",
                    "~/Content/css/event.css"
                    ));
            #endregion
        }
    }
}
