using System;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using SofthemeClassBooking.Helpers;
using SofthemeClassBooking.Models;
using SofthemeClassBooking_BOL.Contract.Models;
using SofthemeClassBooking_BOL.Contract.Services;
using SofthemeClassBooking_BOL.Enum;
using SofthemeClassBooking_BOL.Models;
using SofthemeClassBooking_BOL.Exceptions;

namespace SofthemeClassBooking.Controllers
{
    public class EventController : Controller
    {
        private IEventService<IEvent> _eventService;
        private IParticipantService<IParticipant> _participantService;
        private static object _lock = new object();

        public EventController(
            IEventService<IEvent> eventService,
            IParticipantService<IParticipant> participantService)
        {
            _eventService = eventService;
            _participantService = participantService;

        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult Brief(DateTime dateEventsFrom, DateTime dateEventsTo)
        {
            if (!DateTimeValidationHelper.IsDateTimeValid(dateEventsFrom, dateEventsTo))
            {
                return Json(new { message = Localization.Localization.ErrorInvalidDatetime, success = false });
            }
            try
            {
                var eventsBriefJson = JsonConvert.SerializeObject(_eventService.GetBrief(dateEventsFrom, dateEventsTo),
                    Formatting.None, new IsoDateTimeConverter() { DateTimeFormat = EventSettings.DateTimeToJsonLong });
                return Json(eventsBriefJson, JsonRequestBehavior.AllowGet);

            }
            catch (Exception)
            {
                return Json(new { message = Localization.Localization.ErrorGeneralException, success = false });
            }
        }

        [Authorize]
        [HttpPost]
        public ActionResult UserEvents()
        {
            var userEvents = JsonConvert.SerializeObject(_eventService.GetByUser(User.Identity.GetUserId()),
                                                        Formatting.None,
                                                        new IsoDateTimeConverter() { DateTimeFormat = EventSettings.DateTimeToJsonLong });
            try
            {
                return Json(userEvents, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(new { message = Localization.Localization.ErrorGeneralException, success = false });
            }
        }


        [HttpGet]
        [AllowAnonymous]
        public ActionResult Index(int id)
        {
            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(ApplicationDbContext.Create()));
            var eventInfo = _eventService.Get(id);
            eventInfo.Id = id;

            var author = userManager.FindById(eventInfo.UserId).UserName;

            return View(new EventViewModel
            {
                Event = eventInfo,
                Participants = _participantService.Get(id),
                Author = author
            });
        }

        [HttpPost]
        public ActionResult ByClassRoom(int id, DateTime dateEventsFrom, DateTime dateEventsTo)
        {
            if (!DateTimeValidationHelper.IsDateTimeValid(dateEventsFrom, dateEventsTo))
            {
                return Json(new { message = Localization.Localization.ErrorInvalidDatetime, success = false });
            }
            try
            {
                var eventsByClassRoom = JsonConvert.SerializeObject(_eventService.GetByClassRoom(id, dateEventsFrom, dateEventsTo),
                    Formatting.None, new IsoDateTimeConverter() { DateTimeFormat = EventSettings.DateTimeToJsonLong });
                return Json(eventsByClassRoom, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(new { message = Localization.Localization.ErrorGeneralException, success = false });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Cancel(int id)
        {
            try
            {
                lock (_lock)
                {
                    _eventService.Remove(new EventModel
                    {
                        Id = id
                    });

                    return Json(new { success = true });
                }
            }
            catch (Exception)
            {
                return Json(new { messsage = Localization.Localization.ErrorGeneralException, success = true });
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult InfoVerbose(int id, bool isPrivate)
        {

            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(ApplicationDbContext.Create()));

            try
            {

                var eventInfo = _eventService.Get(id);
                eventInfo.Id = id;

                if (isPrivate && eventInfo.UserId != User.Identity.GetUserId())
                {
                    return Json(new { message = false, success = true });
                }

                return PartialView(new EventViewModel
                {
                    Event = eventInfo,
                    ParticipantCount = _participantService.GetCount(id),
                    Author = userManager.FindById(eventInfo.UserId).UserName
                });
            }
            catch (Exception)
            {
                return Json(new { message = Localization.Localization.ErrorGeneralException, success = false });
            }
        }

        [HttpGet]
        [Authorize]
        public ActionResult InfoPrivate(int id)
        {

            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(ApplicationDbContext.Create()));
            var eventInfo = _eventService.Get(id);

            if (User.Identity.GetUserId() != eventInfo.UserId)
            {
                return null;
            }

            eventInfo.Id = id;

            return PartialView(new EventViewModel
            {
                Event = eventInfo,
                ParticipantCount = _participantService.GetCount(id),
                Author = userManager.FindById(eventInfo.UserId).UserName
            });
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Info(int id)
        {
            var eventInfo = _eventService.Get(id);
            eventInfo.Id = id;

            return PartialView(eventInfo);
        }

        [HttpGet]
        [Authorize]
        public ActionResult Create()
        {
            return PartialView();
        }

        [HttpPost]
        [Authorize]
        [ValidateAntiForgeryToken]
        public ActionResult Create(EventModel eventModel)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { message = Localization.Localization.ErrorModelValidation, success = false });
            }

            eventModel.UserId = User.Identity.GetUserId();
            try
            {
                lock (_lock)
                {
                    _eventService.Add(eventModel);
                }
            }
            catch (RoomIsBusyException)
            {
                return Json(new { message = Localization.Localization.ErrorRoomIsBusy, success = false });
            }
            catch (RoomCapacityException)
            {
                return Json(new { message = Localization.Localization.ErrorRoomCapacityLessOne, success = false });
            }
            catch (Exception)
            {
                return Json(new { message = Localization.Localization.ErrorGeneralException, success = false });
            }

            return Json(new { message = Localization.Localization.InfoEventAddedSuccess, success = true });
        }

        [HttpPost]
        [Authorize]
        public ActionResult Update(EventModel eventModel, EventModel pivotModel)
        {
            try
            {
                lock (_lock)
                {
                    _eventService.Update(eventModel, pivotModel);
                }
            }
            catch (RoomIsBusyException)
            {
                return Json(new { message = Localization.Localization.ErrorRoomIsBusy, success = false });
            }
            catch (RoomCapacityException)
            {
                return Json(new { message = Localization.Localization.ErrorRoomCapacityLessOne, success = false });
            }
            catch (Exception)
            {
                return Json(new { message = Localization.Localization.ErrorGeneralException, success = false });
            }

            return Json(new { message = Localization.Localization.InfoEventChangedSuccess, success = true });
        }
    }
}