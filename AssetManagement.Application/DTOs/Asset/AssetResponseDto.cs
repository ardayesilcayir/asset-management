using AssetManagement.Domain.Enums;

namespace AssetManagement.Application.DTOs.Asset
{
    public class AssetResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public AssetStatus Status { get; set; }
        public string StatusDisplay => Status.ToString();
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public DateTime CreateDate { get; set; }
    }
}
