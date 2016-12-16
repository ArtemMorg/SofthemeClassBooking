﻿using System.Web.Mvc;
using System.Web.Script.Serialization;
using SofthemeClassBooking_BOL.Contract.Models;
using SofthemeClassBooking_BOL.Contract.Services;
using SofthemeClassBooking_BOL.Enum;
using SofthemeClassBooking_BOL.Models;


namespace SofthemeClassBooking.Controllers
{
    public class ClassroomController : Controller
    {
        private IClassRoomService<IClassRoom> _classRoomService;
        // GET: Classroom
        public ClassroomController(IClassRoomService<IClassRoom> classRoomService)
        {
            _classRoomService = classRoomService;
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Index(int? id)
        {

            if (id != null)
            {
                ViewBag.SelectedRoomId = id;
            }
            return PartialView(_classRoomService.Get());
        }


        [HttpGet]
        public ActionResult GetNameId()
        {
            var classRooms = _classRoomService.GetNameId();
            var jsonSerialiser = new JavaScriptSerializer();
            return Json(jsonSerialiser.Serialize(classRooms), JsonRequestBehavior.AllowGet);

        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult AdditionalInfo(int id, bool edit = false)
        {
            if (edit)
            {
                return PartialView("EditClassRoomInfo", _classRoomService.Get(id));
            }
            return PartialView(_classRoomService.Get(id));
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult AdditionalInfo(IClassRoom classRoomModel)
        {
            return PartialView("AdditionalInfo", classRoomModel);
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult RoomPage(int id)
        {
            return View(_classRoomService.Get(id));
        }

        [HttpPost]
        //[Authorize(Roles = "Administrator")]
        public ActionResult Edit(IClassRoom classRoom)
        {
            if (ModelState.IsValid)
            {
                _classRoomService.Update(classRoom);
                return Json(new {success = true});
            }
            return Json(new { success = false });
        }

        [HttpPost]
        //[Authorize(Roles = "Administrator")]
        public ActionResult ChangeStatus(int id, int classRoomStatus)
        {
            if (ModelState.IsValid)
            {
                _classRoomService.ChangeRoomStatus(id, (ClassRoomStatus)classRoomStatus);
                return Json(new { success = true });
            }
            return Json(new { success = false });
        }
    }
}