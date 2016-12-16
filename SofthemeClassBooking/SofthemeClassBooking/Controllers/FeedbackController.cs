using System;
using System.Web.Mvc;
using SofthemeClassBooking_BOL.Contract.Models;
using SofthemeClassBooking_BOL.Contract.Services;
using SofthemeClassBooking_BOL.Models;

namespace SofthemeClassBooking.Controllers
{
    public class FeedbackController : Controller
    {
        private IFeedbackService<IFeedback> _feedbackService;

        public FeedbackController(IFeedbackService<IFeedback> feedbackService)
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
            feedback = null;
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