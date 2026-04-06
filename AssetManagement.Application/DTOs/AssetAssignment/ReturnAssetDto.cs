using AssetManagement.Domain.Enums;

namespace AssetManagement.Application.DTOs.AssetAssignment
{
    public class ReturnAssetDto
    {
        public Guid AssignmentId { get; set; }
        public string? Notes { get; set; }
        /// <summary>
        /// İade sonrası varlığın durumu: Available, Broken veya Retired
        /// </summary>
        public AssetStatus ReturnStatus { get; set; } = AssetStatus.Available;
    }
}
