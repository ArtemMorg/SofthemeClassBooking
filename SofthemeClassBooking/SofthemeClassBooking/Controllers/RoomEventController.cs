using System.Web.Mvc;
using SofthemeClassBooking_BOL.Models;

namespace SofthemeClassBooking.Controllers
{
    public class RoomEventController : Controller
    {
        // GET: Event
        public ActionResult Index()
        {
            return PartialView();
        }

        public ActionResult New (EventModel newEvent)
        {
            return PartialView();
        }

        [HttpPost]
        public ActionResult Create(EventModel newEvent)
        {
            if (ModelState.IsValid)
            {
                return Json(new { message = "SuccessMessage" });
            }

            return Json(new {message = "Not success"});
        }
    }
}