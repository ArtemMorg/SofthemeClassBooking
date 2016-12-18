using System.Web.Mvc;
using SofthemeClassBooking_BOL.Contract.Models;
using SofthemeClassBooking_BOL.Contract.Services;
using SofthemeClassBooking_BOL.Models;

namespace SofthemeClassBooking.Controllers
{
    public class RoomEventController : Controller
    {
        private IEventService<IEvent> _eventService;

        public RoomEventController(IEventService<IEvent> eventService)
        {
            _eventService = eventService;
        }


        public ActionResult Index()
        {
            return PartialView();
        }

        [HttpGet]
        public ActionResult CrudView(int? eventId)
        {
            if (eventId != null)
            {
                return PartialView(_eventService.Get((int)eventId));
            }

            return PartialView();
        }

    }
}