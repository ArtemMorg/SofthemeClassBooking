using System.Web.Mvc;
using SofthemeClassBooking.Models;


namespace SofthemeClassBooking.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

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

        public ActionResult DialogWindow(DialogViewModel dialogModel)
        {
            return PartialView(dialogModel);
        }

    }
}