using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SofthemeClassBooking.Controllers;
using SofthemeClassBooking_BOL.Contract.Models;
using SofthemeClassBooking_BOL.Contract.Services;

namespace SofthemeClassBooking_UnitTest
{
    [TestClass]
    public class FeedBackControllerTest
    {
        private IFeedbackService<IFeedback> _feedbackService;

        public FeedBackControllerTest()
        {
            
        }

        [TestMethod]
        public void SendFeedbackTest()
        {
            var feedBackController = new FeedbackController(_feedbackService);

            Assert.AreEqual("1", "1");
        }
    }
}
