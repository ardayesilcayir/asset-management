using AssetManagement.Application.DTOs.Dashboard;
using AssetManagement.Application.Interfaces.Repositories;
using AssetManagement.Application.Interfaces.Services;
using AssetManagement.Domain.Enums;

namespace AssetManagement.Application.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IAssetRepository _assetRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IAssetCategoryRepository _categoryRepository;

        public DashboardService(
            IAssetRepository assetRepository,
            IEmployeeRepository employeeRepository,
            IAssetCategoryRepository categoryRepository)
        {
            _assetRepository = assetRepository;
            _employeeRepository = employeeRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<DashboardStatsDto> GetStatsAsync()
        {
            var assets = await _assetRepository.GetAllWithCategoryAsync();
            var employees = await _employeeRepository.GetAllAsync();

            var categoryDistribution = assets
                .Where(a => !a.IsDeleted)
                .GroupBy(a => a.AssetCategory?.Name ?? "Kategorisiz")
                .Select(g => new CategoryDistributionDto
                {
                    CategoryName = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(x => x.Count)
                .ToList();

            return new DashboardStatsDto
            {
                TotalAssets = assets.Count(a => !a.IsDeleted),
                AssignedAssets = assets.Count(a => !a.IsDeleted && a.Status == AssetStatus.Assigned),
                AvailableAssets = assets.Count(a => !a.IsDeleted && a.Status == AssetStatus.Available),
                BrokenAssets = assets.Count(a => !a.IsDeleted && a.Status == AssetStatus.Broken),
                RetiredAssets = assets.Count(a => !a.IsDeleted && a.Status == AssetStatus.Retired),
                TotalEmployees = employees.Count(e => !e.IsDeleted),
                CategoryDistribution = categoryDistribution
            };
        }
    }
}
