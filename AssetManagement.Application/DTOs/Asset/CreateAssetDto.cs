using AssetManagement.Domain.Enums;

namespace AssetManagement.Application.DTOs.Asset
{
    public class CreateAssetDto
    {
        public string Name { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
    }
}
