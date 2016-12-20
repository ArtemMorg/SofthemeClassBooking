using System;
using System.Web.Mvc;
using System.Web.Security;
using Microsoft.AspNet.Identity;
using SofthemeClassBooking_BOL.Contract.Models;
using SofthemeClassBooking_BOL.Contract.Services;
using SofthemeClassBooking_BOL.Models;
using SofthemeClassBooking_BOL.Exceptions;

namespace SofthemeClassBooking.Controllers
{
    public class ParticipantController : Controller
    {
        private IParticipantService<IParticipant> _participantService;

        public ParticipantController(IParticipantService<IParticipant> participantService)
        {
            _participantService = participantService;
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Add(ParicipantModel paricipantModel)
        {

            if (!ModelState.IsValid)
            {
                return Json(new { message = Localization.Localization.ErrorModelValidation, success = true });
            }
            try
            {
                _participantService.Add(paricipantModel);
            }
            catch (ParticipantAlreadyRegisteredException)
            {
                return Json(new { message = Localization.Localization.ErrorEventAlreadyEnrolledPlaceholder, success = false });
            }
            catch (ParticipantCountReachedMaximumRoomCapacityException)
            {
                return Json(new { message = Localization.Localization.ErrorEventParticipantReachedMaximumPlaceholder, success = false });
            }

            return Json(new { message = Localization.Localization.InfoParticipantAddedSuccess, success = true });
        }

        [HttpPost]
        public ActionResult IsTakePart(int eventId)
        {
            try
            {
                var response = _participantService.IsTakePart(eventId, User.Identity.GetUserId());
                return Json(new {message = response, success = true});
            }
            catch (Exception)
            {
                return Json(new { message = Localization.Localization.ErrorGeneralException, success = false });
            }
        }

        [HttpGet]
        [Authorize]
        public ActionResult Participants(int eventId)
        {//_participantService.Get(eventId)
            try
            {
                return PartialView(_participantService.Get(eventId));
            }
            catch (Exception)
            {
                return Json(new { message = Localization.Localization.ErrorGeneralException, success = false });
            }
        }

        [HttpPost]
        [Authorize]
        public ActionResult Remove(ParicipantModel participantModel)
        {
            try
            {
                _participantService.Remove(participantModel);
                return Json(new { success = true });
            }
            catch (Exception)
            {
                return Json(new { message = Localization.Localization.ErrorGeneralException, success = false });
            }
        }
    }
}