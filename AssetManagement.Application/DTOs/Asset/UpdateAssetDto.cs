namespace AssetManagement.Application.DTOs.Asset
{
    public class UpdateAssetDto
    {
        public string Name { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
    }
}
