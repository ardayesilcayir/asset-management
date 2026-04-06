using AssetManagement.Application.DTOs.Dashboard;

namespace AssetManagement.Application.Interfaces.Services
{
    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetStatsAsync();
    }
}
