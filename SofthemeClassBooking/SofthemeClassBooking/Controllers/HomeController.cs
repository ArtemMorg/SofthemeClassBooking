﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
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
        

        public ActionResult Schedule()
        {
            ViewBag.Message = "Your contact page.";

            return View("Index");
        }

        [HttpGet]
        public ActionResult PlanPartial()
        {
            //Thread.Sleep(2000);
            return PartialView();
        }

        [HttpGet]
        public ActionResult MapPartial()
        {
            //Thread.Sleep(2000);
            return PartialView();
        }

        [HttpGet]
        public ActionResult CalenderPartial()
        {
            //Thread.Sleep(2000);
            return PartialView();
        }

    }
}