namespace AssetManagement.Application.DTOs.AssetCategory
{
    public class AssetCategoryResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int AssetCount { get; set; }
    }
}
