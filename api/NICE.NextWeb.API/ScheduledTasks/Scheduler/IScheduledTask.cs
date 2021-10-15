using System.Threading;
using System.Threading.Tasks;

namespace NICE.NextWeb.API.ScheduledTasks.Scheduler
{
    public interface IScheduledTask
    {
        string Schedule { get; }
        Task ExecuteAsync(CancellationToken cancellationToken);
    }
}
