using System.Web.Mvc;
using SofthemeClassBooking.Models;


namespace SofthemeClassBooking.Controllers
{
    [HandleError(View = "Error")]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [Authorize]
        public ActionResult UserProfile()
        {
            return View("Profile");
        }

        [HttpGet]
        public ActionResult MapPartial()
        {
            return PartialView();
        }

        [HttpPost]
        public ActionResult DialogWindow(DialogViewModel dialogModel)
        {
            return PartialView(dialogModel);
        }

        [HttpGet]
        public ActionResult MapLink()
        {
            return PartialView();
        }

    }
}