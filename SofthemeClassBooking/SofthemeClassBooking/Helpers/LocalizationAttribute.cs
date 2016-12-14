using System;
using System.Globalization;
using System.Threading;
using System.Web.Mvc;

namespace Customers.Helpers
{
    public class LocalizationAttribute : ActionFilterAttribute
    {
        private string _defaultLanguage = "ru";

        public LocalizationAttribute(string defaultLanguage)
        {
            _defaultLanguage = defaultLanguage;
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            string lang = (string)filterContext.RouteData.Values["lang"] ?? _defaultLanguage;
            //if(lang != _defaultLanguage)
            //{
            try
            {
                Thread.CurrentThread.CurrentCulture =
                    Thread.CurrentThread.CurrentUICulture = new CultureInfo(lang);
            }
            catch (Exception)
            {
                throw new NotSupportedException(string.Format("ERROR: invalid language code '{0}'.", lang));
            }
            //}
        }
    }
}