using System;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using SofthemeClassBooking.Models;
using SofthemeClassBooking_BOL.Contract.Models;
using SofthemeClassBooking_BOL.Contract.Services;
using SofthemeClassBooking_BOL.Models;
using SofthemeClassBooking_BOL.Exceptions;

namespace SofthemeClassBooking.Controllers
{
    public class EventController : Controller
    {
        private IEventService<IEvent> _eventService;
        private IParticipantService<IParticipant> _participantService;

        public EventController(
            IEventService<IEvent> eventService,
            IParticipantService<IParticipant> participantService)
        {
            _eventService = eventService;
            _participantService = participantService;

        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Brief()
        {
            var eventsBriefJson = JsonConvert.SerializeObject(_eventService.GetBrief(), Formatting.None, new IsoDateTimeConverter() { DateTimeFormat = "yyyy-MM-dd-HH-mm-ss" });
            return Json(eventsBriefJson, JsonRequestBehavior.AllowGet);
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


        [Authorize]
        [HttpGet]
        public ActionResult UserEvents()
        {
            var userEvents = JsonConvert.SerializeObject(_eventService.GetByUser(User.Identity.GetUserId()), Formatting.None, new IsoDateTimeConverter() { DateTimeFormat = "yyyy-MM-dd-HH-mm-ss" });
            return Json(userEvents, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Cancel(int id)
        {
            try
            {
                _eventService.Remove(new EventModel
                {
                    Id = id
                });

                return Json(new { success = true });
            }
            catch (Exception)
            {
                return Json(new { messsage = Localization.Localization.ErrorGeneralException, success = true });
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult InfoVerbose(int id)
        {
            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(ApplicationDbContext.Create()));
            var eventInfo = _eventService.Get(id);
            eventInfo.Id = id;

            return PartialView(new EventViewModel
            {
                Event = eventInfo,
                ParticipantCount = _participantService.GetCount(id),
                Author = userManager.FindById(eventInfo.UserId).UserName
            });
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
                _eventService.Add(eventModel);
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
                _eventService.Update(eventModel, pivotModel);
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