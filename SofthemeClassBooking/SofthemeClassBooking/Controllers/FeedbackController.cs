using System;
using System.Web.Mvc;
using SofthemeClassBooking_BOL.Contract.Models;
using SofthemeClassBooking_BOL.Contract.Services;
using SofthemeClassBooking_BOL.Models;

namespace SofthemeClassBooking.Controllers
{
    public class FeedbackController : Controller
    {
        private IFeedbackService<FeedbackModel> _feedbackService;

        public FeedbackController(IFeedbackService<FeedbackModel> feedbackService)
        {
            _feedbackService = feedbackService;
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Send(FeedbackModel feedback)
        {

            if (ModelState.IsValid)
            {
                try
                {
                    _feedbackService.Add(feedback);
                    return Json(new {message = Localization.Localization.FeedBackSuccess, success = false});
                }
                catch (Exception)
                {
                    return Json(new { message = Localization.Localization.ErrorGeneralException, success = false });
                }
            }

            return Json( new {message = Localization.Localization.FeedBackModelError, success = true });
        }

    }
}