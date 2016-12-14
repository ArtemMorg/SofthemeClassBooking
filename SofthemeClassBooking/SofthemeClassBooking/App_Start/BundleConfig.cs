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
                        "~/Scripts/shared.js",
                         "~/Scripts/event/event-modal.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/scripts/jquery").Include(
                        "~/Scripts/jquery/jquery-{version}.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/scripts/jqueryval").Include(
                        "~/Scripts/validation/jquery.validate*"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/scripts/feedback").Include(
                        "~/Scripts/validation/feedback-validation.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/scripts/map").Include(
                        "~/Scripts/map/jquery.min.js",
                        "~/Scripts/map/jquery.mapit.min.js"));


            bundles.Add(new ScriptBundle("~/bundles/scripts/roomevent").Include(
                        "~/Scripts/jquery/jquery-ui.js",
                        "~/Scripts/roomevent/calendar.js",
                      "~/Scripts/roomevent/render.js"));

            bundles.Add(new ScriptBundle("~/bundles/scripts/roompage").Include(
                        "~/Scripts/roompage.js"
                        ));
            #endregion


            #region styles

            bundles.Add(new StyleBundle("~/bundles/styles/general").Include(
                      "~/Content/css/reset.css",
                      "~/Content/css/layout.css",
                      "~/Content/css/global.css",
                      "~/Content/css/font-awesome.css",
                      "~/Content/css/custom-input.css",
                      "~/Content/css/modal.css",
                       "~/Content/css/event-modal.css"
                      ));

            bundles.Add(new StyleBundle("~/bundles/styles/registration").Include(
                "~/Content/css/registration.css"
                      ));

            bundles.Add(new StyleBundle("~/bundles/styles/layout").Include(
                  "~/Content/css/layout.css"));

            bundles.Add(new StyleBundle("~/bundles/styles/feedback").Include(
                    "~/Content/css/feedback.css"));

            bundles.Add(new StyleBundle("~/bundles/styles/profile").Include(
                    "~/Content/css/profile.css"));

            bundles.Add(new StyleBundle("~/bundles/styles/users").Include(
                     "~/Content/css/users.css"));

            bundles.Add(new StyleBundle("~/bundles/styles/plan").Include(
                    "~/Content/css/plan.css",
                    "~/Content/css/additionalInfoRoom.css"));

            bundles.Add(new StyleBundle("~/bundles/styles/event").Include(
                    "~/Content/css/eventpage.css"));

            bundles.Add(new StyleBundle("~/bundles/styles/roomevent").Include(
                    "~/Content/css/roomevent.css",
                    "~/Content/css/event.css"));
            #endregion
        }
    }
}
