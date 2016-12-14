using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using SofthemeClassBooking.Models;
using SofthemeClassBooking_BOL.Contract.Services;
using SofthemeClassBooking_BOL.Models;
using SofthemeClassBooking.Localization;

namespace SofthemeClassBooking.Controllers
{
    public class EventController : Controller
    {
        private IEventService<EventModel> _eventService;
        private IParticipantService<ParicipantModel> _participantService;

        public EventController(
            IEventService<EventModel> eventService, 
            IParticipantService<ParicipantModel> participantService)
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

            if (User.IsInRole(WebConfigurationManager.AppSettings["UserRoleAdmin"]) ||
                User.Identity.GetUserId() == eventInfo.UserId)
            {
                return View("EventOwner", new EventViewModel
                {
                    Event = eventInfo,
                    Participants = _participantService.Get(id),
                    Author = author
                });
            }

            return View(new EventViewModel
            {
                Event = eventInfo,
                ParticipantCount = _participantService.GetCount(id),
                Author = author
            });

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
            eventModel.UserId = User.Identity.GetUserId();

            if (ModelState.IsValid)
            {
                try
                {
                    _eventService.Add(eventModel);
                }
                catch (InvalidOperationException)
                {
                    return Json(new {message = Localization.Localization.ErrorRoomIsBusy, success = false});
                }
                catch (Exception)
                {
                    return Json(new { message = Localization.Localization.ErrorGeneralException , success = false });
                }
            }

            return Json(new {message = Localization.Localization.InfoEventAddedSuccess, success = true });
        }

    }
}