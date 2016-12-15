using System.Web.Mvc;
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
                _feedbackService.Add(feedback);
                return Json(new { message = "Спасибо. Ваше сообщение отправлено администратору." });
            }

            return Json( new {message = "Данные введены неверно. Попробуйте еще раз."});
        }

    }
}