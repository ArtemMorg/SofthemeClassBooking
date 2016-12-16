using SofthemeClassBooking_BOL.Contract.Models;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(SofthemeClassBooking.App_Start.NinjectWebCommon), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethodAttribute(typeof(SofthemeClassBooking.App_Start.NinjectWebCommon), "Stop")]



namespace SofthemeClassBooking.App_Start
{
    using System;
    using System.Web;

    using Microsoft.Web.Infrastructure.DynamicModuleHelper;

    using Ninject;
    using Ninject.Web.Common;

    using SofthemeClassBooking_BLL.Implementation;
    using SofthemeClassBooking_BOL.Contract.Services;
    using SofthemeClassBooking_BOL.Models;

    public static class NinjectWebCommon
    {
        private static readonly Bootstrapper bootstrapper = new Bootstrapper();

        /// <summary>
        /// Starts the application
        /// </summary>
        public static void Start()
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            bootstrapper.Initialize(CreateKernel);
        }

        /// <summary>
        /// Stops the application.
        /// </summary>
        public static void Stop()
        {
            bootstrapper.ShutDown();
        }

        /// <summary>
        /// Creates the kernel that will manage your application.
        /// </summary>
        /// <returns>The created kernel.</returns>
        private static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            try
            {
                kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
                kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();

                RegisterServices(kernel);
                return kernel;
            }
            catch
            {
                kernel.Dispose();
                throw;
            }
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private static void RegisterServices(IKernel kernel)
        {
            kernel.Bind<IFeedbackService<IFeedback>>().To<FeedbackService>();
            kernel.Bind<IClassRoomService<IClassRoom>>().To<ClassRoomService>();
            kernel.Bind<IEventService<IEvent>>().To<EventService>();
            kernel.Bind<IParticipantService<IParticipant>>().To<ParticipantService>();

            kernel.Bind<IFeedback>().To<FeedbackModel>();
        }
    }
}
