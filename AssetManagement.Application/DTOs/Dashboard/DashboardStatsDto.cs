namespace AssetManagement.Application.DTOs.Dashboard
{
    public class DashboardStatsDto
    {
        public int TotalAssets { get; set; }
        public int AssignedAssets { get; set; }
        public int AvailableAssets { get; set; }
        public int BrokenAssets { get; set; }
        public int RetiredAssets { get; set; }
        public int TotalEmployees { get; set; }
        public List<CategoryDistributionDto> CategoryDistribution { get; set; } = new();
    }

    public class CategoryDistributionDto
    {
        public string CategoryName { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}
